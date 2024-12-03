import {
  getUploadUrl,
  getDownloadUrl,
  shareFile,
  getFileMetadata,
  getUserFiles,
  deleteFile,
} from '@/lib/storage';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Redis } from 'ioredis';

jest.mock('@aws-sdk/s3-request-presigner');

describe('Storage Service', () => {
  const mockRedis = new Redis() as jest.Mocked<Redis>;
  const mockS3Client = new S3Client({}) as jest.Mocked<typeof S3Client>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUploadUrl', () => {
    const mockRequest = {
      fileName: 'test.pdf',
      mimeType: 'application/pdf',
      size: 1024,
      folder: 'documents',
      userId: 'user123',
      tags: ['test'],
    };

    it('should generate upload URL for valid file', async () => {
      (getSignedUrl as jest.Mock).mockResolvedValueOnce('https://test-url.com');

      const result = await getUploadUrl(mockRequest);

      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('fileId');
      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.any(S3Client),
        expect.any(PutObjectCommand),
        { expiresIn: 3600 }
      );
    });

    it('should throw error for invalid file type', async () => {
      const invalidRequest = {
        ...mockRequest,
        mimeType: 'invalid/type',
      };

      await expect(getUploadUrl(invalidRequest)).rejects.toThrow('Invalid file type');
    });

    it('should throw error for file size exceeding limit', async () => {
      const largeFileRequest = {
        ...mockRequest,
        size: 200 * 1024 * 1024, // 200MB
      };

      await expect(getUploadUrl(largeFileRequest)).rejects.toThrow('File size exceeds maximum limit');
    });
  });

  describe('getDownloadUrl', () => {
    const mockFileId = 'file123';
    const mockUserId = 'user123';

    it('should generate download URL for file owner', async () => {
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({
        id: mockFileId,
        uploadedBy: mockUserId,
        folder: 'documents',
        originalName: 'test.pdf',
      }));
      (getSignedUrl as jest.Mock).mockResolvedValueOnce('https://test-url.com');

      const result = await getDownloadUrl(mockFileId, mockUserId);

      expect(result).toBe('https://test-url.com');
      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.any(S3Client),
        expect.any(GetObjectCommand),
        { expiresIn: 3600 }
      );
    });

    it('should throw error for non-existent file', async () => {
      mockRedis.get.mockResolvedValueOnce(null);

      await expect(getDownloadUrl(mockFileId, mockUserId)).rejects.toThrow('File not found');
    });

    it('should throw error for unauthorized access', async () => {
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({
        id: mockFileId,
        uploadedBy: 'other-user',
        folder: 'documents',
        originalName: 'test.pdf',
      }));

      await expect(getDownloadUrl(mockFileId, mockUserId)).rejects.toThrow('Access denied');
    });
  });

  describe('shareFile', () => {
    const mockRequest = {
      fileId: 'file123',
      userId: 'user123',
      shareWithUsers: ['user456', 'user789'],
    };

    it('should share file with specified users', async () => {
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({
        id: mockRequest.fileId,
        uploadedBy: mockRequest.userId,
      }));

      const result = await shareFile(mockRequest);

      expect(result).toBe(true);
      expect(mockRedis.setex).toHaveBeenCalled();
      expect(mockRedis.sadd).toHaveBeenCalledTimes(mockRequest.shareWithUsers.length);
    });

    it('should throw error when file not found', async () => {
      mockRedis.get.mockResolvedValueOnce(null);

      await expect(shareFile(mockRequest)).rejects.toThrow('File not found');
    });

    it('should throw error when user is not file owner', async () => {
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({
        id: mockRequest.fileId,
        uploadedBy: 'other-user',
      }));

      await expect(shareFile(mockRequest)).rejects.toThrow('Only file owner can share the file');
    });
  });

  describe('deleteFile', () => {
    const mockFileId = 'file123';
    const mockUserId = 'user123';

    it('should delete file and metadata', async () => {
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({
        id: mockFileId,
        uploadedBy: mockUserId,
        folder: 'documents',
        originalName: 'test.pdf',
      }));

      const result = await deleteFile(mockFileId, mockUserId);

      expect(result).toBe(true);
      expect(mockS3Client.send).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
      expect(mockRedis.del).toHaveBeenCalled();
      expect(mockRedis.srem).toHaveBeenCalled();
    });

    it('should throw error when file not found', async () => {
      mockRedis.get.mockResolvedValueOnce(null);

      await expect(deleteFile(mockFileId, mockUserId)).rejects.toThrow('File not found');
    });

    it('should throw error when user is not file owner', async () => {
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({
        id: mockFileId,
        uploadedBy: 'other-user',
      }));

      await expect(deleteFile(mockFileId, mockUserId)).rejects.toThrow('Only file owner can delete the file');
    });
  });
});

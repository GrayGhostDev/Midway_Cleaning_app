import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageService } from '@/services/storage';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';

const s3Mock = mockClient(S3Client);

describe('StorageService Integration Tests', () => {
  const storageService = new StorageService();
  const testFile = {
    name: 'test.pdf',
    type: 'application/pdf',
    size: 1024,
  };
  const testUserId = 'test-user-123';

  beforeEach(() => {
    s3Mock.reset();
    process.env.AWS_S3_BUCKET = 'test-bucket';
  });

  describe('uploadFile', () => {
    it('should successfully upload a file', async () => {
      // Mock S3 upload response
      s3Mock.on(PutObjectCommand).resolves({
        ETag: '"test-etag"',
      });

      // Mock signed URL generation
      s3Mock.on(GetObjectCommand).resolves({});

      const result = await storageService.uploadFile(testFile as any, testUserId);

      expect(result).toEqual(expect.objectContaining({
        key: expect.stringContaining('documents/test-user-123'),
        url: expect.any(String),
      }));

      expect(s3Mock).toHaveReceivedCommandWith(PutObjectCommand, {
        Bucket: 'test-bucket',
        Key: expect.stringContaining('documents/test-user-123'),
        ContentType: 'application/pdf',
      });
    });

    it('should handle upload failures', async () => {
      s3Mock.on(PutObjectCommand).rejects(new Error('Upload failed'));

      await expect(storageService.uploadFile(testFile as any, testUserId))
        .rejects
        .toThrow('Failed to upload file: Upload failed');
    });

    it('should validate file size', async () => {
      const largeFile = { ...testFile, size: 1024 * 1024 * 1024 }; // 1GB

      await expect(storageService.uploadFile(largeFile as any, testUserId))
        .rejects
        .toThrow('File size exceeds maximum limit');
    });
  });

  describe('generateSignedUrl', () => {
    it('should generate a valid signed URL', async () => {
      const testKey = 'documents/test-user-123/test.pdf';
      const mockSignedUrl = 'https://test-bucket.s3.amazonaws.com/test-file';

      // Mock signed URL generation
      s3Mock.on(GetObjectCommand).resolves({});
      jest.spyOn(getSignedUrl as any, 'getSignedUrl').mockResolvedValue(mockSignedUrl);

      const url = await storageService.generateSignedUrl(testKey);

      expect(url).toBe(mockSignedUrl);
      expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: 'test-bucket',
        Key: testKey,
      });
    });

    it('should handle URL generation failures', async () => {
      s3Mock.on(GetObjectCommand).rejects(new Error('URL generation failed'));

      await expect(storageService.generateSignedUrl('test-key'))
        .rejects
        .toThrow('Failed to generate signed URL: URL generation failed');
    });
  });

  describe('deleteFile', () => {
    it('should successfully delete a file', async () => {
      const testKey = 'documents/test-user-123/test.pdf';

      s3Mock.on(DeleteObjectCommand).resolves({});

      await storageService.deleteFile(testKey);

      expect(s3Mock).toHaveReceivedCommandWith(DeleteObjectCommand, {
        Bucket: 'test-bucket',
        Key: testKey,
      });
    });

    it('should handle delete failures', async () => {
      s3Mock.on(DeleteObjectCommand).rejects(new Error('Delete failed'));

      await expect(storageService.deleteFile('test-key'))
        .rejects
        .toThrow('Failed to delete file: Delete failed');
    });
  });

  describe('validateFile', () => {
    it('should validate allowed file types', async () => {
      const invalidFile = { ...testFile, type: 'application/exe' };

      await expect(storageService.uploadFile(invalidFile as any, testUserId))
        .rejects
        .toThrow('File type not allowed');
    });

    it('should validate file name length', async () => {
      const longNameFile = {
        ...testFile,
        name: 'a'.repeat(300) + '.pdf',
      };

      await expect(storageService.uploadFile(longNameFile as any, testUserId))
        .rejects
        .toThrow('File name exceeds maximum length');
    });
  });
});

import { exec } from 'child_process';
import { promisify } from 'util';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { format } from 'date-fns';
import { DatabaseError } from './errors';

const execAsync = promisify(exec);

interface BackupConfig {
  databaseUrl: string;
  backupPath: string;
  s3: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export class DatabaseBackup {
  private s3Client: S3Client;

  constructor(private config: BackupConfig) {
    this.s3Client = new S3Client({
      region: config.s3.region,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
    });
  }

  private async createLocalBackup(): Promise<string> {
    try {
      const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss');
      const backupFileName = `backup-${timestamp}.sql`;
      const backupFilePath = `${this.config.backupPath}/${backupFileName}`;

      const command = `pg_dump "${this.config.databaseUrl}" -F c -f "${backupFilePath}"`;
      
      await execAsync(command);
      
      return backupFilePath;
    } catch (error) {
      throw new DatabaseError(
        'Failed to create local backup',
        'BACKUP_ERROR',
        error
      );
    }
  }

  private async uploadToS3(filePath: string): Promise<string> {
    try {
      const fileName = filePath.split('/').pop()!;
      const key = `backups/${fileName}`;

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.config.s3.bucket,
          Key: key,
          Body: require('fs').createReadStream(filePath),
        })
      );

      return key;
    } catch (error) {
      throw new DatabaseError(
        'Failed to upload backup to S3',
        'S3_UPLOAD_ERROR',
        error
      );
    }
  }

  async createBackup(): Promise<{ localPath: string; s3Key: string }> {
    try {
      const localPath = await this.createLocalBackup();
      const s3Key = await this.uploadToS3(localPath);

      return { localPath, s3Key };
    } catch (error) {
      throw new DatabaseError(
        'Backup process failed',
        'BACKUP_PROCESS_ERROR',
        error
      );
    }
  }

  static async scheduleBackups(config: BackupConfig, cronSchedule: string): Promise<void> {
    const backup = new DatabaseBackup(config);
    
    // Schedule backups using node-cron
    const cron = require('node-cron');
    
    cron.schedule(cronSchedule, async () => {
      try {
        await backup.createBackup();
        console.log('Scheduled backup completed successfully');
      } catch (error) {
        console.error('Scheduled backup failed:', error);
      }
    });
  }
}

// Example usage:
// const config: BackupConfig = {
//   databaseUrl: process.env.DATABASE_URL!,
//   backupPath: '/path/to/backups',
//   s3: {
//     bucket: process.env.AWS_BACKUP_BUCKET!,
//     region: process.env.AWS_REGION!,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// };
//
// // Schedule daily backups at 2 AM
// DatabaseBackup.scheduleBackups(config, '0 2 * * *');

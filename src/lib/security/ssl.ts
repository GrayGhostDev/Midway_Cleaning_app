import { createServer } from 'https';
import type { IncomingMessage, ServerResponse } from 'http';
import { readFileSync } from 'fs';
import { createLogger } from '@/lib/api/logger';
import { SecureVersion } from 'tls';
import type { RequestListener } from 'http';

const logger = createLogger({ name: 'SSL' });

interface SSLConfig {
  keyPath: string;
  certPath: string;
  caPath?: string;
  ciphers?: string;
  minVersion?: SecureVersion;
  maxVersion?: SecureVersion;
  honorCipherOrder?: boolean;
}

export function loadSSLConfig(): SSLConfig {
  return {
    keyPath: process.env.SSL_KEY_PATH || '',
    certPath: process.env.SSL_CERT_PATH || '',
    caPath: process.env.SSL_CA_PATH,
    ciphers: process.env.SSL_CIPHERS,
    minVersion: process.env.SSL_MIN_VERSION as SecureVersion,
    maxVersion: process.env.SSL_MAX_VERSION as SecureVersion,
    honorCipherOrder: process.env.SSL_HONOR_CIPHER_ORDER === 'true',
  };
}

export function validateSSLConfig(config: SSLConfig): void {
  if (!config.keyPath || !config.certPath) {
    throw new Error('SSL key and certificate paths are required');
  }
}

export function createHTTPSServer(handler: RequestListener<typeof IncomingMessage, typeof ServerResponse>) {
  try {
    const config = loadSSLConfig();
    validateSSLConfig(config);

    const httpsOptions = {
      key: readFileSync(config.keyPath),
      cert: readFileSync(config.certPath),
      ca: config.caPath ? [readFileSync(config.caPath)] : undefined,
      ciphers: config.ciphers,
      minVersion: config.minVersion,
      maxVersion: config.maxVersion,
      honorCipherOrder: config.honorCipherOrder,
    };

    return createServer(httpsOptions, handler);
  } catch (error) {
    logger.error('Failed to create HTTPS server', { error });
    throw error;
  }
}

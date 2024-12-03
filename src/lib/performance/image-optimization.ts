import { ImageLoader, ImageLoaderProps } from 'next/image';
import sharp from 'sharp';

interface OptimizationOptions {
  quality?: number;
  format?: 'jpeg' | 'webp' | 'avif';
  width?: number;
  height?: number;
}

export class ImageOptimizer {
  // Custom image loader for Next.js Image component
  static loader: ImageLoader = ({ src, width, quality }: ImageLoaderProps) => {
    if (src.startsWith('data:')) return src;
    
    const params = new URLSearchParams({
      url: src,
      w: width.toString(),
      q: (quality || 75).toString(),
    });

    return `/api/image?${params.toString()}`;
  };

  // Optimize image buffer
  static async optimizeBuffer(
    buffer: Buffer,
    options: OptimizationOptions = {}
  ): Promise<Buffer> {
    const {
      quality = 80,
      format = 'webp',
      width,
      height,
    } = options;

    let pipeline = sharp(buffer);

    // Resize if dimensions provided
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Convert to specified format
    switch (format) {
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality });
        break;
    }

    return pipeline.toBuffer();
  }

  // Generate responsive image sizes
  static async generateResponsiveSizes(
    buffer: Buffer,
    widths: number[] = [640, 750, 828, 1080, 1200, 1920]
  ): Promise<Map<number, Buffer>> {
    const results = new Map<number, Buffer>();

    await Promise.all(
      widths.map(async (width) => {
        const optimized = await this.optimizeBuffer(buffer, {
          width,
          format: 'webp',
        });
        results.set(width, optimized);
      })
    );

    return results;
  }

  // Get image metadata
  static async getMetadata(buffer: Buffer) {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: buffer.length,
    };
  }

  // Calculate optimal image dimensions
  static calculateOptimalDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth?: number,
    maxHeight?: number
  ) {
    if (!maxWidth && !maxHeight) {
      return { width: originalWidth, height: originalHeight };
    }

    const aspectRatio = originalWidth / originalHeight;

    if (maxWidth && maxHeight) {
      const widthFromHeight = maxHeight * aspectRatio;
      const heightFromWidth = maxWidth / aspectRatio;

      if (widthFromHeight <= maxWidth) {
        return { width: widthFromHeight, height: maxHeight };
      }
      return { width: maxWidth, height: heightFromWidth };
    }

    if (maxWidth) {
      return {
        width: maxWidth,
        height: maxWidth / aspectRatio,
      };
    }

    if (maxHeight) {
      return {
        width: maxHeight * aspectRatio,
        height: maxHeight,
      };
    }

    return { width: originalWidth, height: originalHeight };
  }

  // Generate srcset string
  static generateSrcSet(
    src: string,
    widths: number[] = [640, 750, 828, 1080, 1200, 1920]
  ): string {
    return widths
      .map((width) => {
        const url = new URL('/api/image', process.env.NEXT_PUBLIC_API_URL);
        url.searchParams.set('url', src);
        url.searchParams.set('w', width.toString());
        return `${url.toString()} ${width}w`;
      })
      .join(', ');
  }
}

// Example usage in Next.js API route:
/*
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url, w, q } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const imageResponse = await fetch(url as string);
    const buffer = await imageResponse.arrayBuffer();
    
    const optimized = await ImageOptimizer.optimizeBuffer(Buffer.from(buffer), {
      width: w ? parseInt(w as string) : undefined,
      quality: q ? parseInt(q as string) : undefined,
      format: 'webp',
    });

    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Type', 'image/webp');
    res.send(optimized);
  } catch (error) {
    console.error('Image optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize image' });
  }
}
*/

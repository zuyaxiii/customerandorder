import { Injectable, BadRequestException } from '@nestjs/common';
import { Dropbox } from 'dropbox';
import { extname } from 'path';

@Injectable()
export class DropboxService {
  private readonly dropbox: Dropbox;
  private readonly ALLOWED_EXTENSIONS = {
    images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'],
    pdf: ['.pdf'],
    documents: ['.docx', '.xlsx', '.txt']
};

  constructor() {
    if (!process.env.DROPBOX_KEY) {
      throw new Error('DROPBOX_KEY is not defined in environment variables');
    }
    this.dropbox = new Dropbox({ accessToken: process.env.DROPBOX_KEY });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      this.validateFile(file);
      
      const fileName = this.sanitizeFileName(file.originalname);
      const fileExtension = extname(fileName).toLowerCase();
      const folderPath = this.getFolderPath(fileExtension);
      const dropboxPath = `${folderPath}/${fileName}`;

      console.log(`Uploading file to Dropbox: ${dropboxPath}`);

      const uploadResponse = await this.uploadToDropbox(dropboxPath, file.buffer);
      console.log(`File uploaded successfully: ${uploadResponse.result.path_lower}`);

      const shareResponse = await this.createShareableLink(uploadResponse.result.path_lower);
      return this.formatShareableUrl(shareResponse.result.url);

    } catch (error) {
      console.error('Error uploading file to Dropbox:', error);
      throw new BadRequestException(error.message || 'Failed to upload file to Dropbox');
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file?.buffer || !file?.originalname) {
      throw new BadRequestException('Invalid file: Missing buffer or filename');
    }
  }

  private sanitizeFileName(fileName: string): string {
    const baseName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    return `${timestamp}_${baseName}`;
}

  private getFolderPath(fileExtension: string): string {
    if (this.ALLOWED_EXTENSIONS.pdf.includes(fileExtension)) {
      return '/pdf';
    }
    if (this.ALLOWED_EXTENSIONS.images.includes(fileExtension)) {
      return '/images';
    }
    return '/others';
  }

  private async uploadToDropbox(path: string, contents: Buffer) {
    return await this.dropbox.filesUpload({
      path,
      contents,
      mode: { '.tag': 'overwrite' },
    });
  }

  private async createShareableLink(path: string) {
    return await this.dropbox.sharingCreateSharedLink({
      path,
      short_url: false,
    });
  }

  private formatShareableUrl(url: string): string {
    return url.replace('?dl=0', '?raw=1');
  }
}
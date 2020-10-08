import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

export class FileTransferService {

  private fileTransfer : FileTransferObject = FileTransfer.create();

  async uploadFile(
    fileName: string | undefined, 
    filePath: string, 
    uploadURL: string,
    winCb = () => {},
    failCb = (args : any) => {}
  ) {

    let options : FileUploadOptions = {
      fileKey: 'file',
      fileName: 'image.jpg'
    };
    try {
      const data = await this.fileTransfer.upload(
        filePath, 
        encodeURI(uploadURL),
        options
      )
      winCb();
    } catch(err) {
      console.error(err);
      failCb(JSON.stringify(err.message));
    }
  }
}
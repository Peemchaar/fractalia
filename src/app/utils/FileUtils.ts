export class FileUtils {

  static sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  static k = 1024;
  static dm = 2;

  static getTypeSize(bytes: number): string {
      if (bytes === 0) {
          return '0 Bytes';
      }
      let i = Math.floor(Math.log(bytes) / Math.log(this.k));
      return parseFloat((bytes / Math.pow(this.k, i)).toFixed(this.dm)) + ' ' + this.sizes[i];
  }

  static validateSize(bytes: number, size: number, format: string): boolean {
      if (bytes === 0) {
          return true;
      }
      if(format === 'MB') {
        const fileSize = bytes / 1024 / 1024;
        if (fileSize > size) {
          return false;
        }
      }
      return true;
  }

  static getFileExtension(filename: string) {
    const name = filename.split('.').pop();
    return name;
  }

}

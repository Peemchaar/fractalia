export class BytesValidator {
    private static numberRegex = /\D/g;
    private static spaceRegex = /\s/g
    private static formatRegex = /^[0-9]+[\s]{0,1}[KMGT]{0,1}B$/;
    private static units = ['B', 'KB', 'MB', 'GB', 'TB'];

    static FormatBytes(size): number {
        if (size === 0) return 0;
        let bytesSize = size.replace(BytesValidator.numberRegex, '').replace(BytesValidator.spaceRegex, '');
        const k = 1024;
        const sizes = ['TB', 'GB', 'MB', 'KB', 'B'];
        const unit = size.replace(/[0-9]/g, '').replace(BytesValidator.spaceRegex, '')
        for (let index = sizes.indexOf(unit); index < sizes.length - 1; index++) {
            bytesSize = bytesSize * k;
        }
        return bytesSize;
    }

    static GetSpaceWithDecimals(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + BytesValidator.units[i];
    }

    static GetSpaceWithDecimals2(bytes, decimals = 2):number {
      if (bytes === 0) return 0;

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;

      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    }

    static ValidateBytes = (size: string) => {
        var result = false;
        size = size.toUpperCase();
        var correctFormat = BytesValidator.formatRegex.test(size)
        BytesValidator.units.forEach((e) => {
          result = result || size.indexOf(e) > 0
        })
        if (result && correctFormat)
          return BytesValidator.FormatBytes(size)
        else
          return 0
      }
}

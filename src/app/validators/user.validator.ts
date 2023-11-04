export class UserValidator {

  static EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  static validEmail(email: any) {
    return UserValidator.EMAIL_PATTERN.test(String(email).toLowerCase()) ? ({ validEmail: true }) : null;
  }
  static validPhone(phone: any) {
    const strPhone = typeof phone == "string" ? phone : phone.value;
    if (strPhone == null || strPhone.length == 0) {
      return null;
    }
    if (strPhone.match(/^[+]*[0-9]*$/g) != null) {
      return ({ validPhone: true });
    }
    return null;
  }

  static validUrl(url:string){
    const valid = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/.test(url);
    return valid ? ({ validEmail: true }) : null;
  }

  static NIFValidation(license: string) {
    const letters = "TRWAGMYFPDXBNJZSQVHLCKET";
    const lastCharacter = license[license.length - 1].toString().toUpperCase();
    const numericCharacters = license.substring(0, license.length - 1);
    const indice = +numericCharacters % 23;
    if (!isNaN(indice))
      if (letters[indice].toString() == lastCharacter && numericCharacters.length == 8) return null;
    return ({ validNIF: true });
  }

  static NIEValidation(license: string) {
    const letters = "TRWAGMYFPDXBNJZSQVHLCKET";
    const lastCharacter = license[license.length - 1].toString().toUpperCase();
    const firstCharacter = license[0].toString().toUpperCase();
    let numericCharacters = license.substring(0, license.length - 1);
    switch (firstCharacter) {
      case "Z": numericCharacters = numericCharacters.replace("Z", "2"); break;
      case "Y": numericCharacters = numericCharacters.replace("Y", "1"); break;
      case "X": numericCharacters = numericCharacters.replace("X", "0"); break;
      default: return ({ validNIE: true });
    }
    const indice = +numericCharacters % 23;
    if (letters[indice].toString() == lastCharacter && numericCharacters.length == 8) return null;
    return ({ validNIF: true });
  }
}

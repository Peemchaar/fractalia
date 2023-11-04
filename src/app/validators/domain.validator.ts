export class DomainValidator {
    public static DOMAIN_PATTERN = /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/;

    static checkIsValidDomain = (domain) => {
        var re = new RegExp(DomainValidator.DOMAIN_PATTERN);
        return domain.match(re);
    }
}
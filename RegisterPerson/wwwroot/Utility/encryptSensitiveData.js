function encryptSensitiveData(htmlInputName, ajaxInputName) {
    let encryptor = new JSEncrypt();

    let pubkey =
        '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuLByoCt/VNV5DvAVeDbnnSF3MMB1p6TFvWXypUlxb8swe1zCrfkKkcJW7Tx4Mwyc4B1QlkigUctA+bGf8OAPlfBIQ/8prHjnATdHxvF3P8Bd1bc5FOxnpwo2nValiWY5I2FEeeF+gtA0NlQjW+Q8MrIuGIkOuhsfpZktpGw9u7jBXEVdtpMucPrz8UDQVlqflIRCB3Fx5C0pIEM4QNceBlzAgBLK/xUhaLvmJ2+sBJCjxad+rhRyIr/VSX4a39EPZExe7BcjaSPx2k65R8FDKRcS4/3NP+H32NrvHkA4ZgmZgFMICTwtbTDU7R7N4dZXc88mqH2BqKz0PM/RimCvzwIDAQAB-----END PUBLIC KEY-----';

    encryptor.setPublicKey(pubkey);

    let encryptedLogin = encryptor.encrypt($(`input[name="${htmlInputName}"]`).val());

    return `${ajaxInputName}=${encodeURIComponent(encryptedLogin)}&`;
};
import CryptoJS from 'crypto-js';


export const GenerateSignature = (message) => {
    // Message and secret key
    const secret = "8gBm/:&EnhH.1/q";
    
    // Generate HMAC SHA-256 hash
    const hash = CryptoJS.HmacSHA256(message, secret);
    
    // Convert to Base64 format
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    
    return hashInBase64 // Output the hash
}


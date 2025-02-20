import CryptoJS from "crypto-js"
const SECRET_KEY = "8gBm/:&EnhH.1/q";
const FRONTEND_URL = process.env.FRONTEND_URL;

export const esewaSuccess = async(req,res) =>{
    try {
        // Decode the Base64 response body from eSewa
        const base64Response = req.query.data; // eSewa sends a base64-encoded response
        const decodedResponse = Buffer.from(base64Response, "base64").toString("utf-8");
        const paymentData = JSON.parse(decodedResponse);

        // Extract necessary fields
        const { transaction_code, status, total_amount, transaction_uuid, product_code, signed_field_names, signature } = paymentData;

        // Re-generate signature for verification
        const message = `transaction_code=${transaction_code},status=${status},total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code},signed_field_names=${signed_field_names}`;
        const generatedSignature = CryptoJS.HmacSHA256(message, SECRET_KEY);
        const signatureInBase64 = CryptoJS.enc.Base64.stringify(generatedSignature);

        // if (signature !== signatureInBase64) {
        //     console.error("Signature Mismatch! Possible fraud attempt.");
        //     return res.redirect(`${FRONTEND_URL}/payment?status=failure`);
        // }
        
        if (status === "COMPLETE") {

            // console.log("Payment Verified:", paymentData);
            
            // Redirect user to the order confirmation page
            return res.redirect(`${FRONTEND_URL}/payment?status=success&transactionId=${transaction_uuid}`);
        } else {
            return res.redirect(`${FRONTEND_URL}/payment?status=failure`);
        }
    } catch (error) {
        console.error("Error processing payment:", error);
        return res.redirect(`${FRONTEND_URL}/payment?status=failure`);
    }
}

export const esewaFailure = async(req,res) =>{
    return res.redirect(`${FRONTEND_URL}/payment?status=failure`);
}
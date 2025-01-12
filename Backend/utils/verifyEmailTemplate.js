const verifyEmailTemplate = ({url}) => {
  return `
  <div style="max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; font-size: 24px; color: #333333; margin-bottom: 20px;">
      Verify Your Email Address
    </div>
    <div style="text-align: center; font-size: 16px; color: #555555; margin: 20px 0;">
      <p>Thank you for signing up! Please verify your email address by clicking the button below.</p>
    </div>
    <div style="text-align: center; margin: 20px;">
      <a href=${url} style="display: inline-block; text-decoration: none; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Verify Email</a>
    </div>
    <div style="text-align: center; font-size: 16px; color: #555555; margin: 20px 0;">
      <p>If you did not sign up, please ignore this email.</p>
    </div>
    <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #aaaaaa;">
      &copy; 2025 HamroPasal. All rights reserved.
    </div>
  </div>`
};

export default verifyEmailTemplate;

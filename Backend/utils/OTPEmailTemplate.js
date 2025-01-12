const OTPEmailTemplate = ({OTP}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #007BFF;
      color: white;
      text-align: center;
      padding: 10px 0;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .content {
      text-align: center;
      margin: 20px 0;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #007BFF;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888888;
      margin-top: 20px;
    }
    .footer a {
      color: #007BFF;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>We received a request to reset the password for your account on <strong>HamroPasal</strong>. Please use the OTP below to proceed:</p>
      <div class="otp">${OTP}</div>
      <p>This OTP is valid for the next <strong>5 minutes</strong>.</p>
      <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    </div>
    <div class="footer">
      <p>&copy; HamroPasal | All rights reserved.</p>
    </div>
  </div>
</body>
</html>
   `
};

export default OTPEmailTemplate;
const generateStudentSignupTemplates = (verificationLink) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Email Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #9e9e9e">
      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="background-color: #9e9e9e; height: 100vh"
      >
        <tr>
          <td align="center" valign="middle">
            <table
              role="presentation"
              width="auto"
              style="
                max-width: 500px;
                height: 500px;
                width: 400px;
                border: 1px solid #cccccc;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
                font-family: Arial, sans-serif;
                background-color: #ffffff;
              "
            >
              <!-- Logo -->
              <tr>
                <td align="center" style="padding-bottom: 15px">
                  <img
                    src="https://careerexplorer.s3.us-east-1.amazonaws.com/logo/careerExplorerOriginalLogo.png"
                    width="150"
                    alt="Career Explorer Logo"
                  />
                </td>
              </tr>
  
              <!-- Separator -->
              <tr>
                <td
                  align="center"
                  style="border-bottom: 2px solid #ff8a00; padding-bottom: 10px"
                ></td>
              </tr>
  
              <!-- Email Verification Text -->
              <tr>
                <td
                  align="center"
                  style="
                    padding-top: 20px;
                    font-size: 20px;
                    font-weight: bold;
                    color: #8c001b;
                  "
                >
                  Email Verification
                </td>
              </tr>
  
              <!-- Description Text -->
              <tr>
                <td
                  align="center"
                  style="padding: 15px 20px; font-size: 16px; color: #787876"
                >
                  Thank you for signing up! Please click the button below to
                  verify your email and activate your account.
                </td>
              </tr>
  
              <!-- Button -->
              <tr>
                <td align="center" style="padding: 20px">
                  <a
                     href="${verificationLink}"
                    style="
                      background-color: #ff8a00;
                      color: #ffffff;
                      text-decoration: none;
                      padding: 12px 30px;
                      font-size: 16px;
                      font-weight: bold;
                      border-radius: 5px;
                      display: inline-block;
                    "
                  >
                    Let's Go
                  </a>
                </td>
              </tr>
  
              <!-- Copyright -->
              <tr>
                <td
                  align="center"
                  style="padding-top: 10px; font-size: 14px; color: #787876"
                >
                  © 2025 Career Explorer. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

const generateCounsellorSignupTemplates = (verificationLink) => {
  return `<html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Email Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #9e9e9e">
      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="background-color: #9e9e9e; height: 100vh"
      >
        <tr>
          <td align="center" valign="middle">
            <table
              role="presentation"
              width="auto"
              style="
                max-width: 500px;
                height: 500px;
                width: 400px;
                border: 1px solid #cccccc;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
                font-family: Arial, sans-serif;
                background-color: #ffffff;
              "
            >
              <!-- Logo -->
              <tr>
                <td align="center" style="padding-bottom: 15px">
                  <img
                    src="https://careerexplorer.s3.us-east-1.amazonaws.com/logo/careerExplorerOriginalLogo.png"
                    width="150"
                    alt="Career Explorer Logo"
                  />
                </td>
              </tr>
  
              <!-- Separator -->
              <tr>
                <td
                  align="center"
                  style="border-bottom: 2px solid #ff8a00; padding-bottom: 10px"
                ></td>
              </tr>
  
              <!-- Email Verification Text -->
              <tr>
                <td
                  align="center"
                  style="
                    padding-top: 20px;
                    font-size: 20px;
                    font-weight: bold;
                    color: #8c001b;
                  "
                >
                  Email Verification
                </td>
              </tr>
  
              <!-- Description Text -->
              <tr>
                <td
                  align="center"
                  style="padding: 15px 20px; font-size: 16px; color: #787876"
                >
                  Thank you for signing up!  Welcome to the CareerExplorer.me community We look forward to your
       contributions. Please click the button below to
                  verify your email and activate your account.
                </td>
              </tr>
  
              <!-- Button -->
              <tr>
                <td align="center" style="padding: 20px">
                  <a
                     href="${verificationLink}"
                    style="
                      background-color: #ff8a00;
                      color: #ffffff;
                      text-decoration: none;
                      padding: 12px 30px;
                      font-size: 16px;
                      font-weight: bold;
                      border-radius: 5px;
                      display: inline-block;
                    "
                  >
                    Let's Go
                  </a>
                </td>
              </tr>
  
              <!-- Copyright -->
              <tr>
                <td
                  align="center"
                  style="padding-top: 10px; font-size: 14px; color: #787876"
                >
                  © 2025 Career Explorer. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
};

const generateForgotPasswordTemplate = (resetLink) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #9e9e9e">
      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="background-color: #9e9e9e; height: 100vh"
      >
        <tr>
          <td align="center" valign="middle">
            <table
              role="presentation"
              width="auto"
              style="
                max-width: 500px;
                height: auto;
                width: 400px;
                border: 1px solid #cccccc;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
                font-family: Arial, sans-serif;
                background-color: #ffffff;
              "
            >
              <!-- Logo -->
              <tr>
                <td align="center" style="padding-bottom: 15px">
                  <img
                    src="https://careerexplorer.s3.us-east-1.amazonaws.com/logo/careerExplorerOriginalLogo.png"
                    width="150"
                    alt="Career Explorer Logo"
                  />
                </td>
              </tr>

              <!-- Separator -->
              <tr>
                <td
                  align="center"
                  style="border-bottom: 2px solid #ff8a00; padding-bottom: 10px"
                ></td>
              </tr>

              <!-- Title -->
              <tr>
                <td
                  align="center"
                  style="padding-top: 20px; font-size: 20px; font-weight: bold; color: #8c001b"
                >
                  Reset Your Password
                </td>
              </tr>

              <!-- Info -->
              <tr>
                <td
                  align="center"
                  style="padding: 15px 20px; font-size: 16px; color: #787876"
                >
                  We received a request to reset your password. If this was you, click the button below to set a new password.
                  <br /><br />
                  If you didn’t request this, you can safely ignore this email.
                </td>
              </tr>

              <!-- Reset Button -->
              <tr>
                <td align="center" style="padding: 20px">
                  <a
                    href="${resetLink}"
                    style="
                      background-color: #ff8a00;
                      color: #ffffff;
                      text-decoration: none;
                      padding: 12px 30px;
                      font-size: 16px;
                      font-weight: bold;
                      border-radius: 5px;
                      display: inline-block;
                    "
                  >
                    Reset Password
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td
                  align="center"
                  style="padding-top: 10px; font-size: 14px; color: #787876"
                >
                  © 2025 Career Explorer. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
};

export {
  generateStudentSignupTemplates,
  generateCounsellorSignupTemplates,
  generateForgotPasswordTemplate,
};

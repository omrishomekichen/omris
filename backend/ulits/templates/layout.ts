export interface EmailLayoutOptions {
  title: string;
  preheader?: string;
  content: string;
}

export const emailLayout = ({ title, preheader, content }: EmailLayoutOptions): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      color: #1e293b;
    }
    .email-wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 30px 10px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
      border: 1px solid #e2e8f0;
    }
    .email-header {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .brand-title {
      color: #ffffff;
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .brand-subtitle {
      color: #fef3c7;
      font-size: 13px;
      margin-top: 4px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .email-body {
      padding: 36px 32px;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 15px;
      margin: 24px 0;
      box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25);
    }
    .info-card {
      background-color: #f8fafc;
      border-left: 4px solid #d97706;
      padding: 16px 20px;
      border-radius: 0 10px 10px 0;
      margin: 24px 0;
    }
    .info-card p {
      margin: 4px 0;
      font-size: 14px;
      color: #334155;
    }
    .email-footer {
      background-color: #f1f5f9;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    .email-footer p {
      margin: 6px 0;
    }
    .email-footer a {
      color: #d97706;
      text-decoration: none;
    }
  </style>
</head>
<body>
  ${preheader ? `<div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>` : ""}
  <div class="email-wrapper">
    <div class="email-container">
      <div class="email-header">
        <h1 class="brand-title">Omri's Home Kitchen</h1>
        <div class="brand-subtitle">Traditional Handcrafted Pickles & Spices</div>
      </div>
      <div class="email-body">
        ${content}
      </div>
      <div class="email-footer">
        <p>&copy; ${new Date().getFullYear()} Omri's Home Kitchen. All rights reserved.</p>
        <p>Hyderabad, Telangana, India • Support: <a href="mailto:orders@omrishomekitchen.com">orders@omrishomekitchen.com</a></p>
        <p style="margin-top: 12px; color: #94a3b8; font-size: 11px;">If you did not initiate this request, please ignore this email or contact support immediately.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

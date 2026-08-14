export { emailLayout } from "./layout";
export { otpTemplate } from "./otp";
export { welcomeTemplate } from "./welcome";
export { forgotPasswordTemplate } from "./forgotPassword";
export { passwordResetSuccessTemplate } from "./passwordResetSuccess";
export { orderConfirmationTemplate } from "./orderConfirmation";
export { loginAlertTemplate } from "./loginAlert";
export { passwordChangeAlertTemplate } from "./passwordChangeAlert";

import { otpTemplate } from "./otp";
import { welcomeTemplate } from "./welcome";
import { forgotPasswordTemplate } from "./forgotPassword";
import { passwordResetSuccessTemplate } from "./passwordResetSuccess";
import { orderConfirmationTemplate } from "./orderConfirmation";
import { loginAlertTemplate } from "./loginAlert";
import { passwordChangeAlertTemplate } from "./passwordChangeAlert";

export const renderTemplate = (templateName: string, data: any): string | null => {
  switch (templateName.toLowerCase()) {
    case "otp":
      return otpTemplate(data.otp, data.name);
    case "welcome":
      return welcomeTemplate(data.name || "Customer");
    case "forgotpassword":
    case "forgot_password":
      return forgotPasswordTemplate(data.resetLink, data.name);
    case "passwordresetsuccess":
    case "password_reset_success":
      return passwordResetSuccessTemplate(data.name);
    case "orderconfirmation":
    case "order_confirmation":
      return orderConfirmationTemplate(data);
    case "loginalert":
    case "login_alert":
      return loginAlertTemplate(data.device || "Browser", data.location || "India", data.time || new Date().toLocaleString(), data.name);
    case "passwordchangealert":
    case "password_change_alert":
      return passwordChangeAlertTemplate(data.time || new Date().toLocaleString(), data.name);
    default:
      return null;
  }
};

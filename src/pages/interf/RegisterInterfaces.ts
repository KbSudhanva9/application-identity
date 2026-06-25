export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  phone: string;
}

export interface ResetPasswordForm {
  email?: string;
  phone?: string;
  newPassword: string;
  confirmPassword: string;
  otp: string;
}

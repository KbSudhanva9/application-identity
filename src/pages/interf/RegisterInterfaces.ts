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
  phoneNumber?: string;
  newPassword: string;
  confirmPassword: string;
}

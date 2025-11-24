// config/routes.ts
const API_BASE_URL = `https://backend-eventos.unitec.academy`;
const API_MPESA = process.env.NEXT_PUBLIC_API_MPESA || "";

export const routes = {
  backend_url:`https://backend-eventos.unitec.academy`,

  //auth routes
  login: `${API_BASE_URL}/auth/login`,
  create_account: `${API_BASE_URL}/auth/register`,
  verify_otp: `${API_BASE_URL}/confirmsignupuser`,
  resend_otp: `${API_BASE_URL}/resendotpuser`,
  request_password_recovery: `${API_BASE_URL}/request-password-recovery`,
  reset_password: `${API_BASE_URL}/reset-password`,

  carts: `${API_BASE_URL}/carts`,


  deliveries: `${API_BASE_URL}/deliveries`,
  payment_mpesa: API_MPESA,
  carts_create: `${API_BASE_URL}/carts/create`,
  carts_list: `${API_BASE_URL}/carts/list-user-carts`,
};

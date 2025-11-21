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

  //books routes
  books: `${API_BASE_URL}/ebooks/list`,

  //payments routes
  deliveries: `${API_BASE_URL}/deliveries`,
  payment_mpesa: API_MPESA,
  calculate_price: `${API_BASE_URL}/deliveries/calculate-price`,
  buyebook: `${API_BASE_URL}/buyebook`,
};

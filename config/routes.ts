// config/routes.ts
const API_BASE_URL = `https://backend-eventos.unitec.academy`;
const API_BASE_URL_CO = `https://backend.unitec.co.mz`;
const API_MPESA = process.env.NEXT_PUBLIC_API_MPESA || "";

export const routes = {
  backend_url:`https://backend-eventos.unitec.academy`,

  //auth routes
  // login: `${API_BASE_URL}/auth/login`,
  login: `${API_BASE_URL_CO}/auth/login`,
  create_account: `${API_BASE_URL}/auth/register`,
  verify_otp: `${API_BASE_URL}/confirmsignupuser`,
  resend_otp: `${API_BASE_URL}/resendotpuser`,
  request_password_recovery: `${API_BASE_URL}/request-password-recovery`,
  reset_password: `${API_BASE_URL}/reset-password`,
  payments_transference_create: `${API_BASE_URL}/payments/transference/create`,
  carts: `${API_BASE_URL}/carts`,
  payments_transfer_proof: `${API_BASE_URL}/payments/transfer-proof`,
  payments_create: `${API_BASE_URL}/payments/create`,
  deliveries: `${API_BASE_URL}/deliveries`,
  payments_list: `${API_BASE_URL}/payments/list`,
  payments_user_list: `${API_BASE_URL}/payments/list-items-paid`,
  payments: `${API_BASE_URL}/payments`,
  payment_mpesa: API_MPESA,
  carts_create: `${API_BASE_URL}/carts/create`,
  carts_list: `${API_BASE_URL}/carts/list-user-carts`,
  cart_remove: `${API_BASE_URL}/carts/remove-items`,
  cart_update: `${API_BASE_URL}/carts/update-items`,
  cart_clear: `${API_BASE_URL}/carts/clear-cart`,
};
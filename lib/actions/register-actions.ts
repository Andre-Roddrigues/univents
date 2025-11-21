"use server";

export async function registerUser(payload: {
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  provincia: string;
  bairro: string;
}) {
  try {
    const res = await fetch("https://backend-eventos.unitec.academy/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-cache",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Erro ao criar conta.",
        errors: data?.errors,
      };
    }

    return {
      success: true,
      message: data?.message || "Conta criada com sucesso!",
      data,
    };
  } catch (error) {
    console.error("Erro no registerUser:", error);
    return {
      success: false,
      message: "Erro de conexão. Tente novamente.",
    };
  }
}

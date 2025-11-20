
"use server";

export async function getEventCategories() {
  try {
    const response = await fetch(
      "https://backend-eventos.unitec.academy/categories",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // cache: "no-store", // ative se quiser evitar cache
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar categorias: ${response.status}`);
    }

    const data = await response.json();

    // Esperado:
    // [
    //   {
    //     "id": "a23303dd-ee63-4bf7-96e1-5696b4f4728c",
    //     "name": "Educação",
    //     "description": "Formações, palestras, cursos e seminários educativos."
    //   },
    //   ...
    // ]

    return {
      success: true,
      categories: data,
    };
  } catch (error: any) {
    console.error("Erro ao buscar categorias:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

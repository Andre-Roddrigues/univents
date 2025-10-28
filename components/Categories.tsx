"use client";
import { BookOpen } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ReactEventHandler } from "react";
import Link from "next/link";

const categorias = [
  { id: 0, nome: "Todos" },
  { id: 1, nome: "Ficção" },
  { id: 2, nome: "Mistério" },
  { id: 3, nome: "História" },
  { id: 4, nome: "Ciência" },
  { id: 5, nome: "Tecnologia" },
  { id: 6, nome: "Autoajuda" },
  { id: 7, nome: "Romance" },
  { id: 8, nome: "Aventura" },
  { id: 9, nome: "Fantasia" },
  { id: 10, nome: "Terror" },
  { id: 11, nome: "Biografia" },
  { id: 12, nome: "Psicologia" },
  { id: 13, nome: "Comédia" },
  { id: 14, nome: "Política" },
  { id: 15, nome: "Culinária" },
  { id: 16, nome: "Espiritualidade" },
  { id: 17, nome: "Filosofia" },
  { id: 18, nome: "Arte" },
  { id: 19, nome: "Música" },
  { id: 20, nome: "Esportes" },
];

export default function Categories() {
  const searchParams = useSearchParams();
  const active = searchParams.get("categoria") || "Todos";

  const toogleQuery = (key: string, value: string) => {
    const query = Object.fromEntries(searchParams);
    if (query[key] === value) {
      delete query[key];
    } else {
      query[key] = value;
    }
    if (query[key] === "Todos") {
      delete query[key];
    }
    return query;
  };

  const toogleMultipleQuery = (key: string, value: string) => {
    const query = Object.fromEntries(searchParams);
    let values = query[key] ? query[key].split(",") : [];

    if (values.includes(value)) {
      values = values.filter((v) => v !== value);
    } else {
      values.push(value);
    }

    if (values.length === 0) {
      delete query[key];
    } else {
      query[key] = values.join(",");
    }

    return query;
  };

  function handleCategoria(value: string) {
    const sp = new URLSearchParams(searchParams);
    if (value.trim() === "") {
      sp.delete("category");
    } else {
      sp.set("category", value);
    }
    // router.push(`${pathname}?${sp.toString()}`,{scroll:false});
  }
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Categorias de Livros</h2>
      <div className="flex flex-wrap gap-2">
        {categorias.map((categoria, index) => (
          <Link
            scroll={false}
            key={index}
            href={{
              pathname: "/books",
              query: toogleQuery("categoria", categoria.nome),
            }}
          >
            <Badge
              variant={`${categoria.nome === active ? "default" : "outline"}`}
            >
              {categoria.nome}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}

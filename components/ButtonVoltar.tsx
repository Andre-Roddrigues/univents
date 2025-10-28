"use client";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function ButtonVoltar() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back}
      className="mb-6 -ml-2 text-muted-foreground"
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      Voltar
    </Button>
  );
}

export default ButtonVoltar;

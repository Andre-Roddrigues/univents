import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

function AuthButtons() {
  return (
    <div className="space-x-4">
      <Link href="/login">
        <Button className="border-secondary text- border bg-secondary hover:bg-secondary/70 duration-75">Entrar</Button>
      </Link>
      <Link href="/register">
        <Button className="border-secondary hover:bg-secondary/70 text-muted-foreground border bg-transparent">Registar</Button>
      </Link>
    </div>
  );
}

export default AuthButtons;

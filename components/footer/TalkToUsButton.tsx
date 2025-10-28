import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import whatsapp from "@/public/icons/whatsapp.png";

function TalkToUsButton() {
  return (
    <Link
      href="https://api.whatsapp.com/send?phone=+258834303184&text=Olá,%20gostaria%20de%20Saber%20mais%20acerca%20dos%20livros."
      passHref
      className="flex"
    >
      <Button
        className="flex items-center justify-center gap-2 border text-secondary-foreground transition-all duration-200 w-full md:w-auto"
        variant={"ghost"}
      >
        Fale Connosco
        <Image
          src={whatsapp}
          alt="Whatsapp"
          className=" h-7 w-7"
          priority
          blurDataURL="/images/skeleton.gif"
          placeholder="blur"
        />
      </Button>
    </Link>
  );
}

export default TalkToUsButton;

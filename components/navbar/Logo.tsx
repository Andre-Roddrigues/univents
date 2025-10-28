import Link from "next/link";
import React from "react";
import logo from "@/public/images/unievents-logo.png";
import Image from "next/image";
import { cn } from "@/lib/utils"; // (ou use clsx ou string template)

interface LogoProps {
  className?: string;
}

function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "w-14 h-14 rounded-full  overflow-hidden relative p-0 m-0 ",
        className
      )}
    >
      <Image
        src={logo}
        fill
        alt="UniMentor logo"
        className="object-center bg-white rounded-full"
        sizes="512px"
      />
    </Link>
  );
}

export default Logo;

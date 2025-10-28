"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import clsx from "clsx";
import { Button } from "./ui/button";

interface SubmitButtonProps {
  loadingText?: string;
  defaultText?: string;
  className?: string;
  isLoading: boolean;
}

export function SubmitButton({
  loadingText = "Entrando...",
  defaultText = "Entrar",
  className,
  isLoading,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={clsx(
        "transition-all",
        className,
        isLoading && "opacity-50 cursor-not-allowed"
      )}
    >
      {isLoading ? loadingText : defaultText}
    </Button>
  );
}

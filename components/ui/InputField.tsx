import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  label?: string;
  errorMessage?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      icon,
      rightIcon,
      onRightIconClick,
      label,
      errorMessage,
      className,
      type,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "flex flex-col space-y-1 text-muted-foreground w-full",
          className
        )}
      >
        {label && <Label className="text-sm font-semibold">{label}</Label>}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-10 w-full items-center  rounded-md border border-border  bg-input leading-normal placeholder:text-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border disabled:cursor-not-allowed disabled:opacity-50 disabled:border-none disabled:bg-transparent disabled:text-zinc-600 disabled:tracking-wide",
              icon ? "pl-9" : "pl-3",
              rightIcon ? "pr-10" : "pr-3"
            )}
            ref={ref}
            {...props}
          />
          {icon && (
            <div className="absolute inset-y-0 left-2 flex items-center text-muted-foreground">
              {icon}
            </div>
          )}
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {rightIcon}
            </button>
          )}
        </div>
        {errorMessage && (
          <span className="text-destructive text-xs">{errorMessage}</span>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export { InputField };

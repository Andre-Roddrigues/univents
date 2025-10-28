"use client";
import {
  MorphingPopover,
  MorphingPopoverTrigger,
  MorphingPopoverContent,
} from "@/components/motion-primitives/morphing-popover";
import { motion } from "motion/react";
import { useId, useState } from "react";
import { ArrowLeftIcon, Search } from "lucide-react";
import SearchField from "./SearchField";
import { Button } from "../ui/button";

export function SearchPopover() {
  const uniqueId = useId();
  const [note, setNote] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setNote("");
    setIsOpen(false);
  };

  return (
    <MorphingPopover
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.3,
      }}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <MorphingPopoverTrigger asChild className="p-0">
        <motion.span
          layoutId={`popover-label-${uniqueId}`}
          className="text-sm p-0"
        >
          <Button variant={"outline"} size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </motion.span>
      </MorphingPopoverTrigger>
      <MorphingPopoverContent className="rounded-lg mt-32 -right-10 z-50  border-zinc-950/10 bg-white p0 shadow-[0_9px_9px_0px_rgba(0,0,0,0.01),_0_2px_5px_0px_rgba(0,0,0,0.06)] dark:bg-zinc-700">
        {/* <div className="text-sm"> */}
        <span className="text-sm text-muted-foreground">Pesquisar:</span>
        <SearchField />
        {/* </div> */}
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}

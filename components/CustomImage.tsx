"use client";

import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import placeholderImg from "@/public/img-placeholder.png";

interface Props {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
}

export default function CustomImage({
  src,
  alt,
  width = 620,
  height = 620,
}: Props) {
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(src);

  return (
    <Image
      width={width}
      height={height}
      src={imgSrc}
      alt={alt}
      className="w-full h-full object-cover transition-transform hover:scale-105"
      blurDataURL={"/img-placeholder.png"}
      placeholder="blur"
      onError={() => setImgSrc(placeholderImg)}
    />
  );
}

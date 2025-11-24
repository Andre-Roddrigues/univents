import HeroSection from "@/components/HomePage/HeroSection";
import BookFormatSection from "@/components/HomePage/BookFormatSection";
import SectionHome from "@/components/HomePage/sections/Sections";

export const dynamic = "force-dynamic";
export default async function Home() {


    return (
      <div className=" w-full">
        <HeroSection />
        <SectionHome />
      </div>
    );
  } 
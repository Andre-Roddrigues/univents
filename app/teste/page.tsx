import { SimpleMentorshipCarousel } from "@/components/HomePage/sections/carousel";
import { HowItWorks } from "@/components/HomePage/sections/HowItWorks";
import { WhyChooseUsMinimal } from "@/components/HomePage/sections/WhyChooseUs";
import React from "react";

export default function TestePage() {
    return (
        <main>
            <WhyChooseUsMinimal />
                   <SimpleMentorshipCarousel />
                   <HowItWorks />
        </main>
    );
}
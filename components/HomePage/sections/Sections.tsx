
import React from "react";
import { SimpleMentorshipCarousel } from "./carousel";
import HowItWorks from "./HowItWorks";
import { WhyChooseUsMinimal } from "./WhyChooseUs";
import { FindMentorCTA } from "./FindMentorCTA";
import MentorCTA from "./MentorCTA";
import CTASection from "./MentorCTA";
import BusinessMentorshipCTA from "./BusinessMentorshipCTA";
import BusinessMentorshipCT from "./BusinessMentorshipCT";
import RecentEvents from "./NewEvents";

export default function SectionHome() {
    return (
        <main>
            <RecentEvents />
            {/* <WhyChooseUsMinimal /> */}
            {/* <SimpleMentorshipCarousel /> */}
            <HowItWorks />
            <FindMentorCTA />
            {/* <BusinessMentorshipCTA /> */}
            {/* <BusinessMentorshipCT /> */}
            {/* <CTASection /> */}
        </main>
    );
}
// ===== main page file =========//

import Hero from "@/components/Hero";
import FeaturedCourses from "@/components/FeaturedCourses";
import HowItWorks from "@/components/HowItWorks";
import CategoryShowcase from "@/components/CategoryShowcase";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturedCourses />
      <HowItWorks />
      <CategoryShowcase />
    </div>
  );
}
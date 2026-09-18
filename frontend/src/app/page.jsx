// ===== main page file =========//

import Hero from "@/components/Hero";
import FeaturedCourses from "@/components/FeaturedCourses";
import HowItWorks from "@/components/HowItWorks";
import CategoryShowcase from "@/components/CategoryShowcase";
import AboutSection from "@/components/AboutSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";

export default function HomePage() {
  return (
    <div>
      <Hero />

      <section id="about" className="scroll-mt-24">
        <AboutSection />
      </section>

      <FeaturedCourses />
      <CategoryShowcase />
      <HowItWorks />

      <section id="reviews" className="scroll-mt-24">
        <ReviewsSection />
      </section>

      <section id="contact" className="scroll-mt-24">
        <ContactSection />
      </section>
    </div>
  );
}
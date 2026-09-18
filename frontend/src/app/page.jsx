// ===== main page file =========//

import Hero from "@/components/Hero";
import FeaturedCourses from "@/components/FeaturedCourses";
import HowItWorks from "@/components/HowItWorks";
import CategoryShowcase from "@/components/CategoryShowcase";
import AboutPage from "./about/page";
import ReviewsPage from "./reviews/page";
import ContactPage from "./contact/page";

export default function HomePage() {
  return (
    <div>
      <Hero />

      <section id="about" className="scroll-mt-24">
        <AboutPage />
      </section>

      <FeaturedCourses />
      <CategoryShowcase />
      <HowItWorks />

      <section id="reviews" className="scroll-mt-24">
        <ReviewsPage />
      </section>

      <section id="contact" className="scroll-mt-24">
        <ContactPage />
      </section>
    </div>
  );
}



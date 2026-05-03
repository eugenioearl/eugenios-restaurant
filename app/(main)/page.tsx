import { HeroSection } from "./_components/hero-section";
import { FeaturedMenu } from "./_components/featured-menu";
import { AboutSection } from "./_components/about-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedMenu />
      <AboutSection />
    </>
  );
}

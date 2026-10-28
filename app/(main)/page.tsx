import Hero from '@/components/Hero/Hero';
import PopularStoriesSection from '@/components/PopularStoriesSection/PopularStoriesSection';
import OurTravellers from '@/components/OurTravellers/OurTravellers';
import JoinUs from '@/components/JoinUs/JoinUs';
import About from '@/components/About/About';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularStoriesSection />
      <About />
      <OurTravellers />
      <JoinUs isAuthenticated={false} />
    </>
  );
}

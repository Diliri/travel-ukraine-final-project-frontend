import Hero from '@/components/Hero/Hero';
import PopularStoriesSection from '@/components/PopularStoriesSection/PopularStoriesSection';
import OurTravellers from '@/components/OurTravellers/OurTravellers';

export default function HomePage() {
  return (
    <>
      <Hero />
    <PopularStoriesSection />
      <OurTravellers />
    </>
  );
}

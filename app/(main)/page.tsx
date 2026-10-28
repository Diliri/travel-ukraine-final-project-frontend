import Hero from '@/components/Hero/Hero';
import PopularStoriesSection from '@/components/PopularStoriesSection/PopularStoriesSection';
import JoinUs from '@/components/JoinUs/JoinUs';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularStoriesSection />
      <JoinUs isAuthenticated={false} />
    </>
  );
}

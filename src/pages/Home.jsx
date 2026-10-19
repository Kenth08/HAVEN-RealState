import usePageMeta from '../hooks/usePageMeta';
import Hero from '../components/home/Hero';
import Statement from '../components/home/Statement';
import StoryExpand from '../components/home/StoryExpand';
import FeaturedHomes from '../components/home/FeaturedHomes';
import Discover from '../components/home/Discover';
import Neighborhoods from '../components/home/Neighborhoods';
import Contact from '../components/home/Contact';

export default function Home() {
  usePageMeta();
  return (
    <>
      {/* Curtain: the statement slides up over the pinned hero. */}
      <div className="relative">
        <Hero />
        <Statement />
      </div>
      <StoryExpand />
      <FeaturedHomes />
      <Discover />
      <Neighborhoods />
      <Contact />
    </>
  );
}

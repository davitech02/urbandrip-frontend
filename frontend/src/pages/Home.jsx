import HeroSection from '../components/sections/HeroSection';
import MarqueeStrip from '../components/home/MarqueeStrip';
import FeaturedProducts from '../components/home/FeaturedProducts';
import PromoBanner from '../components/home/PromoBanner';
import Portfolio from '../components/home/Portfolio';
import BrandFeatures from '../components/home/BrandFeatures';
import FAQSectionHome from '../components/home/FAQSectionHome';
import AboutSectionHome from '../components/home/AboutSectionHome';
import FooterHome from '../components/home/FooterHome';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <MarqueeStrip />
      <FeaturedProducts />
      <PromoBanner />
      <Portfolio />
      <BrandFeatures />
      <FAQSectionHome />
      <AboutSectionHome />
      <FooterHome />
    </div>
  );
};

export default Home;

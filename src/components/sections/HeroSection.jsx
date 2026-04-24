import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover opacity-60"
      >
        <source src="/assets/videos/hero-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Reduced Overlay */}
      <div className="absolute z-10 w-full h-full bg-black/10"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent2/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tighter font-display leading-none">
            <span className="bg-gradient-to-r from-white via-neutral-200 to-accent bg-clip-text text-transparent">
              URBAN
            </span>
            <span className="block text-accent animate-scale-in">
              DRIP
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 font-light tracking-wide uppercase opacity-90 leading-relaxed">
            Premium Streetwear for the Modern Culture
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/shop"
              className="bg-accent text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-accent/80 hover:scale-105 transition-all duration-300 uppercase tracking-widest shadow-2xl hover:shadow-accent/25"
            >
              Shop Collection
            </Link>
            <Link
              to="/shop"
              className="border-2 border-white/30 text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest backdrop-blur-sm"
            >
              Explore Categories
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

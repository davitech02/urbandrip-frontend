import { Target, Heart, Zap } from 'lucide-react';

const AboutUsSection = () => {
  const values = [
    {
      icon: <Target size={40} />,
      title: 'Our Mission',
      description: 'To inspire and empower individuals through premium streetwear that celebrates culture, creativity, and self-expression.'
    },
    {
      icon: <Heart size={40} />,
      title: 'Quality Commitment',
      description: 'We source only the finest materials and work with certified manufacturers to ensure every piece meets our high standards.'
    },
    {
      icon: <Zap size={40} />,
      title: 'Culture Forward',
      description: 'UrbanDrip stays at the forefront of streetwear trends, constantly innovating and collaborating with creative minds.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            About <span className="text-accent">URBAN</span><span className="text-white">DRIP</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Founded in 2020, UrbanDrip has become a global destination for authentic streetwear culture.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-lg p-8 hover:bg-white/10 hover:border-accent transition backdrop-blur-sm"
            >
              <div className="text-accent mb-4">{value.icon}</div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                {value.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-12 backdrop-blur-sm">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">
            Our <span className="text-accent">Story</span>
          </h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            What started as a passion project by a group of streetwear enthusiasts has grown into a community of thousands. 
            Every piece in the UrbanDrip collection tells a story of culture, creativity, and quality craftsmanship.
          </p>
          <p className="text-gray-300 leading-relaxed">
            We believe in the power of fashion to express identity. Whether you're a collector, a fashionista, or someone 
            discovering their style, UrbanDrip is your platform to find pieces that resonate with who you are.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-5xl font-black text-accent mb-2">50K+</div>
            <p className="text-gray-300 uppercase tracking-widest font-bold text-sm">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-accent mb-2">500+</div>
            <p className="text-gray-300 uppercase tracking-widest font-bold text-sm">Products</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-accent mb-2">100+</div>
            <p className="text-gray-300 uppercase tracking-widest font-bold text-sm">Countries</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;

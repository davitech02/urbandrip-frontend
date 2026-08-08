import { Truck, Headphones, RefreshCcw, Star } from 'lucide-react';

const features = [
  {
    icon: <Truck size={32} className="text-[#111111]" />,
    title: 'Free Delivery',
    description: 'Fast delivery on all orders over $100.'
  },
  {
    icon: <Headphones size={32} className="text-[#111111]" />,
    title: 'Online Support 24/7',
    description: 'We’re here whenever you need us.'
  },
  {
    icon: <RefreshCcw size={32} className="text-[#111111]" />,
    title: 'Money Return',
    description: '30-day easy returns on all products.'
  },
  {
    icon: <Star size={32} className="text-[#111111]" />,
    title: 'Member Discount',
    description: 'Exclusive deals for our loyal members.'
  }
];

const BrandFeatures = () => {
  return (
    <section className="bg-[#f9f9f9] py-24 text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="rounded-[2rem] border border-[#eeeeee] bg-white p-8 text-center transition hover:shadow-xl">
              <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f0f0]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black uppercase tracking-[0.2em] mb-3 font-body">{feature.title}</h3>
              <p className="text-[#555555] leading-relaxed font-body">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandFeatures;

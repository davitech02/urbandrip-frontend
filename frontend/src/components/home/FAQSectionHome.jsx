import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What sizes are available?',
    answer: 'We offer sizes from XS to XXL for most pieces. Check each product page for exact fit guidance and style notes.'
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes. International delivery is available to most countries with secure tracking and premium packaging.'
  },
  {
    question: 'What is your return policy?',
    answer: 'Returns are accepted within 30 days. Items must be unworn, unwashed, and in original condition.'
  },
  {
    question: 'How do I track my order?',
    answer: 'Use the Order Tracking page, enter your order number, and get real-time shipment updates.'
  },
  {
    question: 'Are your products authentic?',
    answer: 'Absolutely. Every URBAN DRIP item is sourced from trusted partners and built with premium materials.'
  },
  {
    question: 'Do you offer bulk discounts?',
    answer: 'For larger orders, reach out to support@urbandrip.com for custom pricing and expedited service.'
  }
];

const FAQSectionHome = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="bg-[#f9f9f9] text-[#111111] py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter font-display">FAQ</h2>
          <p className="mt-4 text-[#555555] text-lg max-w-3xl mx-auto font-body">
            Clear, concise answers for the most common questions about URBAN DRIP.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border-t border-[#e5e5e5] py-5">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between text-left gap-4"
              >
                <span className="text-lg font-bold uppercase tracking-[0.2em] text-[#111111] font-body">{faq.question}</span>
                <ChevronDown className={`text-[#111111] transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="mt-4 text-[#555555] leading-relaxed font-body">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSectionHome;

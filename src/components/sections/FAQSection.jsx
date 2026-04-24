import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What sizes are available?',
      answer: 'We offer sizes from XS to XXL for most of our products. Check the product page for specific size availability and our detailed size guide.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes! We ship to most countries worldwide. Shipping times and costs vary by location. International orders typically arrive within 10-15 business days.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy. Items must be unworn, unwashed, and in original packaging. Contact our support team to initiate a return.'
    },
    {
      question: 'How do I track my order?',
      answer: 'Use the Order Tracking page in the navigation menu. Enter your order ID to see real-time updates on your shipment status.'
    },
    {
      question: 'Are your products authentic?',
      answer: 'Absolutely! All UrbanDrip products are 100% authentic. We source directly from certified manufacturers and guarantee quality.'
    },
    {
      question: 'Do you offer bulk discounts?',
      answer: 'Yes! For orders of 10 or more items, please contact our support team at support@urbandrip.com for custom pricing.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            <span className="text-accent">FAQ</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Got questions? We've got answers.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition text-left"
              >
                <h3 className="font-bold text-lg uppercase tracking-tight">
                  {faq.question}
                </h3>
                <ChevronDown
                  size={24}
                  className={`text-accent flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5 pt-0 text-gray-600 border-t border-gray-100">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-gray-50 rounded-lg p-8">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="mailto:support@urbandrip.com"
            className="inline-block bg-black text-white px-8 py-3 rounded-none font-bold uppercase tracking-widest hover:bg-accent transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

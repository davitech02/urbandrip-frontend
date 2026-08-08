import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-['Playfair_Display'] text-3xl font-bold text-gray-900 mb-4">Message Received!</h1>
          <p className="text-gray-600 mb-4">Thank you for reaching out, {form.name}. We have received your message and will get back to you at <strong>{form.email}</strong> within 24 hours.</p>
          <p className="text-gray-500 text-sm mb-8">For urgent inquiries, call us at +234 800 000 0000.</p>
          <a href="/" className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-['Playfair_Display'] text-4xl font-bold text-gray-900 mb-4">CONTACT US</h1>
          <p className="text-gray-600 text-lg">We'd love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
            <Mail className="w-8 h-8 text-black mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 text-sm">support@urbandrip.com</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
            <Phone className="w-8 h-8 text-black mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600 text-sm">+234 800 000 0000</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
            <MapPin className="w-8 h-8 text-black mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Location</h3>
            <p className="text-gray-600 text-sm">Lagos, Nigeria</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-name" className="sr-only">Your Name</label>
                <input id="contact-name" type="text" placeholder="Your Name" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-['Inter']" />
              </div>
              <div>
                <label htmlFor="contact-email" className="sr-only">Your Email</label>
                <input id="contact-email" type="email" placeholder="Your Email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-['Inter']" />
              </div>
            </div>
            <div>
              <label htmlFor="contact-subject" className="sr-only">Subject</label>
              <input id="contact-subject" type="text" placeholder="Subject" required value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-['Inter']" />
            </div>
            <div>
              <label htmlFor="contact-message" className="sr-only">Your Message</label>
              <textarea id="contact-message" placeholder="Your Message" required rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-['Inter'] resize-none" />
            </div>
            <button type="submit" className="w-full bg-black text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
              <Send className="w-5 h-5" />
              SEND MESSAGE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

// src/app/(root)/contact/page.tsx
import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const ContactMethod = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="flex items-start space-x-4">
    <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon className="w-6 h-6 text-purple-700" />
    </div>
    <div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const SocialLink = ({ 
  icon: Icon, 
  href 
}: { 
  icon: React.ElementType;
  href: string;
}) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-purple-100 transition-colors"
  >
    <Icon className="w-5 h-5 text-gray-600 hover:text-purple-700" />
  </a>
);

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Have questions about our fonts or services? We&apos;re here to help. Reach out to us through any of the following channels.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <div className="space-y-8 mb-12">
              <ContactMethod 
                icon={Mail}
                title="Email Us"
                description="support@fontcompany.com"
              />
              <ContactMethod 
                icon={Phone}
                title="Call Us"
                description="+880 1234-567890"
              />
              <ContactMethod 
                icon={MapPin}
                title="Visit Us"
                description="123 Font Street, Dhaka 1200, Bangladesh"
              />
              <ContactMethod 
                icon={Clock}
                title="Business Hours"
                description="Monday - Friday: 9:00 AM - 6:00 PM BST"
              />
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <SocialLink icon={Facebook} href="https://facebook.com" />
                <SocialLink icon={Twitter} href="https://twitter.com" />
                <SocialLink icon={Instagram} href="https://instagram.com" />
                <SocialLink icon={Linkedin} href="https://linkedin.com" />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input 
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2575098088727!2d90.38570931536256!3d23.739261395235575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8c6b9b6d9c3%3A0x5b5d45b4f2b8b2b5!2sDhanmondi%2C%20Dhaka%201205!5e0!3m2!1sen!2sbd!4v1629789234567!5m2!1sen!2sbd"
              className="w-full h-96 rounded-xl"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
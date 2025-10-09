import { Mail, Linkedin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-white text-2xl font-bold mb-2">Ehab Badran</h3>
            <p className="text-slate-400 font-semibold mb-4">
              Plastic Surgeon | Founder
            </p>
            <p className="text-slate-400 mb-6 leading-relaxed">
              I Support Surgeons In Their Career and Beyond the Scrubs
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:info@ehabbadran.com"
                className="bg-gray-800 hover:bg-blue-600 p-3 rounded-lg transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/ehab-badran-62014365/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-blue-600 p-3 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="hover:text-blue-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-blue-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/newsletter" className="hover:text-blue-400 transition-colors">
                  Newsletter
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-blue-400 transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="https://ehabbadran.gumroad.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors flex items-center space-x-1">
                  <span>Gumroad Shop</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Topics</h4>
            <ul className="space-y-3">
              <li>
                <a href="/newsletter" className="hover:text-blue-400 transition-colors">
                  Career Growth
                </a>
              </li>
              <li>
                <a href="/newsletter" className="hover:text-blue-400 transition-colors">
                  Personal Branding
                </a>
              </li>
              <li>
                <a href="/newsletter" className="hover:text-blue-400 transition-colors">
                  Entrepreneurship
                </a>
              </li>
              <li>
                <a href="/newsletter" className="hover:text-blue-400 transition-colors">
                  Productivity
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              © {new Date().getFullYear()} Ehab Badran. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="mailto:info@ehabbadran.com" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <a href="mailto:info@ehabbadran.com" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
              <a href="mailto:info@ehabbadran.com" className="hover:text-blue-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { ArrowRight, Award, Users, BookOpen, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useNewsletterSubscription } from '../hooks/useNewsletterSubscription';

export default function Home() {
  const { email, setEmail, status, errorMessage, handleSubmit } = useNewsletterSubscription();

  return (
    <>
      <main className="bg-white">
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full mb-8 font-medium text-sm border border-blue-200">
                <Award className="w-4 h-4" />
                <span>Trusted by 2,000+ Surgeons</span>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] mb-6">
                Build a career you love
                <span className="block text-blue-600 mt-2">beyond the OR</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                I'm Ehab Badran, a Plastic Surgeon helping medical professionals create digital income streams,
                grow their personal brands, and design careers with more freedom and impact.
              </p>

              <form onSubmit={(e) => handleSubmit(e, 'homepage_hero')} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-200 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-lg placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all disabled:opacity-50 whitespace-nowrap shadow-sm"
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Get Free Newsletter'}
                  </button>
                </div>
                {status === 'success' && (
                  <p className="text-green-600 mt-3 flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Thanks for subscribing!</span>
                  </p>
                )}
                {status === 'error' && errorMessage && (
                  <p className="text-red-600 mt-3 flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>{errorMessage}</span>
                  </p>
                )}
              </form>

              <p className="text-sm text-gray-500">
                Join 2,000+ surgeons getting weekly insights on career growth, personal branding, and digital entrepreneurship.
              </p>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-blue-400 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative">
                <img
                  src="/My photo.png"
                  alt="Ehab Badran"
                  className="w-full rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                What I Can Help You With
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Strategic resources to help you grow beyond clinical practice
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Link
                to="/newsletter"
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all group border-2 border-gray-100 hover:border-blue-600"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="w-7 h-7 text-blue-600 group-hover:text-blue-700 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Newsletter</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Weekly insights on building your brand, growing your career, and creating income streams beyond surgery.
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Read Archives</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </Link>

              <Link
                to="/products"
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all group border-2 border-gray-100 hover:border-blue-600"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <TrendingUp className="w-7 h-7 text-blue-600 group-hover:text-blue-700 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Digital Products</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Premium guides, templates, and resources designed specifically for surgeons looking to expand their impact.
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Explore Products</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </Link>

              <a
                href="https://cosmoplastic.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all group border-2 border-gray-100 hover:border-blue-600"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <Users className="w-7 h-7 text-blue-600 group-hover:text-blue-700 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Cosmoplastic</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  A comprehensive platform providing branding and education services for aesthetic surgeons.
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Visit Platform</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 lg:p-16 text-center text-white shadow-xl">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Ready to Build Your Digital Career?
              </h2>
              <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
                Join thousands of surgeons who are learning to grow their brands, create new income streams,
                and design careers they love.
              </p>
              <form onSubmit={(e) => handleSubmit(e, 'homepage_cta')} className="max-w-xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-6 py-4 rounded-full text-gray-900 bg-white text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-full font-bold text-lg transition-all disabled:opacity-50 whitespace-nowrap shadow-sm"
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
                  </button>
                </div>
                {status === 'success' && (
                  <p className="text-white mt-3 flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Thanks for subscribing!</span>
                  </p>
                )}
                {status === 'error' && errorMessage && (
                  <p className="text-red-200 mt-3 flex items-center justify-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>{errorMessage}</span>
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                The Numbers
              </h2>
              <p className="text-xl text-gray-600">
                Building in public since 2020
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-bold text-gray-900 mb-3">12+</div>
                <div className="text-lg text-gray-600">Years in Surgery</div>
              </div>
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-bold text-blue-600 mb-3">2,000+</div>
                <div className="text-lg text-gray-600">Newsletter Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-bold text-gray-900 mb-3">5,000+</div>
                <div className="text-lg text-gray-600">Social Followers</div>
              </div>
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-bold text-blue-600 mb-3">50+</div>
                <div className="text-lg text-gray-600">Resources Created</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

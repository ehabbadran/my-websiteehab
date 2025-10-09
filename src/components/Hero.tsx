import { ArrowRight, Stethoscope } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAtOGgydi0yaC0ydjJ6bS0yLTJ2MmgtMnYyaDJ2LTJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-emerald-500 p-3 rounded-xl">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-emerald-400 font-semibold tracking-wide">FOR SURGEONS WHO WANT MORE</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Build Your Career Beyond
              <span className="block text-emerald-400 mt-2">The Operating Theatre</span>
            </h1>

            <p className="text-xl lg:text-2xl text-slate-300 mb-8 leading-relaxed">
              Join 2,000+ surgeons learning to grow their personal brand, create digital income streams, and design a career they love.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="#newsletter"
                className="group bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Get Free Weekly Insights</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#resources"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all border border-white/20"
              >
                Explore Resources
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-emerald-400">2,000+</div>
                <div className="text-slate-400 text-sm">Newsletter Subscribers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400">50+</div>
                <div className="text-slate-400 text-sm">Resources Published</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400">100%</div>
                <div className="text-slate-400 text-sm">Free to Start</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative w-80 h-80 rounded-full overflow-hidden border-8 border-emerald-500 shadow-2xl">
                <img
                  src="/My photo.png"
                  alt="Ehab Badran - Plastic Surgeon"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { FileText, Video, BookOpen, ArrowRight } from 'lucide-react';

const resources = [
  {
    icon: FileText,
    title: 'Digital Products & Guides',
    description: 'Step-by-step frameworks, templates, and playbooks to accelerate your progress.',
    cta: 'Browse Resources',
    link: '#',
    featured: true,
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'In-depth walkthroughs on branding, content creation, and business fundamentals.',
    cta: 'Watch Now',
    link: '#',
    featured: false,
  },
  {
    icon: BookOpen,
    title: 'Blog & Articles',
    description: 'Deep dives into career strategy, productivity, finance, and entrepreneurship.',
    cta: 'Read Articles',
    link: '#',
    featured: false,
  },
];

export default function Resources() {
  return (
    <section id="resources" className="py-20 lg:py-32 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Resources to Get You Started
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Practical tools and content to help you build your brand, grow your career, and create new opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <a
                key={index}
                href={resource.link}
                className={`group block p-8 rounded-2xl transition-all ${
                  resource.featured
                    ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-xl hover:shadow-2xl'
                    : 'bg-slate-800 hover:bg-slate-750 border border-slate-700'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    resource.featured ? 'bg-white/20' : 'bg-emerald-500/10'
                  }`}
                >
                  <Icon className={`w-7 h-7 ${resource.featured ? 'text-white' : 'text-emerald-500'}`} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{resource.title}</h3>
                <p className={`mb-6 leading-relaxed ${resource.featured ? 'text-emerald-50' : 'text-slate-400'}`}>
                  {resource.description}
                </p>
                <div
                  className={`flex items-center space-x-2 font-semibold group-hover:translate-x-2 transition-transform ${
                    resource.featured ? 'text-white' : 'text-emerald-400'
                  }`}
                >
                  <span>{resource.cta}</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </a>
            );
          })}
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 lg:p-12 border border-slate-700">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-3">Start with the Newsletter</h3>
              <p className="text-xl text-slate-400">
                Not sure where to begin? The weekly newsletter is the best way to get consistent, actionable
                insights delivered straight to your inbox.
              </p>
            </div>
            <a
              href="#newsletter"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              <span>Join Free Newsletter</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

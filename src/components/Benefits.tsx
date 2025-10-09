import { TrendingUp, Users, BookOpen, DollarSign, Calendar, Lightbulb } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Strategic advice on advancing your surgical career, navigating NHS structures, and creating opportunities for leadership roles.',
  },
  {
    icon: Users,
    title: 'Personal Branding',
    description: 'Build a powerful professional presence that opens doors, attracts opportunities, and positions you as a thought leader.',
  },
  {
    icon: DollarSign,
    title: 'Digital Income',
    description: 'Learn proven strategies to create income streams beyond clinical work through consulting, digital products, and expertise monetization.',
  },
  {
    icon: BookOpen,
    title: 'Entrepreneurship',
    description: 'Discover how to launch and grow side ventures while maintaining your clinical practice and work-life balance.',
  },
  {
    icon: Calendar,
    title: 'Productivity Systems',
    description: 'Master time management, focus techniques, and productivity frameworks designed specifically for busy medical professionals.',
  },
  {
    icon: Lightbulb,
    title: 'Practical Resources',
    description: 'Access templates, guides, and tools that save you time and help you implement strategies immediately.',
  },
];

export default function Benefits() {
  return (
    <section className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need to Thrive
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive guidance across the key areas that matter most for your professional and personal success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Real-World Experience from a Practicing Surgeon
            </h3>
            <p className="text-lg text-slate-700">
              I'm not a guru or coach. I'm a practicing surgeon who has successfully built multiple income streams,
              grown an audience, and designed a fulfilling career. I share what actually works.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Ehab's insights on building a personal brand have been transformative. I've gone from zero online presence to being recognized at conferences.",
    author: "Dr. Sarah Mitchell",
    role: "Consultant Surgeon, London",
  },
  {
    quote: "The productivity systems shared in the newsletter have helped me reclaim 10+ hours per week. Game-changing for work-life balance.",
    author: "Dr. James Chen",
    role: "Registrar, Manchester",
  },
  {
    quote: "I launched my first digital product using the strategies Ehab teaches. It now generates meaningful income alongside my clinical work.",
    author: "Dr. Amira Patel",
    role: "Consultant Surgeon, Birmingham",
  },
];

const results = [
  { metric: '2,000+', label: 'Surgeons in Community' },
  { metric: '95%', label: 'Open Rate' },
  { metric: '4.8/5', label: 'Average Rating' },
  { metric: '50+', label: 'Resources Created' },
];

export default function SocialProof() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Trusted by Surgeons Across the UK
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join a community of ambitious medical professionals who are building careers they love.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {results.map((result, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-emerald-600 mb-2">
                {result.metric}
              </div>
              <div className="text-slate-600">{result.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors"
            >
              <Quote className="w-10 h-10 text-emerald-500 mb-4" />
              <p className="text-slate-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-slate-200 pt-4">
                <div className="font-semibold text-slate-900">{testimonial.author}</div>
                <div className="text-sm text-slate-600">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 lg:p-12 border border-emerald-100">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Why Surgeons Trust This Newsletter
            </h3>
            <p className="text-lg text-slate-700 mb-6">
              Unlike generic business advice, every insight is tailored specifically for medical professionals.
              I understand your unique challenges, time constraints, and career pressures because I live them too.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white px-4 py-2 rounded-full text-slate-700 font-medium">
                Evidence-Based Strategies
              </span>
              <span className="bg-white px-4 py-2 rounded-full text-slate-700 font-medium">
                Real-World Experience
              </span>
              <span className="bg-white px-4 py-2 rounded-full text-slate-700 font-medium">
                No BS or Hype
              </span>
              <span className="bg-white px-4 py-2 rounded-full text-slate-700 font-medium">
                UK Healthcare Focus
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

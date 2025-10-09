import { Stethoscope, Users, BookOpen, TrendingUp, ExternalLink, Briefcase } from 'lucide-react';
import Footer from '../components/Footer';

export default function About() {
  const projects = [
    {
      name: 'Cosmoplastic',
      description: 'A comprehensive platform providing branding and education services for cosmetic surgeons. Helping aesthetic practitioners enhance their skills, build their brands, and grow their practices.',
      url: 'https://cosmoplastic.co.uk',
      icon: Briefcase,
      featured: true,
    },
    {
      name: 'Beyond The Scrubs Newsletter',
      description: 'Weekly newsletter reaching 2,000+ surgeons with actionable insights on career growth, personal branding, and digital entrepreneurship.',
      url: '#newsletter',
      icon: BookOpen,
      featured: true,
    },
    {
      name: 'Digital Products Library',
      description: 'Collection of guides, templates, and resources specifically designed to help surgeons advance their careers and create new opportunities.',
      url: '/products',
      icon: TrendingUp,
      featured: false,
    },
  ];

  const stats = [
    { label: 'Years in Surgery', value: '12+' },
    { label: 'Newsletter Subscribers', value: '2,000+' },
    { label: 'Social Media Followers', value: '5,000+' },
    { label: 'Resources Created', value: '50+' },
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-blue-600 shadow-2xl">
              <img
                src="/My photo.png"
                alt="Ehab Badran"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              Hi, I'm Ehab Badran
            </h1>
            <p className="text-2xl text-blue-400 font-semibold mb-4">
              Plastic Surgeon | Founder
            </p>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              I Support Surgeons In Their Career and Beyond the Scrubs
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="prose prose-lg prose-invert max-w-none mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">My Story</h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              I'm a Plastic Surgeon working in the NHS with over 12 years of medical experience. As an International Medical Graduate (IMG), I know firsthand the challenges of building a career in a new healthcare system and working your way up through dedication and strategic thinking.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              Throughout my journey, I realized that being a good surgeon isn't just about technical skills. It's about building your brand, creating opportunities, and designing a career that gives you both professional fulfillment and personal freedom. That's why I started sharing what I've learned.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">My Mission</h3>

            <p className="text-gray-600 leading-relaxed mb-6">
              My mission is simple: <strong>equip surgeons with the knowledge and tools to grow their careers, build their brands, and create new opportunities.</strong>
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              I believe that being a good surgeon doesn't mean having to grind, suffer, and work to the point of exhaustion and burnout. You can be excellent at what you do while also enjoying the journey and maintaining balance in your life.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">What I Do</h3>

            <p className="text-gray-600 leading-relaxed mb-6">
              Through my newsletter, blog, and digital products, I share practical strategies on:
            </p>

            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li><strong>Career Growth:</strong> How to advance strategically in the NHS and beyond</li>
              <li><strong>Personal Branding:</strong> Building an online presence that opens doors</li>
              <li><strong>Digital Entrepreneurship:</strong> Creating income streams beyond clinical work</li>
              <li><strong>Productivity:</strong> Working smarter, not just harder</li>
              <li><strong>Financial Wisdom:</strong> Making smart money decisions as a doctor</li>
            </ul>

            <p className="text-gray-600 leading-relaxed">
              I'm not a guru or life coach. I'm a Plastic Surgeon who has successfully built multiple projects, grown an audience, and designed a fulfilling career. I share what actually works based on real-world experience.
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Projects I'm Working On</h2>

            <div className="space-y-6">
              {projects.map((project, index) => {
                const Icon = project.icon;
                const isExternal = project.url.startsWith('http');

                return (
                  <a
                    key={index}
                    href={project.url}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className={`block p-6 rounded-xl border-2 transition-all group ${
                      project.featured
                        ? 'border-blue-600 bg-gray-50 hover:border-blue-500 hover:shadow-lg'
                        : 'border-blue-700 bg-gray-50 hover:border-blue-600 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg flex-shrink-0 ${
                        project.featured ? 'bg-blue-100' : 'bg-blue-100'
                      }`}>
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                          {isExternal && (
                            <ExternalLink className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
                          )}
                        </div>
                        <p className="text-gray-600 leading-relaxed">{project.description}</p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 lg:p-12 text-white text-center border-2 border-blue-600">
            <Users className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
              Join 2,000+ surgeons who are building careers they love. Get weekly insights delivered to your inbox.
            </p>
            <a
              href="#newsletter"
              className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Subscribe to Newsletter
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

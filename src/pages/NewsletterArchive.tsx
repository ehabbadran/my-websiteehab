import { useEffect, useState } from 'react';
import { Mail, CheckCircle2, ExternalLink, Calendar, Linkedin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import Footer from '../components/Footer';

type Newsletter = Database['public']['Tables']['newsletters']['Row'];

export default function NewsletterArchive() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    async function fetchNewsletters() {
      try {
        const { data, error } = await supabase
          .from('newsletters')
          .select('*')
          .order('published_date', { ascending: false });

        if (error) throw error;
        setNewsletters(data || []);
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewsletters();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('loading');

    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Mail className="w-5 h-5 mr-2" />
              <span className="font-semibold">Beyond The Scrubs Newsletter</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              Weekly Insights for Ambitious Surgeons
            </h1>

            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join 2,000+ surgeons getting actionable advice on career growth, personal branding, and digital entrepreneurship every Thursday.
            </p>

            {subscribeStatus === 'success' ? (
              <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Aboard!</h3>
                <p className="text-gray-600">Check your email for confirmation.</p>
              </div>
            ) : (
              <div className="max-w-xl mx-auto">
                <form onSubmit={handleSubscribe}>
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="flex-1 px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-slate-300"
                    />
                    <button
                      type="submit"
                      disabled={subscribeStatus === 'loading'}
                      className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                      {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
                    </button>
                  </div>
                </form>
                <div className="text-center">
                  <a
                    href="https://www.linkedin.com/newsletters/7042121432830484480/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>Follow on LinkedIn</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Newsletter Archive</h2>
            <p className="text-xl text-gray-600">
              Browse past editions and see what you'll get every Thursday.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600 text-lg mt-4">Loading newsletter archive...</p>
            </div>
          ) : newsletters.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl">
              <Mail className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No newsletters available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {newsletters.map((newsletter, index) => (
                <a
                  key={newsletter.id}
                  href={newsletter.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white border-2 border-slate-200 hover:border-blue-500 rounded-2xl p-8 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          Issue #{newsletters.length - index}
                        </span>
                        <div className="flex items-center text-sm text-slate-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(newsletter.published_date)}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {newsletter.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {newsletter.preview_content}
                      </p>
                    </div>
                    <ExternalLink className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                  </div>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>Read Full Issue</span>
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="mt-16 bg-slate-50 rounded-2xl p-10 border-2 border-slate-200">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              What You'll Get Every Week
            </h3>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-blue-700" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Actionable Strategies</h4>
                <p className="text-gray-600 leading-relaxed">
                  Practical tips you can implement immediately in your career
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-blue-700" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Real Experience</h4>
                <p className="text-gray-600 leading-relaxed">
                  From a practicing surgeon who's built multiple successful ventures
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-blue-700" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Exclusive Insights</h4>
                <p className="text-gray-600 leading-relaxed">
                  Deep dives and frameworks not available anywhere else
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

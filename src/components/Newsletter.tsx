import { Mail, CheckCircle2, Gift, AlertCircle } from 'lucide-react';
import { useNewsletterSubscription } from '../hooks/useNewsletterSubscription';

export default function Newsletter() {
  const { email, setEmail, status, errorMessage, handleSubmit } = useNewsletterSubscription();

  return (
    <section id="newsletter" className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center text-white">
          <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Gift className="w-5 h-5 mr-2" />
            <span className="font-semibold">Free Weekly Newsletter</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Join 2,000+ Surgeons Getting Ahead
          </h2>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Every week, get actionable insights on career growth, personal branding, digital income, and productivity.
            Plus, exclusive resources you won't find anywhere else.
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome Aboard!</h3>
                <p className="text-slate-600">Check your email for a confirmation link and your first resource.</p>
              </div>
            ) : (
              <form onSubmit={(e) => handleSubmit(e, 'newsletter_page')} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-slate-200 focus:border-emerald-500 focus:outline-none text-slate-900 text-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl whitespace-nowrap"
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Get Free Access'}
                  </button>
                </div>

                {status === 'error' && errorMessage && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                )}

                <p className="text-sm text-slate-500 text-center">
                  Join surgeons from Imperial, Oxford, Cambridge, and across the UK. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold text-slate-100">Weekly Insights</div>
                <div className="text-sm text-slate-300">Practical strategies every Thursday</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold text-slate-100">Exclusive Resources</div>
                <div className="text-sm text-slate-300">Templates, guides, and tools</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold text-slate-100">No Spam</div>
                <div className="text-sm text-slate-300">Quality over quantity, always</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

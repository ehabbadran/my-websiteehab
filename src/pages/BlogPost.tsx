import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import Footer from '../components/Footer';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setError('Blog post not found');
        } else {
          setPost(data);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 text-lg">Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h1>
            <p className="text-slate-600 mb-8">The article you're looking for doesn't exist.</p>
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 text-blue-600 font-semibold hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(post.published_date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12">
          <div className="max-w-4xl mx-auto px-6">
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 text-slate-300 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>

            <div className="mb-6">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center space-x-6 text-slate-300">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{post.read_time} min read</span>
              </div>
            </div>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl border border-slate-200 p-8 lg:p-12 shadow-sm">
            {post.featured_image_url && (
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-auto rounded-lg mb-8"
              />
            )}

            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-strong:font-semibold prose-ul:list-disc prose-ol:list-decimal prose-li:text-slate-700 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-md">
              <div className="text-xl text-slate-700 leading-relaxed mb-8 pb-8 border-b border-slate-200 italic">
                {post.excerpt}
              </div>

              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>

          <div className="mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Articles</span>
            </Link>
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
}

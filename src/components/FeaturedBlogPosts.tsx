import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import BlogCard from './BlogCard';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

export default function FeaturedBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_featured', true)
          .order('published_date', { ascending: false })
          .limit(3);

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-slate-600">Loading featured posts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Featured Articles
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Latest insights on career growth, personal branding, and building a fulfilling surgical career.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              category={post.category}
              publishedDate={post.published_date}
              readTime={post.read_time}
              externalUrl={post.external_url}
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl group"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import BlogCard from '../components/BlogCard';
import Footer from '../components/Footer';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

const categories = [
  'All',
  'Entrepreneurship',
  'Productivity',
  'Reflections',
  'Finance',
  'Reviews',
  'Health',
  'UK Doctors\' Digest',
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('published_date', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
        setFilteredPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.category === selectedCategory));
    }
  }, [selectedCategory, posts]);

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-slate-300 max-w-2xl">
              Insights on career growth, personal branding, productivity, and building a fulfilling surgical career.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-slate-600 text-lg">Loading articles...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-600 text-lg">No articles found in this category.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-slate-600">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
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
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

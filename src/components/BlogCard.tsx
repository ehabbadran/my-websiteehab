import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedDate: string;
  readTime: number;
  externalUrl: string;
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  category,
  publishedDate,
  readTime,
  externalUrl,
}: BlogCardProps) {
  const formattedDate = new Date(publishedDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden group">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            {category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
          <Link to={`/blog/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>

        <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">{excerpt}</p>

        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>

        <Link
          to={`/blog/${slug}`}
          className="inline-flex items-center space-x-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group/link"
        >
          <span>Read Article</span>
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}

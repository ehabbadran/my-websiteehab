import { Calendar, ExternalLink } from 'lucide-react';

interface NewsletterCardProps {
  title: string;
  publishedDate: string;
  previewContent: string;
  externalUrl: string;
}

export default function NewsletterCard({
  title,
  publishedDate,
  previewContent,
  externalUrl,
}: NewsletterCardProps) {
  const formattedDate = new Date(publishedDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all p-6 group">
      <div className="flex items-center text-sm text-slate-500 mb-3">
        <Calendar className="w-4 h-4 mr-2" />
        <span>{formattedDate}</span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
        {title}
      </h3>

      <p className="text-slate-600 mb-4 leading-relaxed">{previewContent}</p>

      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group/link"
      >
        <span>Read Full Newsletter</span>
        <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
      </a>
    </article>
  );
}

import { ExternalLink, Star } from 'lucide-react';

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  gumroadUrl: string;
  isBestseller: boolean;
  category: string;
}

export default function ProductCard({
  name,
  description,
  price,
  gumroadUrl,
  isBestseller,
  category,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `£${price.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
            {category}
          </span>
          {isBestseller && (
            <div className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              <Star className="w-4 h-4 fill-current" />
              <span>Bestseller</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-3 min-h-[3.5rem] leading-tight">
          {name}
        </h3>

        <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">{description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-2xl font-bold text-blue-600">{formatPrice(price)}</div>
          <a
            href={gumroadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all group-hover:shadow-md"
          >
            <span>View Product</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

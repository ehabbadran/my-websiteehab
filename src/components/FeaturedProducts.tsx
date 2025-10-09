import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import ProductCard from './ProductCard';

type Product = Database['public']['Tables']['products']['Row'];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBestsellers() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_bestseller', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching bestseller products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBestsellers();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-slate-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Bestselling Resources
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Proven guides and templates trusted by hundreds of surgeons to accelerate their career growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              gumroadUrl={product.gumroad_url}
              isBestseller={product.is_bestseller}
              category={product.category}
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { Package, ExternalLink, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import Footer from '../components/Footer';

type Product = Database['public']['Tables']['products']['Row'];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-semibold">Digital Products</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              Resources to Accelerate Your Career
            </h1>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive guides, templates, and tools designed specifically for surgeons who want to build their brand, grow their income, and design a career they love.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Available Products</h2>
            <p className="text-xl text-gray-600">
              Premium resources designed by a surgeon, for surgeons
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
              <p className="text-gray-600 text-lg mt-4">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl">
              <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-6">No products available yet. Check back soon!</p>
              <a
                href="https://ehabbadran.gumroad.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              >
                <span>Visit Gumroad Store</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {products.map((product) => (
                  <a
                    key={product.id}
                    href={product.gumroad_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-2xl p-8 transition-all hover:shadow-xl"
                  >
                    {product.is_bestseller && (
                      <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                        Bestseller
                      </div>
                    )}

                    {product.image_url ? (
                      <div className="mb-6 rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                        <Package className="w-8 h-8 text-blue-700 group-hover:text-white transition-colors" />
                      </div>
                    )}

                    <div className="mb-4">
                      <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                        {product.category || 'Guide'}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-600-600 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-6">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-gray-900">
                        £{Number(product.price).toFixed(2)}
                      </span>
                      <div className="flex items-center text-gray-600-600 font-semibold group-hover:translate-x-2 transition-transform">
                        <span>View Product</span>
                        <ExternalLink className="w-5 h-5 ml-2" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="text-center">
                <a
                  href="https://ehabbadran.gumroad.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all border-2 border-slate-300"
                >
                  <span>Browse All on Gumroad</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </>
          )}

          <div className="mt-20 bg-slate-50 rounded-2xl p-10 lg:p-16 border-2 border-slate-200">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Not Sure Where to Start?
              </h3>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join the free newsletter to get weekly insights and exclusive resources delivered to your inbox every Thursday.
              </p>
              <a
                href="/#newsletter"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Subscribe to Newsletter
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

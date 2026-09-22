import { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, RefreshCw, ShoppingBag, Eye } from 'lucide-react';
import type { BoutiqueProduct } from '../types/boutique';

const CATEGORIES = [
  { id: 'all', label: 'All Creations' },
  { id: 'bridal_sarees', label: 'Bridal Sarees' },
  { id: 'designer_lehengas', label: 'Designer Lehengas' },
  { id: 'kurtis', label: 'Festive Kurtis' },
  { id: 'festive', label: 'Couture & Festive' },
];

export const Collection = () => {
  const [products, setProducts] = useState<BoutiqueProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<BoutiqueProduct | null>(null);

  const fetchCollection = async () => {
    setLoading(true);
    setError(null);
    try {
      if (window.boutique?.storage?.fetchMedia) {
        const items = await window.boutique.storage.fetchMedia();
        setProducts(items || []);
      } else {
        // Retry shortly if SDK is still initializing
        setTimeout(async () => {
          if (window.boutique?.storage?.fetchMedia) {
            try {
              const items = await window.boutique.storage.fetchMedia();
              setProducts(items || []);
            } catch (err: unknown) {
              const errorMsg = err instanceof Error ? err.message : 'Unable to load collection';
              setError(errorMsg);
            }
          } else {
            setProducts([]);
          }
          setLoading(false);
        }, 800);
        return;
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unable to load boutique items.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  const handleOrderWhatsApp = (product: BoutiqueProduct) => {
    if (window.boutique?.whatsapp?.openChat) {
      window.boutique.whatsapp.openChat(product);
    } else {
      const title = product.title || 'Designer Outfit';
      const price = product.price ? product.price.toLocaleString('en-IN') : 'On Request';
      const imageUrl = product.fileUrl || '';
      const text = `Hello test_web!\nI would like to order/inquire about this dress:\n- Product: ${title}\n- Price: Rs. ${price}\n- Image: ${imageUrl}\nPlease share available sizes, fabric details & custom blouse stitching options.`;
      const encoded = encodeURIComponent(text);
      window.open(`https://wa.me/917660922413?text=${encoded}`, '_blank');
    }
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section id="collection" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 border border-amber-300/60 text-amber-900 text-xs font-semibold tracking-widest uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          Exclusive Haute Couture
        </div>
        <h2 className="text-4xl sm:text-5xl font-serif tracking-tight text-stone-900 mb-4 font-normal">
          The Bridal & Festive Collection
        </h2>
        <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
          Meticulously hand-embroidered, artisanal silks and contemporary bridal couture designed for unforgettable celebrations in Hyderabad.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-stone-900 text-amber-100 shadow-md shadow-stone-900/10 scale-105'
                  : 'bg-white text-stone-600 border border-stone-200/80 hover:border-amber-400 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-amber-700 animate-spin mb-4" />
          <p className="text-stone-500 font-serif text-lg">Curating exquisite creations...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="text-center py-16 bg-rose-50/60 border border-rose-200/80 rounded-2xl p-8 max-w-lg mx-auto">
          <p className="text-rose-800 font-medium mb-3">{error}</p>
          <button
            onClick={fetchCollection}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-amber-100 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
        </div>
      )}

      {/* Zero Items / Coming Soon State */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-24 bg-white/60 backdrop-blur-sm border border-stone-200/70 rounded-3xl p-12 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-3">
            New Season Collection Coming Soon
          </h3>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 font-light">
            Our bridal studio in mad,hyd is handcrafting our latest couture line. Contact us directly on WhatsApp to preview exclusive in-studio lookbooks or book a custom styling appointment.
          </p>
          <button
            onClick={() => {
              const text = encodeURIComponent('Hello test_web! I would like to inquire about your upcoming bridal & festive collection.');
              window.open(`https://wa.me/917660922413?text=${text}`, '_blank');
            }}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-full text-sm font-semibold tracking-wide transition-colors duration-200 shadow-md shadow-emerald-900/10 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            Inquire on WhatsApp (917660922413)
          </button>
        </div>
      )}

      {/* Luxury Product Grid */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredProducts.map((product) => {
            const displayTitle = product.title || 'Handcrafted Designer Ensemble';
            const displayPrice = product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on Request';
            const categoryLabel = CATEGORIES.find((c) => c.id === product.category)?.label || 'Couture';

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/70 shadow-sm hover:shadow-xl hover:border-amber-300/80 transition-all duration-500 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                  <img
                    src={product.fileUrl}
                    alt={displayTitle}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="w-full py-2.5 bg-white/95 backdrop-blur text-stone-900 text-xs font-semibold tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors shadow-lg cursor-pointer"
                    >
                      <Eye className="w-4 h-4" /> Quick Preview
                    </button>
                  </div>
                  <span className="absolute top-4 left-4 px-3 py-1 bg-stone-900/85 backdrop-blur-md text-amber-200 text-[11px] font-semibold tracking-wider uppercase rounded-full border border-amber-500/20">
                    {categoryLabel}
                  </span>
                </div>

                {/* Content Container */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-stone-900 mb-2 line-clamp-1 group-hover:text-amber-800 transition-colors">
                      {displayTitle}
                    </h3>
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-lg font-semibold text-stone-900 font-sans tracking-tight">
                        {displayPrice}
                      </span>
                      <span className="text-xs text-stone-500 font-light">Custom Tailoring Available</span>
                    </div>
                  </div>

                  {/* WhatsApp Ordering CTA */}
                  <button
                    onClick={() => handleOrderWhatsApp(product)}
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-5 bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:from-[#0f776a] hover:to-[#1eb956] text-white rounded-xl text-sm font-semibold tracking-wide shadow-md shadow-emerald-900/10 hover:shadow-emerald-900/20 transition-all duration-300 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-[#128C7E]" />
                    Order on WhatsApp / Custom Stitching
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Preview */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 grid grid-cols-1 md:grid-cols-2 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[3/4] bg-stone-100">
              <img
                src={selectedProduct.fileUrl}
                alt={selectedProduct.title || 'Product'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
                  {selectedProduct.category.replace('_', ' ')}
                </span>
                <h3 className="text-3xl font-serif text-stone-900 mb-2">
                  {selectedProduct.title || 'Designer Ensemble'}
                </h3>
                <p className="text-2xl font-sans font-bold text-stone-900 mb-4">
                  {selectedProduct.price ? `₹${selectedProduct.price.toLocaleString('en-IN')}` : 'Price on Request'}
                </p>
                <div className="space-y-2 text-sm text-stone-600 border-t border-b border-stone-100 py-4 my-4 font-light">
                  <p>✨ 100% Authentic Handcrafted Heritage Weaves</p>
                  <p>✨ Custom Blouse Stitching & Tassels Included</p>
                  <p>✨ Worldwide & Hyderabad Same-Day Studio Pickup</p>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    handleOrderWhatsApp(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-3.5 px-4 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" /> Inquire & Order via WhatsApp
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full py-2.5 px-4 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

import { MapPin, Phone, Sparkles, MessageCircle, ShieldCheck, Clock, Scissors, Award } from 'lucide-react';
import { Collection } from './Collection';

export const Storefront = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-amber-200 selection:text-stone-900">
      {/* Top Banner */}
      <div className="bg-stone-900 text-amber-200/90 text-xs py-2.5 px-4 text-center tracking-widest uppercase font-medium flex items-center justify-center gap-3">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Bespoke Bridal Couture Studio in mad,hyd • Instant WhatsApp Custom Orders</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-stone-900 font-bold">
              test_web
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
              Hyderabad
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-600">
            <a href="#collection" className="hover:text-stone-900 transition-colors">Collection</a>
            <a href="#about" className="hover:text-stone-900 transition-colors">Bridal Studio</a>
            <a href="#custom-stitching" className="hover:text-stone-900 transition-colors">Custom Stitching</a>
            <a href="#contact" className="hover:text-stone-900 transition-colors">Visit Us</a>
            <a href="/admin" className="text-amber-800 hover:text-amber-900 font-semibold transition-colors">Owner Console</a>
          </nav>

          <div className="flex items-center space-x-3">
            <a
              href="https://wa.me/917660922413"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp Us</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:py-28 bg-gradient-to-b from-stone-100/70 to-[#FAF8F5] border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Bridal Couture & Designer Sarees
            </div>
            <h1 className="text-4xl sm:text-6xl font-serif text-stone-900 tracking-tight leading-[1.15] font-normal">
              Elegance Woven for the Modern Indian Bride.
            </h1>
            <p className="text-stone-600 text-lg sm:text-xl font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Welcome to <strong>test_web</strong>. Discover handcrafted bridal lehengas, authentic pure silk sarees, and bespoke designer outfits tailored to your exact measurements at our Hyderabad boutique studio.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#collection"
                className="w-full sm:w-auto px-8 py-4 bg-stone-900 text-amber-100 hover:bg-stone-800 rounded-full text-sm font-semibold tracking-wide uppercase transition-all shadow-lg shadow-stone-900/10 text-center cursor-pointer"
              >
                Explore Collection
              </a>
              <a
                href="https://wa.me/917660922413?text=Hello%20test_web!%20I%20would%20like%20to%20book%20a%20bridal%20consultation%20appointment."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white border border-stone-300 hover:border-amber-500 text-stone-800 hover:text-stone-900 rounded-full text-sm font-semibold tracking-wide transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#128C7E]" />
                Book Consultation
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-stone-200/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="font-serif text-2xl font-bold text-stone-900">100%</p>
                <p className="text-xs text-stone-500 font-light">Pure Handloom Silks</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-stone-900">mad,hyd</p>
                <p className="text-xs text-stone-500 font-light">Studio Location</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-stone-900">Direct</p>
                <p className="text-xs text-stone-500 font-light">WhatsApp Ordering</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white p-4 rounded-3xl shadow-2xl border border-stone-200/80 rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                  alt="Bridal Couture Lehenga"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-1">
                    Signature Wedding Line
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-white">
                    Zardozi Handcrafted Royal Lehenga
                  </h3>
                  <p className="text-stone-300 text-xs mt-1">Available in Custom Sizing & Bridal Trousseau Packages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dynamic Collection Component */}
      <Collection />

      {/* Craftsmanship & Custom Stitching Section */}
      <section id="custom-stitching" className="py-20 bg-stone-900 text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-2 block">
              Bespoke Tailoring & Master Tailors
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif tracking-tight font-normal text-white">
              The Art of Custom Bridal Stitching
            </h2>
            <p className="text-stone-400 text-base mt-4 font-light">
              Every body is unique, and every bridal outfit deserves a flawless, sculpted fit. Our master tailors in Hyderabad deliver bespoke tailoring with personalized necklines, sleeve cuts, and premium padding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-stone-800/60 border border-stone-700/60">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-6">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">Designer Blouse Stitching</h3>
              <p className="text-stone-400 text-sm font-light leading-relaxed">
                Elaborate Maggam work, Zari embroidery, stone embellishments, and custom back patterns designed to complement your bridal saree.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-stone-800/60 border border-stone-700/60">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">Custom Fit Lehengas</h3>
              <p className="text-stone-400 text-sm font-light leading-relaxed">
                Made-to-measure bridal lehengas with double can-can flares, latkans, and personalized waistbands for comfortable all-day wedding wear.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-stone-800/60 border border-stone-700/60">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">Pre-Pleated Sarees</h3>
              <p className="text-stone-400 text-sm font-light leading-relaxed">
                Effortless 1-minute drape saree stitching tailored to your height for festive occasions, sangeet nights, and receptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About & Studio Visit */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-amber-800 text-xs font-semibold tracking-widest uppercase block">
              About Our Studio
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 tracking-tight">
              A Legacy of Grace, Craftsmanship & Contemporary Flair
            </h2>
            <p className="text-stone-600 text-base leading-relaxed font-light">
              Located in mad,hyd, <strong>test_web</strong> is Hyderabad's premier destination for high-end bridal couture, festive kurtis, and designer wedding ensembles. We work closely with heritage weavers and artisan craftsmen across India to bring timeless creations directly to your wardrobe.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-stone-700 text-sm">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>Boutique Address: mad,hyd, Hyderabad, Telangana</span>
              </div>
              <div className="flex items-center gap-3 text-stone-700 text-sm">
                <Phone className="w-4 h-4 text-amber-700" />
                <span>WhatsApp Hotline: +91 7660922413</span>
              </div>
              <div className="flex items-center gap-3 text-stone-700 text-sm">
                <span className="w-4 h-4 text-amber-700 font-bold text-center">@</span>
                <span>Instagram: @test</span>
              </div>
              <div className="flex items-center gap-3 text-stone-700 text-sm">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Studio Hours: 10:30 AM – 8:30 PM (Open 7 Days)</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-8 sm:p-10 text-center space-y-6">
            <h3 className="font-serif text-2xl text-stone-900">Connect Directly with Our Head Stylist</h3>
            <p className="text-stone-600 text-sm font-light">
              Need assistance selecting the right color palette, fabric drape, or stitching consultation? Chat directly with us on WhatsApp.
            </p>
            <a
              href="https://wa.me/917660922413?text=Hello%20test_web!%20I%20would%20like%20to%20inquire%20about%20bridal%20outfits."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-full text-sm font-semibold tracking-wide shadow-md transition-colors cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp (917660922413)
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-2xl font-serif text-white font-bold">test_web</h3>
            <p className="text-sm text-stone-400 font-light max-w-sm">
              Luxury Bridal Couturier & Boutique Studio in Hyderabad. Crafting bespoke elegance for brides and wedding parties.
            </p>
            <p className="text-xs text-stone-500 font-mono">
              Central Engine: BoutiqueCore SDK • Client ID: cl_hyd_testweb_ac36e7
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm font-light">
              <li><a href="#collection" className="hover:text-white transition-colors">Bridal Sarees</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Designer Lehengas</a></li>
              <li><a href="#custom-stitching" className="hover:text-white transition-colors">Custom Tailoring</a></li>
              <li><a href="/admin" className="hover:text-white transition-colors">Store Admin Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-4">Contact & Social</h4>
            <ul className="space-y-2 text-sm font-light">
              <li>Location: mad,hyd</li>
              <li>WhatsApp: +91 7660922413</li>
              <li>Instagram: <a href="https://instagram.com/test" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 underline">@test</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-stone-800 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} test_web Boutique. All Rights Reserved.</p>
          <p>Powered by BoutiqueCore SaaS Engine</p>
        </div>
      </footer>
    </div>
  );
};

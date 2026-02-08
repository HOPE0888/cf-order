
import React from 'react';
import { Link } from 'react-router-dom';
import { Product, CartItem, Language } from '../types';

interface ShopPageProps {
  t: any;
  lang: Language;
  products: Product[];
  cart: CartItem[];
  exchangeRate: number;
  shopNote: string;
  onAdd: (p: Product) => void;
  onRemove: (id: string) => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ t, lang, products, cart, exchangeRate, shopNote, onAdd, onRemove }) => {
  const getQuantity = (id: string) => cart.find(i => i.id === id)?.quantity || 0;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPriceJPY = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalPriceCNY = totalPriceJPY * exchangeRate;

  return (
    <div className="pb-24">
      {/* Shop Announcement */}
      <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-indigo-800 font-bold flex items-center gap-2 mb-2">
          <i className="fa-solid fa-bullhorn"></i>
          {t.announcement}
        </h2>
        <p className="text-indigo-600 text-sm leading-relaxed whitespace-pre-wrap">
          {shopNote}
        </p>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{t.browse}</h1>
        <div className="relative">
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex">
            <img src={product.image} alt={product.name[lang]} className="w-32 h-32 object-cover" />
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">{product.name[lang]}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description[lang]}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex flex-col">
                  <span className="text-indigo-600 font-bold text-lg">¥{product.price} <span className="text-xs font-normal opacity-70">JPY</span></span>
                  <span className="text-emerald-600 text-sm font-medium">≈ ￥{(product.price * exchangeRate).toFixed(2)} <span className="text-[10px] uppercase">CNY</span></span>
                </div>
                <div className="flex items-center gap-2">
                  {getQuantity(product.id) > 0 && (
                    <>
                      <button 
                        onClick={() => onRemove(product.id)}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span className="font-bold w-4 text-center">{getQuantity(product.id)}</span>
                    </>
                  )}
                  <button 
                    onClick={() => onAdd(product)}
                    className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 shadow-sm transition-colors"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg">
          <Link to="/checkout" className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between hover:scale-[1.02] transition-transform active:scale-100 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 px-3 py-1 rounded-lg text-sm font-bold">
                {totalItems} {t.items}
              </div>
              <span className="font-semibold">{t.checkout}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-bold">¥{totalPriceJPY} JPY</span>
              <span className="text-xs text-emerald-400 font-medium">≈ ￥{totalPriceCNY.toFixed(2)} CNY</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ShopPage;

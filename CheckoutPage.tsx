
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartItem, Order } from '../types';

interface CheckoutPageProps {
  t: any;
  cart: CartItem[];
  exchangeRate: number;
  shopNote: string;
  onPlaceOrder: (wechat: string, date: string, time: string, screenshot: string) => Order;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ t, cart, exchangeRate, shopNote, onPlaceOrder }) => {
  const navigate = useNavigate();
  const [wechat, setWechat] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [screenshot, setScreenshot] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPriceJPY = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalPriceCNY = Number((totalPriceJPY * exchangeRate).toFixed(2));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wechat || !pickupDate || !pickupTime || !screenshot) {
      alert(t.uploadScreenshot + ' is required!');
      return;
    }
    setIsSubmitting(true);
    const order = onPlaceOrder(wechat, pickupDate, pickupTime, screenshot);
    navigate(`/confirmation/${order.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <i className="fa-solid fa-cart-shopping text-6xl text-slate-200 mb-4"></i>
        <p className="text-slate-500 mb-6">{t.emptyCart}</p>
        <Link to="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
          {t.backToShop}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t.checkout}</h1>
      
      {/* Reminder Note */}
      <div className="mb-6 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-amber-800 text-sm italic">
        <i className="fa-solid fa-circle-info mr-2"></i>
        {shopNote}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">{t.cart}</h2>
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center text-sm md:text-base">
              <div>
                <span className="font-medium text-slate-800">{item.name.zh}</span>
                <span className="text-slate-400 ml-2">x{item.quantity}</span>
              </div>
              <span className="font-bold text-slate-700">¥{item.price * item.quantity} JPY</span>
            </div>
          ))}
          <div className="border-t pt-4 flex flex-col items-end gap-1">
            <div className="flex justify-between items-center w-full">
              <span className="text-slate-500 font-medium">{t.total} (JPY)</span>
              <span className="text-xl font-bold text-slate-800">¥{totalPriceJPY}</span>
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="text-slate-500 font-medium">{t.total} (CNY)</span>
              <span className="text-2xl font-bold text-emerald-600">￥{totalPriceCNY}</span>
            </div>
            <p className="text-[10px] text-slate-400 italic">Rate: 1 JPY = {exchangeRate} CNY</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6 text-center">
        <h2 className="text-lg font-bold text-slate-700 mb-4">{t.paymentQR}</h2>
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 inline-block mb-4">
          <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PaymentPlaceholder" 
            alt="Payment QR" 
            className="w-40 h-40"
          />
        </div>
        <p className="text-sm text-slate-500 mb-4">请扫码支付 ￥{totalPriceCNY} 人民币</p>
        
        <div className="text-left">
          <label className="block text-sm font-bold text-slate-700 mb-2">{t.uploadScreenshot} *</label>
          <div className="relative group">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              required
            />
            <div className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${screenshot ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 group-hover:border-indigo-400'}`}>
              {screenshot ? (
                <div className="flex items-center gap-3 p-2">
                  <img src={screenshot} alt="Preview" className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                  <span className="text-emerald-700 font-medium text-sm">已上传截图</span>
                </div>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up text-2xl text-slate-400 mb-2"></i>
                  <span className="text-slate-500 text-sm">点击选择支付截图</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">{t.customerInfo}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t.wechatName}</label>
            <input 
              type="text" 
              required
              value={wechat}
              onChange={e => setWechat(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. wxid_xxxx"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t.pickupDate}</label>
              <input 
                type="date" 
                required
                value={pickupDate}
                onChange={e => setPickupDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t.pickupTime}</label>
              <input 
                type="time" 
                required
                value={pickupTime}
                onChange={e => setPickupTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg mt-6 ${isSubmitting ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.01] active:scale-100'}`}
          >
            {isSubmitting ? 'Processing...' : t.confirmPickup}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;

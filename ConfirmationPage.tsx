
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Order } from '../types';

interface ConfirmationPageProps {
  t: any;
  orders: Order[];
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ t, orders }) => {
  const { orderId } = useParams();
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-md mx-auto py-12 text-center">
      <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <i className="fa-solid fa-check text-4xl text-green-600"></i>
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">订单已提交</h1>
      <p className="text-slate-500 mb-8">请凭取货码前往店内领取</p>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 mb-8">
        <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-2">{t.pickupCode}</div>
        <div className="text-6xl font-black text-indigo-600 tracking-tighter mb-6">{order.pickupCode}</div>
        <div className="space-y-4 text-left border-t pt-6">
          <div className="flex justify-between">
            <span className="text-slate-500">{t.wechatName}</span>
            <span className="font-bold">{order.wechatName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t.pickupTime}</span>
            <span className="font-bold text-indigo-600">{order.pickupDate} {order.pickupTime}</span>
          </div>
        </div>
      </div>

      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline"
      >
        <i className="fa-solid fa-house"></i>
        {t.backToShop}
      </Link>
    </div>
  );
};

export default ConfirmationPage;

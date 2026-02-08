
import React, { useState } from 'react';
import { Order, OrderStatus, Product } from '../types';

interface AdminDashboardProps {
  t: any;
  orders: Order[];
  products: Product[];
  exchangeRate: number;
  shopNote: string;
  backendUrl: string;
  onUpdateStatus: (id: string, updates: Partial<Order>) => void;
  onUpdateRate: (rate: number) => void;
  onUpdateNote: (note: string) => void;
  onUpdateBackendUrl: (url: string) => void;
  onSaveProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onRefresh: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  t, orders, products, exchangeRate, shopNote, backendUrl,
  onUpdateStatus, onUpdateRate, onUpdateNote, onUpdateBackendUrl, 
  onSaveProduct, onDeleteProduct, onRefresh 
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');
  const [rateInput, setRateInput] = useState(exchangeRate.toString());
  const [noteInput, setNoteInput] = useState(shopNote);
  const [urlInput, setUrlInput] = useState(backendUrl);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const handleSettingsSave = () => {
    onUpdateBackendUrl(urlInput);
    const rateVal = parseFloat(rateInput);
    if (!isNaN(rateVal) && rateVal > 0) onUpdateRate(rateVal);
    onUpdateNote(noteInput);
    alert('配置已保存！正在刷新数据...');
    onRefresh();
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-amber-100 text-amber-700';
      case OrderStatus.PREPARING: return 'bg-blue-100 text-blue-700';
      case OrderStatus.READY: return 'bg-emerald-100 text-emerald-700';
      case OrderStatus.COMPLETED: return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="pb-24">
      {/* 顶部导航 */}
      <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-100 mb-6">
        <button onClick={() => setActiveTab('orders')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
          <i className="fa-solid fa-list-check mr-2"></i>订单
        </button>
        <button onClick={() => setActiveTab('products')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
          <i className="fa-solid fa-boxes-stacked mr-2"></i>商品
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
          <i className="fa-solid fa-cloud mr-2"></i>设置
        </button>
      </div>

      <div className="flex justify-end mb-6">
        <button onClick={onRefresh} className="flex items-center gap-2 text-indigo-600 text-xs font-bold bg-white px-4 py-2 rounded-xl border border-indigo-100 hover:bg-indigo-50 shadow-sm transition-all">
          <i className="fa-solid fa-arrows-rotate"></i> 刷新云端同步
        </button>
      </div>

      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fade-in">
          {/* 配置向导 */}
          {!backendUrl && (
            <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-xl">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                快速连接 Google 表格
              </h3>
              <ol className="text-xs space-y-2 opacity-90 list-decimal list-inside">
                <li>创建一个 Google 表格并命名工作表为 Orders 和 Products</li>
                <li>点击表格菜单: 扩展 -> Apps Script</li>
                <li>粘贴后端脚本并点击“部署”为“Web 应用”</li>
                <li>访问权限设为“所有人”，复制生成的 URL 填入下方</li>
              </ol>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">后端连接 (GAS URL)</label>
              <input 
                value={urlInput} 
                onChange={e => setUrlInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="https://script.google.com/..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">实时汇率 (1 JPY = ? CNY)</label>
                <input type="number" step="0.0001" value={rateInput} onChange={e => setRateInput(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">店铺公告</label>
                <input value={noteInput} onChange={e => setNoteInput(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="例如：自提请到3号柜台" />
              </div>
            </div>
            <button onClick={handleSettingsSave} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <i className="fa-solid fa-save"></i>
              保存同步配置
            </button>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4 animate-fade-in">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-100">
              <i className="fa-solid fa-inbox text-4xl text-slate-200 mb-3"></i>
              <p className="text-slate-400 text-sm">暂无云端订单</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 bg-slate-50 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-indigo-600 tracking-tighter">{order.pickupCode}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getStatusColor(order.status)}`}>{order.status}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">客户</p>
                    <p className="font-bold text-slate-800">{order.wechatName}</p>
                    <p className="text-[10px] text-indigo-600 font-medium mt-1">{order.pickupDate} {order.pickupTime}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">金额</p>
                    <p className="text-xs font-bold text-slate-700">¥{order.totalPriceJPY} JPY</p>
                    <p className="text-xs font-bold text-emerald-600">￥{order.totalPriceCNY} CNY</p>
                  </div>
                  <div className="col-span-2 md:col-span-1 flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    {order.paymentScreenshot ? (
                      <div className="flex-1 flex items-center gap-2 cursor-pointer" onClick={() => setSelectedImage(order.paymentScreenshot!)}>
                        <img src={order.paymentScreenshot} className="w-10 h-10 object-cover rounded-lg" />
                        <span className="text-[10px] text-slate-500 font-medium">查看凭证</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-300">无支付截图</span>
                    )}
                  </div>
                </div>
                <div className="px-4 pb-4 flex flex-wrap gap-2">
                  <button onClick={() => onUpdateStatus(order.id, { status: OrderStatus.PREPARING })} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${order.status === OrderStatus.PREPARING ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-blue-50'}`}>备货</button>
                  <button onClick={() => onUpdateStatus(order.id, { status: OrderStatus.READY })} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${order.status === OrderStatus.READY ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-emerald-50'}`}>待取</button>
                  <button onClick={() => onUpdateStatus(order.id, { status: OrderStatus.COMPLETED })} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${order.status === OrderStatus.COMPLETED ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-50'}`}>完成</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-4 animate-fade-in">
          <button 
            onClick={() => setEditingProduct({ id: `p_${Date.now()}`, name: { zh: '', ja: '' }, price: 0, category: 'General', image: '', description: { zh: '', ja: '' }})}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-plus-circle"></i>
            添加新商品
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 group">
                <img src={p.image || 'https://via.placeholder.com/80'} className="w-20 h-20 object-cover rounded-xl shadow-sm" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 truncate">{p.name.zh}</h3>
                  <p className="text-indigo-600 font-black text-sm mt-1">¥{p.price} <span className="text-[10px] font-normal opacity-50">JPY</span></p>
                  <div className="flex gap-3 mt-2">
                    <button onClick={() => setEditingProduct(p)} className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">编辑</button>
                    <button onClick={() => onDeleteProduct(p.id)} className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors">删除</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 弹窗逻辑保持不变... */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <form onSubmit={(e) => { e.preventDefault(); onSaveProduct(editingProduct as Product); setEditingProduct(null); }} className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-zoom-in">
            <div className="p-6 border-b border-slate-100 font-bold text-lg">编辑商品信息</div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="中文名" value={editingProduct.name?.zh} onChange={e => setEditingProduct({...editingProduct, name: {...editingProduct.name!, zh: e.target.value}})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                <input placeholder="日文名" value={editingProduct.name?.ja} onChange={e => setEditingProduct({...editingProduct, name: {...editingProduct.name!, ja: e.target.value}})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="价格 (JPY)" type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                <input placeholder="分类" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <input placeholder="图片 URL (以 http 开头)" value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
              <textarea placeholder="商品简介" value={editingProduct.description?.zh} onChange={e => setEditingProduct({...editingProduct, description: {...editingProduct.description!, zh: e.target.value}})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none" />
            </div>
            <div className="p-6 bg-slate-50 flex gap-4">
              <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-500">取消</button>
              <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100">保存到云端</button>
            </div>
          </form>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} className="max-w-full max-h-full rounded-2xl shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

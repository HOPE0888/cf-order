
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Product, CartItem, Order, OrderStatus, Language } from './types';
import { PRODUCTS as INITIAL_PRODUCTS, UI_STRINGS } from './constants';
import ShopPage from './pages/ShopPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 配置信息
  const [backendUrl, setBackendUrl] = useState(() => localStorage.getItem('quickpick_backend_url') || '');
  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    const saved = localStorage.getItem('quickpick_rate');
    return saved ? parseFloat(saved) : 0.048;
  });
  const [shopNote, setShopNote] = useState<string>(() => {
    const saved = localStorage.getItem('quickpick_note');
    return saved ? saved : '欢迎光临！请扫码支付并上传截图。';
  });

  // 数据状态
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);

  // 从 Google Sheets 同步数据
  const syncData = useCallback(async () => {
    if (!backendUrl) return;
    setLoading(true);
    try {
      const resp = await fetch(`${backendUrl}?action=getData`);
      const data = await resp.json();
      if (data.products && data.products.length > 0) setProducts(data.products);
      if (data.orders) setOrders(data.orders);
      if (data.settings) {
        if (data.settings.exchangeRate) setExchangeRate(data.settings.exchangeRate);
        if (data.settings.shopNote) setShopNote(data.settings.shopNote);
      }
    } catch (e) {
      console.error("Sync failed", e);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    syncData();
  }, [syncData]);

  // 保存设置到本地
  useEffect(() => {
    localStorage.setItem('quickpick_backend_url', backendUrl);
    localStorage.setItem('quickpick_rate', exchangeRate.toString());
    localStorage.setItem('quickpick_note', shopNote);
  }, [backendUrl, exchangeRate, shopNote]);

  const t = useMemo(() => UI_STRINGS[lang], [lang]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.id !== productId);
    });
  }, []);

  const placeOrder = async (wechatName: string, pickupDate: string, pickupTime: string, paymentScreenshot: string) => {
    const jpyTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cnyTotal = jpyTotal * exchangeRate;
    
    const newOrder: Order = {
      id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      pickupCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      wechatName,
      items: [...cart],
      totalPriceJPY: jpyTotal,
      totalPriceCNY: Number(cnyTotal.toFixed(2)),
      exchangeRate: exchangeRate,
      pickupDate,
      pickupTime,
      status: OrderStatus.PENDING,
      createdAt: Date.now(),
      paymentScreenshot,
    };

    // 如果有后端，则发送到 Google Sheets
    if (backendUrl) {
      setLoading(true);
      try {
        await fetch(backendUrl, {
          method: 'POST',
          mode: 'no-cors', // Apps Script 通常需要 no-cors
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'addOrder', order: newOrder })
        });
      } catch (e) {
        console.error("Post order failed", e);
      } finally {
        setLoading(false);
      }
    }

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, updates: Partial<Order>) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, ...updates } : o);
    setOrders(updatedOrders);
    
    if (backendUrl) {
      await fetch(backendUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'updateOrder', orderId, updates })
      });
    }
  };

  const saveProduct = async (product: Product) => {
    const exists = products.find(p => p.id === product.id);
    let newProducts;
    if (exists) {
      newProducts = products.map(p => p.id === product.id ? product : p);
    } else {
      newProducts = [product, ...products];
    }
    setProducts(newProducts);

    if (backendUrl) {
      await fetch(backendUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'saveProduct', product })
      });
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm('确定要删除这个商品吗？')) return;
    setProducts(prev => prev.filter(p => p.id !== id));
    if (backendUrl) {
      await fetch(backendUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: 'deleteProduct', id })
      });
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {loading && (
          <div className="fixed inset-0 z-[200] bg-white/50 flex items-center justify-center">
            <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl">
              <i className="fa-solid fa-circle-notch animate-spin"></i>
              <span className="text-sm font-bold">同步中...</span>
            </div>
          </div>
        )}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-100">
                <i className="fa-solid fa-bolt-lightning text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">{t.shopName}</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-slate-100 border-none rounded-full px-3 py-1 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
              >
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
              </select>
              <Link to="/admin" className="text-slate-500 hover:text-indigo-600 transition-colors">
                <i className="fa-solid fa-user-gear text-xl"></i>
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={
              <ShopPage 
                t={t} 
                lang={lang} 
                products={products} 
                cart={cart} 
                exchangeRate={exchangeRate}
                shopNote={shopNote}
                onAdd={addToCart} 
                onRemove={removeFromCart} 
              />
            } />
            <Route path="/checkout" element={
              <CheckoutPage 
                t={t} 
                cart={cart} 
                exchangeRate={exchangeRate}
                shopNote={shopNote}
                onPlaceOrder={placeOrder} 
              />
            } />
            <Route path="/confirmation/:orderId" element={
              <ConfirmationPage t={t} orders={orders} />
            } />
            <Route path="/admin" element={
              <AdminDashboard 
                t={t} 
                orders={orders} 
                products={products}
                exchangeRate={exchangeRate}
                shopNote={shopNote}
                backendUrl={backendUrl}
                onUpdateStatus={updateOrderStatus} 
                onUpdateRate={setExchangeRate}
                onUpdateNote={setShopNote}
                onUpdateBackendUrl={setBackendUrl}
                onSaveProduct={saveProduct}
                onDeleteProduct={deleteProduct}
                onRefresh={syncData}
              />
            } />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;

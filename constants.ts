
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: { zh: '精选拿铁咖啡', ja: '厳選ラテ' },
    price: 500,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80',
    description: { zh: '选用优质咖啡豆，口感顺滑。', ja: '高品質のコーヒー豆を使用した、滑らかな味わい。' }
  },
  {
    id: 'p2',
    name: { zh: '经典三明治', ja: 'クラシックサンドイッチ' },
    price: 750,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80',
    description: { zh: '新鲜火腿与芝士的完美结合。', ja: '新鮮なハムとチーズの完璧な組み合わせ。' }
  },
  {
    id: 'p3',
    name: { zh: '抹茶红豆蛋糕', ja: '抹茶小豆ケーキ' },
    price: 850,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=400&q=80',
    description: { zh: '地道京都抹茶，口感醇厚。', ja: '本場京都の抹茶を使用、濃厚な味わい。' }
  },
  {
    id: 'p4',
    name: { zh: '冷萃冰茶', ja: 'コールドブリューティー' },
    price: 450,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80',
    description: { zh: '清爽解渴，夏季首选。', ja: '爽やかで渇きを癒す、夏に最適。' }
  }
];

export const UI_STRINGS = {
  zh: {
    shopName: '快速自提店',
    browse: '浏览商品',
    cart: '购物车',
    checkout: '结算下单',
    pickupTime: '自提时间',
    pickupDate: '自提日期',
    pickupCode: '取货码',
    admin: '管理后台',
    add: '加入',
    items: '件商品',
    total: '订单总计',
    orderNow: '提交订单',
    customerInfo: '联系信息',
    wechatName: '微信名',
    status: '订单状态',
    noOrders: '暂无待处理订单',
    preparing: '正在备货',
    ready: '可以领取',
    completed: '交易完成',
    pending: '待核对付款',
    confirmPickup: '确认下单并生成取货码',
    backToShop: '返回商店',
    emptyCart: '购物车是空的',
    searchPlaceholder: '搜索商品...',
    exchangeRate: '今日汇率 (1 JPY = ? CNY)',
    paymentQR: '扫描下方二维码支付 (CNY)',
    uploadScreenshot: '上传付款截图',
    storageArea: '存放区域',
    jpy: '日元',
    cny: '人民币',
    setRate: '保存设置',
    viewScreenshot: '查看支付凭证',
    shopNote: '店铺提示/备注',
    announcement: '重要提示'
  },
  ja: {
    shopName: 'クイックピック',
    browse: '商品を見る',
    cart: 'カート',
    checkout: 'レジへ',
    pickupTime: '受取時間',
    pickupDate: '受取日',
    pickupCode: '受取コード',
    admin: '管理画面',
    add: '追加',
    items: '点の商品',
    total: '合計',
    orderNow: '注文を確定する',
    customerInfo: 'お客様情報',
    wechatName: 'WeChat名',
    status: 'ステータス',
    noOrders: '注文はありません',
    preparing: '準備中',
    ready: '受取可能',
    completed: '完了',
    pending: '支払い確認中',
    confirmPickup: '注文を確定してコードを生成',
    backToShop: 'ショップに戻る',
    emptyCart: 'カートは空です',
    searchPlaceholder: '商品を検索...',
    exchangeRate: '本日のレート (1 JPY = ? CNY)',
    paymentQR: 'QRコードで支払う (CNY)',
    uploadScreenshot: '支払い完了画面をアップロード',
    storageArea: '保管場所',
    jpy: '円',
    cny: '人民元',
    setRate: '設定保存',
    viewScreenshot: '支払い証明を表示',
    shopNote: '店舗からのお知らせ',
    announcement: 'お知らせ'
  }
};

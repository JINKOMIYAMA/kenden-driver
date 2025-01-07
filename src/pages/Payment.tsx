import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Payment = () => {
  const { items } = useCart();
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [address, setAddress] = useState({
    postalCode: '',
    prefecture: '',
    city: '',
    street: ''
  });

  const handlePostalCodeChange = async (code: string) => {
    setAddress(prev => ({ ...prev, postalCode: code }));
    
    // 7桁の郵便番号が入力された場合に住所を検索
    if (code.length === 7) {
      try {
        const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}`);
        const data = await response.json();
        
        if (data.results) {
          const result = data.results[0];
          setAddress(prev => ({
            ...prev,
            prefecture: result.address1,
            city: result.address2 + result.address3,
            street: ''
          }));
        }
      } catch (error) {
        console.error('郵便番号の検索に失敗しました:', error);
      }
    }
  };

  const handlePayment = () => {
    alert('支払い処理が完了しました！');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-4xl mx-auto bg-gray-900/80 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">お支払い情報</h2>

        <div className="space-y-6 mb-8">
          {/* 注文概要 */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-4">注文概要</h3>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-gray-300">
                  <span>{item.name} × {item.quantity}</span>
                  <span>¥{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 mt-4 pt-4">
              <div className="flex justify-between text-white font-bold">
                <span>合計</span>
                <span>¥{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* お客様情報 */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-4">お客様情報</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">お名前</label>
                <input 
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  placeholder="山田 太郎"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-1">メールアドレス</label>
                <input 
                  type="email"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  placeholder="example@email.com"
                />
              </div>
            </div>
          </div>

          {/* お届け先情報 */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-4">お届け先情報</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">郵便番号（ハイフンなし）</label>
                <input 
                  type="text"
                  maxLength={7}
                  value={address.postalCode}
                  onChange={(e) => handlePostalCodeChange(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full md:w-1/3 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  placeholder="1234567"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-1">都道府県</label>
                <input 
                  type="text"
                  value={address.prefecture}
                  onChange={(e) => setAddress(prev => ({ ...prev, prefecture: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  placeholder="東京都"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-1">市区町村</label>
                <input 
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  placeholder="渋谷区"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-1">番地・建物名</label>
                <input 
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  placeholder="1-2-3 ○○マンション101"
                />
              </div>
            </div>
          </div>

          {/* 支払い方法 */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-4">支払い方法</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  name="payment" 
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio text-yellow-500" 
                />
                <span className="text-gray-300">クレジットカード</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  name="payment" 
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio text-yellow-500" 
                />
                <span className="text-gray-300">銀行振込</span>
              </label>

              {/* 銀行振込が選択された場合の追加フォーム */}
              {paymentMethod === 'bank' && (
                <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-700">
                  <div>
                    <h4 className="text-white font-medium mb-2">振込先情報</h4>
                    <div className="bg-gray-800 p-4 rounded space-y-2 text-gray-300">
                      <p>銀行名：テック銀行</p>
                      <p>支店名：渋谷支店（101）</p>
                      <p>口座種別：普通</p>
                      <p>口座番号：1234567</p>
                      <p>口座名義：カ）テックショップ</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">振込人情報</h4>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">お名前（カタカナ）</label>
                      <input 
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        placeholder="ヤマダタロウ"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">電話番号</label>
                      <input 
                        type="tel"
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        placeholder="090-1234-5678"
                      />
                    </div>
                    <div className="text-sm text-gray-400">
                      ※振込手数料はお客様負担となります。<br />
                      ※お振込みは1週間以内にお願いいたします。
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/checkout')}
            className="text-blue-400 hover:text-blue-300"
          >
            ← カートに戻る
          </button>

          <button
            onClick={handlePayment}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full transition-colors"
          >
            注文を確定する
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment; 
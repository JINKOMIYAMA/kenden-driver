import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { OrderSummary } from '../components/payment/OrderSummary';
import { CustomerInfo } from '../components/payment/CustomerInfo';
import { DeliveryInfo } from '../components/payment/DeliveryInfo';
import { PaymentMethod } from '../components/payment/PaymentMethod';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Supabaseクライアントの初期化
const supabase = createClient(
  'https://your-project-url.supabase.co',  // ここを実際のSupabase URLに置き換える必要があります
  'your-anon-key'  // ここを実際のAnon Keyに置き換える必要があります
);

const Payment = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: ''
  });
  const [address, setAddress] = useState({
    postalCode: '',
    prefecture: '',
    city: '',
    street: ''
  });

  const handlePostalCodeChange = async (code: string) => {
    setAddress(prev => ({ ...prev, postalCode: code }));
    
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

  const handlePayment = async () => {
    try {
      // 注文情報をデータベースに保存
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: customerInfo.name,
            customer_email: customerInfo.email,
            total_amount: total,
            payment_method: paymentMethod,
            shipping_address: `${address.postalCode} ${address.prefecture}${address.city}${address.street}`,
            items: items.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            })),
            status: 'pending'
          }
        ])
        .select();

      if (error) throw error;

      // 注文完了後の処理
      toast.success('ご注文ありがとうございます！');
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('注文処理に失敗しました:', error);
      toast.error('注文処理に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-3xl mx-auto bg-gray-900/80 rounded-xl p-4 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-6">お支払い情報</h2>

        <div className="space-y-6">
          <OrderSummary items={items} total={total} />
          <CustomerInfo 
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
          />
          <DeliveryInfo 
            address={address}
            setAddress={setAddress}
            handlePostalCodeChange={handlePostalCodeChange}
          />
          <PaymentMethod 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => navigate('/checkout')}
            className="text-blue-400 hover:text-blue-300 md:text-base text-sm"
          >
            ← カートに戻る
          </button>

          <button
            onClick={handlePayment}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold md:py-3 md:px-8 py-2 px-4 rounded-full transition-colors md:text-base text-sm"
          >
            注文を確定する
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
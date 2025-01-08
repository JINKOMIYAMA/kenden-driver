import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { OrderSummary } from '../components/payment/OrderSummary';
import { CustomerInfo } from '../components/payment/CustomerInfo';
import { DeliveryInfo } from '../components/payment/DeliveryInfo';
import { PaymentMethod } from '../components/payment/PaymentMethod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  const validateForm = () => {
    const errors: string[] = [];

    // Customer Info validation
    if (!customerInfo.name.trim()) {
      errors.push('お名前を入力してください');
    }
    if (!customerInfo.email.trim()) {
      errors.push('メールアドレスを入力してください');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.push('有効なメールアドレスを入力してください');
    }

    // Delivery Info validation
    if (!address.postalCode) {
      errors.push('郵便番号を入力してください');
    }
    if (!address.prefecture.trim()) {
      errors.push('都道府県を入力してください');
    }
    if (!address.city.trim()) {
      errors.push('市区町村を入力してください');
    }
    if (!address.street.trim()) {
      errors.push('番地・建物名を入力してください');
    }

    // Payment Method specific validation
    if (paymentMethod === 'credit') {
      const creditFields = document.querySelectorAll('input[type="text"]');
      creditFields.forEach(field => {
        if ((field as HTMLInputElement).value.trim() === '') {
          errors.push('クレジットカード情報をすべて入力してください');
        }
      });
    } else if (paymentMethod === 'bank') {
      const bankFields = document.querySelectorAll('input[type="text"], input[type="tel"]');
      bankFields.forEach(field => {
        if ((field as HTMLInputElement).value.trim() === '') {
          errors.push('振込人情報をすべて入力してください');
        }
      });
    }

    return errors;
  };

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
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => {
        toast.error(error);
      });
      return;
    }

    try {
      // 配送先住所の文字列を作成
      const shippingAddress = `〒${address.postalCode} ${address.prefecture}${address.city}${address.street}`;

      // 注文情報をデータベースに保存
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: customerInfo.name,
            customer_email: customerInfo.email,
            total_amount: total,
            payment_method: paymentMethod,
            shipping_address: shippingAddress,
            items: items.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            }))
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
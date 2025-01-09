import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { OrderSummary } from '../components/payment/OrderSummary';
import { CustomerInfo } from '../components/payment/CustomerInfo';
import { DeliveryInfo } from '../components/payment/DeliveryInfo';
import { PaymentMethod } from '../components/payment/PaymentMethod';
import { toast } from 'sonner';
import { validateCustomerInfo, validateAddress, validatePaymentMethod } from '../utils/validationUtils';
import { processOrder } from '../services/paymentService';

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
          }));
        } else {
          toast.error('郵便番号が見つかりませんでした');
        }
      } catch (error) {
        console.error('郵便番号の検索に失敗しました:', error);
        toast.error('郵便番号の検索に失敗しました');
      }
    }
  };

  const validateForm = (formElement: HTMLFormElement) => {
    // カートの確認
    if (items.length === 0) {
      toast.error('カートが空です');
      return false;
    }

    // 顧客情報の確認
    const customerInfoError = validateCustomerInfo(customerInfo);
    if (customerInfoError) {
      toast.error(customerInfoError);
      return false;
    }

    // 配送先情報の確認
    const addressError = validateAddress(address);
    if (addressError) {
      toast.error(addressError);
      return false;
    }

    // 支払い方法の確認
    const paymentError = validatePaymentMethod(paymentMethod, formElement);
    if (paymentError) {
      toast.error(paymentError);
      return false;
    }

    return true;
  };

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    if (!validateForm(formElement)) {
      return;
    }

    const shippingAddress = `〒${address.postalCode} ${address.prefecture}${address.city}${address.street}`;
    const orderData = {
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      totalAmount: total,
      paymentMethod,
      shippingAddress,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    };

    const success = await processOrder(orderData);
    
    if (success) {
      toast.success('ご注文ありがとうございます！');
      clearCart();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-3xl mx-auto bg-gray-900/80 rounded-xl p-4 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-6">お支払い情報</h2>

        <form onSubmit={handlePayment} className="space-y-6">
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

          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="text-blue-400 hover:text-blue-300 md:text-base text-sm"
            >
              ← カートに戻る
            </button>

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold md:py-3 md:px-8 py-2 px-4 rounded-full transition-colors md:text-base text-sm"
            >
              注文を確定する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
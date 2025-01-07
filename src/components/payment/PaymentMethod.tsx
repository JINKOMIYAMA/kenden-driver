interface PaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

export const PaymentMethod = ({ paymentMethod, setPaymentMethod }: PaymentMethodProps) => {
  return (
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
  );
};
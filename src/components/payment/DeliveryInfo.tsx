interface Address {
  postalCode: string;
  prefecture: string;
  city: string;
  street: string;
}

interface DeliveryInfoProps {
  address: Address;
  setAddress: (address: Address) => void;
  handlePostalCodeChange: (code: string) => void;
}

export const DeliveryInfo = ({ address, setAddress, handlePostalCodeChange }: DeliveryInfoProps) => {
  return (
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
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">都道府県</label>
            <input 
              type="text"
              value={address.prefecture}
              onChange={(e) => setAddress({ ...address, prefecture: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              placeholder="東京都"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-1">市区町村</label>
            <input 
              type="text"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              placeholder="渋谷区"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm mb-1">番地・建物名</label>
          <input 
            type="text"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            placeholder="1-2-3 ○○マンション101"
          />
        </div>
      </div>
    </div>
  );
};
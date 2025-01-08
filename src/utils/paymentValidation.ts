interface ValidationErrors {
  customerInfo?: string[];
  deliveryInfo?: string[];
  paymentInfo?: string[];
  general?: string[];
}

export const validatePaymentForm = (
  items: any[],
  customerInfo: { name: string; email: string },
  address: { postalCode: string; prefecture: string; city: string; street: string },
  paymentMethod: string,
) => {
  const errors: ValidationErrors = {};

  // カートの商品チェック
  if (items.length === 0) {
    errors.general = ['カートに商品が入っていません'];
    return errors;
  }

  // お客様情報のバリデーション
  const customerErrors: string[] = [];
  if (!customerInfo.name.trim()) {
    customerErrors.push('お名前を入力してください');
  }
  if (!customerInfo.email.trim()) {
    customerErrors.push('メールアドレスを入力してください');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
    customerErrors.push('有効なメールアドレスを入力してください');
  }
  if (customerErrors.length > 0) {
    errors.customerInfo = customerErrors;
  }

  // お届け先情報のバリデーション
  const deliveryErrors: string[] = [];
  if (!address.postalCode) {
    deliveryErrors.push('郵便番号を入力してください');
  } else if (address.postalCode.length !== 7) {
    deliveryErrors.push('郵便番号は7桁で入力してください');
  }
  if (!address.prefecture.trim()) {
    deliveryErrors.push('都道府県を入力してください');
  }
  if (!address.city.trim()) {
    deliveryErrors.push('市区町村を入力してください');
  }
  if (!address.street.trim()) {
    deliveryErrors.push('番地・建物名を入力してください');
  }
  if (deliveryErrors.length > 0) {
    errors.deliveryInfo = deliveryErrors;
  }

  // 支払い方法のバリデーション
  const paymentErrors: string[] = [];
  const creditCardInputs = document.querySelectorAll('input[type="text"]');
  
  if (paymentMethod === 'credit') {
    const cardNumberInput = document.querySelector('input[placeholder="1234 5678 9012 3456"]') as HTMLInputElement;
    const expiryInput = document.querySelector('input[placeholder="MM/YY"]') as HTMLInputElement;
    const cvvInput = document.querySelector('input[placeholder="123"]') as HTMLInputElement;
    const nameInput = document.querySelector('input[placeholder="TARO YAMADA"]') as HTMLInputElement;

    if (!cardNumberInput?.value) {
      paymentErrors.push('クレジットカード番号を入力してください');
    } else if (!/^\d{16}$/.test(cardNumberInput.value.replace(/\s/g, ''))) {
      paymentErrors.push('有効なクレジットカード番号を入力してください');
    }

    if (!expiryInput?.value) {
      paymentErrors.push('有効期限を入力してください');
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryInput.value)) {
      paymentErrors.push('有効期限は MM/YY の形式で入力してください');
    }

    if (!cvvInput?.value) {
      paymentErrors.push('セキュリティコードを入力してください');
    } else if (!/^\d{3}$/.test(cvvInput.value)) {
      paymentErrors.push('セキュリティコードは3桁の数字で入力してください');
    }

    if (!nameInput?.value.trim()) {
      paymentErrors.push('カード名義人を入力してください');
    }
  } else if (paymentMethod === 'bank') {
    const nameInput = document.querySelector('input[placeholder="ヤマダタロウ"]') as HTMLInputElement;
    const phoneInput = document.querySelector('input[placeholder="090-1234-5678"]') as HTMLInputElement;

    if (!nameInput?.value.trim()) {
      paymentErrors.push('お名前（カタカナ）を入力してください');
    } else if (!/^[ァ-ヶー]+$/.test(nameInput.value)) {
      paymentErrors.push('お名前はカタカナで入力してください');
    }

    if (!phoneInput?.value) {
      paymentErrors.push('電話番号を入力してください');
    } else if (!/^0\d{1,4}-\d{1,4}-\d{4}$/.test(phoneInput.value)) {
      paymentErrors.push('有効な電話番号を入力してください（例：090-1234-5678）');
    }
  }
  
  if (paymentErrors.length > 0) {
    errors.paymentInfo = paymentErrors;
  }

  return errors;
};
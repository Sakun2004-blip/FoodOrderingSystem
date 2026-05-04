import React, { useState } from 'react';
import { PaymentMethod, PaymentRequest } from '../../types';

interface PaymentFormProps {
  orderId: number;
  amount: number;
  onSubmit: (data: PaymentRequest) => Promise<void>;
  isLoading: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ orderId, amount, onSubmit, isLoading }) => {
  const [method, setMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');
  const [card, setCard] = useState({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
  const [errors, setErrors] = useState<Partial<typeof card>>({});

  const validateCard = () => {
    const errs: Partial<typeof card> = {};
    if (!card.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) errs.cardNumber = 'Enter a valid 16-digit card number';
    if (!card.cardHolder.trim()) errs.cardHolder = 'Card holder name is required';
    if (!card.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) errs.expiryDate = 'Format: MM/YY';
    if (!card.cvv.match(/^\d{3,4}$/)) errs.cvv = 'Enter 3 or 4 digit CVV';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'cardNumber') formatted = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    if (name === 'expiryDate') formatted = value.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');
    if (name === 'cvv') formatted = value.replace(/\D/g, '').slice(0, 4);
    setCard((prev) => ({ ...prev, [name]: formatted }));
    if (errors[name as keyof typeof card]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'CARD' && !validateCard()) return;
    const payload: PaymentRequest = { orderId, method, ...(method === 'CARD' ? card : {}) };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-xl font-bold text-gray-800 mb-2">
        Total to pay: <span className="text-primary-600">${amount.toFixed(2)}</span>
      </div>

      {/* Method selector */}
      <div className="grid grid-cols-2 gap-3">
        {(['CASH_ON_DELIVERY', 'CARD'] as PaymentMethod[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMethod(m)}
            className={`p-4 rounded-xl border-2 text-sm font-medium transition-colors ${
              method === m ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {m === 'CASH_ON_DELIVERY' ? '💵 Cash on Delivery' : '💳 Credit / Debit Card'}
          </button>
        ))}
      </div>

      {/* Card Fields */}
      {method === 'CARD' && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              name="cardNumber"
              value={card.cardNumber}
              onChange={handleCardChange}
              className={`input-field font-mono ${errors.cardNumber ? 'border-red-500' : ''}`}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            {errors.cardNumber && <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
            <input
              name="cardHolder"
              value={card.cardHolder}
              onChange={handleCardChange}
              className={`input-field ${errors.cardHolder ? 'border-red-500' : ''}`}
              placeholder="JOHN DOE"
            />
            {errors.cardHolder && <p className="mt-1 text-xs text-red-600">{errors.cardHolder}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                name="expiryDate"
                value={card.expiryDate}
                onChange={handleCardChange}
                className={`input-field ${errors.expiryDate ? 'border-red-500' : ''}`}
                placeholder="MM/YY"
                maxLength={5}
              />
              {errors.expiryDate && <p className="mt-1 text-xs text-red-600">{errors.expiryDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                name="cvv"
                value={card.cvv}
                onChange={handleCardChange}
                className={`input-field ${errors.cvv ? 'border-red-500' : ''}`}
                placeholder="123"
                maxLength={4}
              />
              {errors.cvv && <p className="mt-1 text-xs text-red-600">{errors.cvv}</p>}
            </div>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            🔒 Your payment info is encrypted and secure
          </p>
        </div>
      )}

      <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-base">
        {isLoading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default PaymentForm;

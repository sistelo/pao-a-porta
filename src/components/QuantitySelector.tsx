import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  label?: string;
  quantity: number;
  onChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
}

export const QuantitySelector = ({ label, quantity, onChange, min = 0, max = 20 }: QuantitySelectorProps) => {
  const handleDecrease = () => {
    if (quantity > min) onChange(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div className="flex justify-between items-center" style={{ padding: '0.5rem 0' }}>
      {label && <span className="font-medium">{label}</span>}
      <div className="flex items-center gap-4">
        <button 
          onClick={handleDecrease}
          disabled={quantity <= min}
          className="btn-icon"
          style={{ opacity: quantity <= min ? 0.5 : 1 }}
          aria-label="Diminuir quantidade"
        >
          <Minus size={18} />
        </button>
        <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 'bold' }}>
          {quantity}
        </span>
        <button 
          onClick={handleIncrease}
          disabled={quantity >= max}
          className="btn-icon"
          style={{ opacity: quantity >= max ? 0.5 : 1 }}
          aria-label="Aumentar quantidade"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

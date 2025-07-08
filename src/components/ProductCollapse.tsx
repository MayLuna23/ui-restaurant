import { useState } from "react";

interface ProductCollapseProps {
  items: {
    product: { name: string };
    quantity: number;
  }[];
}

const ProductCollapse: React.FC<ProductCollapseProps> = ({ items }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        className="text-xs text-orange-500 underline"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Ver menos' : 'Ver productos'}
      </button>

      {expanded && (
        <div className="mt-1 space-y-1">
          {items.map((item, index) => (
            <span
              key={index}
              className="inline-block text-black text-xs font-medium px-2 py-1 rounded mr-1 mb-1"
            >
              {item.product.name} × {item.quantity}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCollapse;
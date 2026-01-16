import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onOrderClick: (product: Product) => void;
}

export function ProductCard({ product, onOrderClick }: ProductCardProps) {
  const isInStock = product.availability === 'in_stock';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={isInStock ? 'default' : 'secondary'}>
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Potency:</span>
            <span className="font-medium text-gray-900">{product.potency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Form:</span>
            <span className="font-medium text-gray-900">{product.form}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between pt-4 border-t">
          <span className="text-2xl font-bold text-gray-900">
            ${product.sellingPrice.toFixed(2)}
          </span>
          <button
            onClick={() => onOrderClick(product)}
            disabled={!isInStock}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isInStock ? 'Book Order' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

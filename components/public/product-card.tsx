import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onOrderClick?: (product: Product) => void;
}

export function ProductCard({ product, onOrderClick }: ProductCardProps) {
  const isInStock = product.availability === 'in_stock';

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all block",
        isInStock 
          ? "hover:shadow-lg hover:scale-[1.02] cursor-pointer hover:border-blue-300" 
          : "opacity-75"
      )}
    >
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
            {formatCurrency(product.sellingPrice)}
          </span>
          <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
            {isInStock ? 'View Details →' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </Link>
  );
}

import Link from 'next/link';
import { Package } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">RemedyFlow</span>
            </Link>
            <p className="text-sm text-gray-600">
              Your trusted source for quality pharmaceutical products.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Products</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/products" className="hover:text-blue-600 transition-colors">
                  Browse All
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-blue-600 transition-colors">
                  In Stock
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} RemedyFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

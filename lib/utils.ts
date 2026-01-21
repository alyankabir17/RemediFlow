import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number as Pakistani Rupees
 * @param amount - Amount to format
 * @param showDecimals - Whether to show decimal places (default: true)
 * @returns Formatted currency string (e.g., "Rs 1,234.56")
 */
export function formatCurrency(amount: number, showDecimals: boolean = true): string {
  const formatted = showDecimals 
    ? amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : amount.toLocaleString('en-PK', { maximumFractionDigits: 0 });
  
  return `Rs ${formatted}`;
}

/**
 * Format number as compact Pakistani Rupees (for small spaces)
 * @param amount - Amount to format
 * @returns Formatted currency string (e.g., "Rs 1.2k", "Rs 1.5M")
 */
export function formatCompactCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `Rs ${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `Rs ${(amount / 1000).toFixed(1)}k`;
  }
  return `Rs ${amount.toFixed(0)}`;
}

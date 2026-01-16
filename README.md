# RemedyFlow - Pharmaceutical SaaS Frontend

A production-grade frontend for a pharmaceutical SaaS application built with Next.js 13+, TypeScript, Tailwind CSS, and ShadCN UI.

## Features

### 🌐 Public User Portal
- **Landing Page**: Modern hero section with features and call-to-action
- **Product Catalog**: Grid view of products with filtering and pagination
- **Product Details**: Detailed product view with specifications
- **Order Form**: Validated order form with React Hook Form + Zod
- **Order Success**: Confirmation page after order placement

### 🔐 Admin Portal
- **Dashboard**: Overview with stats cards and recent orders
- **Product Management**: Full CRUD operations for products
- **Order Management**: View and update order statuses
- **Reports**: Analytics dashboard with placeholder charts

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI (Radix UI primitives)
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── (public)/           # Public portal routes
│   │   ├── layout.tsx      # Public layout with navbar & footer
│   │   ├── page.tsx        # Landing page
│   │   ├── products/       # Product listing & details
│   │   └── order-success/  # Order confirmation page
│   ├── admin/              # Admin portal routes
│   │   ├── layout.tsx      # Admin layout with sidebar
│   │   ├── page.tsx        # Dashboard
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order management
│   │   └── reports/        # Reports & analytics
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # ShadCN UI components
│   ├── public/             # Public portal components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── product-card.tsx
│   │   └── order-form-dialog.tsx
│   └── admin/              # Admin portal components
│       ├── sidebar.tsx
│       └── product-form-dialog.tsx
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── validations.ts      # Zod schemas
│   ├── api.ts              # API service layer
│   └── utils.ts            # Utility functions
└── hooks/
    └── use-toast.ts        # Toast notification hook
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd remidy
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your API endpoint:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the public portal.
Visit [http://localhost:3000/admin](http://localhost:3000/admin) for the admin portal.

### Build

Build for production:

```bash
npm run build
npm start
```

## API Integration

This frontend expects the following API endpoints to be available:

### Public API
- `GET /products` - Get paginated products
- `GET /products/:id` - Get single product
- `POST /orders` - Create new order

### Admin API
- `GET /admin/products` - Get paginated products
- `POST /admin/products` - Create product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product
- `GET /admin/orders` - Get paginated orders
- `PATCH /admin/orders/:id/status` - Update order status
- `GET /admin/dashboard/stats` - Get dashboard statistics

### API Response Format

All API responses should follow this structure:

```typescript
// Single item response
{
  data: T,
  success: boolean,
  message?: string
}

// Paginated response
{
  data: T[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Customization

### Colors & Branding
Edit the Tailwind configuration in `tailwind.config.ts` to customize colors, fonts, and other design tokens.

### Components
All UI components are in the `components/ui/` directory and can be customized. They're built using Radix UI primitives with Tailwind CSS styling.

### API Configuration
Update the API base URL and endpoint structure in `lib/api.ts`.

## Features to Add (Optional)

- [ ] User authentication for admin portal
- [ ] Real-time order notifications
- [ ] Advanced filtering and search
- [ ] Product image upload
- [ ] Email notifications
- [ ] PDF invoice generation
- [ ] Export functionality for reports
- [ ] Chart integration (Recharts/Chart.js)

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue in the repository.

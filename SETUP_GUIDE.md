# RemedyFlow Backend - Quick Start Guide

## 🚀 Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
# Copy example environment file
copy .env.backend.example .env

# Edit .env and update:
# - DATABASE_URL with your PostgreSQL connection string
# - NEXTAUTH_SECRET with a secure random string (generate with: openssl rand -base64 32)
# - NEXTAUTH_URL with your app URL (http://localhost:3000 for local dev)
```

### 3. Database Setup
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations to create database tables
npm run db:migrate

# Seed database with sample data (optional but recommended)
npm run db:seed
```

### 4. Create Admin User
```bash
# Option 1: Via seed script (already creates admin@remedyflow.com)
npm run db:seed

# Option 2: Create custom admin user
ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword npm run create-admin
```

### 5. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🔐 Default Admin Credentials (after seeding)
- **Email**: admin@remedyflow.com
- **Password**: admin123
- ⚠️ **IMPORTANT**: Change password after first login!

---

## 📁 Project Structure

```
e:\Github\Remidy\
├── app/
│   ├── (public)/              # Public portal (no auth)
│   │   ├── page.tsx           # Landing page
│   │   ├── products/          # Product catalog
│   │   └── order/             # Order placement
│   │
│   ├── admin/                 # Admin portal (auth required)
│   │   ├── dashboard/         # Dashboard with stats
│   │   ├── products/          # Product CRUD
│   │   ├── orders/            # Order management
│   │   ├── purchases/         # Purchase recording
│   │   └── reports/           # Stock & expiry reports
│   │
│   └── api/                   # API Routes
│       ├── products/          # Public product endpoints
│       ├── orders/            # Public order endpoint
│       └── admin/             # Protected admin endpoints
│
├── lib/
│   ├── services/              # Business logic layer
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── purchase.service.ts
│   │   └── sale.service.ts
│   │
│   ├── utils/
│   │   └── stock.ts           # Stock calculations
│   │
│   ├── validations/
│   │   └── backend.ts         # Zod schemas
│   │
│   ├── auth.config.ts         # NextAuth config
│   ├── auth.ts                # Auth utilities
│   └── db.ts                  # Prisma client
│
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding
│
├── scripts/
│   └── create-admin.ts        # Admin user creation
│
└── middleware.ts              # Route protection
```

---

## 🧪 Testing Checklist

### Public API Endpoints
- [ ] `GET /api/products` - List all products with availability
- [ ] `GET /api/products/[id]` - Get product details
- [ ] `POST /api/orders` - Create new order

### Admin API Endpoints (requires authentication)
- [ ] `GET /api/admin/products` - List products with stock info
- [ ] `POST /api/admin/products` - Create product
- [ ] `PATCH /api/admin/products/[id]` - Update product
- [ ] `DELETE /api/admin/products/[id]` - Delete product
- [ ] `GET /api/admin/orders` - List orders
- [ ] `PATCH /api/admin/orders/[id]/status` - Update order status
- [ ] `POST /api/admin/purchases` - Record purchase
- [ ] `GET /api/admin/dashboard/stats` - Dashboard statistics
- [ ] `GET /api/admin/reports/stock` - Stock report
- [ ] `GET /api/admin/reports/expiry` - Expiry alerts

---

## 🛠️ Useful Commands

```bash
# Database Commands
npm run db:generate      # Generate Prisma Client after schema changes
npm run db:migrate       # Create and run new migration
npm run db:push          # Push schema changes without migration (dev only)
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio (GUI for database)

# Admin User Management
npm run create-admin     # Create new admin user (interactive)

# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

---

## 📊 Database Schema Overview

### Models
- **User** - Admin users for authentication
- **Product** - Medicine catalog with details
- **Purchase** - Inventory purchases (adds stock)
- **Sale** - Sales records (reduces stock)
- **Order** - Customer orders (doesn't affect stock until confirmed)

### Stock Calculation Rule
```
Current Stock = Total Purchases - Total Confirmed Sales
```
Stock is NEVER stored in database, always calculated in real-time.

---

## 🔒 Security Features
- ✅ NextAuth.js authentication for admin routes
- ✅ Bcrypt password hashing
- ✅ Route-level middleware protection
- ✅ Zod validation on all inputs
- ✅ SQL injection prevention via Prisma
- ✅ Price information hidden in public API

---

## 📝 Development Notes

### Adding New Features
1. Update Prisma schema if database changes needed
2. Run `npm run db:migrate` to create migration
3. Create/update service in `lib/services/`
4. Create API route in `app/api/`
5. Add Zod validation in `lib/validations/backend.ts`
6. Test endpoint with authentication if admin route

### Business Rules
- Orders remain PENDING until admin confirms
- Stock is only reduced when order status changes to CONFIRMED
- Sale record is automatically created when order is confirmed
- Stock calculation checks available stock before confirmation
- Expiry alerts show products expiring within 30 days

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
# Verify DATABASE_URL in .env
# Test connection:
npx prisma db pull
```

### Authentication Not Working
```bash
# Regenerate NEXTAUTH_SECRET:
openssl rand -base64 32

# Verify admin user exists:
npm run db:studio
# Check User table in Prisma Studio
```

### Migration Errors
```bash
# Reset database (WARNING: deletes all data):
npx prisma migrate reset

# Or manually fix:
npx prisma migrate resolve --rolled-back <migration-name>
```

---

## 📚 Additional Documentation
- Full backend documentation: `BACKEND_DOCUMENTATION.md`
- API endpoint details: `BACKEND_DOCUMENTATION.md#api-endpoints`
- Environment variables: `.env.backend.example`

---

## 🎯 Next Steps
1. ✅ Complete setup above
2. 🔄 Test all API endpoints
3. 🎨 Customize admin dashboard
4. 📦 Deploy to production
5. 🔐 Set up proper secrets management
6. 📈 Add monitoring and logging

**Happy Coding! 🚀**

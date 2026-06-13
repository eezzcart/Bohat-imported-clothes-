# Unified Website Architecture

## Overview

Your website now runs as a **single unified application** with integrated admin panel. Everything runs on the same domain with secure authentication.

## Architecture

```
https://your-domain.com/
├── / (Home Page - Public)
│   ├── Shop Section
│   ├── Categories Filter
│   ├── Products Display
│   └── Admin Button (in navbar)
│
├── /login (Login Page - Public)
│   └── Username & Password Authentication
│
└── /admin/* (Admin Dashboard - Protected)
    ├── /admin (Dashboard)
    ├── /admin/products (Products List)
    ├── /admin/products/add (Add New Product)
    ├── /admin/products/edit/:id (Edit Product)
    ├── /admin/categories (Manage Categories)
    └── All routes require authentication
```

## How It Works

### 1. **Single Domain**
- Everything runs on: `https://your-domain.com`
- No separate admin subdomain or external pages
- Consistent branding and user experience

### 2. **Unified Routing**
- Uses `wouter` routing library for all navigation
- Admin panel is part of the main React app
- Seamless transitions between public and admin areas

### 3. **Secure Authentication**
- Login page at `/login`
- Username: `Bohat imported clothes`
- Password: `bhatimported@098765`
- Session stored in secure HTTP-only cookies
- Automatic logout on tab close (security feature)

### 4. **Protected Routes**
- All `/admin/*` routes require authentication
- If not logged in, redirects to `/login`
- Session expires after 30 days
- Automatic logout when switching tabs

## User Flow

### For Customers (Public)
1. Visit `https://your-domain.com`
2. Browse products and categories
3. See all products from database in real-time
4. Click "Admin" button to go to login page

### For Admin Users
1. Click "Admin" button on home page
2. Redirected to `/login` if not authenticated
3. Enter credentials
4. Access admin dashboard at `/admin`
5. Manage products, categories, images
6. Changes appear immediately on storefront
7. Click "Back to Store" to return to home page

## Security Features

### 1. **Authentication**
- Username and password required
- Bcrypt password hashing (10 rounds)
- Secure session tokens (JWT-based)
- HTTP-only cookies (cannot be accessed by JavaScript)

### 2. **Authorization**
- Admin role verification on all protected routes
- Server-side permission checks
- Automatic redirection on unauthorized access

### 3. **Session Management**
- 30-day session expiration
- Automatic logout when tab becomes hidden
- Session cookie with SameSite=Lax protection
- Secure flag enabled in production

### 4. **Data Protection**
- All database queries use parameterized statements
- No SQL injection vulnerabilities
- TiDB Cloud encryption at rest and in transit

## Database Connection

- **Type**: TiDB Cloud (MySQL-compatible)
- **Location**: Asia Pacific (Singapore)
- **Database**: bohat_shop
- **Tables**: users, products, categories, productImages
- **SSL/TLS**: Enabled for all connections
- **Backups**: Automatic daily backups

## Deployment

### On Vercel
1. Code is automatically deployed when you push to GitHub
2. Environment variables are set in Vercel dashboard
3. No separate admin deployment needed
4. Single build process for entire app

### Environment Variables Required
```
DATABASE_URL=mysql://...
COOKIE_SECRET=your-secret-key
OAUTH_SERVER_URL=https://oauth.manus.im
```

## Admin Panel Features

### Dashboard
- Overview of shop statistics
- Quick access to all admin functions

### Products Management
- Add new products with images
- Edit existing products
- Delete products
- Set product status (active/draft)
- Upload multiple images per product
- Organize by category

### Categories Management
- Add new categories
- Edit category names and descriptions
- Delete categories
- Categories appear in storefront filters immediately

### Real-Time Sync
- Changes made in admin appear on storefront instantly
- All devices see the same products
- No caching delays
- Database is the single source of truth

## Navigation

### From Home Page
- Click "Admin" button → Goes to `/login`
- After login → Redirected to `/admin`

### From Admin Panel
- Click "Back to Store" → Returns to home page
- Click "Sign Out" → Logs out and returns to home page

### Sidebar Navigation
- Dashboard → `/admin`
- Products → `/admin/products`
- Add Product → `/admin/products/add`
- Categories → `/admin/categories`

## Troubleshooting

### Admin Panel Not Loading
- Check if you're logged in
- Clear browser cookies and try again
- Check browser console for errors

### Changes Not Appearing on Storefront
- Ensure product status is "active"
- Refresh the storefront page
- Check database connection

### Login Not Working
- Verify username: `Bohat imported clothes`
- Verify password: `bhatimported@098765`
- Check browser cookies are enabled

### Session Expired
- Log in again
- Sessions expire after 30 days
- Automatic logout if tab is hidden

## Performance

- **Single App Bundle**: ~670KB gzipped
- **API Calls**: Batched for efficiency
- **Database Queries**: Optimized with indexes
- **Caching**: React Query handles client-side caching

## Next Steps

1. **Change Admin Password**: Log in and change the default password
2. **Add Your Products**: Use admin panel to add real products
3. **Customize Categories**: Modify categories as needed
4. **Setup Payment**: Integrate payment gateway
5. **Add Inventory Tracking**: Monitor stock levels

---

**Last Updated**: June 13, 2024
**Architecture Version**: 2.0 (Unified Single App)

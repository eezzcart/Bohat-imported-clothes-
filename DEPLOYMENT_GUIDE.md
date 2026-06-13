# Bohat Imported Clothes - Deployment Guide

## TiDB Database Setup

Your website is now connected to TiDB Cloud. The database has been created with the following tables:
- `users` - Admin user accounts
- `categories` - Product categories
- `products` - Product listings
- `productImages` - Product images

### Database Credentials
- **Host**: gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com
- **Port**: 4000
- **Database**: bohat_shop
- **Username**: 2B6wGzhpfgFdij7.root
- **Password**: x33G37Q1YgQUje4Z

## Vercel Environment Variables

To deploy this project on Vercel, you need to set the following environment variables:

### Production Environment Variables

1. **DATABASE_URL** (Required)
   ```
   mysql://2B6wGzhpfgFdij7.root:x33G37Q1YgQUje4Z@gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com:4000/bohat_shop
   ```

2. **COOKIE_SECRET** (Required)
   ```
   bohat-secret-key-2024
   ```
   (Change this to a secure random string in production)

3. **OAUTH_SERVER_URL** (Optional)
   ```
   https://oauth.manus.im
   ```

4. **OWNER_OPEN_ID** (Optional)
   ```
   (Leave empty unless using OAuth)
   ```

5. **APP_ID** (Optional)
   ```
   (Leave empty unless using OAuth)
   ```

## How to Deploy

### Step 1: Set Environment Variables on Vercel
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each environment variable from the list above
4. Make sure they are set for **Production** environment

### Step 2: Trigger Deployment
1. Push your code to GitHub (already done)
2. Vercel will automatically detect the push and start building
3. The build should complete in a few minutes

### Step 3: Verify Deployment
1. Visit your Vercel deployment URL
2. Check that products and categories load from the database
3. Test the admin panel at `/admin`

## Key Changes Made

### 1. Database Connection
- Switched from local database to TiDB Cloud
- Created all required tables in `bohat_shop` database
- Updated `drizzle.config.ts` to use SSL for TiDB

### 2. Public API Endpoints
Created new public endpoints for the storefront:
- `trpc.publicProducts.list` - Get all active products
- `trpc.publicProducts.getById` - Get product details
- `trpc.publicCategories.list` - Get all categories
- `trpc.publicCategories.getById` - Get category details

### 3. Storefront Updates
- Replaced hardcoded demo products in `Home.tsx`
- Home page now fetches products from the database
- Categories are dynamically loaded from the database
- Products and categories sync in real-time across all devices

### 4. Admin Panel
- Admin panel remains unchanged and connected to the database
- When you add products in the admin panel, they appear on the storefront immediately
- When you add categories in the admin panel, they appear in the storefront filters

## Adding Products

### Via Admin Panel
1. Navigate to `/admin` on your website
2. Go to **Products** section
3. Click **Add Product**
4. Fill in product details:
   - Name
   - Description
   - Price
   - Category
   - Stock
   - Status (active/draft)
5. Upload product images
6. Save

### Direct Database (Advanced)
You can also insert products directly into the TiDB database:

```sql
INSERT INTO categories (name, description) VALUES ('Jackets', 'Premium imported jackets');

INSERT INTO products (name, description, price, categoryId, stock, status) 
VALUES ('Premium Denim Jacket', 'Authentic imported denim jacket', '2500.00', 1, 10, 'active');
```

## Troubleshooting

### Products Not Showing on Storefront
1. Make sure products have `status = 'active'`
2. Check that the DATABASE_URL environment variable is set correctly on Vercel
3. Verify TiDB connection is working

### Admin Panel Not Working
1. Check that you're logged in
2. Verify the admin user exists in the database
3. Check browser console for errors

### Categories Not Syncing
1. Make sure categories are created in the admin panel before adding products
2. Refresh the storefront page to see new categories

## Support

For issues or questions about the deployment, please check:
1. Vercel deployment logs
2. Browser developer console for client-side errors
3. TiDB Cloud dashboard for database connection issues

## Next Steps

1. **Customize Branding**: Update the logo and colors in the storefront
2. **Add Payment Integration**: Integrate with payment providers (Razorpay, Stripe, etc.)
3. **Setup Email Notifications**: Configure email for order confirmations
4. **Add Inventory Management**: Track stock levels
5. **Setup Analytics**: Monitor user behavior and sales

---

**Last Updated**: June 13, 2024

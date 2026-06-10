import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Package, Tag, TrendingUp, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery();
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();

  const totalProducts = products?.length || 0;
  const totalCategories = categories?.length || 0;
  const activeProducts = products?.filter((p) => p.status === "active").length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Bhat Imported Clothess</h1>
            <p className="text-muted-foreground mt-2">Best Quality | Affordable price</p>
            <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.name || "Admin"}</p>
          </div>
          <Link href="/admin/products/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Products Card */}
          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-foreground">Total Products</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-primary">{totalProducts}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">All products in catalog</p>
            </CardContent>
          </Card>

          {/* Active Products Card */}
          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-foreground">Active Products</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-primary">{activeProducts}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Live and available</p>
            </CardContent>
          </Card>

          {/* Categories Card */}
          <Card className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-foreground">Categories</CardTitle>
              <Tag className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-primary">{totalCategories}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Product categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>Manage your shop from here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/products">
                <Button variant="outline" className="w-full justify-start border-border hover:bg-muted">
                  <Package className="w-4 h-4 mr-2 text-primary" />
                  View All Products
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full justify-start border-border hover:bg-muted">
                  <Tag className="w-4 h-4 mr-2 text-primary" />
                  Manage Categories
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

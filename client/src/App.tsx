import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import FloatingNavbar from "./components/FloatingNavbar";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./admin-new/components/Layout";
import AdminDashboard from "./admin-new/pages/Dashboard";
import AdminProducts from "./admin-new/pages/Products";
import AdminAddProduct from "./admin-new/pages/AddProduct";
import AdminEditProduct from "./admin-new/pages/EditProduct";
import AdminProductDetail from "./admin-new/pages/ProductDetail";
import AdminCategories from "./admin-new/pages/Categories";
import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import superjson from "superjson";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = "/login";
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

// Protected Admin Routes Component
function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/products" component={AdminProducts} />
        <Route path="/admin/products/add" component={AdminAddProduct} />
        <Route path="/admin/products/new" component={AdminAddProduct} />
        <Route path="/admin/products/edit/:id" component={AdminEditProduct} />
        <Route path="/admin/products/:id" component={AdminProductDetail} />
        <Route path="/admin/categories" component={AdminCategories} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  const [location] = useLocation();

  return (
    <Switch>
      <Route path={"/login"} component={LoginPage} />
      
      {/* Admin routes - all under /admin prefix */}
      <Route path="/admin/*" component={AdminRoutes} />
      
      {/* Home page and public routes */}
      <Route path={"/404"} component={NotFound} />
      <Route path="/">
        {(params) => {
          const [activeSection, setActiveSection] = React.useState('home');
          return (
            <Home activeSection={activeSection} onSectionChange={setActiveSection} />
          );
        }}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <ThemeProvider
            defaultTheme="light"
          >
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;

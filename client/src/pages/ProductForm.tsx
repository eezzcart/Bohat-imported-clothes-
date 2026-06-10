import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductForm() {
  const params = useParams();
  const [, navigate] = useLocation();
  const productId = params?.id ? parseInt(params.id) : null;
  const isEditing = !!productId;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stock: "0",
    sku: "",
    status: "draft" as "active" | "draft",
  });

  const [images, setImages] = useState<Array<{ id?: number; url: string; file?: File; isNew?: boolean }>>([]);
  const [primaryImageId, setPrimaryImageId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries and mutations
  const { data: product, isLoading: productLoading } = trpc.products.getById.useQuery(
    { id: productId! },
    { enabled: isEditing }
  );
  const { data: categories } = trpc.categories.list.useQuery();
  const createProductMutation = trpc.products.create.useMutation();
  const updateProductMutation = trpc.products.update.useMutation();
  const uploadImageMutation = trpc.products.uploadImage.useMutation();

  // Load product data when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        categoryId: product.categoryId?.toString() || "",
        stock: product.stock.toString(),
        sku: product.sku || "",
        status: product.status,
      });
      if (product.images) {
        setImages(product.images.map((img) => ({ id: img.id, url: img.imageUrl })));
      }
      setPrimaryImageId(product.primaryImageId);
    }
  }, [product]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        const target = event.target as FileReader | null;
        if (target && target.result) {
          setImages((prev) => [
            ...prev,
            {
              url: target.result as string,
              file,
              isNew: true,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Reorder images
  const handleMoveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newImages.length) {
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      setImages(newImages);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.name || !formData.price) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      let productIdToUse = productId;

      // Create or update product
      if (isEditing) {
        await updateProductMutation.mutateAsync({
          id: productId!,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
          stock: parseInt(formData.stock),
          sku: formData.sku,
          status: formData.status,
        });
      } else {
        const result = await createProductMutation.mutateAsync({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
          stock: parseInt(formData.stock),
          sku: formData.sku,
          status: formData.status,
        });
        // Note: We'll need to get the ID from the response
        productIdToUse = productId;
      }

      // Upload new images
      for (const image of images) {
        if (image.isNew && image.file && productIdToUse) {
          await uploadImageMutation.mutateAsync({
            productId: productIdToUse!,
            imageFile: image.file!,
            altText: image.file!.name,
          });
        }
      }

      // Set primary image if selected
      if (primaryImageId && productIdToUse) {
        const setPrimaryMutation = trpc.products.setPrimaryImage.useMutation();
        await setPrimaryMutation.mutateAsync({
          productId: productIdToUse,
          imageId: primaryImageId,
        });
      }

      toast.success(isEditing ? "Product updated successfully" : "Product created successfully");
      navigate("/admin/products");
    } catch (error) {
      toast.error("Failed to save product");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && productLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/products")}
            className="text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{isEditing ? "Edit Product" : "Add New Product"}</h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? "Update product details" : "Create a new product"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Basic Information</CardTitle>
                  <CardDescription className="text-muted-foreground">Product name and description</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-foreground font-bold">
                      Product Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className="mt-2 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-foreground font-bold">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter product description"
                      className="mt-2 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Inventory */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Pricing & Inventory</CardTitle>
                  <CardDescription className="text-muted-foreground">Price, stock, and SKU information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price" className="text-foreground font-bold">
                        Price *
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className="mt-2 bg-input border-border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock" className="text-foreground font-bold">
                        Stock Quantity *
                      </Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="mt-2 bg-input border-border text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="sku" className="text-foreground font-bold">
                      SKU
                    </Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="Enter SKU"
                      className="mt-2 bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Image Gallery */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Product Images</CardTitle>
                  <CardDescription className="text-muted-foreground">Upload and manage product images</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-primary" />
                        <span className="text-foreground font-bold">Click to upload images</span>
                        <span className="text-sm text-muted-foreground">or drag and drop</span>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Image Gallery */}
                  {images.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-foreground font-bold">Uploaded Images</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={`Product ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-border"
                            />
                            {primaryImageId === image.id && (
                              <div className="absolute top-1 right-1 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                                Primary
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => image.id && setPrimaryImageId(image.id)}
                                className="text-white hover:bg-primary/50"
                                title="Set as primary"
                              >
                                ★
                              </Button>
                              {index > 0 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMoveImage(index, "up")}
                                  className="text-white hover:bg-primary/50"
                                  title="Move up"
                                >
                                  ↑
                                </Button>
                              )}
                              {index < images.length - 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMoveImage(index, "down")}
                                  className="text-white hover:bg-primary/50"
                                  title="Move down"
                                >
                                  ↓
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveImage(index)}
                                className="text-white hover:bg-destructive/50"
                                title="Remove"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Category */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={formData.categoryId} onValueChange={(value) => handleSelectChange("categoryId", value)}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()} className="text-foreground">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Status */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value as "active" | "draft")}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="active" className="text-foreground">
                        Active
                      </SelectItem>
                      <SelectItem value="draft" className="text-foreground">
                        Draft
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-3 flex gap-2">
                    <Badge
                      variant={formData.status === "active" ? "default" : "secondary"}
                      className={formData.status === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                    >
                      {formData.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

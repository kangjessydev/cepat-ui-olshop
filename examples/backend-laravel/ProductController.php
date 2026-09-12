<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * ProductController — Example reference controller for Cepat UI Olshop
 *
 * Implements endpoints consumed by `ApiProductRepository`:
 * - GET    /api/products
 * - GET    /api/products/{id}
 * - POST   /api/products
 * - PUT    /api/products/{id}
 * - DELETE /api/products/{id}
 * - POST   /api/products/deduct-stock
 * - GET    /api/categories
 */
class ProductController extends Controller
{
    /**
     * Display a listing of products with optional search and category filters.
     */
    public function index(Request $request): JsonResponse
    {
        // Example with Eloquent:
        // $query = Product::with(['category', 'variantMatrix']);
        // if ($request->filled('category')) {
        //     $query->where('category_id', $request->query('category'));
        // }
        // if ($request->filled('q')) {
        //     $query->where('name', 'like', '%' . $request->query('q') . '%');
        // }
        // return response()->json($query->paginate(20));

        return response()->json([
            'status' => 'success',
            'data' => [
                [
                    'id' => 'prod-1',
                    'name' => 'Kemeja Katun Signature Oxford',
                    'slug' => 'kemeja-katun-signature-oxford',
                    'sku' => 'KMT-OXF-001',
                    'description' => 'Kemeja katun premium breathable untuk daily dan kerja.',
                    'price' => 189000,
                    'originalPrice' => 249000,
                    'stock' => 35,
                    'weight' => 350,
                    'soldCount' => 142,
                    'rating' => 4.8,
                    'reviewCount' => 28,
                    'status' => 'active',
                    'hasVariants' => true,
                    'images' => [
                        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'
                    ],
                    'category' => [
                        'id' => 'cat-1',
                        'name' => 'Fashion Pria',
                        'slug' => 'fashion-pria'
                    ]
                ]
            ]
        ]);
    }

    /**
     * Display the specified product by ID or slug.
     */
    public function show(string $id): JsonResponse
    {
        // Example with Eloquent:
        // $product = Product::with(['category', 'variantMatrix'])->findOrFail($id);
        // return response()->json($product);

        return response()->json([
            'id' => $id,
            'name' => 'Kemeja Katun Signature Oxford',
            'slug' => 'kemeja-katun-signature-oxford',
            'sku' => 'KMT-OXF-001',
            'price' => 189000,
            'stock' => 35,
            'weight' => 350,
            'status' => 'active',
            'images' => [
                'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'
            ]
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'weight' => 'required|integer|min:1',
            'categoryId' => 'nullable|string',
            'description' => 'nullable|string',
            'images' => 'required|array|min:1',
            'images.*' => 'string',
            'hasVariants' => 'boolean',
            'variantMatrix' => 'nullable|array'
        ]);

        // Example with Eloquent:
        // $product = Product::create([
        //     'id' => (string) Str::uuid(),
        //     'slug' => Str::slug($validated['name']),
        //     ...$validated
        // ]);
        // return response()->json($product, 201);

        return response()->json([
            'status' => 'success',
            'message' => 'Produk berhasil dibuat',
            'data' => array_merge($validated, [
                'id' => 'prod-' . time(),
                'slug' => Str::slug($validated['name'])
            ])
        ], 201);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'weight' => 'sometimes|integer|min:1',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:active,draft,archived'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Produk berhasil diperbarui',
            'data' => array_merge(['id' => $id], $validated)
        ]);
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        // Example: Product::findOrFail($id)->delete();
        return response()->json([
            'status' => 'success',
            'message' => "Produk {$id} berhasil dihapus"
        ]);
    }

    /**
     * Deduct stock for order checkout items.
     */
    public function deductStock(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.productId' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        // Example with DB Transaction:
        // DB::transaction(function () use ($validated) {
        //     foreach ($validated['items'] as $item) {
        //         Product::where('id', $item['productId'])
        //             ->decrement('stock', $item['quantity']);
        //         Product::where('id', $item['productId'])
        //             ->increment('sold_count', $item['quantity']);
        //     }
        // });

        return response()->json([
            'status' => 'success',
            'message' => 'Stok produk berhasil diperbarui'
        ]);
    }

    /**
     * Get list of product categories.
     */
    public function categories(): JsonResponse
    {
        return response()->json([
            ['id' => 'cat-1', 'name' => 'Fashion Pria', 'slug' => 'fashion-pria'],
            ['id' => 'cat-2', 'name' => 'Fashion Wanita', 'slug' => 'fashion-wanita'],
            ['id' => 'cat-3', 'name' => 'Gadget & Audio', 'slug' => 'gadget-audio'],
            ['id' => 'cat-4', 'name' => 'Sepatu & Sneakers', 'slug' => 'sepatu-sneakers'],
            ['id' => 'cat-5', 'name' => 'Lifestyle & Rumah', 'slug' => 'lifestyle-rumah']
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * OrderController — Example reference controller for Cepat UI Olshop
 *
 * Implements endpoints consumed by `ApiOrderRepository`:
 * - GET   /api/orders
 * - GET   /api/orders/{id}
 * - POST  /api/orders
 * - PATCH /api/orders/{id}/status
 * - PATCH /api/orders/{id}/tracking
 * - GET   /api/account/orders (Customer auth)
 * - GET   /api/orders/track?q=ORD-...
 */
class OrderController extends Controller
{
    /**
     * List all orders (Admin dashboard).
     */
    public function index(Request $request): JsonResponse
    {
        // Example with Eloquent:
        // $orders = Order::with('items')->latest()->paginate(20);
        // return response()->json($orders);

        return response()->json([
            'status' => 'success',
            'data' => [
                [
                    'id' => 'ord-1001',
                    'orderNumber' => 'ORD-202609-101',
                    'customerId' => 'cust-1',
                    'customerName' => 'Jessica Tanuwijaya',
                    'customerEmail' => 'jessica@gmail.com',
                    'customerPhone' => '081298765432',
                    'totalAmount' => 425000,
                    'status' => 'paid',
                    'shipping' => [
                        'courierName' => 'JNE',
                        'serviceName' => 'JNE REG',
                        'cost' => 15000,
                        'trackingNumber' => 'JNE8829103982',
                        'address' => [
                            'recipientName' => 'Jessica Tanuwijaya',
                            'phone' => '081298765432',
                            'addressLine' => 'Jl. Dago Asri No. 12',
                            'city' => 'Kota Bandung',
                            'province' => 'Jawa Barat',
                            'postalCode' => '40135'
                        ]
                    ],
                    'payment' => [
                        'method' => 'bank_transfer',
                        'provider' => 'xendit',
                        'status' => 'paid',
                        'reference' => 'xendit_inv_1001'
                    ],
                    'createdAt' => now()->toISOString()
                ]
            ]
        ]);
    }

    /**
     * Show single order detail.
     */
    public function show(string $id): JsonResponse
    {
        return response()->json([
            'id' => $id,
            'orderNumber' => 'ORD-202609-101',
            'customerName' => 'Jessica Tanuwijaya',
            'totalAmount' => 425000,
            'status' => 'processing',
            'items' => [],
            'timeline' => [
                [
                    'id' => 'tl-1',
                    'title' => 'Pesanan Berhasil Dibuat',
                    'timestamp' => now()->toISOString()
                ]
            ]
        ]);
    }

    /**
     * Create order from storefront checkout.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customerName' => 'required|string|max:255',
            'customerPhone' => 'required|string',
            'items' => 'required|array|min:1',
            'totalAmount' => 'required|numeric|min:0',
            'shipping' => 'required|array',
            'payment' => 'required|array'
        ]);

        $orderNumber = 'ORD-' . date('Ym') . '-' . rand(100, 999);
        $orderId = 'ord-' . time();

        // Example with Eloquent:
        // $order = Order::create([...$validated, 'orderNumber' => $orderNumber]);
        // return response()->json($order, 201);

        return response()->json(array_merge($validated, [
            'id' => $orderId,
            'orderNumber' => $orderNumber,
            'status' => 'pending_payment',
            'createdAt' => now()->toISOString()
        ]), 201);
    }

    /**
     * Update order status (Admin).
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending_payment,paid,processing,shipped,delivered,cancelled',
            'note' => 'nullable|string'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Status pesanan {$id} diubah ke {$validated['status']}",
            'data' => [
                'id' => $id,
                'status' => $validated['status']
            ]
        ]);
    }

    /**
     * Attach shipping courier & tracking number (Admin).
     */
    public function updateTracking(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'trackingNumber' => 'required|string|max:100',
            'courier' => 'required|string|max:50'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Nomor resi pengiriman berhasil diperbarui',
            'data' => [
                'id' => $id,
                'status' => 'shipped',
                'trackingNumber' => $validated['trackingNumber'],
                'courier' => $validated['courier']
            ]
        ]);
    }

    /**
     * Get logged-in customer's order history.
     */
    public function myOrders(Request $request): JsonResponse
    {
        // Example: $user = $request->user(); return response()->json($user->orders);
        return response()->json([]);
    }

    /**
     * Public order tracking by order number or phone.
     */
    public function track(Request $request): JsonResponse
    {
        $query = $request->query('q');
        return response()->json([
            'status' => 'success',
            'data' => null // Return order object matching query
        ]);
    }
}

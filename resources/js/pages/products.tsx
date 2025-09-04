import AppLayout from '@/layouts/app-layout';
import { products as productsRoute } from '@/routes';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Product = {
    id: string;
    name: string;
    price: number;
};

const CATALOG: Product[] = [
    { id: 'p1', name: 'Apple', price: 1.25 },
    { id: 'p2', name: 'Banana', price: 0.75 },
    { id: 'p3', name: 'Orange', price: 1.5 },
    { id: 'p4', name: 'Mango', price: 2.0 },
];

type Cart = Record<string, number>;

export default function ProductsPage() {
    const [cart, setCart] = useState<Cart>({});

    const addToCart = (productId: string) => {
        setCart((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }));
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => {
            const currentQty = prev[productId] ?? 0;
            if (currentQty <= 1) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [productId]: currentQty - 1 };
        });
    };

    const totalAmount = useMemo(() => {
        return Object.entries(cart).reduce((sum, [id, qty]) => {
            const product = CATALOG.find((p) => p.id === id);
            if (!product) return sum;
            return sum + product.price * qty;
        }, 0);
    }, [cart]);

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Products', href: productsRoute().url }]}
        >
            <Head title="Products" />
            <div className="mx-auto w-full max-w-3xl space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Product List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y">
                            {CATALOG.map((product) => {
                                const qty = cart[product.id] ?? 0;
                                return (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between py-3"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">{product.name}</span>
                                            <span className="text-sm text-muted-foreground">
                                                ${product.price.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeFromCart(product.id)}
                                                disabled={qty === 0}
                                                aria-label={`Decrease ${product.name}`}
                                            >
                                                -
                                            </Button>
                                            <span className="w-8 text-center tabular-nums">
                                                {qty}
                                            </span>
                                            <Button
                                                size="icon"
                                                onClick={() => addToCart(product.id)}
                                                aria-label={`Increase ${product.name}`}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Cart Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total</span>
                            <span className="text-lg font-semibold">
                                ${totalAmount.toFixed(2)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}



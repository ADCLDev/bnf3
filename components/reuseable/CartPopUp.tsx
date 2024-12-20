// components/reuseable/CartPopUp
'use client'
import React, { useState } from 'react';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import CheckoutDialog from './CheckoutDialog';

const CartPopup = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Elegance Sans",
      style: "Regular",
      price: 49.99,
      quantity: 1
    }
  ]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckoutComplete = () => {
    setCartItems([]);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
          </button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 -mx-6 px-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-2">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.style}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="w-20 text-right">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            {cartItems.length > 0 && (
              <div className="border-t mt-4 pt-4 space-y-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => setCheckoutOpen(true)}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutDialog 
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        total={total}
        onCheckoutComplete={handleCheckoutComplete}
      />
    </>
  );
};

export default CartPopup;
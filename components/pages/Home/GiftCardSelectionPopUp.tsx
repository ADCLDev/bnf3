"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Check, Gift, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import PaymentPopup from '@/components/payment/PaymentPopUp';

interface GiftCard {
  id: string;
  name: string;
  amount: number;
  bonusAmount: number;
  validityDays: number;
  libraryAccess: 'free' | 'entire';
  licenseType: 'private' | 'commercial' | 'both';
  totalDevices: number;
  typeToolAccess: boolean;
  textGenerationLimit: number;
  isActive: boolean;
  description: string;
}

const GiftCardPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);

  const fetchGiftCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const cardsQuery = query(
        collection(db, 'gift_cards'),
        orderBy('amount')
      );
      const snapshot = await getDocs(cardsQuery);
      const cardsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as GiftCard))
        .filter(card => card.isActive);
      
      setGiftCards(cardsData);
    } catch (error) {
      console.error('Error fetching gift cards:', error);
      setError('Failed to load gift cards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGiftCards();
    }
  }, [isOpen]);

  const handlePurchase = (card: GiftCard) => {
    setSelectedCard(card);
    setShowPayment(true);
  };

  const getVariantStyles = (index: number) => {
    const variants = ['blue', 'purple', 'green'] as const;
    type VariantType = typeof variants[number];
    
    const variant = variants[index % variants.length];
    
    const styles: Record<VariantType, {
      background: string;
      border: string;
      button: string;
      icon: string;
    }> = {
      blue: {
        background: 'bg-blue-50',
        border: 'border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        icon: 'text-blue-600'
      },
      purple: {
        background: 'bg-purple-50',
        border: 'border-purple-200',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
        icon: 'text-purple-600'
      },
      green: {
        background: 'bg-green-50',
        border: 'border-green-200',
        button: 'bg-green-600 hover:bg-green-700 text-white',
        icon: 'text-green-600'
      }
    };
    
    return styles[variant];
  };

  return (
    <div>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        size="icon"
        className="rounded-full bg-red-500 text-white hover:bg-red-600 hover:text-white text-2xl h-8 w-8"
      >
        <Plus className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] max-w-[1200px] h-[95vh] md:h-auto md:max-h-[90vh] p-0">
          <div className="h-full flex flex-col overflow-hidden">
            <DialogHeader className="p-4 sm:p-6 flex-shrink-0 border-b">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-center flex items-center justify-center gap-2">
                <Gift className="h-6 w-6" />
                Choose Your Gift Card
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button 
                    variant="outline"
                    onClick={fetchGiftCards}
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 py-4 max-w-5xl mx-auto">
                  {giftCards.map((card, index) => {
                    const styles = getVariantStyles(index);
                    
                    return (
                      <Card 
                        key={card.id} 
                        className={`relative p-6 lg:p-8 flex flex-col ${styles.background} ${styles.border} border-2`}
                      >
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className={`${styles.button} px-4 py-1 rounded-full text-sm font-medium`}>
                            Gift Card
                          </span>
                        </div>
                        
                        <div className="text-center mb-6">
                          <h3 className="text-xl lg:text-2xl font-bold mb-2">{card.name}</h3>
                          <div className="text-3xl lg:text-4xl font-bold mb-1">
                            <span className="font-normal text-xl lg:text-2xl">৳</span> {card.amount}
                          </div>
                          {card.bonusAmount > 0 && (
                            <div className="text-green-600 text-sm">
                              +৳{card.bonusAmount} bonus
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center text-base lg:text-lg">
                            <Check className={`h-5 w-5 ${styles.icon} mr-3 flex-shrink-0`} />
                            <span>Valid for {card.validityDays} days</span>
                          </div>
                          <div className="flex items-center text-base lg:text-lg">
                            <Check className={`h-5 w-5 ${styles.icon} mr-3 flex-shrink-0`} />
                            <span>
                              {card.libraryAccess === 'entire' ? 'Full Library Access' : 'Free Library Only'}
                            </span>
                          </div>
                          <div className="flex items-center text-base lg:text-lg">
                            <Check className={`h-5 w-5 ${styles.icon} mr-3 flex-shrink-0`} />
                            <span>
                              {card.licenseType.charAt(0).toUpperCase() + card.licenseType.slice(1)} License
                            </span>
                          </div>
                          <div className="flex items-center text-base lg:text-lg">
                            <Check className={`h-5 w-5 ${styles.icon} mr-3 flex-shrink-0`} />
                            <span>
                              {card.totalDevices} {card.totalDevices === 1 ? 'Device' : 'Devices'}
                            </span>
                          </div>
                          {card.typeToolAccess && (
                            <div className="flex items-center text-base lg:text-lg">
                              <Check className={`h-5 w-5 ${styles.icon} mr-3 flex-shrink-0`} />
                              <span>{card.textGenerationLimit} Daily Generations</span>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          className={`w-full mt-6 py-6 text-base lg:text-lg font-semibold ${styles.button}`}
                          onClick={() => handlePurchase(card)}
                        >
                          Purchase Gift Card
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showPayment && selectedCard && (
        <PaymentPopup
          onClose={() => {
            setShowPayment(false);
            setSelectedCard(null);
          }}
          amount={selectedCard.amount}
          itemName={selectedCard.name}
          itemType="gift"
        />
      )}
    </div>
  );
};

export default GiftCardPopup;
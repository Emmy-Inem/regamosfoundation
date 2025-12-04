import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const donationAmount = location.state?.amount || "0";
  const donorInfo = location.state?.donorInfo || {};

  const bankDetails = {
    bankName: "Zenith Bank",
    accountName: "Regamos Foundation",
    accountNumber: "1017935691",
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentConfirmation = () => {
    toast.success("Thank you for your donation! We'll confirm your payment shortly.");
    navigate("/");
  };

  const handleCardPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const paymentReference = `REG-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      const { data, error } = await supabase.functions.invoke('initialize-monnify-payment', {
        body: {
          amount: donationAmount,
          customerName: donorInfo.name,
          customerEmail: donorInfo.email,
          paymentReference,
          paymentDescription: 'Donation to Regamos Foundation',
        },
      });

      if (error) {
        console.error('Payment initialization error:', error);
        toast.error('Failed to initialize payment. Please try again.');
        return;
      }

      if (data.success && data.checkoutUrl) {
        // Redirect to Monnify checkout page
        window.location.href = data.checkoutUrl;
      } else {
        toast.error('Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Payment"
        description="Complete your donation to Regamos Foundation. Choose between card payment or bank transfer."
        url="https://regamosfoundation.lovable.app/payment"
      />
      <div className="min-h-screen">
        <Navigation />
        <main>
          {/* Hero Section */}
          <section className="pt-32 pb-16 bg-gradient-to-b from-muted/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-bold">
                  Complete Your <span className="text-primary">Donation</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Choose your preferred payment method
                </p>
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                {/* Donation Summary */}
                <Card className="border-0 shadow-soft mb-8">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-muted-foreground">Donation Amount</p>
                        <p className="text-3xl font-bold text-primary">₦{parseInt(donationAmount).toLocaleString()}</p>
                      </div>
                      {donorInfo.name && (
                        <div className="text-right">
                          <p className="text-muted-foreground">Donor</p>
                          <p className="font-semibold">{donorInfo.name}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Tabs defaultValue="bank-transfer" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="bank-transfer">Bank Transfer</TabsTrigger>
                    <TabsTrigger value="card">Card Payment</TabsTrigger>
                  </TabsList>

                  <TabsContent value="bank-transfer" className="mt-6">
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">Bank Transfer Details</h3>
                            <p className="text-muted-foreground text-sm">Transfer to the account below</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Bank Name</span>
                              <span className="font-semibold">{bankDetails.bankName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Account Name</span>
                              <span className="font-semibold">{bankDetails.accountName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Account Number</span>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{bankDetails.accountNumber}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => copyToClipboard(bankDetails.accountNumber)}
                                >
                                  {copied ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-sm">
                              <strong>Important:</strong> Please use your email ({donorInfo.email}) as the transfer reference 
                              so we can confirm your donation quickly.
                            </p>
                          </div>
                        </div>

                        <Button 
                          variant="cta" 
                          size="lg" 
                          className="w-full"
                          onClick={handlePaymentConfirmation}
                        >
                          I've Completed the Transfer
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="card" className="mt-6">
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">Pay with Card</h3>
                            <p className="text-muted-foreground text-sm">Secure payment via Monnify</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Amount</span>
                              <span className="font-semibold text-xl">₦{parseInt(donationAmount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Payment Method</span>
                              <span className="font-semibold">Card / Bank Transfer</span>
                            </div>
                          </div>

                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-sm">
                              <strong>Secure Payment:</strong> You'll be redirected to Monnify's secure payment page to complete your transaction.
                            </p>
                          </div>
                        </div>

                        <Button 
                          variant="cta" 
                          size="lg" 
                          className="w-full"
                          onClick={handleCardPayment}
                          disabled={isProcessingPayment}
                        >
                          {isProcessingPayment ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Proceed to Payment'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Payment;

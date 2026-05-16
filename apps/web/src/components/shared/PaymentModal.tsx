import { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/utils";
import { CreditCard, Smartphone, Building2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  serviceType: string;
  onSuccess: (paymentId: string) => void;
}

const paymentMethods = [
  { id: "jazzcash", label: "JazzCash", icon: Smartphone },
  { id: "easypaisa", label: "EasyPaisa", icon: Smartphone },
  { id: "card", label: "Debit / Credit Card", icon: CreditCard },
  { id: "bank", label: "Bank Transfer", icon: Building2 },
];

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  serviceType,
  onSuccess,
}: PaymentModalProps) {
  const [method, setMethod] = useState<string>("jazzcash");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      toast.success("Payment completed successfully!");
      onSuccess(paymentId);
      onClose();
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Pay for {serviceType} — {formatPKR(amount)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium">{serviceType}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-lg font-bold">{formatPKR(amount)}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Payment Method</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {paymentMethods.map((pm) => {
                const Icon = pm.icon;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setMethod(pm.id)}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-all ${
                      method === pm.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {pm.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handlePay}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Pay ${formatPKR(amount)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

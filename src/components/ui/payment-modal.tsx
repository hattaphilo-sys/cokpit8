"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./glass-card";
import { ShimmerButton } from "./shimmer-button";
import { X, CreditCard, Shield } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: "jpy" | "usd";
  projectTitle: string;
}

export const PaymentModal = ({
  isOpen,
  onClose,
  amount,
  currency,
  projectTitle,
}: PaymentModalProps) => {
  const formattedAmount = currency === "jpy" 
    ? `¥${amount.toLocaleString()}`
    : `$${amount.toLocaleString()}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-md"
            >
              <GlassCard className="p-8 relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center"
                  >
                    <CreditCard className="w-8 h-8 text-purple-400" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Payment Required
                  </h2>
                  <p className="text-white/60 text-sm">
                    {projectTitle}
                  </p>
                </div>

                {/* Amount */}
                <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                    Amount Due
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {formattedAmount}
                  </p>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-blue-300 font-medium mb-1">
                      Secure Payment
                    </p>
                    <p className="text-xs text-blue-200/60">
                      Your payment is processed securely through Stripe. We never store your card details.
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <ShimmerButton
                  className="w-full"
                  background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  onClick={() => {
                    // TODO: Integrate with Stripe Payment Intent
                    console.log("Payment initiated for:", amount, currency);
                  }}
                >
                  <CreditCard className="w-5 h-5" />
                  Pay Now
                </ShimmerButton>

                <p className="text-center text-xs text-white/40 mt-4">
                  By proceeding, you agree to our terms of service
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

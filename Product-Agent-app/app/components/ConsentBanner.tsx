"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getConsent, setConsent } from "@/app/lib/analytics";
import { startAnalyticsSubscribers } from "@/app/lib/analytics-subscribers";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Defer to client — avoid SSR mismatch
    setVisible(getConsent() === null);
  }, []);

  const handleAccept = () => {
    setConsent("accepted");
    startAnalyticsSubscribers();
    setVisible(false);
  };

  const handleDecline = () => {
    setConsent("declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg"
        >
          <Card className="bg-surface-2 border-border-default shadow-lg py-4">
            <CardContent className="flex flex-col gap-3 px-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5 p-1.5 rounded-md bg-surface-3">
                  <BarChart3 size={16} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Product Agent collects anonymous usage data to help us improve
                  the product. No personal information is tracked.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={handleDecline}>
                  No thanks
                </Button>
                <Button size="sm" onClick={handleAccept}>
                  Yes, share anonymous stats
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

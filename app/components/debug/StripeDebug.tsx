"use client";

import { useEffect, useState } from "react";

export default function StripeDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    setDebugInfo({
      stripeKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "SET" : "NOT SET",
      stripeKeyLength: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.length || 0,
      appUrl: process.env.NEXT_PUBLIC_APP_URL ? "SET" : "NOT SET",
      isClient: typeof window !== "undefined",
    });
  }, []);

  return (
    <div style={{ 
      position: "fixed", 
      bottom: 20, 
      right: 20, 
      background: "black", 
      color: "white", 
      padding: "10px", 
      borderRadius: "5px",
      fontSize: "12px",
      zIndex: 9999 
    }}>
      <div>Stripe Debug Info:</div>
      <div>Key: {debugInfo.stripeKey}</div>
      <div>Key Length: {debugInfo.stripeKeyLength}</div>
      <div>App URL: {debugInfo.appUrl}</div>
      <div>Client: {debugInfo.isClient ? "YES" : "NO"}</div>
    </div>
  );
}

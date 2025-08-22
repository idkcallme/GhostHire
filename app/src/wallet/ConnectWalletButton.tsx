import React, { useState } from "react";
import { Wallet, LogOut, Loader2 } from "lucide-react";

export function ConnectWalletButton({ variant="primary" }:{variant?:"primary"|"secondary"}) {
  const [status, setStatus] = useState<"disconnected"|"connecting"|"connected"|"error">("disconnected");
  const [addr, setAddr] = useState<string>("");

  async function connect() {
    try {
      setStatus("connecting");
      // TODO: integrate Midnight wallet SDK here
      await new Promise(r=>setTimeout(r, 1200));
      setAddr("mdnt…ab12");
      setStatus("connected");
    } catch {
      setStatus("error");
    }
  }

  function disconnect() {
    setStatus("disconnected");
    setAddr("");
  }

  if (status==="connected") {
    return (
      <div className="flex items-center gap-3">
        {/* Connected Wallet Display */}
        <div 
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full"
          style={{
            background: "var(--success-muted)",
            border: "1px solid rgba(60, 203, 127, 0.2)"
          }}
        >
          <div 
            className="w-2 h-2 rounded-full status-pulse"
            style={{background: "var(--success)"}}
          />
          <span className="body-small font-medium" style={{color: "var(--success)"}}>
            {addr}
          </span>
        </div>
        
        {/* Disconnect Button */}
        <button 
          className="btn btn-ghost flex items-center gap-2 body-small"
          onClick={disconnect}
          style={{padding: "0.5rem 1rem"}}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <button 
      className={`btn ${variant==="primary" ? "btn-primary" : "btn-secondary"} flex items-center gap-2 body-small`}
      onClick={connect}
      disabled={status==="connecting"}
      style={{padding: "0.75rem 1.5rem"}}
    >
      {status==="connecting" ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Connecting…</span>
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
}

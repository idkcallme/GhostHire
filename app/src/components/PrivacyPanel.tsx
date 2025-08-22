import React from "react";
import { Check, Lock, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";

interface PrivacyPanelProps {
  revealed: {
    eligible: boolean;
    jobId: string;
    nullifier: string;
  };
  keptPrivate: {
    skills: string[];
    region: string;
    salary: string;
  };
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

export function PrivacyPanel({ revealed, keptPrivate, variant = "default", className = "" }: PrivacyPanelProps) {
  const isCompact = variant === "compact";
  const isDetailed = variant === "detailed";

  return (
    <div className={`card ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: "var(--primary-muted)"}}>
          <Eye className="w-4 h-4" style={{color: "var(--primary)"}} />
        </div>
        <h3 className="body-small" style={{color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "600"}}>
          Privacy Transparency
        </h3>
        {isDetailed && (
          <div className="ml-auto">
            <CheckCircle className="w-4 h-4" style={{color: "var(--success)"}} />
          </div>
        )}
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Revealed Panel */}
        <div className="privacy-revealed rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor: "var(--success-muted)"}}>
              <Check className="w-3 h-3" style={{color: "var(--success)"}} />
            </div>
            <h4 className="font-semibold" style={{color: "var(--success)"}}>Revealed</h4>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-muted-foreground">Eligible:</span>
              <span className={`font-mono font-semibold ${revealed.eligible ? 'text-success' : 'text-destructive'}`}>
                {revealed.eligible ? '✓ true' : '✗ false'}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-muted-foreground">Job ID:</span>
              <code className="text-xs bg-background/80 px-2 py-1 rounded font-mono border">
                {revealed.jobId}
              </code>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-muted-foreground">Nullifier:</span>
              <code className="text-xs bg-background/80 px-2 py-1 rounded font-mono border">
                {revealed.nullifier}
              </code>
            </li>
            {isDetailed && (
              <li className="text-xs text-muted-foreground mt-3 pt-2 border-t border-success/20">
                <Shield className="w-3 h-3 inline mr-1" />
                These values are publicly verifiable on-chain
              </li>
            )}
          </ul>
        </div>

        {/* Kept Private Panel */}
        <div className="privacy-hidden rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor: "var(--border-strong)"}}>
              <Lock className="w-3 h-3" style={{color: "var(--warm-off-white)", opacity: "0.6"}} />
            </div>
            <h4 className="font-semibold" style={{color: "var(--warm-off-white)", opacity: "0.8"}}>Kept Private</h4>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <EyeOff className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                <span className="font-medium">Skills:</span> {keptPrivate.skills.join(', ')}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <EyeOff className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                <span className="font-medium">Region:</span> {keptPrivate.region}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <EyeOff className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                <span className="font-medium">Salary:</span> {keptPrivate.salary}
              </span>
            </li>
            {isDetailed && (
              <li className="text-xs text-success mt-3 pt-2 border-t border-border/50">
                <Shield className="w-3 h-3 inline mr-1" />
                Your data never leaves the browser
              </li>
            )}
          </ul>
        </div>
      </div>

      {isDetailed && (
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-success/5 rounded-lg border border-primary/10">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-3 h-3 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">How ZK Proofs Work</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Zero-knowledge proofs verify your eligibility without revealing sensitive information. 
                Only the proof result is shared on-chain, keeping your personal data completely private.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Score Indicator */}
      {isDetailed && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success">Privacy Score: 100%</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Zero data exposure
          </div>
        </div>
      )}
    </div>
  );
}

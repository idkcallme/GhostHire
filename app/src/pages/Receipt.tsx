import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Copy, ExternalLink, Shield, Clock, FileText, Download, Share2 } from "lucide-react";
import toast from "react-hot-toast";

interface ReceiptDetails {
  transactionHash: string;
  jobId: string;
  jobTitle: string;
  company: string;
  timestamp: Date;
  blockNumber: number;
  gasUsed: string;
  proofHash: string;
  nullifierHash: string;
  privacyScore: number;
  zkProofDetails: {
    circuitId: string;
    publicInputs: Record<string, any>;
    verificationKey: string;
  };
}

export function Receipt() {
  const { hash } = useParams<{ hash: string }>();
  const [receipt, setReceipt] = useState<ReceiptDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching receipt details from blockchain
    const fetchReceipt = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1000)); // Simulate network delay
      
      // Mock receipt data based on hash
      const mockReceipt: ReceiptDetails = {
        transactionHash: hash || "0x1234567890abcdef",
        jobId: "1",
        jobTitle: "Senior Rust Protocol Engineer", 
        company: "ZK Labs",
        timestamp: new Date(),
        blockNumber: 12847293,
        gasUsed: "0.00234 ETH",
        proofHash: "0xproof" + Math.random().toString(16).substring(2, 18),
        nullifierHash: "0xnull" + Math.random().toString(16).substring(2, 18),
        privacyScore: 97,
        zkProofDetails: {
          circuitId: "eligibility_v1.0",
          publicInputs: {
            jobId: "0x" + Math.random().toString(16).substring(2, 18),
            nullifier: "0xnull" + Math.random().toString(16).substring(2, 18),
            eligible: true,
            timestamp: Math.floor(Date.now() / 1000)
          },
          verificationKey: "0xvk" + Math.random().toString(16).substring(2, 32)
        }
      };
      
      setReceipt(mockReceipt);
      setLoading(false);
    };

    fetchReceipt();
  }, [hash]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const downloadReceipt = () => {
    const receiptData = {
      ...receipt,
      downloadedAt: new Date().toISOString(),
      application: "GhostHire - Privacy-Preserving Job Board"
    };
    
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghosthire-receipt-${hash?.substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Receipt downloaded!");
  };

  if (loading) {
    return (
      <div className="section-large flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="body-large">Loading receipt details...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="section-large flex items-center justify-center">
        <div className="card text-center py-12 max-w-md">
          <FileText className="w-12 h-12 mx-auto mb-4" style={{opacity: "0.5"}} />
          <h2 className="h2 mb-4">Receipt Not Found</h2>
          <p className="body-large mb-6" style={{opacity: "0.7"}}>
            The transaction hash provided could not be found.
          </p>
          <Link to="/applications">
            <button className="btn btn-primary">View Applications</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-large">
      <div className="grid-container">
        <div className="content-wide">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{background: "linear-gradient(135deg, var(--success) 0%, var(--primary) 100%)"}}
              >
                <CheckCircle className="w-8 h-8" style={{color: "var(--warm-off-black)"}} />
              </div>
            </div>
            <h1 className="h1 mb-4">Application Confirmed</h1>
            <p className="body-large" style={{opacity: "0.8", maxWidth: "600px", margin: "0 auto"}}>
              Your privacy-preserving application has been successfully submitted to the blockchain.
              <strong style={{color: "var(--warm-off-white)", opacity: "1"}}> Zero personal data was revealed.</strong>
            </p>
          </div>

          {/* Success Status */}
          <div 
            className="card mb-8 p-6"
            style={{background: "var(--success-muted)", border: "1px solid rgba(60, 203, 127, 0.2)"}}
          >
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 mt-1" style={{color: "var(--success)"}} />
              <div className="flex-1">
                <h3 className="h3 mb-2" style={{color: "var(--success)", textTransform: "none"}}>
                  Zero-Knowledge Proof Verified & Recorded
                </h3>
                <p className="body-large" style={{opacity: "0.9"}}>
                  Your eligibility has been cryptographically proven without revealing:
                </p>
                <ul className="list-disc list-inside body-small mt-2 space-y-1" style={{opacity: "0.8"}}>
                  <li>Your exact skill levels or certifications</li>
                  <li>Your precise location or address</li>
                  <li>Your specific salary expectations</li>
                  <li>Any other personal identifying information</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Application Details */}
            <div className="card">
              <h3 className="h3 mb-6" style={{textTransform: "none"}}>Application Details</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="body-small" style={{opacity: "0.7"}}>Job Position:</span>
                  <span className="body-large font-medium text-right">{receipt.jobTitle}</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="body-small" style={{opacity: "0.7"}}>Company:</span>
                  <span className="body-large font-medium">{receipt.company}</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="body-small" style={{opacity: "0.7"}}>Submitted:</span>
                  <span className="body-large font-medium">{receipt.timestamp.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="body-small" style={{opacity: "0.7"}}>Privacy Score:</span>
                  <span className="body-large font-medium" style={{color: "var(--success)"}}>{receipt.privacyScore}%</span>
                </div>
              </div>
            </div>

            {/* Blockchain Details */}
            <div className="card">
              <h3 className="h3 mb-6" style={{textTransform: "none"}}>Blockchain Verification</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="body-small" style={{opacity: "0.7"}}>Transaction Hash:</span>
                    <button 
                      onClick={() => copyToClipboard(receipt.transactionHash, "Transaction hash")}
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <code className="body-small font-mono" style={{opacity: "0.9"}}>
                    {receipt.transactionHash}
                  </code>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="body-small" style={{opacity: "0.7"}}>Block Number:</span>
                  <span className="body-large font-medium">#{receipt.blockNumber.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="body-small" style={{opacity: "0.7"}}>Gas Used:</span>
                  <span className="body-large font-medium">{receipt.gasUsed}</span>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="body-small" style={{opacity: "0.7"}}>Nullifier Hash:</span>
                    <button 
                      onClick={() => copyToClipboard(receipt.nullifierHash, "Nullifier hash")}
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <code className="body-small font-mono" style={{opacity: "0.9"}}>
                    {receipt.nullifierHash}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* ZK Proof Technical Details */}
          <div className="card mt-8">
            <h3 className="h3 mb-6" style={{textTransform: "none"}}>Zero-Knowledge Proof Details</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="body-large font-medium mb-3">Circuit Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="body-small" style={{opacity: "0.7"}}>Circuit ID:</span>
                    <code className="body-small font-mono">{receipt.zkProofDetails.circuitId}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-small" style={{opacity: "0.7"}}>Proof Algorithm:</span>
                    <span className="body-small">Groth16 ZK-SNARK</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-small" style={{opacity: "0.7"}}>Curve:</span>
                    <span className="body-small">BN254</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="body-large font-medium mb-3">Public Inputs</h4>
                <div className="space-y-2">
                  {Object.entries(receipt.zkProofDetails.publicInputs).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="body-small" style={{opacity: "0.7"}}>{key}:</span>
                      <code className="body-small font-mono" style={{opacity: "0.9"}}>
                        {typeof value === 'string' ? value.substring(0, 12) + '...' : String(value)}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center mt-12">
            <button onClick={downloadReceipt} className="btn btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
            
            <button 
              onClick={() => copyToClipboard(window.location.href, "Receipt URL")}
              className="btn btn-ghost flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Receipt
            </button>
            
            <a 
              href={`https://etherscan.io/tx/${receipt.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on Explorer
            </a>
            
            <Link to="/applications">
              <button className="btn btn-primary">View All Applications</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

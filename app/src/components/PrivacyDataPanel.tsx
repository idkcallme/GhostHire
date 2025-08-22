import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  Lock, 
  Unlock, 
  Info, 
  ChevronDown, 
  ChevronRight,
  Check,
  X
} from 'lucide-react';

interface PrivacyDataItem {
  label: string;
  value: any;
  isPrivate: boolean;
  zkProof?: string;
  description: string;
}

interface PrivacyDataPanelProps {
  title: string;
  subtitle?: string;
  data: PrivacyDataItem[];
  privacyScore: number;
  className?: string;
}

export const PrivacyDataPanel: React.FC<PrivacyDataPanelProps> = ({
  title,
  subtitle,
  data,
  privacyScore,
  className = ''
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showDetails, setShowDetails] = useState(false);

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const getPrivacyScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getPrivacyScoreIcon = (score: number) => {
    if (score >= 90) return <Shield className="w-5 h-5" aria-hidden="true" />;
    if (score >= 70) return <Eye className="w-5 h-5" aria-hidden="true" />;
    return <EyeOff className="w-5 h-5" aria-hidden="true" />;
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}
      role="region"
      aria-labelledby={`privacy-panel-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <h3 
              id={`privacy-panel-${title.replace(/\s+/g, '-').toLowerCase()}`}
              className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
            >
              <Lock className="w-5 h-5 text-blue-600" aria-hidden="true" />
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Privacy Score Badge */}
          <div className={`px-3 py-2 rounded-lg border font-medium text-sm flex items-center gap-2 ${getPrivacyScoreColor(privacyScore)}`}>
            {getPrivacyScoreIcon(privacyScore)}
            <span aria-label={`Privacy score: ${privacyScore} percent`}>
              {privacyScore}% Private
            </span>
          </div>
        </div>
        
        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          aria-expanded={showDetails}
          aria-controls="privacy-details"
        >
          {showDetails ? (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          )}
          {showDetails ? 'Hide' : 'Show'} Privacy Details
        </button>
      </div>

      {/* Privacy Details */}
      {showDetails && (
        <div id="privacy-details" className="p-6 space-y-4">
          {/* Privacy Explanation */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="text-sm">
                <p className="text-blue-900 dark:text-blue-100 font-medium mb-1">
                  How Privacy Protection Works
                </p>
                <p className="text-blue-800 dark:text-blue-200">
                  Zero-knowledge proofs allow you to prove you meet job requirements without revealing your exact data. 
                  Private information is never stored or transmitted - only cryptographic proofs of eligibility.
                </p>
              </div>
            </div>
          </div>

          {/* Data Items */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Data Privacy Breakdown
            </h4>
            
            {data.map((item, index) => (
              <div 
                key={item.label}
                className="border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                {/* Item Header */}
                <button
                  onClick={() => toggleExpanded(item.label)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg"
                  aria-expanded={expandedItems.has(item.label)}
                  aria-controls={`privacy-item-${index}`}
                >
                  <div className="flex items-center gap-3">
                    {item.isPrivate ? (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Lock className="w-4 h-4" aria-hidden="true" />
                        <span className="text-sm font-medium">Private</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                        <Unlock className="w-4 h-4" aria-hidden="true" />
                        <span className="text-sm font-medium">Revealed</span>
                      </div>
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.isPrivate ? (
                      <Check className="w-4 h-4 text-green-600" aria-hidden="true" />
                    ) : (
                      <X className="w-4 h-4 text-orange-600" aria-hidden="true" />
                    )}
                    {expandedItems.has(item.label) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
                    )}
                  </div>
                </button>

                {/* Item Details */}
                {expandedItems.has(item.label) && (
                  <div 
                    id={`privacy-item-${index}`}
                    className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600"
                  >
                    <div className="pt-4 space-y-3">
                      {/* Description */}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                      
                      {/* Value Display */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {item.isPrivate ? 'Proof Generated' : 'Value'}:
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white font-mono">
                          {item.isPrivate ? (
                            <span className="text-green-600 dark:text-green-400">
                              ✓ ZK Proof Created
                            </span>
                          ) : (
                            String(item.value)
                          )}
                        </span>
                      </div>

                      {/* ZK Proof Hash */}
                      {item.isPrivate && item.zkProof && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                                ZK Proof Hash
                              </p>
                              <p className="text-xs font-mono text-blue-800 dark:text-blue-200 break-all">
                                {item.zkProof}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Privacy Impact */}
                      <div className={`p-3 rounded-lg border ${
                        item.isPrivate 
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                          : 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
                      }`}>
                        <p className={`text-xs font-medium ${
                          item.isPrivate 
                            ? 'text-green-900 dark:text-green-100' 
                            : 'text-orange-900 dark:text-orange-100'
                        }`}>
                          Privacy Impact:
                        </p>
                        <p className={`text-xs mt-1 ${
                          item.isPrivate 
                            ? 'text-green-800 dark:text-green-200' 
                            : 'text-orange-800 dark:text-orange-200'
                        }`}>
                          {item.isPrivate 
                            ? 'Your exact data remains completely private. Only proof of eligibility is shared.'
                            : 'This information is visible to employers and affects your privacy score.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Privacy Score Explanation */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
              Privacy Score Calculation
            </h5>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Private data points:</span>
                <span className="font-medium">{data.filter(item => item.isPrivate).length}/{data.length}</span>
              </div>
              <div className="flex justify-between">
                <span>ZK proofs generated:</span>
                <span className="font-medium">{data.filter(item => item.isPrivate && item.zkProof).length}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="font-medium">Privacy Score:</span>
                <span className={`font-bold ${
                  privacyScore >= 90 ? 'text-green-600' : 
                  privacyScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {privacyScore}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyDataPanel;

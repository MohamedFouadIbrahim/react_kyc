import React from 'react';
import { CheckCircle, Download, RotateCcw } from 'lucide-react';

interface CompletionScreenProps {
  onReset: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onReset }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Verification Complete</h2>
              <p className="text-green-100 mt-1">Your documents have been successfully submitted</p>
            </div>
          </div>
        </div>

        <div className="p-8 text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-600 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thank you for your submission!
            </h3>
            <p className="text-gray-600 text-lg">
              Your KYC verification is now under review
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid gap-4 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Passport Document</span>
                </div>
                <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  Uploaded
                </span>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Identity Photo</span>
                </div>
                <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  Captured
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h4 className="font-semibold text-blue-900 mb-3">What happens next?</h4>
            <div className="text-left space-y-2">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-800">1</span>
                </div>
                <p className="text-blue-800">Our team will review your documents within 24-48 hours</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-800">2</span>
                </div>
                <p className="text-blue-800">You'll receive an email notification once verification is complete</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-800">3</span>
                </div>
                <p className="text-blue-800">Your account will be activated for full access</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onReset}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Start Over</span>
            </button>
            
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Download Receipt</span>
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                support@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
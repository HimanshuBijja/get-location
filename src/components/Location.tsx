'use client';

import { BadgeAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LocationFetcher({handleRetryLocation}: {handleRetryLocation: () => void}) {
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                            <BadgeAlert color="red"/>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Permission Required
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={handleRetryLocation}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Click Here
                            </button>
                        </div>
                        <div className="mt-4 text-xs text-gray-400">
                            <p>If you previously denied browser permission:</p>
                            <p>• Select "Allow" and refresh the page</p>
                        </div>
                    </div>
                </div>
            </div>
  );
}

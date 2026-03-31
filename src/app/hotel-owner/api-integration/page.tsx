'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../lib/store';
import Link from 'next/link';
import AuthGuard from '../../../components/AuthGuard';

export default function APIIntegrationPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks' | 'documentation'>('keys');

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-2xl font-bold text-indigo-600">
                  HotelHub
                </Link>
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="/hotel-owner" 
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user?.name || 'Hotel Owner'}!
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Hotel Owner
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-8">
              <Link 
                href="/hotel-owner" 
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-4">API Integration</h1>
              <p className="text-gray-600 mt-2">Manage your API keys, webhooks, and access documentation</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8" role="tablist" aria-label="API integration sections">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('keys')}
                  role="tab"
                  aria-selected={activeTab === 'keys'}
                  aria-controls="keys-panel"
                  id="keys-tab"
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded ${
                    activeTab === 'keys'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  API Keys
                </button>
                <button
                  onClick={() => setActiveTab('webhooks')}
                  role="tab"
                  aria-selected={activeTab === 'webhooks'}
                  aria-controls="webhooks-panel"
                  id="webhooks-tab"
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded ${
                    activeTab === 'webhooks'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Webhooks
                </button>
                <button
                  onClick={() => setActiveTab('documentation')}
                  role="tab"
                  aria-selected={activeTab === 'documentation'}
                  aria-controls="documentation-panel"
                  id="documentation-tab"
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded ${
                    activeTab === 'documentation'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Documentation
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'keys' && (
              <div 
                role="tabpanel" 
                id="keys-panel" 
                aria-labelledby="keys-tab"
                tabIndex={0}
                className="space-y-6"
              >
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                      Generate New Key
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">Production API Key</h3>
                          <p className="text-sm text-gray-500">Created: March 15, 2024</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                        hk_prod_1234567890abcdef...
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                          Copy Key
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Revoke
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">Development API Key</h3>
                          <p className="text-sm text-gray-500">Created: March 10, 2024</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                        hk_dev_0987654321fedcba...
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                          Copy Key
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Revoke
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">API Usage</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700 font-medium">Requests this month</p>
                        <p className="text-2xl font-bold text-blue-900">1,234</p>
                      </div>
                      <div>
                        <p className="text-blue-700 font-medium">Rate limit</p>
                        <p className="text-2xl font-bold text-blue-900">10,000</p>
                      </div>
                      <div>
                        <p className="text-blue-700 font-medium">Reset date</p>
                        <p className="text-2xl font-bold text-blue-900">Apr 1</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'webhooks' && (
              <div 
                role="tabpanel" 
                id="webhooks-panel" 
                aria-labelledby="webhooks-tab"
                tabIndex={0}
                className="space-y-6"
              >
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Webhook Configuration</h2>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                      Add Webhook
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">Booking Created</h3>
                          <p className="text-sm text-gray-500">Triggered when a new booking is created</p>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                            Active
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
                          <input
                            type="url"
                            value="https://yourapp.com/webhooks/booking-created"
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                          />
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input type="checkbox" checked readOnly className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            <span className="ml-2 text-sm text-gray-700">Active</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" checked readOnly className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            <span className="ml-2 text-sm text-gray-700">Include full booking data</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">Booking Updated</h3>
                          <p className="text-sm text-gray-500">Triggered when a booking status changes</p>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                            Inactive
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
                          <input
                            type="url"
                            value=""
                            placeholder="https://yourapp.com/webhooks/booking-updated"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
                          />
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            <span className="ml-2 text-sm text-gray-700">Active</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-medium text-yellow-900 mb-2">Recent Webhook Events</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-yellow-200">
                        <span className="font-medium">Booking Created - #12345</span>
                        <span className="text-green-600">Success</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-yellow-200">
                        <span className="font-medium">Booking Created - #12344</span>
                        <span className="text-green-600">Success</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium">Booking Updated - #12343</span>
                        <span className="text-red-600">Failed (3 retries)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documentation' && (
              <div 
                role="tabpanel" 
                id="documentation-panel" 
                aria-labelledby="documentation-tab"
                tabIndex={0}
                className="space-y-6"
              >
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">API Documentation</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Getting Started</h3>
                      <div className="prose max-w-none">
                        <p className="text-gray-600 mb-4">
                          The HotelHub API allows you to integrate hotel booking functionality into your applications. 
                          Use your API keys to authenticate requests and manage hotels, rooms, and bookings programmatically.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Authentication</h4>
                          <p className="text-sm text-gray-600 mb-2">Include your API key in the Authorization header:</p>
                          <code className="block bg-gray-800 text-white p-3 rounded text-sm">
                            Authorization: Bearer YOUR_API_KEY
                          </code>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Available Endpoints</h3>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Hotels</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li><code className="bg-gray-100 px-1 rounded">GET /api/hotels</code> - List all hotels</li>
                            <li><code className="bg-gray-100 px-1 rounded">POST /api/hotels</code> - Create new hotel</li>
                            <li><code className="bg-gray-100 px-1 rounded">GET /api/hotels/:id</code> - Get hotel details</li>
                            <li><code className="bg-gray-100 px-1 rounded">PUT /api/hotels/:id</code> - Update hotel</li>
                            <li><code className="bg-gray-100 px-1 rounded">DELETE /api/hotels/:id</code> - Delete hotel</li>
                          </ul>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Bookings</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li><code className="bg-gray-100 px-1 rounded">GET /api/bookings</code> - List bookings</li>
                            <li><code className="bg-gray-100 px-1 rounded">POST /api/bookings</code> - Create booking</li>
                            <li><code className="bg-gray-100 px-1 rounded">GET /api/bookings/:id</code> - Get booking details</li>
                            <li><code className="bg-gray-100 px-1 rounded">PUT /api/bookings/:id</code> - Update booking</li>
                          </ul>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Room Types</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li><code className="bg-gray-100 px-1 rounded">GET /api/room-types</code> - List room types</li>
                            <li><code className="bg-gray-100 px-1 rounded">POST /api/room-types</code> - Create room type</li>
                            <li><code className="bg-gray-100 px-1 rounded">PUT /api/room-types/:id</code> - Update room type</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                      <h3 className="font-medium text-indigo-900 mb-3">Need Help?</h3>
                      <p className="text-indigo-700 mb-4">
                        Check out our comprehensive API documentation for detailed examples, 
                        error codes, and best practices.
                      </p>
                      <div className="flex space-x-4">
                        <a 
                          href="#" 
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          View Full Documentation
                          <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a 
                          href="#" 
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          API Reference
                          <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

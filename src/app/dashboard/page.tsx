'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '../../lib/store';
import { logout } from '../../lib/slices/authSlice';
import Link from 'next/link';
import AuthGuard from '../../components/AuthGuard';
import HotelSearch from '../../components/hotel/HotelSearch';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

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
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.name || 'User'}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Your Dashboard
            </h1>
            <p className="text-xl text-gray-700">
              Find and book your perfect hotel from our curated selection
            </p>
          </div>

          {/* Hotel Search Component */}
          <HotelSearch />

          {/* Additional Dashboard Sections */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Bookings</h2>
              <p className="text-gray-700">View and manage your hotel bookings</p>
              <Link 
                href="/bookings" 
                className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              >
                View Bookings
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
              <p className="text-gray-700">Manage your account settings and preferences</p>
              <button className="mt-4 bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AuthGuard>
  );
}

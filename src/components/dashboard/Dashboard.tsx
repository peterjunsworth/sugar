'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

interface SyncStatus {
  cgmProvider: string | null;
  isConnected: boolean;
  totalReadings: number;
  latestReading: {
    timestamp: string;
    value: number;
    trend?: string;
  } | null;
}

export default function Dashboard() {
  const { token, user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showCGMSetup, setShowCGMSetup] = useState(false);

  useEffect(() => {
    loadSyncStatus();
  }, []);

  const loadSyncStatus = async () => {
    if (!token) return;

    try {
      const response = await axios.get('/api/cgm/sync', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSyncStatus(response.data);
    } catch (error) {
      console.error('Failed to load sync status:', error);
    }
  };

  const syncCGMData = async () => {
    if (!token) return;

    setIsSyncing(true);
    try {
      const response = await axios.post(
        '/api/cgm/sync',
        { daysBack: 7 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Successfully synced ${response.data.readingsCount} glucose readings!`);
      loadSyncStatus();
    } catch (error) {
      console.error('Failed to sync CGM data:', error);
      alert('Failed to sync CGM data. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const connectDexcom = async () => {
    if (!token) return;

    try {
      const response = await axios.get('/api/cgm/dexcom', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Open OAuth URL in new window
      window.open(response.data.authUrl, '_blank', 'width=600,height=700');
    } catch (error) {
      console.error('Failed to connect Dexcom:', error);
      alert('Failed to initiate Dexcom connection.');
    }
  };

  const connectEversense = async () => {
    if (!token) return;

    try {
      const response = await axios.get('/api/cgm/eversense', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Open OAuth URL in new window
      window.open(response.data.authUrl, '_blank', 'width=600,height=700');
    } catch (error) {
      console.error('Failed to connect Eversense:', error);
      alert('Failed to initiate Eversense connection.');
    }
  };

  const connectLibre = async () => {
    const email = prompt('Enter your LibreView email:');
    const password = prompt('Enter your LibreView password:');

    if (!email || !password || !token) return;

    try {
      await axios.post(
        '/api/cgm/libre',
        { email, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Successfully connected to LibreView!');
      loadSyncStatus();
    } catch (error) {
      console.error('Failed to connect LibreView:', error);
      alert('Failed to connect to LibreView. Please check your credentials.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome, {user?.name}!</h2>

        {/* CGM Status */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">CGM Connection</h3>

          {syncStatus?.isConnected ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium mb-2">
                Connected to {syncStatus.cgmProvider?.toUpperCase()}
              </p>
              <p className="text-sm text-green-700">
                Total readings: {syncStatus.totalReadings}
              </p>
              {syncStatus.latestReading && (
                <p className="text-sm text-green-700">
                  Latest reading: {syncStatus.latestReading.value} mg/dL at{' '}
                  {new Date(syncStatus.latestReading.timestamp).toLocaleString()}
                </p>
              )}
              <button
                onClick={syncCGMData}
                disabled={isSyncing}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition"
              >
                {isSyncing ? 'Syncing...' : 'Sync Data'}
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 mb-3">No CGM connected</p>
              <button
                onClick={() => setShowCGMSetup(!showCGMSetup)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {showCGMSetup ? 'Hide' : 'Connect CGM'}
              </button>

              {showCGMSetup && (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={connectDexcom}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-900"
                  >
                    Connect Dexcom
                  </button>
                  <button
                    onClick={connectLibre}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-900"
                  >
                    Connect Freestyle Libre
                  </button>
                  <button
                    onClick={connectEversense}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-900"
                  >
                    Connect Eversense
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Glucose Readings</p>
            <p className="text-2xl font-bold text-blue-900">
              {syncStatus?.totalReadings || 0}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">Latest Reading</p>
            <p className="text-2xl font-bold text-purple-900">
              {syncStatus?.latestReading?.value || '--'} mg/dL
            </p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-sm text-indigo-600 font-medium">CGM Status</p>
            <p className="text-2xl font-bold text-indigo-900">
              {syncStatus?.isConnected ? 'Active' : 'Not Connected'}
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Started</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">1.</span>
            <span>Connect your CGM device to automatically sync glucose readings</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">2.</span>
            <span>Use the chat to log meals, insulin doses, exercise, and other activities</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">3.</span>
            <span>Ask the chatbot questions like "What should I do before eating pizza?"</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">4.</span>
            <span>The more data you provide, the better the insights will become</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

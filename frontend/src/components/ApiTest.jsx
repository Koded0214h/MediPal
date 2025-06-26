import React, { useState, useEffect } from 'react';
import { testApiConnection } from '../utils/api';

const ApiTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('Testing connection...');
      const result = await testApiConnection();
      
      if (result.success) {
        setConnectionStatus('✅ Connected to Django Backend!');
        setApiResponse(result.data);
      } else {
        setConnectionStatus('❌ Connection failed');
        setApiResponse(result.error);
      }
    } catch (error) {
      setConnectionStatus('❌ Connection failed');
      setApiResponse(error.message);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      <div className="mb-4">
        <p className="font-semibold">Status: {connectionStatus}</p>
      </div>
      
      {apiResponse && (
        <div className="mb-4">
          <p className="font-semibold">Response:</p>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
      
      <button
        onClick={testConnection}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Test Connection Again
      </button>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Backend: http://localhost:8000</p>
        <p>Frontend: http://localhost:5173</p>
      </div>
    </div>
  );
};

export default ApiTest; 
'use client';

import React, { useState, useEffect } from 'react';
import { SheetClient } from '../lib/sheet-client';

interface SheetRow {
  StoreName: string;
  Date: string;
  Profit: string;
  _id: string;
  _rowIndex: number;
}

export default function App() {
  const [data, setData] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [newRow, setNewRow] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const client = new SheetClient();
      const result = await client.getAllData();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = async () => {
    try {
      const client = new SheetClient();
      const result = await client.addRow(newRow);

      if (result.success) {
        setNewRow({});
        await loadData(); // Refresh data
      } else {
        setError(result.error || 'Failed to add row');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add row');
    }
  };

  const handleUpdateField = async (rowId: string, field: string, newValue: string) => {
    try {
      const client = new SheetClient();
      const result = await client.updateField({
        identifier: rowId,
        field: field,
        newValue: newValue
      });

      if (result.success) {
        await loadData(); // Refresh data
      } else {
        setError(result.error || 'Failed to update field');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update field');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading Daily Profits App...</h2>
          <p className="text-gray-600">Connecting to Google Sheets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Daily Profits App
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build a React app for the Google Sheet: "Daily Profits"

SHEET STRUCTURE:
- Headers: StoreName, Date, Profit
- Total rows: 9
- Columns: 3

SAMPLE DATA (first 5 rows):
1. StoreName: "Canberra" | Date: "08/08/25" | Profit: "18000"
2. StoreName: "Melbourne - 1" | Date: "09/08/25" | Profit: "25000"
3. StoreName: "Brisbane" | Date: "08/09/25" | Profit: "30000"
4. StoreName: "Test Store" | Date: "09/04/25" | Profit: "15000"
5. StoreName: "Test 1" | Date: "09/04/25" | Profit: "75000"

SHEETCLIENT API DOCUMENTATION:
The SheetClient must be instantiated before use: `const client = new SheetClient();`

AVAILABLE METHODS:

1. **getAllData()**
   - Input: None
   - Output: Promise<SheetRow[]> - Returns array of row objects with named properties
   - Example: `const data = await client.getAllData();`
   - Returns: `[{ StoreName: "value", Date: "value", Profit: "value", _id: "...", _rowIndex: 1 }, ...]`

2. **addRow(data)**
   - Input: Record<string, any> - Object with field names as keys
   - Output: Promise<ApiResponse> - Returns {success: boolean, error?: string}
   - Example: `await client.addRow({StoreName: "value", Date: "value", Profit: "value"})`

3. **updateField(params)**
   - Input: UpdateOperation object {identifier, field, newValue, oldValue?}
   - Output: Promise<ApiResponse> - Returns {success: boolean, error?: string}
   - Example: `await client.updateField({identifier: "John", field: "Profit", newValue: "Yes"})`

4. **search(query)**
   - Input: SearchQuery object {field?, value?, operator?}
   - Output: Promise<SheetRow[]> - Returns matching row objects
   - Example: `await client.search({value: "search term", operator: "contains"})`

5. **getRowById(identifier)**
   - Input: string | number - Row identifier
   - Output: Promise<SheetRow | null> - Returns single row object or null
   - Example: `await client.getRowById("identifier")`

IMPORTANT API CONSTRAINTS:
- DELETE operations are NOT available - rows cannot be deleted via API
- UPDATE operations work on individual fields, not entire rows
- All methods return objects with named properties, NOT arrays
- Must instantiate SheetClient: `const client = new SheetClient()`
- API responses use {success: boolean, error?: string} format
- Row objects include _id and _rowIndex metadata fields

EFFICIENT API USAGE (RATE LIMIT CONSIDERATIONS):
- Call getAllData() once on component mount and cache results
- Use local state updates for immediate UI feedback
- Only call API methods for actual persistence
- Implement optimistic updates where possible
- Use the built-in 30-second cache in SheetClient
- Batch multiple operations when possible

DATA STRUCTURE:
```typescript
interface SheetRow {
  StoreName: string;
  Date: string;
  Profit: string;
  _id: string;
  _rowIndex: number;
}

interface ApiResponse {
  success: boolean;
  error?: string;
}
```

USAGE NOTES:
- Always handle async operations with try/catch blocks
- The SheetClient automatically handles authentication and sheet connection
- All methods return Promises - use await or .then()
- Data is returned as objects with named properties for easy access
- Handle ApiResponse.success to check operation results

AVAILABLE DEPENDENCIES:
- react, { useState, useEffect }
- lucide-react (for icons: Search, Plus, Edit, Trash2, Save, X, etc.)
- SheetClient from './api/client' (pre-configured, must be instantiated)

REQUIREMENTS:
- Create a modern, responsive UI using the CORRECT SheetClient API
- Handle the fact that delete operations are not available
- Use proper object destructuring for row data
- Implement proper error handling for API responses
- Show user-friendly messages when operations succeed/fail
- Use Tailwind CSS for clean, professional styling
- Include proper loading states and error handling
- Add data visualization if appropriate for the data type
- IMPORTANT: Only modify App.tsx, do not change any API configuration files
- The SheetClient API is pre-configured and requires instantiation

TECHNICAL REQUIREMENTS:
- Use TypeScript with proper interfaces
- Implement proper error boundaries
- Add form validation for user inputs
- Include success/error notifications
- Make it mobile responsive with mobile-first design
- Add loading spinners during API calls
- Use React hooks (useState, useEffect) for state management

MOBILE & VISUAL REQUIREMENTS:
- Design for mobile app format - touch-friendly buttons, proper spacing
- Add charts and visualizations where appropriate using simple CSS/SVG or canvas
- Include summary cards with key metrics
- Use responsive grid layouts that work on phones
- Add smooth animations and transitions
- Include data visualization charts (bar charts, pie charts, progress indicators)
- Make buttons large enough for mobile touch (min 44px height)
- Use mobile-optimized forms with proper input types

Add charts and visuals where possible and make sure it's usable in mobile app format with touch-friendly interface.

Make the interface intuitive and user-friendly for managing this specific type of data with beautiful visualizations and mobile-optimized design.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>📊 {data.length} records</span>
            <span>🔄 Live sync enabled</span>
            <span>🚀 Powered by SheetApps</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span className="text-red-800">{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Add New Row Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Record</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                StoreName
              </label>
              <input
                type="text"
                value={newRow['StoreName'] || ''}
                onChange={(e) => setNewRow(prev => ({ ...prev, 'StoreName': e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter storename"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="text"
                value={newRow['Date'] || ''}
                onChange={(e) => setNewRow(prev => ({ ...prev, 'Date': e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter date"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profit
              </label>
              <input
                type="text"
                value={newRow['Profit'] || ''}
                onChange={(e) => setNewRow(prev => ({ ...prev, 'Profit': e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter profit"
              />
            </div>
            
          </div>
          <button
            onClick={handleAddRow}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Add Record
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Data Records</h2>
          </div>

          {data.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📄</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
              <p className="text-gray-600">Add your first record using the form above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      StoreName
                    </th>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit
                    </th>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((row, index) => (
                    <tr key={row._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newValue = e.currentTarget.textContent || '';
                            if (newValue !== row['StoreName']) {
                              handleUpdateField(row._id, 'StoreName', newValue);
                            }
                          }}
                          className="hover:bg-blue-50 px-2 py-1 rounded cursor-text"
                        >
                          {row['StoreName']}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newValue = e.currentTarget.textContent || '';
                            if (newValue !== row['Date']) {
                              handleUpdateField(row._id, 'Date', newValue);
                            }
                          }}
                          className="hover:bg-blue-50 px-2 py-1 rounded cursor-text"
                        >
                          {row['Date']}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newValue = e.currentTarget.textContent || '';
                            if (newValue !== row['Profit']) {
                              handleUpdateField(row._id, 'Profit', newValue);
                            }
                          }}
                          className="hover:bg-blue-50 px-2 py-1 rounded cursor-text"
                        >
                          {row['Profit']}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Row {row._rowIndex}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Built with ❤️ by <strong>SheetApps</strong> •
            <a href="https://sheetapps.com" className="text-blue-600 hover:text-blue-800 ml-1">
              Create your own app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
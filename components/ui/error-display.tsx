interface ErrorDisplayProps {
  error: string | null;
  isOffline: boolean;
}

export const ErrorDisplay = ({ error, isOffline }: ErrorDisplayProps) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center max-w-md mx-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
        <h2 className="text-lg font-semibold text-red-700 mb-2">
          {isOffline ? 'You are offline' : 'Error Loading Data'}
        </h2>
        <p className="text-red-600">
          {error || 'Please check your internet connection and try again.'}
        </p>
      </div>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  </div>
); 
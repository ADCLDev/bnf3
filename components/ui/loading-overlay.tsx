export const LoadingOverlay = () => (
  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
      <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
    </div>
  </div>
); 
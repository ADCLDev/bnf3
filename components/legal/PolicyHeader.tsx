// components/legal/PolicyHeader

const PolicyHeader = ({ 
  title, 
  description,
  icon: Icon 
}: { 
  title: string; 
  description: string;
  icon: React.ElementType;
}) => (
  <div className="text-center max-w-3xl mx-auto mb-16">
    <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
      <Icon className="w-8 h-8 text-purple-700" />
    </div>
    <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-6">
      {title}
    </h1>
    <p className="text-xl text-gray-600 leading-relaxed">
      {description}
    </p>
  </div>
);

export default PolicyHeader;
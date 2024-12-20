// components/legal/PolicySection

const PolicySection = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
    <div className="prose prose-lg max-w-none text-gray-600">
      {children}
    </div>
  </div>
);

export default PolicySection;
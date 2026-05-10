const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
    <div className="skeleton h-48 w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-4/5" />
      <div className="flex justify-between mt-4">
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-4 w-12" />
      </div>
    </div>
  </div>
);

const Loader = ({ count = 6 }) => (
  <div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    aria-busy="true"
    aria-label="Loading institutes..."
    role="status"
  >
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default Loader;

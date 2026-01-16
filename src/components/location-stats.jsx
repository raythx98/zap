
export default function Location({countries}) {
  if (!countries || countries.length === 0) return null;

  // Sort by count descending
  const sortedCountries = [...countries].sort((a, b) => b.count - a.count);
  const total = sortedCountries.reduce((acc, item) => acc + item.count, 0);
  const topCountries = sortedCountries.slice(0, 5);
  const otherCount = sortedCountries.length - 5;

  return (
    <div className="flex flex-col gap-4 w-full">
      {topCountries.map((item, index) => {
        const percentage = ((item.count / total) * 100).toFixed(0);
        return (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-gray-300">{item.country}</span>
              <span className="text-gray-500">{item.count} clicks ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-800 rounded-md h-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-md transition-all duration-500" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
      {otherCount > 0 && (
        <p className="text-xs text-gray-500 font-medium italic mt-1">
          & {otherCount} other{otherCount > 1 ? 's' : ''}...
        </p>
      )}
    </div>
  );
}
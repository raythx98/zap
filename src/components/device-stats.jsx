/* eslint-disable react/prop-types */

export default function DeviceStats({devices}) {
  if (!devices || devices.length === 0) return null;

  const total = devices.reduce((acc, item) => acc + item.count, 0);
  const topDevices = devices.slice(0, 5);
  const otherCount = devices.length - 5;

  return (
    <div className="flex flex-col gap-4 w-full">
      {topDevices.map((item, index) => {
        const percentage = ((item.count / total) * 100).toFixed(0);
        return (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="capitalize text-gray-300">{item.device}</span>
              <span className="text-gray-500">{item.count} clicks ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-green-500 h-full rounded-full transition-all duration-500" 
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
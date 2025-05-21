import React from 'react';

// Simple mock chart components for the demo
// In a real app, you would use a proper chart library like Chart.js or Recharts

interface ChartProps {
  data: any;
  height?: number;
  options?: any;
}

export function BarChart({ data, height = 300, options = {} }: ChartProps) {
  return (
    <div style={{ height: `${height}px` }} className="p-4 bg-gray-50 rounded-lg flex items-end justify-around">
      {data.labels.map((label: string, index: number) => {
        const value = data.datasets[0].data[index];
        const maxValue = Math.max(...data.datasets[0].data);
        const barHeight = (value / maxValue) * 80; // 80% of the container height
        
        return (
          <div key={label} className="flex flex-col items-center">
            <div 
              className="w-12 bg-blue-500 rounded-t-md" 
              style={{ height: `${barHeight}%` }}
            />
            <div className="text-xs mt-2 text-center">{label}</div>
          </div>
        );
      })}
    </div>
  );
}

export function LineChart({ data, height = 300, options = {} }: ChartProps) {
  return (
    <div style={{ height: `${height}px` }} className="p-4 bg-gray-50 rounded-lg flex flex-col justify-between">
      <div className="h-full flex items-end">
        {data.labels.map((label: string, index: number) => {
          const value = data.datasets[0].data[index];
          const maxValue = Math.max(...data.datasets[0].data);
          const dotHeight = (value / maxValue) * 80; // 80% of the container height
          
          return (
            <div key={label} className="flex-1 flex flex-col items-center justify-end h-full">
              <div className="relative">
                <div 
                  className="absolute bottom-0 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"
                  style={{ bottom: `${dotHeight}%` }}
                />
              </div>
              {index > 0 && (
                <div className="h-px bg-blue-200 w-full" style={{ marginBottom: `${dotHeight}%` }} />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-4">
        {data.labels.map((label: string) => (
          <div key={label} className="text-xs">{label}</div>
        ))}
      </div>
    </div>
  );
}

export function PieChart({ data, height = 300, options = {} }: ChartProps) {
  return (
    <div style={{ height: `${height}px` }} className="p-4 bg-gray-50 rounded-lg flex items-center justify-center">
      <div className="relative w-32 h-32 rounded-full overflow-hidden">
        {data.labels.map((label: string, index: number) => {
          const value = data.datasets[0].data[index];
          const totalValue = data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
          const percentage = (value / totalValue) * 100;
          
          return (
            <div 
              key={label}
              className="absolute inset-0"
              style={{ 
                backgroundColor: data.datasets[0].backgroundColor[index] || '#3b82f6',
                clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.cos((percentage / 100) * Math.PI * 2)}% ${50 + 50 * Math.sin((percentage / 100) * Math.PI * 2)}%)`,
                transform: `rotate(${index * 45}deg)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function DonutChart({ data, height = 300, options = {} }: ChartProps) {
  return (
    <div style={{ height: `${height}px` }} className="p-4 bg-gray-50 rounded-lg flex flex-col items-center justify-center">
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white flex items-center justify-center">
        <div className="absolute inset-0">
          {data.labels.map((label: string, index: number) => {
            const value = data.datasets[0].data[index];
            const totalValue = data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = (value / totalValue) * 100;
            
            return (
              <div 
                key={label}
                className="absolute inset-2" // To create the donut hole
                style={{ 
                  backgroundColor: data.datasets[0].backgroundColor[index] || '#3b82f6',
                  clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.cos((percentage / 100) * Math.PI * 2)}% ${50 + 50 * Math.sin((percentage / 100) * Math.PI * 2)}%)`,
                  transform: `rotate(${index * 45}deg)`,
                }}
              />
            );
          })}
        </div>
        <div className="w-16 h-16 bg-white rounded-full z-10"></div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {data.labels.map((label: string, index: number) => (
          <div key={label} className="flex items-center text-xs">
            <div 
              className="w-3 h-3 mr-1 rounded-full" 
              style={{ backgroundColor: data.datasets[0].backgroundColor[index] || '#3b82f6' }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AreaChart({ data, height = 300, options = {} }: ChartProps) {
  return (
    <div style={{ height: `${height}px` }} className="p-4 bg-gray-50 rounded-lg flex flex-col justify-between">
      <div className="h-full flex items-end">
        {data.labels.map((label: string, index: number) => {
          const value = data.datasets[0].data[index];
          const maxValue = Math.max(...data.datasets[0].data);
          const areaHeight = (value / maxValue) * 80; // 80% of the container height
          
          return (
            <div key={label} className="flex-1 flex flex-col items-center justify-end h-full">
              <div 
                className="w-full bg-purple-200" 
                style={{ height: `${areaHeight}%` }}
              />
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-4">
        {data.labels.map((label: string) => (
          <div key={label} className="text-xs">{label}</div>
        ))}
      </div>
    </div>
  );
}
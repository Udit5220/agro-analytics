import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { BarChart2, CandlestickChart, TrendingUp, Layers } from 'lucide-react';

const generateData = () => {
  const data = [];
  let time = new Date('2024-01-01').getTime();
  let basePrice = 2000;
  for (let i = 0; i < 100; i++) {
    const open = basePrice + Math.random() * 50 - 25;
    const high = open + Math.random() * 40;
    const low = open - Math.random() * 40;
    const close = low + Math.random() * (high - low);
    const volume = Math.floor(Math.random() * 5000) + 1000;
    data.push({
      time: time / 1000,
      open, high, low, close, value: close, volume
    });
    time += 86400000; // +1 day
    basePrice = close;
  }
  return data;
};

export default function AdvancedCharts() {
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);
  const seriesInstance = useRef(null);
  const volumeSeriesInstance = useRef(null);
  
  const [chartType, setChartType] = useState('candlestick');

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: '#0f172a' },
        textColor: '#64748b',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      timeScale: {
        borderColor: '#334155',
      },
      rightPriceScale: {
        borderColor: '#334155',
      },
    });

    chartInstance.current = chart;
    const data = generateData();

    // Volume Series
    const volumeSeries = chart.addHistogramSeries({
      color: '#334155',
      priceFormat: { type: 'volume' },
      priceScaleId: '', // set as an overlay
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volumeSeries.setData(data.map(d => ({ 
      time: d.time, 
      value: d.volume, 
      color: d.close > d.open ? '#10b98140' : '#ef444440' 
    })));
    volumeSeriesInstance.current = volumeSeries;

    // Price Series
    if (chartType === 'candlestick') {
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#10b981', downColor: '#ef4444', 
        borderVisible: false,
        wickUpColor: '#10b981', wickDownColor: '#ef4444'
      });
      candlestickSeries.setData(data);
      seriesInstance.current = candlestickSeries;
    } else if (chartType === 'line') {
      const lineSeries = chart.addLineSeries({
        color: '#3b82f6', lineWidth: 2,
      });
      lineSeries.setData(data.map(d => ({ time: d.time, value: d.close })));
      seriesInstance.current = lineSeries;
    }

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [chartType]);

  return (
    <div className="space-y-4 animate-fadeIn h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white">Advanced Interactive Charts</h2>
          <p className="text-sm text-slate-400 mt-1">Professional grade charting tools for deep technical analysis.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[#1e293b] rounded p-1">
            <button 
              onClick={() => setChartType('candlestick')}
              className={`px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-2 ${chartType === 'candlestick' ? 'bg-[#334155] text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <CandlestickChart className="h-4 w-4" /> Candlestick
            </button>
            <button 
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-2 ${chartType === 'line' ? 'bg-[#334155] text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <TrendingUp className="h-4 w-4" /> Line
            </button>
          </div>

          <div className="flex bg-[#1e293b] rounded p-1">
            {['1D', '1W', '1M', '3M', '6M', '1Y'].map(tf => (
              <button key={tf} className="px-3 py-1.5 rounded text-sm font-medium text-slate-400 hover:text-white hover:bg-[#334155] transition-colors">
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#0f172a] border border-[#334155] rounded-xl overflow-hidden p-1 relative">
        <div className="absolute top-4 left-4 z-10 bg-[#1e293b]/80 backdrop-blur rounded p-2 border border-[#334155]">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white">Wheat Continuous Contract</span>
            <span className="text-emerald-500 font-bold">+2.4%</span>
          </div>
          <div className="text-xs text-slate-400 font-mono space-x-2">
            <span>O: 2340</span>
            <span>H: 2365</span>
            <span>L: 2310</span>
            <span>C: 2355</span>
          </div>
        </div>
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}

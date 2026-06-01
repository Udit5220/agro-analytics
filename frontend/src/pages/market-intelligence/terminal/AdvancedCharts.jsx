import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { BarChart2, CandlestickChart, TrendingUp, RefreshCw } from 'lucide-react';
import { commodityApi } from '../../../services/apiService';

const COMMODITIES = ['Wheat', 'Soybean', 'Cotton', 'Onion', 'Maize', 'Paddy', 'Chana', 'Mustard', 'Turmeric', 'Tomato'];

export default function AdvancedCharts() {
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);
  const seriesInstance = useRef(null);
  const volumeSeriesInstance = useRef(null);
  
  const [chartType, setChartType] = useState('candlestick');
  const [commodity, setCommodity] = useState('Wheat');
  const [days, setDays] = useState(30);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await commodityApi.getPriceTrends(commodity, 'all', days);
        if (res.data) {
          // Map to OHLC format and ensure unique, ascending timestamps
          const raw = res.data.map(d => ({
            time: Math.floor(new Date(d.priceDate).getTime() / 1000),
            open: d.previousModalPrice || d.modalPrice,
            high: d.maxPrice || d.modalPrice,
            low: d.minPrice || d.modalPrice,
            close: d.modalPrice,
            volume: d.arrivalVolume || 0
          })).sort((a, b) => a.time - b.time);

          // Deduplicate by time (aggregate multiple mandis on the same day)
          const uniqueData = [];
          for (const item of raw) {
            const last = uniqueData[uniqueData.length - 1];
            if (last && last.time === item.time) {
              last.high = Math.max(last.high, item.high);
              last.low = Math.min(last.low, item.low);
              last.volume += item.volume;
              // we can keep the last close or average it, let's keep the last one
              last.close = item.close;
              last.value = item.close;
            } else {
              item.value = item.close; // for line chart
              uniqueData.push(item);
            }
          }
          
          setData(uniqueData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [commodity, days]);

  // Render chart when data or chartType changes
  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

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
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#334155',
      },
    });

    chartInstance.current = chart;

    // Volume Series (using AreaSeries to avoid addHistogramSeries missing function error in some versions)
    const volumeSeries = chart.addAreaSeries({
      lineColor: 'transparent',
      topColor: '#33415580',
      bottomColor: '#33415510',
      priceFormat: { type: 'volume' },
      priceScaleId: '', // set as an overlay
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volumeSeries.setData(data.map(d => ({ 
      time: d.time, 
      value: d.volume
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
    chart.timeScale().fitContent();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [chartType, data]);

  const latest = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="space-y-4 animate-fadeIn h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Advanced Interactive Charts</h2>
          <p className="text-sm text-slate-400 mt-1">Professional grade charting tools for deep technical analysis.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select value={commodity} onChange={e => setCommodity(e.target.value)} className="bg-[#1e293b] border border-[#334155] text-slate-200 text-sm rounded px-3 py-1.5 focus:outline-none">
            {COMMODITIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <div className="flex bg-[#1e293b] rounded p-1">
            <button 
              onClick={() => setChartType('candlestick')}
              className={`px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-2 ${chartType === 'candlestick' ? 'bg-[#0f172a] text-slate-200' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <CandlestickChart className="h-4 w-4" /> Candlestick
            </button>
            <button 
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-2 ${chartType === 'line' ? 'bg-[#0f172a] text-slate-200' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <TrendingUp className="h-4 w-4" /> Line
            </button>
          </div>

          <div className="flex bg-[#1e293b] rounded p-1">
            {[ {label: '1M', val: 30}, {label: '3M', val: 90}, {label: '6M', val: 180} ].map(tf => (
              <button 
                key={tf.label} 
                onClick={() => setDays(tf.val)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${days === tf.val ? 'bg-[#0f172a] text-slate-200' : 'text-slate-400 hover:text-slate-200 hover:hover:bg-[#0f172a]/50'}`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#0A0D14] border border-[#334155] rounded-xl overflow-hidden p-1 relative">
        {latest && (
          <div className="absolute top-4 left-4 z-10 bg-[#1e293b]/80 backdrop-blur rounded p-2 border border-[#334155]">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-slate-200">{commodity} Spot Prices</span>
              <span className={latest.close >= latest.open ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                {latest.close >= latest.open ? '+' : ''}{((latest.close - latest.open) / latest.open * 100).toFixed(2)}%
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono space-x-2">
              <span>O: {latest.open}</span>
              <span>H: {latest.high}</span>
              <span>L: {latest.low}</span>
              <span>C: {latest.close}</span>
            </div>
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
          </div>
        ) : (
          <div ref={chartContainerRef} className="w-full h-full min-h-[400px]" />
        )}
      </div>
    </div>
  );
}

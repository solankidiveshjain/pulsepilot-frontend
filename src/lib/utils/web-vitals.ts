import { ReportHandler } from 'web-vitals';

const reportWebVitals = async (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    try {
      const { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');
      
      // Core Web Vitals
      onCLS(onPerfEntry);
      onLCP(onPerfEntry);
      onFID(onPerfEntry);
      
      // Other important metrics
      onINP(onPerfEntry);
      onFCP(onPerfEntry);
      onTTFB(onPerfEntry);
    } catch (error) {
      console.error('Error loading web-vitals:', error);
    }
  }
};

// Function to send metrics to our API endpoint
export const sendWebVitalsToAnalytics: ReportHandler = (metric) => {
  // Don't send metrics in development for better console readability
  // unless explicitly enabled
  if (
    process.env.NODE_ENV !== 'production' && 
    !process.env.NEXT_PUBLIC_ENABLE_DEV_VITALS
  ) {
    console.log('[Web Vitals]', metric);
    return;
  }

  // Send to our API endpoint for processing
  const body = {
    name: metric.name,
    id: metric.id,
    value: metric.value,
    href: window.location.href,
    timeStamp: Date.now(),
  };

  // Use `navigator.sendBeacon()` if available
  if (navigator.sendBeacon) {
    const success = navigator.sendBeacon('/api/vitals', JSON.stringify(body));
    if (success) return;
  }

  // Fallback to fetch API
  fetch('/api/vitals', {
    body: JSON.stringify(body),
    method: 'POST',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(console.error);
};

export default reportWebVitals; 
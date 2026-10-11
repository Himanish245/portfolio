'use client';

import { useEffect, useState } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  pixelRatio: number;
}

export function useMobileDetect(): DeviceInfo {
  const [device, setDevice] = useState<DeviceInfo>({
    isMobile: false,
    pixelRatio: 1,
  });

  useEffect(() => {
    const checkDevice = () => {
      const isMobile = window.innerWidth < 768;
      const dpr = window.devicePixelRatio || 1;
      setDevice({
        isMobile,
        pixelRatio: Math.min(dpr, isMobile ? 1.25 : 1.5),
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return device;
}

import { useEffect, useState } from 'react';

const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

export const useCountUp = (
  target,
  {
    duration = 900,
    formatter = val => val,
  } = {}
) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return setValue(0);

    let start = 0;
    const startTime = performance.now();

    const animate = now => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      setValue(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return formatter(value);
};
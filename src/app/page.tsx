'use client';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect } from 'react';
import { useDevicePreferences } from '@/hooks/useDevicePreferences';

export default function Home() {
  const progress = 8;
  const updates = [
    'Added empty pages for routes - not final',
    'Contact information and Socials design',
    'Drawer with placeholder nav items',
    'Custom animating dark mode toggle button',
    'Dynamic navbar',
    'Logo and Dark mode integration',
  ];
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const { lowEndDevice, prefersReducedMotion } = useDevicePreferences();
  const shouldAnimate = !(prefersReducedMotion || lowEndDevice);

  useEffect(() => {
    const controls = animate(count, progress, {
      duration: shouldAnimate ? 2 : 0,
      ease: 'circOut',
    });
    return () => controls.stop();
  }, [count, progress]);

  return (
    <main className='relative'>
      <section className="h-[200vh]">
        <div className="p-5 flex flex-col gap-y-2 font">
          <p className="text-current text-xl text-center">Coming Soon</p>
          <div className="flex w-full h-4 border rounded-full p-1">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: shouldAnimate ? 2 : 0, ease: 'circOut' }}
              className="bg-current relative rounded-full"
            >
              <motion.span
                className="absolute text-xs text-current font-semibold top-1/2 z-10 translate-x-1 left-full transform -translate-y-1/2"
                style={{ x: 0 }}
              >
                <motion.span>{rounded}</motion.span>%
              </motion.span>
            </motion.div>
          </div>
          <div className='w-full flex flex-col mt-4'>
            <h1 className='text-lg'>Latest Updates:</h1>
            <ul className="list-['-'] text-sm">
              {updates.map((update, index) => (
                <li
                  className='pl-1'
                  key={index}>{update}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

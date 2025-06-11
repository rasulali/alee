'use client';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect } from 'react';
import Nav from '../components/nav';
import { useDevicePreferences } from '@/hooks/useDevicePreferences';

export default function Home() {
  const progress = 5;
  const updates = [
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
      <Nav />
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
          {/* <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel odio assumenda voluptatibus commodi excepturi corporis, distinctio deleniti quae laboriosam quasi pariatur repellendus consectetur sunt eius reprehenderit aspernatur ipsa veniam autem blanditiis. Dolores molestiae corporis, ipsa animi magnam, hic rem dolorem labore enim laboriosam itaque harum delectus reprehenderit, ratione incidunt quos deserunt nisi minima sapiente sunt necessitatibus voluptatem minus cumque. Optio harum a, ab, nisi, alias adipisci cupiditate molestiae nam beatae vel sit error ad explicabo voluptatum dignissimos commodi eius qui tempora fugit id aliquid dolorum obcaecati. Eligendi enim quibusdam sequi excepturi fuga! Ex ratione voluptatum quasi facere mollitia error dolor.</h1> */}
        </div>
      </section>
    </main>
  );
}

'use client';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect } from 'react';
import { useDevicePreferences } from '@/hooks/useDevicePreferences';
import { useTranslations } from 'next-intl';
import Scene from '../components/scene';


export default function Home() {
  const progress = 11;
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

  const Updates = () => {
    const updates = tHome.raw('updates') as string[];
    return <div className="p-5 flex flex-col gap-y-2 font">
      <p className="text-current text-xl text-center">{tHeadings("comingSoon")}</p>
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
        <h1 className='text-lg'>{tHeadings("latestUpdates")}</h1>
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
  }


  const tHome = useTranslations('home');
  const tHeadings = useTranslations('home.headings');

  return (
    <main className='relative'>
      <section id="home" className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Scene />
          <div className='absolute inset-0 bg-background/10 backdrop-blur-xs pointer-events-none' />
        </div>

        <div className="relative z-10 flex items-center justify-center w-full h-full pointer-events-none">
          <Updates />
        </div>
      </section>

      <section id='projects' className='w-full h-screen flex justify-center items-center'>
        <h1 className='block text-center text-4xl'>PROJECTS</h1>
      </section>
      <section id='writings' className='w-full h-screen flex justify-center items-center'>
        <h1 className='block text-center text-4xl'>WRITINGS</h1>
      </section>
      <section id='about' className='w-full h-screen flex justify-center items-center'>
        <h1 className='block text-center text-4xl'>ABOUT</h1>
      </section>
    </main>
  );
}

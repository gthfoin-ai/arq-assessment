"use client";
import dynamic from 'next/dynamic';
const ARQAlpha = dynamic(() => import('../components/ARQAlpha'), { ssr: false });
export default function Home() { return <ARQAlpha />; }

"use client";
import dynamic from 'next/dynamic';
const ARQFull = dynamic(() => import('../../components/ARQFull'), { ssr: false });
export default function FullPage() { return <ARQFull />; }

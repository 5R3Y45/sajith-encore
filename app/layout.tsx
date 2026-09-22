import type { Metadata } from 'next';
import './globals.css';
import Shell from '@/components/Shell';
export const metadata: Metadata = { title:'Sajith-Quote',description:'Personal, local-only quotation generator' };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body><Shell>{children}</Shell></body></html>; }

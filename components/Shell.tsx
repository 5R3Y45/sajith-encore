'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
export default function Shell({children}:{children:React.ReactNode}) { const path=usePathname(); useEffect(()=>{ if('serviceWorker' in navigator && process.env.NODE_ENV==='production') navigator.serviceWorker.register('/sw.js').catch(console.error); },[]); return <><header><div className="header-inner"><Link href="/" className="brand"><span className="brand-icon">SQ</span>Sajith-Quote</Link><nav><Link className={path==='/'?'active':''} href="/">Generator</Link><Link className={path.startsWith('/history')?'active':''} href="/history/">History</Link></nav><span className="local"><i/>Local workspace</span></div></header><main>{children}</main><footer>Stored only in this browser. Clearing site data, changing browser or losing this device can erase quotations. Export backups regularly.</footer></>; }

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});const files=[];for(const e of entries){const p=`${dir}/${e.name}`;if(e.isDirectory())files.push(...await walk(p));else files.push(p);}return files;}
const files=(await walk('out')).filter(p=>!p.endsWith('/sw.js'));
const hash=createHash('sha256');for(const file of files)hash.update(await readFile(file));
const version=hash.digest('hex').slice(0,12);
const urls=files.map(f=>'/'+f.slice(4));urls.push('/','/history/');
await writeFile('out/sw.js',`const CACHE='sajith-quote-${version}';
const ASSETS=${JSON.stringify(urls)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('sajith-quote-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;event.respondWith(fetch(event.request).catch(async()=>{const cache=await caches.open(CACHE);return (await cache.match(event.request,{ignoreSearch:true}))||Response.error();}));});
`);
console.log(`Offline cache generated (${urls.length} local assets).`);

import { z } from 'zod';
export const safeUrl = (s: string) => { try { const u = new URL(s); return ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password; } catch { return false; } };
const nullableText = z.string().nullable();
const url = z.string().refine(safeUrl, 'Use an absolute http:// or https:// URL').nullable();
export const productSchema = z.object({ part_number: z.string().min(1), manufacturer: nullableText, description: nullableText, quantity: z.number().int().positive().max(1000000), unit_weight_kg: z.number().positive().finite().nullable(), weight_type: nullableText, weight_source_type: nullableText, weight_source_url: url, datasheet_url: url, document_type: nullableText, product_status: nullableText, verification_notes: nullableText });
export const importSchema = z.object({ schema_version: z.literal('1.0'), products: z.array(productSchema).min(1).max(1000) });
export type Imported = z.infer<typeof importSchema>;
export type Product = z.infer<typeof productSchema>;
export const currencies = ['USD', 'EUR', 'AED', 'GBP'] as const;
export const defaultRates = { USD: '3.70', EUR: '4.30', GBP: '4.90' } as const;
export const ratesSchema = z.object({ USD: z.string().default(defaultRates.USD), EUR: z.string(), GBP: z.string() });
export const rowSchema = productSchema.extend({ weight: z.string(), price: z.string(), margin: z.string().default('0'), currency: z.enum(currencies), leadTime: z.string(), sourcingFrom: z.string().default(''), countryOfOrigin: z.string().default('') });
export const editorSchema = z.object({ date: z.string(), serial: z.string(), customer: z.string(), email: z.string(), payment: z.string(), incoterms: z.string(), validity: z.string(), origin: z.string(), rates: ratesSchema, products: z.array(rowSchema).min(1) });
export type Editor = z.infer<typeof editorSchema>;
export type Row = Editor['products'][number];
export type Rates = Editor['rates'];
export const defaults = { payment: '50% advance, 50% before delivery', incoterms: 'Ex work Dubai', validity: '30 days/Prior to Sale', origin: 'Multiple' };
export function parseProducts(text: string): Imported { let value: unknown; try { value = JSON.parse(text); } catch { throw new Error('Invalid JSON. Check commas, quotation marks and brackets.'); } const result = importSchema.safeParse(value); if (!result.success) throw new Error(result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n')); return result.data; }
export function todayDubai() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
export function quoteNumber(date: string, serial: string) { if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(date + 'T12:00:00Z').toISOString().slice(0,10) !== date) throw new Error('Enter a valid quotation date.'); if (!/^[1-9]\d*$/.test(serial) || !Number.isSafeInteger(Number(serial))) throw new Error('Quotation Serial Number must be a positive whole number.'); const [y,m,d] = date.split('-'); return `Q-ENCR${y.slice(-2)}-S${serial}-${d}${m}`; }
export function normalizeRates(value?: Partial<Rates> | null): Rates { return { USD: value?.USD || defaultRates.USD, EUR: value?.EUR || defaultRates.EUR, GBP: value?.GBP || defaultRates.GBP }; }
export function normalizeEditor(value: unknown): Editor { return {...editorSchema.parse(value),origin:'Multiple'}; }
export function newEditor(data: Imported, serial: number, rates: Rates = normalizeRates()): Editor { return { ...defaults, date: todayDubai(), serial: String(serial), customer: '', email: '', rates: normalizeRates(rates), products: data.products.map(p => ({ ...p, weight: p.unit_weight_kg === null ? '' : String(p.unit_weight_kg), price: '', margin: '0', currency: 'USD', leadTime: '', sourcingFrom: '', countryOfOrigin: '' })) }; }

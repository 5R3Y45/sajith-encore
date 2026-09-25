import { Editor, quoteNumber, safeUrl } from './model';
import { Totals } from './calculations';
import { encoreLogo } from './encore-logo';

export const escapeHtml = (value: string | number | null) => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]!));
const displayDate = (date: string) => date.split('-').reverse().join('/');

export function renderEncoreV1Quote(editor: Editor, totals?: Totals) {
 const h = escapeHtml;
 const number = h(quoteNumber(editor.date,editor.serial));
 const customer = h(editor.customer || 'Customer');
 const rows = editor.products.map((product,index) => {
  const partNumber = h(product.part_number);
  const data = product.datasheet_url && safeUrl(product.datasheet_url) ? `<a href="${h(product.datasheet_url)}" style="color:#1789a6;text-decoration:underline;">${partNumber}</a>` : partNumber;
  const background = index % 2 ? 'background:#fbfdfd;' : '';
  return `<tr style="${background}">
            <td style="padding:11px 7px;border-top:1px solid #d8e3e6;text-align:center;vertical-align:top;">${index+1}</td>
            <td style="padding:11px;border-top:1px solid #d8e3e6;vertical-align:top;line-height:1.55;">
              <span style="font-weight:700;color:#173f48;">${partNumber} - ${h(product.description)}</span><br>
              <span style="color:#50676e;">Weight - ${h(product.weight || '[Missing weight]')}${product.weight?' kg':''}</span><br>
              <span style="color:#6a858c;">Data: ${data}</span>
            </td>
            <td style="padding:11px 7px;border-top:1px solid #d8e3e6;text-align:center;vertical-align:top;">${product.quantity}</td>
            <td style="padding:11px 7px;border-top:1px solid #d8e3e6;text-align:right;vertical-align:top;">${totals?.rows[index].unit ?? '[0.00]'}</td>
            <td style="padding:11px 7px;border-top:1px solid #d8e3e6;text-align:right;vertical-align:top;font-weight:700;">${totals?.rows[index].total ?? '[0.00]'}</td>
            <td style="padding:11px 7px;border-top:1px solid #d8e3e6;text-align:center;vertical-align:top;">${h(product.leadTime || '[Lead Time]')}</td>
          </tr>`;
 }).join('');
 const customerEmail = editor.email ? `<div style="margin-top:4px;font-size:12px;font-weight:400;color:#50676e;">${h(editor.email)}</div>` : '';
 return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${number}</title>
</head>
<body style="margin:0;padding:28px;background:#f4f7f8;color:#1c2b33;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:940px;margin:0 auto 18px;line-height:1.5;font-size:14px;color:#263840;">
    <p style="margin:0 0 8px;">Dear <strong>${customer}</strong>,</p>
    <p style="margin:0;">Thank you for your enquiry. Please find our quotation below for your review.</p>
  </div>

  <div style="max-width:940px;margin:0 auto;background:#ffffff;border:1px solid #dbe4e7;border-radius:14px;overflow:hidden;box-shadow:0 8px 28px rgba(24,55,65,.08);">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;">
      <tr>
        <td style="width:34%;background:#0f353c;padding:24px;vertical-align:middle;">
          <img src="${encoreLogo}" alt="Encore Powers" width="245" style="display:block;width:245px;max-width:100%;height:auto;border:0;">
        </td>
        <td style="width:66%;padding:26px 30px 24px;vertical-align:middle;background:#ffffff;">
          <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4e7f89;font-weight:700;">Commercial Offer</div>
          <div style="margin-top:5px;font-size:31px;line-height:1.1;font-weight:800;color:#153e46;">QUOTATION</div>
          <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:16px;border-collapse:collapse;font-size:12px;color:#40545b;">
            <tr>
              <td style="padding:0 18px 0 0;"><strong style="color:#153e46;">Salesperson</strong><br>&nbsp;</td>
              <td style="padding:0 18px;border-left:1px solid #d6e1e4;"><strong style="color:#153e46;">Quote No.</strong><br><span data-quote-number>${number}</span></td>
              <td style="padding:0 0 0 18px;border-left:1px solid #d6e1e4;"><strong style="color:#153e46;">Date</strong><br>${h(displayDate(editor.date))}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td colspan="2" style="height:6px;background:#2aa8c8;"></td></tr>
    </table>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate;border-spacing:14px 14px;padding:6px 14px 0;">
      <tr>
        <td style="width:50%;background:#f5fafb;border:1px solid #dce9ec;border-radius:10px;padding:14px 16px;">
          <div style="font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#6a858c;font-weight:700;">Customer</div>
          <div style="margin-top:5px;font-size:14px;font-weight:700;color:#183f47;">${h(editor.customer) || '&nbsp;'}</div>${customerEmail}
        </td>
        <td style="width:50%;background:#f5fafb;border:1px solid #dce9ec;border-radius:10px;padding:14px 16px;">
          <div style="font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#6a858c;font-weight:700;">Customer RFQ Ref.</div>
          <div style="margin-top:5px;font-size:14px;font-weight:700;color:#183f47;">&nbsp;</div>
        </td>
      </tr>
    </table>

    <div style="padding:4px 28px 8px;">
      <div style="font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:#2b6975;font-weight:800;margin:5px 0 10px;">Commercial Terms</div>
      <table width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;font-size:12px;">
        <tr>
          <td style="width:25%;padding:12px;border:1px solid #d7e4e7;"><div style="font-size:10px;text-transform:uppercase;color:#7a9298;font-weight:700;">Incoterms</div><div style="margin-top:5px;color:#1d3940;">${h(editor.incoterms)}</div></td>
          <td style="width:25%;padding:12px;border:1px solid #d7e4e7;"><div style="font-size:10px;text-transform:uppercase;color:#7a9298;font-weight:700;">Payment Terms</div><div style="margin-top:5px;color:#1d3940;">${h(editor.payment)}</div></td>
          <td style="width:25%;padding:12px;border:1px solid #d7e4e7;"><div style="font-size:10px;text-transform:uppercase;color:#7a9298;font-weight:700;">Validity</div><div style="margin-top:5px;color:#1d3940;">${h(editor.validity)}</div></td>
          <td style="width:25%;padding:12px;border:1px solid #d7e4e7;"><div style="font-size:10px;text-transform:uppercase;color:#7a9298;font-weight:700;">Country of Origin</div><div style="margin-top:5px;color:#1d3940;">${h(editor.origin)}</div></td>
        </tr>
      </table>
    </div>

    <div style="padding:12px 28px 0;">
      <div style="font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:#2b6975;font-weight:800;margin:0 0 10px;">Quoted Items</div>
      <table width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;font-size:12px;border:1px solid #cfdcdf;">
        <thead><tr style="background:#153e46;color:#ffffff;">
          <th style="width:6%;padding:10px 7px;border-right:1px solid #345d65;text-align:center;">#</th>
          <th style="width:44%;padding:10px;border-right:1px solid #345d65;text-align:left;">Description &amp; Part Number</th>
          <th style="width:8%;padding:10px 7px;border-right:1px solid #345d65;text-align:center;">Qty</th>
          <th style="width:14%;padding:10px 7px;border-right:1px solid #345d65;text-align:right;">Unit Price AED</th>
          <th style="width:14%;padding:10px 7px;border-right:1px solid #345d65;text-align:right;">Total AED</th>
          <th style="width:14%;padding:10px 7px;text-align:center;">Lead Time</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin-top:18px;">
      <tr>
        <td style="width:58%;padding:0 14px 22px 28px;vertical-align:top;">
          <div style="background:#eef7f9;border-left:4px solid #2aa8c8;padding:14px 16px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:800;color:#285f6a;margin-bottom:8px;">Important Notes</div>
            <div style="font-size:11px;color:#4d6268;line-height:1.55;">
              <div style="margin-bottom:5px;">• Lead time commences upon receipt of the agreed advance payment or acceptance of the purchase order, whichever applies.</div>
              <div style="margin-bottom:5px;">• Prices and availability are subject to confirmation at the time of order. Stock is not reserved by this quotation.</div>
              <div>• Please verify quoted part numbers, descriptions and technical specifications before issuing the purchase order.</div>
            </div>
          </div>
        </td>
        <td style="width:42%;padding:0 28px 22px 14px;vertical-align:top;">
          <table width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;font-size:12px;border:1px solid #cbd9dc;">
            <tr><td style="padding:9px 11px;background:#f2f7f8;border-bottom:1px solid #cbd9dc;font-weight:700;color:#244b54;">Subtotal</td><td style="padding:9px 11px;border-bottom:1px solid #cbd9dc;text-align:right;">AED ${totals?.subtotal ?? '[0.00]'}</td></tr>
            <tr><td style="padding:9px 11px;background:#f2f7f8;border-bottom:1px solid #cbd9dc;font-weight:700;color:#244b54;">VAT 5%</td><td style="padding:9px 11px;border-bottom:1px solid #cbd9dc;text-align:right;">AED ${totals?.vat ?? '[0.00]'}</td></tr>
            <tr><td style="padding:12px 11px;background:#2aa8c8;color:#ffffff;font-size:13px;font-weight:800;">GRAND TOTAL</td><td style="padding:12px 11px;background:#2aa8c8;color:#ffffff;text-align:right;font-size:14px;font-weight:800;">AED ${totals?.grandTotal ?? '[0.00]'}</td></tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="padding:0 28px 20px;">
      <div style="border:1px solid #dce6e8;padding:12px 14px;font-size:11px;color:#53666c;line-height:1.55;">
        <strong style="color:#173f48;">Warranty:</strong> Warranty coverage applies only to manufacturing defects and remains subject to the applicable manufacturer or supplier warranty terms. Manufacturer warranty may not apply to discontinued or obsolete products unless expressly confirmed in writing.
      </div>
    </div>
    <div style="padding:0 28px 24px;font-size:13px;color:#3f535a;line-height:1.5;">
      <p style="margin:0 0 10px;">To proceed, please send your official purchase order referencing the quotation number above.</p>
      <p style="margin:0;">Should you require any clarification or additional products, please feel free to contact us.</p>
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;background:#0f353c;">
      <tr>
        <td style="padding:15px 24px;color:#d7eef3;font-size:11px;"><strong style="color:#ffffff;">Encore Powers General Trading Co. L.L.C</strong></td>
        <td style="padding:15px 24px;text-align:right;color:#d7eef3;font-size:11px;">&nbsp;</td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

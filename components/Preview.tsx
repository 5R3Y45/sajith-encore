'use client';
export default function Preview({html}:{html:string}) { return <div className="preview-scroll"><iframe title="Quotation preview" sandbox="allow-popups allow-popups-to-escape-sandbox" srcDoc={html} className="quote-frame"/></div>; }

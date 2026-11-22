const test = require('node:test');
const assert = require('node:assert/strict');
const invoice = require('../lib/invoice');
const line = (extra = {}) => ({name:'Rice',sku:'RICE',hsn:'1006',price:1020,qty:1,...extra});
test('HSN and post-discount GST match checkout', () => {
 const r = invoice.computeInvoiceFigures({items:[line()],coupon:'SAVE10'});
 assert.equal(r.tax,45.9); assert.equal(r.discount,102); assert.equal(r.total,963.9);
});
test('SAVE10 discount is capped at 150', () => {
 const r = invoice.computeInvoiceFigures({items:[line({price:2240})],coupon:'SAVE10'});
 assert.equal(r.discount,150); assert.equal(r.tax,104.5); assert.equal(r.total,2194.5);
});
test('empty order is zero', () => {
 const r = invoice.computeInvoiceFigures({items:[]});
 assert.equal(r.total,0); assert.deepEqual(r.rows,[]);
});
test('explicit 18 percent item without coupon is stable and rendering escapes names', () => {
 const o={id:1,total:118,items:[line({name:'<script>',price:100,gstRate:18})]};
 assert.equal(invoice.computeInvoiceFigures(o).total,118);
 assert.ok(invoice.render(o).includes('&lt;script&gt;'));
});
const historical = require('./fixtures/orders.json');
for (const order of historical) {
 test('historical order '+order.id+' reconciles without mutating input',()=>{
  const before=JSON.stringify(order), r=invoice.computeInvoiceFigures(order);
  for(const key of ['subtotal','discount','tax','total']) assert.equal(r[key],order[key],key);
  assert.equal(Math.round((r.cgst+r.sgst)*100),Math.round(r.tax*100));
  assert.equal(JSON.stringify(order),before);
 });
}
for(const [label,extra,expected] of [
 ['12 percent HSN',{hsn:'0405'},112],['fractional explicit rate',{gstRate:0.05},105],
 ['zero explicit rate',{gstRate:0},100],['unknown HSN fallback',{hsn:'unknown'},118]
]) test(label,()=>assert.equal(invoice.computeInvoiceFigures({items:[line({price:100,...extra})]}).total,expected));
for(const coupon of ['INVALID','DIWALI20','SAVE10']) test('ineligible coupon '+coupon,()=>{
 const r=invoice.computeInvoiceFigures({coupon,items:[line({price:100})]});
 assert.equal(r.discount,0); assert.equal(r.total,105);
});

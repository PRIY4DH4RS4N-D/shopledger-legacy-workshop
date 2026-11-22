const test = require('node:test');
const assert = require('node:assert/strict');
const invoice = require('../lib/invoice');
test('ticket 1002: invoice matches billed total and GST',()=>{
 const r=invoice.computeInvoiceFigures({coupon:'SAVE10',items:[{name:'Rice',hsn:'1006',price:1020,qty:1}]});
 assert.equal(r.total,963.9); assert.equal(r.tax,45.9); assert.equal(r.discount,102);
});

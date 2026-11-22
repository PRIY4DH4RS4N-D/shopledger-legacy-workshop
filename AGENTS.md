# ShopLedger instructions
Node.js CommonJS application, Express 4 and body-parser; static HTML/CSS/JavaScript UI.
server.js mounts routes/products.js, orders.js, customers.js, reports.js and printable invoices.
lib/: coupons, dates, inventory, invoice, ledger, orders, pricing, reports, store, tax.
config.js holds shop, GST and coupon settings. data/db.json is the tracked JSON database.
Commands: npm install; npm start; node --test. npm test is an unconfigured placeholder.
Write characterization tests before changing behaviour.
Change only the module(s) the selected ticket concerns.
Tests must use in-memory fixtures and never access data/db.json.
Add no dependencies. Do not commit package-lock.json.

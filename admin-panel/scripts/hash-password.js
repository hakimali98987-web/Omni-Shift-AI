#!/usr/bin/env node
// Usage: npm run hash-password -- "your-password"
const bcrypt = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.error('Usage: npm run hash-password -- "your-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nAdd this to admin-panel/.env as ADMIN_PASSWORD_HASH:\n");
console.log(hash);
console.log("");

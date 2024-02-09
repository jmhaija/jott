#!/usr/bin/env node

const procedure = process.argv[2] || 'help'
const path = `./${procedure}/index.js`
try {
  const script = (await import(path)).default
  console.log(await script.main())
} catch(err) {
  console.error(err)
}

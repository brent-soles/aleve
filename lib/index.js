#!/usr/bin/env node
function main(argv) {
  if(argv.length < 3) {
    console.log(`
      Error: invalid number of arguements.

      aleve expects a single argument:

        aleve [path to html directory]
    `);
    return -1;
  }

  // Includes (don't need to run if there is an error)
  const fs = require('fs');
  const aleve = require('./aleve-core');

  // arvv[0] is 'node'
  // argv[1] is 'index.js'
  // argv[2] is our target filepath
  const filePath = argv[2];
  if(!fs.existsSync(filePath)) {
    console.log(`
      Error: Please check your filepath.
    `);
  }

  const server = new aleve({ filePath });
  server.serve(5000, () => console.log('listening on http://localhost:5000'));
}

main(process.argv)
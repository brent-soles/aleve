#!/usr/bin/env node
function main(argv) {
  // At a minimum, there 
  if(argv.length < 2) {
    console.log(`
      Apologies, something went wrong.

      If this issue persists, please submit an issue on github.

      gh: https://github.com/brent-soles/aleve
    `)
  }

  // Includes (don't need to run if there is an error)
  const fs = require('fs');
  const aleve = require('./aleve-core');

  // Gets args passed
  const filePath = parseConfigArg('-d|--directory')(argv) || '.';
  const port = parseConfigArg('-p|--port')(argv) || 5000;
  
  // Need to make sure
  // Requested resources exist
  if(!fs.existsSync(filePath)) {
    console.log(`
      Error: Please check your filepath.
    `);
  }
  //
  const server = new aleve({ filePath, port });
  server.serve((port) => console.log(`listening on http://localhost:${port}`));
}

function parseConfigArg(regexString) {
  // Instantiate new regex
  // And grab preceding argument
  // If the arg is found
  const argRegex = new RegExp(`^(${regexString})$`);
  return function(argv) {
    const i = argv.findIndex((element) => argRegex.test(element));
    return i === -1 ? null : argv[i+1];
  };
}

main(process.argv)
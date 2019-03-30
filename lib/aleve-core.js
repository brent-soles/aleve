/**
 * Server class which serves (lol)
 * as a wrapper for the http/socket
 * operations.
 */
const fs = require('fs');
const http = require('http');
const io = require('socket.io');

function aleveServer({ filePath }) {
  console.log('File path:', filePath);
  this.filePath = filePath; // Passed from main function
  this.serverInstance = null;
  this.socketHandler = null;
  this.eventTypes = {
    'fsevent': {
      id: 'fsevent',
      action: 'emit'
    }
  }
  this.mimeTypes = {
    html: 'text/html',
    css: 'text/css',
    javascript: 'text/javascript',
    json: 'application/json',
    gif: 'image/gif',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    xml: 'image/svg+xml',
    "x-icon": 'image/x-icon'
  }
  this.clients = {}; // Create hash table for unique clients
}

aleveServer.prototype.serve = function(port, cb) {
  if(this.serverInstance){
    console.log('Error: object already has a server running')
    return -1;
  } 

  this.serverInstance = this.initServer();
  if(!this.socketHandler) {
    this.socketHandler = io(this.serverInstance);
  } 
  this.registerSocketOperations();
  this.serverInstance.listen(port, () => cb());
}

aleveServer.prototype.initServer = function () {
  // Specify variables we need to operate on
  // Reason: so class/function scopes within callbacks
  //  are not confused/undefined
  const filePath = this.filePath;
  const injectScript = this.injectClientScript;
  const sanitizeUrl = this.sanitizeUrl.bind(this);
  const applyMimeType = this.applyMimeType.bind(this);

  return http.createServer(function (req, res) {
    // Want to serve index file on root url
    const requestedFile = req.url === '/' ? '/index.html' : req.url;
    const cleanUrl = sanitizeUrl(filePath + requestedFile);
    fs.readFile(cleanUrl, function (err, data) {
      if(err) {
        res.writeHead(500);
        return res.end(`
          Error:
          Couldn't find the file you requested at:
            ${cleanUrl}
        `);
      }
      // All good, package up and send
      applyMimeType(requestedFile)(res);
      res.writeHead(200);
      // Shouldn't inject code on anything
      // besides html
      return requestedFile.includes('.html') ?
        res.end(injectScript(data)) :
        res.end(data);
    });
  });

};

aleveServer.prototype.registerSocketOperations = function () {
  if(!this.socketHandler) {
    console.log(`
      Error: Socket handler has been passed as null.
    `)
    return -1;
  }

  // Sockets events will fire on each fs event
  const sockHandler = this.socketHandler;
  
  // Copy over, so as to avoid
  // this keyword error
  let clients = this.clients;
  sockHandler.on('connecttion', (socket) => {
    if(!clients[socket.id]) {
      clients[socket.id] = socket;
    }

    socket.on('disconnect', () => {
      clients[socket.id] = null;
    });
  });

  // Main point to watch files, will emit
  // to all clients
  // TODO: have it be specific to single
  // client.
  fs.watch(this.filePath, (ev, file) => {
    console.log('Refreshing page')
    sockHandler.emit('fsevent', {
      file: {
        name: file
      }
    });
  })
}

aleveServer.prototype.injectClientScript = function (htmlDataAsString) {
  // Injection string for html files
  const injection = `
  <script src="/socket.io/socket.io.js"></script>
  <script>
    var socket = io('http://localhost:5000');
    socket.on('fsevent', function (data) {
      window.location.reload();
    });
  </script>
</body>
`
    /**
    * Inject just before the end of the body element
    * As the body element SHOULD always be there
    * TODO: create flexible manner of injection (possibly in <head>?)
    * Will return:
        <body>
          ...other html stuff...
          ...other scripts...
        <script src="/socket.io/socket.io.js"></script>
        <script>
          var socket = io('http://localhost:5000');
          socket.on('fsevent', function (data) {
            window.location.reload();
          });
        </script>
      </body>
    </html>
    */ 
    let data = htmlDataAsString.toString().split('</body>');
    data.splice(1, 0, injection);
    data = data.join('')
    return data;
}

aleveServer.prototype.applyMimeType = function(file) {
  // Get the extension and then
  // assign the mime type for transfer
  const fileExtentsion = file.split('.')[1];
  const mimeType = this.mimeTypes[fileExtentsion];
  return function(res) {
    res.setHeader("Content-Type", mimeType);
  }
}

aleveServer.prototype.sanitizeUrl = function(url) {
  // Need each of these to check against
  const removeExtraPeriods = /(\.){2,}/g;
  const removeSameDirString = /\.\//g;
  const removeExtraForwardSlashes = /(\/){2,}/g;
  // Syntax aimed at compactness
  return url.replace(removeExtraPeriods, '')
    .replace(removeSameDirString, '')
    .replace(removeExtraForwardSlashes, '/');
}


module.exports = aleveServer;
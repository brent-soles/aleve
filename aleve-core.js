/**
 * Server class which serves (lol)
 * as a wrapper for the http/socket
 * operations.
 */
const fs = require('fs');
const http = require('http');
const io = require('socket.io');

function aleveServer({ filePath }) {
  console.log('fp', filePath);
  this.filePath = filePath; // Passed from main function
  this.serverInstance = null;
  this.socketHandler = null;
  this.eventTypes = {
    'fsevent': {
      id: 'fsevent',
      action: 'emit'
    }
  }
  this.clients = {}; // Create hash table for unique clients
}

aleveServer.prototype.serve = function(port, cb) {
  if(this.serverInstance){
    console.log('Error: object already has a server running')
    return -1;
  } 

  const file = this.filePath;
  const injectScript = this.injectClientScript
  this.serverInstance = http.createServer(function (req, res){
    fs.readFile(file + req.url, function (err, data) {
      if(err) {
        res.writeHead(500);
        return res.end(`
          Couldn't find the files your requested at:
            ${this.filePath + req.url}
        `);
      }

      res.writeHead(200);

      if(!req.url.includes('.html')) {
        return res.end(data)
      }
      res.end(
        injectScript(data)
      );
    });
  });

  if(!this.socketHandler) {
    this.socketHandler = io(this.serverInstance);
  } 
  this.registerSocketOperations();
  this.serverInstance.listen(port, () => cb());
}

aleveServer.prototype.reqHandler = function (req, res) {
  console.log('fpp', this.filePath);
  fs.readFile(this.filePath + req.url, function (err, data) {
    if(err) {
      res.writeHead(500);
      return res.end(`
        Couldn't find the files your requested at:
          ${this.filePath + req.url}
      `);
    }
    res.writeHead(200);
    res.send(data);
  });
};  

aleveServer.prototype.registerSocketOperations = function () {
  if(!this.socketHandler) {
    console.log(`
      Error: Socket handler has been passed as null.
    `)
    return -1;
  }
  console.log('rso', this.filePath);
  // Sockets events will fire on each fs event
  const sockHandler = this.socketHandler;
  fs.watch(this.filePath, (ev, file) => {
    sockHandler.emit('fsevent', {event: 'fsevent'})
  })
}

aleveServer.prototype.injectClientScript = function (htmlDataAsString) {
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
    let data = htmlDataAsString.toString().split('</body>');
    data.splice(1, 0, injection);
    data = data.join('')
    return data;
}

module.exports = aleveServer;
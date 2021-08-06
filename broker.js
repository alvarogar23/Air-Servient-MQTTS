var mosca = require('mosca')

var SECURE_KEY = './keys/broker.key';
var SECURE_CERT = './keys/broker.crt'

var settings = {
  secure: {port: 8443,
    keyPath: SECURE_KEY,
    certPath: SECURE_CERT,
  }
  
    
  
};
var server = new mosca.Server(settings);
server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running')
}
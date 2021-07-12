const SerialPort = require('serialport')
const port = new SerialPort('COM7', {
    baudRate: 115200
}, false)
 
port.on('open', function() {
  port.write('main screen turn on', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });
});
 
// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
})

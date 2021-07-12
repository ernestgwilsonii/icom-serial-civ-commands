const SerialPort = require('serialport');
let vendorId = "10C4"; // Icom 7300 is vendor ID 10C4

SerialPort.list().then(ports => {
  ports.forEach(function(port) {
     if(port.vendorId==vendorId)
     {
        console.log(port.path);
     }
  });
});
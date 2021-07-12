const SerialPort = require('serialport');

SerialPort.list().then(ports => {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
    console.log("########");
  });
});

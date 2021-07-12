const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const ByteLength = require('@serialport/parser-byte-length')
const port = new SerialPort('COM8', {
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1
},false)

let buffer = new Buffer.alloc(6);
buffer[0] = 0xFE;
buffer[1] = 0xFE;
buffer[2] = 0x94;
buffer[3] = 0xE0;
buffer[4] = 0x03;
buffer[5] = 0xFD;

port.on('open', function () {
    port.write(buffer, function (err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('port opened');
        //port.write(buffer)
    });
});

// open errors will be emitted as an error event
port.on('error', function (err) {
    console.log('Error: ', err.message);
})

// Switches the port into "flowing mode"
port.on('data', function (data) {
    console.log('Data:', data);
    console.log(data.toString('hex',5,10));
    console.log(data[9]);
    console.log(data[8]);
    console.log(data[7]);
    console.log(data[6]);
    console.log(data[5]);
})

// Pipe the data into another stream (like a parser or standard out)
const lineStream = port.pipe(new Readline())
// port.on('data', function (data) {
//     console.log("lineStream:");
//     console.log(lineStream.buffer);
// })

const parser = port.pipe(new ByteLength({ length: 17 }))
// parser.on('data', function (data) {
//     console.log("parser data:");
//     console.log(data);
//     console.log(data[5]);
// })

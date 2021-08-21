const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const ByteLength = require('@serialport/parser-byte-length')
const port = new SerialPort('COM7', {
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1
}, false)

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
        console.log('Radio port opened:');
    });
});

// open errors will be emitted as an error event
port.on('error', function (err) {
    console.log('Error: ', err.message);
})

// Switches the port into "flowing mode"
port.on('data', function (data) {
    console.log('bufferData:', data);
    console.log(data.length);
    convertHexBufferToString(data);
})

async function convertHexBufferToString(data) {
    let stringOutput = data.toString('hex');
    console.log("stringOutput: " + stringOutput);
    console.log(stringOutput.length);
    const regex = /^fefe009400/g; //Comamand 00 - Send frequency data
    const detected = stringOutput.match(regex);
    console.log("detected: " + detected);
    if (detected) {
        endOfDataDelimiter = /fd$/;
        let rawData = stringOutput.replace(regex,'').replace(endOfDataDelimiter,'');
        // console.log("rawData: " + rawData);
        convertRawDataToRawFrequency(rawData);
    }
}

async function convertRawDataToRawFrequency(stringOutput) {
    let frequencyDataArray = stringOutput.match(/.{1,2}/g);
    let rawFrequency = frequencyDataArray[4] + frequencyDataArray[3] + frequencyDataArray[2] + frequencyDataArray[1] + frequencyDataArray[0];
    // console.log(rawFrequency);
    convertRawFrequencyToReadableFrequency(rawFrequency)
}

async function convertRawFrequencyToReadableFrequency(rawFrequency) {
    let readableFrequency;
    if (rawFrequency.match(/^[0]{5}/)) {
        readableFrequency = rawFrequency[5] + rawFrequency[6] + "." + rawFrequency[7] + rawFrequency[8] + rawFrequency[9];
    } else if (rawFrequency.match(/^[0]{4}/)) {
        readableFrequency = rawFrequency[4] + rawFrequency[5] + rawFrequency[6] + "." + rawFrequency[7] + rawFrequency[8] + rawFrequency[9];
    } else if (rawFrequency.match(/^[0]{3}/)) {
        readableFrequency = rawFrequency[3] + "." + rawFrequency[4] + rawFrequency[5] + rawFrequency[6] + rawFrequency[7] + rawFrequency[8] + rawFrequency[9]
    } else if (rawFrequency.match(/^[0]{2}/)) {
        readableFrequency = rawFrequency[2] + rawFrequency[3] + "." + rawFrequency[4] + rawFrequency[5] + rawFrequency[6] + rawFrequency[7] + rawFrequency[8] + rawFrequency[9];
    } else {
        readableFrequency = rawFrequency[0] + "," + rawFrequency[1] + rawFrequency[2] + rawFrequency[3] + "." + rawFrequency[4] + rawFrequency[5] + rawFrequency[6] + rawFrequency[7] + rawFrequency[8] + rawFrequency[9];
    }
    // console.log(readableFrequency);
    convertToHumanReadableFrequency(readableFrequency)
}

async function convertToHumanReadableFrequency(readableFrequency) {
    let humanReadableFrequency = readableFrequency;
    if (humanReadableFrequency.length <= 7) {
        humanReadableFrequency = humanReadableFrequency + " kHz"
    } else {
        humanReadableFrequency = humanReadableFrequency + " MHz"
    }
    console.log(humanReadableFrequency);
}


// Pipe the data into another stream (like a parser or standard out)
// const lineStream = port.pipe(new Readline())
// port.on('data', function (data) {
//     console.log("lineStream:");
//     console.log(lineStream.buffer);
// })

// const parser = port.pipe(new ByteLength({ length: 17 }))
// parser.on('data', function (data) {
//     console.log("parser data:");
//     console.log(data);
//     console.log(data[5]);
// })

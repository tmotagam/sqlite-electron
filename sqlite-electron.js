const zmq = require("zeromq");
const { execFile,exec } = require('child_process')
const path = require('path');

const sock = new zmq.Request

async function init() {
    var fullpath = __dirname + '\\sqlite-server.exe';
    child = execFile(fullpath, (error) => {console.log(error)});

    sock.connect("tcp://127.0.0.1:3000")
    
    await sock.send("init")
    const [result] = await sock.receive()
    let re = new TextDecoder("utf-8").decode(result);
    return JSON.parse(re)
}

async function Connect(dataBasename = '', additionalPath = '') {
    
    if (additionalPath == '') {
        fullpath = path.join(path.dirname(process.mainModule.filename), dataBasename);
    } else {
        fullpath = path.join(path.dirname(process.mainModule.filename), additionalPath, dataBasename);
    }

    await sock.send("Connect"+'~'+fullpath)
    const [result] = await sock.receive()
    let re = new TextDecoder("utf-8").decode(result);
    return JSON.parse(re)
}

async function Close() {
    await sock.send("Close")
    const [result] = await sock.receive()
    let re = new TextDecoder("utf-8").decode(result);
    return JSON.parse(re)
}

async function executeQuery(Query = '', fetch = '', values = []) {
    a = Query +'~'+ fetch +'~'+ values;
    await sock.send("eQuery" +'~'+ a)
    const [result] = await sock.receive()
    let re = new TextDecoder("utf-8").decode(result);
    return JSON.parse(re)
}

async function executeMany(Query = '', v = []) {
    let i = 0;
    let values = [];
    while (i <= v.length-1) {
        if (i == 0) {
            values += v[i]
        }else{
            values += '/^/' + v[i]
        }
        i+=1
    }
    a = Query +'~'+ values;
    await sock.send("mQuery" +'~'+ a)
    const [result] = await sock.receive()
    let re = new TextDecoder("utf-8").decode(result);
    return JSON.parse(re)
}

async function executeScript(scriptName = '') {
    await sock.send("sQuery" +'~'+ scriptName)
    const [result] = await sock.receive()
    let re = new TextDecoder("utf-8").decode(result);
    return JSON.parse(re)
}

module.exports.init = init
module.exports.Connect = Connect
module.exports.Close = Close
module.exports.executeQuery = executeQuery
module.exports.executeMany = executeMany
module.exports.executeScript = executeScript

function exitHandler(options) {
    if (options.cleanup) {
        exec('taskkill /F /T /IM sqlite-server.exe')
    };
    if (options.exit) process.exit();
}

//Exit when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true, exit:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {cleanup:true, exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {cleanup:true, exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {cleanup:true, exit:true}));

//catches uncaught exceptions
process.on('uncaughtException',err => {
    console.error(err, 'Uncaught Exception thrown');
    exitHandler.bind(null, {cleanup:true, exit:true});
});
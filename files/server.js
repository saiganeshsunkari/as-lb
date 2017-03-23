var cfenv=require('cfenv');
var appEnv=cfenv.getAppEnv();
const app = require('koa')(),
    fs = require('fs'),
    exec = require('child_process').exec,
    path = require('path');
    console.log('nen rasifi',appEnv.url);

const index = path.resolve(__dirname, 'index.html'),
    

var readFileThunk = function(src) {
    return new Promise(function(resolve, reject) {
        fs.readFile(src, {'encoding': 'utf8'}, (err, data) => {
            if (err) return reject(err);
	    console.log(data+'<div>'+appEnv.url+'</div>');
	    resolve(data+'<div>'+appEnv.url+'</div>');
        });
    });
};

var execThunk = function(cmd) {
    return new Promise(function(resolve, reject) {
        exec(cmd, (error, stdout, stderr) => {
            if (error) return reject(error);
            resolve(stdout);
        });
    });
};

app.use(function*() {
    if (this.url === '/') {
        this.body = yield readFileThunk(index);
    } else if (this.url === '/run') {
        this.body = yield execThunk('curl --insecure --cert /ssl/cert.pem --key /ssl/key.pem "https://replicator/$HOSTNAME"');
    } else {
        this.status = 404;
        this.body = 'invalid address';
    }
});

app.listen(appEnv.port);

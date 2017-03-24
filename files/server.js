var os=require('os');
var cfenv=require('cfenv');

var appEnv=cfenv.getAppEnv();
const app = require('koa')(),
    fs = require('fs'),
    exec = require('child_process').exec,
    path = require('path');

    console.log('nen rasifi',appEnv.url);
const index = path.resolve(__dirname, 'index.html')
    var host = os.hostname();

var readFileThunk = function(src) {
    return new Promise(function(resolve, reject) {
        fs.readFile(src, {'encoding': 'utf8'}, (err, data) => {
            if (err) return reject(err);
	    resolve(data+'<div>'+host+'</div>');
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

var host=os.hostname();

app.use(function*() {
    if (this.url === '/') {
        this.body = host;
    } else if (this.url === '/run') {
        this.body = yield execThunk('curl --insecure --cert /ssl/cert.pem --key /ssl/key.pem "https://replicator/$HOSTNAME"');
    } 
    else if(this.url==='/jik'){
    		this.body=yield {"host1":host};
			}else {
        this.status = 404;
        this.body = 'invalid address';
    }
});

app.listen(appEnv.port);

const {strip} = require('ansicolor');
const {exec, spawn} = require('child_process');
const http = require('http');
var urlCommand = require('url');
var execSSH = require('ssh-exec')

const terraformPath = '/Users/veronica/Desktop/Teza_Project/terraform';
const ansiblePath = '/Users/veronica/Desktop/Teza_Project/ansible-k8s';
const keyFile = '/Users/veronica/Desktop/Teza_Project/ansible-k8s/ssh/id_rsa'
const hostname = '127.0.0.1';
const port = 8084;
let messageId = 1;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    // SSE
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-control', 'no-cache');
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');

    const {method, url} = req;
    const queryData = urlCommand.parse(url, true).query;
    if (method === 'GET' && url.indexOf('/terraform/apply') === 0) {
        terraformApply(res, queryData);
    } else if (method === 'GET' && url === '/terraform/destroy') {
        terraformDestroy(res);
    } else if (method === 'GET' && url === '/terraform/state/list') {
        terraformState(res);
    } else if (method === 'GET' && url.indexOf('/k8s/init') === 0) {
        k8sInitial(res, queryData);
    } else if (method === 'GET' && url === '/k8s/dependencies') {
        k8sDependencies(res);
    } else if (method === 'GET' && url === '/k8s/master') {
        k8sMaster(res);
    } else if (method === 'GET' && url === '/k8s/workers') {
        k8sWorkers(res);
    } else if (method === 'GET' && url.indexOf('/k8s/status/nodes') === 0) {
        k8sNodes(res, queryData);
    } else if (method === 'GET' && url.indexOf('/k8s/status/pods') === 0 ) {
        k8sPods(res, queryData);
    } else {
        res.end();
    }
});

// Start HTTP server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


async function terraformApply(response, queryData) {
    console.log('Params: ', queryData.region, queryData.zone, queryData.ami, queryData.vpcName, queryData.ec2TypeMaster, queryData.ec2TypeWorker);
    await exec('rm variables.tf', {cwd: terraformPath});
    setTimeout(async () => {
        await exec(`sed 's/REGION_VALUE/${queryData.region}/g; s/ZONE_VALUE/${queryData.zone}/g; s/AMI_VALUE/${queryData.ami}/g; s/VPC_NAME/${queryData.vpcName}/g; s/EC2_MASTER_VALUE/${queryData.ec2TypeMaster}/g; s/EC2_WORKER_VALUE/${queryData.ec2TypeWorker}/g;' variables.placeholders > variables.tf`, {cwd: terraformPath});
        const tfApply = spawn('terraform', ['apply', '-auto-approve'], {cwd: terraformPath});
        setCommandEvents(tfApply, response);
    }, 2000);
}

function terraformDestroy(response) {
    const tfDestroy = spawn('terraform', ['destroy', '-auto-approve'], {cwd: terraformPath});
    setCommandEvents(tfDestroy, response);
}

function terraformState(response) {
    const tfState = spawn('terraform', ['state', 'list'], {cwd: terraformPath});
    setCommandEvents(tfState, response);
}

async function k8sInitial(response, queryData) {
    console.log('Params: ', queryData.masterIp, queryData.workerIp);
    await exec('rm hosts', {cwd: ansiblePath});
    setTimeout(async () => {
        await exec(`sed 's/MASTER_IP_VALUE/${queryData.masterIp}/g; s/WORKER_IP_VALUE/${queryData.workerIp}/g;' hosts.placeholders > hosts`, {cwd: ansiblePath});
        setTimeout(() => {
            const k8sInit = spawn('ansible-playbook', ['-i', './hosts', '--key-file', './ssh/id_rsa', './initial.yml'], {
                cwd: ansiblePath,
                env: {...process.env, ANSIBLE_HOST_KEY_CHECKING: 'False'}
            });
            setCommandEvents(k8sInit, response);
        }, 1000);
    }, 2000);

}

function k8sDependencies(response) {
    const k8sDeps = spawn('ansible-playbook', ['-i', './hosts', '--key-file', './ssh/id_rsa', './k8s-dependencies.yml'], {
        cwd: ansiblePath,
        env: {...process.env, ANSIBLE_HOST_KEY_CHECKING: 'False'}
    });
    setCommandEvents(k8sDeps, response);
}

function k8sMaster(response) {
    const k8sMasterConfig = spawn('ansible-playbook', ['-i', './hosts', '--key-file', './ssh/id_rsa', './k8s-master.yml'], {
        cwd: ansiblePath,
        env: {...process.env, ANSIBLE_HOST_KEY_CHECKING: 'False'}
    });
    setCommandEvents(k8sMasterConfig, response);
}

function k8sWorkers(response) {
    const k8sWorkersConfig = spawn('ansible-playbook', ['-i', './hosts', '--key-file', './ssh/id_rsa', './k8s-workers.yml'], {
        cwd: ansiblePath,
        env: {...process.env, ANSIBLE_HOST_KEY_CHECKING: 'False'}
    });
    setCommandEvents(k8sWorkersConfig, response);
}

function k8sNodes(response, queryData) {
    execSSH('kubectl get nodes', {
        user: 'ubuntu',
        host: queryData.masterIp,
        key: keyFile
    }, (err, stdout, stderr) => {
        if(err) {
            console.log('SSH ERROR: ', err);
            sendMessage(response, err, false);
        }
        if(stdout) {
            sendMessage(response, stdout);
        }
        if(stderr) {
            console.log('SSH OUTPUT ERROR: ', stderr);
            sendMessage(response, stderr, false);
        }
        closeConnection(response);
        console.log('K8S Status:', err, stdout, stderr);
    });
}

function k8sPods(response, queryData) {
    execSSH('kubectl get pods --all-namespaces', {
        user: 'ubuntu',
        host: queryData.masterIp,
        key: keyFile
    }, (err, stdout, stderr) => {
        if(err) {
            console.log('SSH ERROR: ', err);
            sendMessage(response, err, false);
        }
        if(stdout) {
            sendMessage(response, stdout);
        }
        if(stderr) {
            console.log('SSH OUTPUT ERROR: ', stderr);
            sendMessage(response, stderr, false);
        }
        closeConnection(response);
        console.log('K8S Status:', err, stdout, stderr);
    });
}

function setCommandEvents(command, response) {
    command.stdout.on('data', (data) => {
        sendMessage(response, data.toString());
    });
    command.stderr.on('data', (data) => {
        sendMessage(response, data.toString());
    });
    command.on('close', (code) => {
        closeConnection(response);
    });
}

function sendMessage(response, message, stripCodes = true) {
    let msg = message;
    if(stripCodes) {
        msg = strip(message).replace(/(\n|\r\n)+/g, '<br />');
    }
    if (msg !== '<br />') {
        console.log(messageId, msg);
        response.write(`id: ${messageId}\n`);
        response.write(`data: ${msg}\n\n`);
        messageId++;
    }
}

function closeConnection(response) {
    console.log('DONE!!!');
    response.write('event: done\n');
    response.write(`id: ${messageId}\n`);
    response.write('data: \n\n');
    response.end();
    messageId++;
}

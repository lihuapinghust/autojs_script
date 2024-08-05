toastLog("bootstrap.js started");

launch("com.lovepi.setting")
sleep(1000)

var jsonResp = http.get("http://127.0.0.1:1688/cmd?fun=getNetworkStatus").body.json()
if (jsonResp.data.status == 0) {
    toastLog("Network not connected, exit now")
    exit()
}

const repoOwner = 'lihuapinghust';
const repoName = 'autojs_script';
var repoBranch = jsonResp.data.ssid;
if (repoBranch.startsWith("\"") && repoBranch.endsWith("\"")) {
    repoBranch = repoBranch.substring(1, repoBranch.length - 1);    
}

files.removeDir(`/sdcard/Download/${repoName}`);
const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents?ref=${repoBranch}`;
var res = http.get(apiUrl);
if (res.statusCode == 200) {
    const file_list = JSON.parse(res.body.string());
    file_list.forEach(function(file) {
        if (file.type === 'file') {
            downloadFile(file.download_url, `/sdcard/Download/${repoName}/${file.name}`);
        }
    });
    sleep(3000);
} else {
    toastLog("Download failed: " + res.body.string() + ", exit now");
    exit();
}

let scriptPath = `/sdcard/Download/${repoName}/main.js`;
if (files.exists(scriptPath)) {
    let scriptContent = files.read(scriptPath);
    engines.execScript("main.js", scriptContent);
    console.log('main.js loaded and executed: ' + scriptPath);
} else {
    console.error('main.js not exits: ' + scriptPath);
}

function downloadFile(url, path) {
    var res = http.get(url);
    files.createWithDirs(path);
    files.writeBytes(path, res.body.bytes());
    console.log('File downloaded: ' + path);
}
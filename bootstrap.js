toastLog("bootstrap.js started");

const GLOBAL_TIMEOUT = 10000;

const clash_config = `port: 7890
socks-port: 7891
redir-port: 7892
allow-lan: true
mode: Rule
log-level: info
external-controller: 127.0.0.1:9090

proxies:
  - name: aws-us-xray
    type: vmess
    server: 52.52.246.95
    port: 30300
    uuid: 80217067-7778-46f6-a658-72c55e221296
    alterId: 0
    cipher: none

proxy-groups:
  - name: Proxy
    type: select
    proxies:
      - aws-us-xray

rules:
  - DOMAIN-SUFFIX,amazonaws.com,DIRECT
  - DOMAIN-SUFFIX,amazon.com,DIRECT
  - DOMAIN-SUFFIX,amazon.co.jp,DIRECT
  - DOMAIN-KEYWORD,aws,DIRECT
  - IP-CIDR,97.64.30.72/32,DIRECT
  - MATCH,Proxy
`

files.createWithDirs("/sdcard/Download/aws-us-xray.yaml")
files.write("/sdcard/Download/aws-us-xray.yaml", clash_config)

launch("com.lovepi.setting")
sleep(1000)

var jsonResp = http.get("http://127.0.0.1:1688/cmd?fun=getNetworkStatus").body.json()
if (jsonResp.data.status == 0) {
    toastLog("Network not connected, exit now")
    exit()
}

var ssid = jsonResp.data.ssid

http.get("http://127.0.0.1:1688/cmd?fun=execAsRoot&command=pm%20grant%20com.github.kr328.clash%20android.permission.POST_NOTIFICATIONS")
http.get("http://127.0.0.1:1688/cmd?fun=execAsRoot&command=pm%20grant%20com.github.kr328.clash%20android.permission.READ_EXTERNAL_STORAGE")

launch("com.github.kr328.clash")
sleep(1000)

// click profile
click(540, 820)
sleep(1000)

// click add
click(980, 200)
sleep(1000)

threads.start(function(){
    http.get("http://127.0.0.1:1688/cmd?fun=execAsRoot&command=%7B%20echo%20-e%20%27HTTP%2F1.1%20200%20OK%5Cr%5Cn%27%3B%20cat%20%2Fsdcard%2FDownload%2Faws-us-xray.yaml%3B%20%7D%20%7C%20nc%20-l%20-p%208080")
});

// click URL
click(540, 650)
sleep(1000)

// click URL input
click(540, 900)
sleep(1000)

setText("http://127.0.0.1:8080")

// click OK
click(860, 1040)
sleep(1000)

// click save
click(980, 200)
sleep(1000)

// select profile
click(540, 400)
sleep(1000)

// back
click(100, 210)
sleep(1000)

// start clash
click(540, 530)
sleep(1000)

// click ok button
click(870, 1540)
sleep(1000)

// proxy mode
click(540, 820)
sleep(1000)

// more options
click(980, 200)
sleep(1000)

// Mode
click(780, 500)
sleep(1000)

// Global
click(700, 780)
sleep(1000)

// Global rules
click(130, 370)
sleep(1000)

// Select Proxy
click(800, 740)
sleep(1000)

// back
click(100, 210)
sleep(1000)

launch("com.android.vending")
sleep(3000)

// click Cancel Update
click(230, 2150)
sleep(1000)

// click more
click(1045, 220)
sleep(1000)

// click Update
click(755, 350)
sleep(3000)

// click Google Play Service
click(890, 770)
sleep(5000)

var retries = 0;
while (retries < 60) {
    retries++;

    var jsonResp = http.get("http://127.0.0.1:1688/cmd?fun=execAsRoot&command=dumpsys%20package%20com.google.android.gms%20%7C%20grep%20versionName").body.json();
    if (jsonResp.data.length >= 2) {
        toastLog("Google Play Service version: " + jsonResp.data[0]);
        sleep(5000);
        break
    } else {
        toastLog("Google Play Service update not finished, retrying...");
    }
    sleep(1000);
}

const repoOwner = 'lihuapinghust';
const repoName = 'autojs_script';
var repoBranch = ssid;
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
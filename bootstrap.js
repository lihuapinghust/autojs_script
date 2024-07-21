function downloadFile(url, path) {
    http.get(url, {}, function(res, err) {
        if (err) {
            console.error('无法下载文件: ' + err.message);
            return;
        }

        // 创建文件对象，并写入内容
        let file = files.createWithDirs(path);
        file.writeBytes(res.body.bytes());

        console.log('文件已成功保存到: ' + path);
    });
}


const repoOwner = 'lihuapinghust';
const repoName = 'autojs_script';

// 获取文件列表的URL
const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;

// 发送HTTP请求获取文件列表
var res = http.get(apiUrl);
const file_list = JSON.parse(res.body.string());
file_list.forEach(function(file) {
    if (file.type === 'file') {
        downloadFile(file.download_url, `/sdcard/Download/${repoName}/${file.name}`);
    }
});

let scriptPath = `/sdcard/Download/${repoName}/main.js`;
if (files.exists(scriptPath)) {
    let scriptContent = files.read(scriptPath);
    engines.execScript("main.js", scriptContent);
    console.log('main.js脚本已成功加载并执行');
} else {
    console.error('main.js脚本不存在: ' + scriptPath);
}

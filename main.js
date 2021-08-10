importClass(android.net.ConnectivityManager);
function ToastInfo(input) {
    toast(input);
    console.info(input);
}
function ToastError(input) {
    toast(input);
    console.error(input);
}
var statusTexts = [];
events.broadcast.on('respondStatusText', (r) => {
    var index = statusTexts.indexOf(r);
    if (index === -1)
        statusTexts.push(r);
    else
        statusTexts[index] = r;
});
//
var dev = false;
//
var script = '';
var scriptName = '';
var storage = storages.create('life.his2nd.autofillin2');
var cm = context.getSystemService(context.CONNECTIVITY_SERVICE);
var net = cm.getActiveNetworkInfo();
if (!net && typeof net !== 'undefined' && net !== 0 || !net.isAvailable()) {
    ToastError('无网络连接，结束运行。');
    engines.stopAll();
    exit();
}
console.log('正在检查更新。');
var res = http.get('https://1499374354759535.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/AutoFillIn2/GetLatest/');
if (res.statusCode !== 200) {
    ToastError('检查更新失败：' + res.statusCode + ' - “' + res.statusMessage + '”，结束运行。');
    engines.stopAll();
    exit();
} else {
    var data = res.body.json();
    script = data.script;
    scriptName = data.scriptName;
    if (data.versionCode > app.versionCode) {
        ToastInfo('发现新版本：' + data.versionName + ' - “' + data.log + '”，结束运行。');
        app.openUrl(data.url);
        engines.stopAll();
        exit();
    }
}
if (storage.get('firstRun') !== false) {
    ToastInfo('这是您首次运行本程序，请先阅读手册。');
    app.openUrl('https://his2nd.life/technologies/5c3f7b01.html');
    storage.put('firstRun', false);
    toastLog('结束运行。');
    engines.stopAll();
    exit();
}
if (dev)
    ToastInfo('当前处于开发模式。');
console.log('本程序使用 Auto.js Pro 制作，由 Hollis(his2nd.life) 在 JiyeHoo 的 Auto-Daily-Clock 程序基础上修改而来。');
ToastInfo('使用前请阅读手册：https://his2nd.life/technologies/5c3f7b01.html。');
$settings.setEnabled('foreground_service', true);
$settings.setEnabled('stop_all_on_volume_up', false);
console.log('强行停止本程序后，可能需要重新启用无障碍服务。');
while (!$power_manager.isIgnoringBatteryOptimizations())
    $power_manager.requestIgnoreBatteryOptimizations();
while (!$floaty.checkPermission())
    $floaty.requestPermission();
auto.waitFor();
if (storage.get('requestMorePermissions') !== false) {
    storage.put('requestMorePermissions', false);
    var c = confirm('赋予更多权限', '注意：本提示仅显示一次。\n部分手机系统如 MIUI、ColorOS、FuntouchOS 设置了“后台弹出界面”或类似权限。本程序需要该权限以在后台启动钉钉，需要“自启动”权限以保持运行。\n如果您要赋予这些权限，请点击“确认”以结束运行，方便您进行操作；否则，请点击“取消”。');
    if (c) {
        toastLog('结束运行。');
        engines.stopAll();
        exit();
    }
}
if (currentPackage() !== 'life.his2nd.autofillin2')
    app.startActivity('console');
var w = floaty.rawWindow('<frame gravity="center" bg="#1E90FF" alpha="0.5"><text id="status" textColor="white"></text></frame>');
w.setTouchable(false);
setInterval(() => {
    var scripts = engines.all();
    if (scripts.length > 2)
        for (item of scripts)
            if (item.getSource().toString().indexOf('main.js') === -1)
                item.forceStop();
    if (scripts.length < 2)
        dev ? engines.execScriptFile('auto_fill_in_dev.js') : engines.execScript(scriptName, script);
    events.broadcast.emit('requestStatusText');
    var text = '';
    scripts = engines.all();
    for (item of scripts) {
        var name = item.getSource().toString().split('/')[item.getSource().toString().split('/').length - 1];
        var found = false;
        for (it of statusTexts)
            if (it.name === name) {
                found = true;
                text += it.text + '\n';
                break;
            }
        if (!found)
            text += name + ' 正在运行。\n';
    }
    text = text.substring(0, text.length - 1);
    ui.run(() => { w.status.setText(text); });
}, 1000);

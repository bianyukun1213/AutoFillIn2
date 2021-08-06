function ToastInfo(input) {
    toast(input);
    console.info(input);
}
function ToastError(input) {
    toast(input);
    console.error(input);
}
console.info('正在检查更新。');
var res = http.get('https://1499374354759535.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/AutoFillIn2/GetLatest/');
if (res.statusCode != 200) {
    ToastError('检查更新失败：' + res.statusCode + ' - “' + res.statusMessage + '”。');
    engines.stopAll();
    exit();
} else {
    var data = res.body.json();
    if (data.versionCode > app.versionCode) {
        ToastInfo('发现新版本：' + data.versionName + ' - “' + data.log + '”。');
        app.openUrl(data.url);
        engines.stopAll();
        exit();
    }
}
var storage = storages.create('life.his2nd.autofillin2');
if (storage.get('firstRun') != false) {
    ToastInfo('这是您首次运行此程序，请先阅读手册。');
    app.openUrl('https://his2nd.life/technologies/5c3f7b01.html');
    storage.put('firstRun', false);
    engines.stopAll();
    exit();
}
console.info('本程序使用 Auto.js Pro 制作，由 Hollis(his2nd.life) 在 JiyeHoo 的 Auto-Daily-Clock 程序基础上修改而来。');
ToastInfo('使用前请阅读手册：https://his2nd.life/technologies/5c3f7b01.html。');
$settings.setEnabled('foreground_service', true);
$settings.setEnabled('stop_all_on_volume_up', false);
ToastInfo('请确保已取消锁屏密码，已忽略电池优化，已启用前台服务，已启用无障碍服务，已赋予悬浮窗、自启动、常驻通知、后台弹出界面、读写手机储存等权限，钉钉语言已设置为简体中文，程序自动操作时无人工干预。');
console.info('强行停止本程序后，可能需要重新启用无障碍服务。');
while (!$power_manager.isIgnoringBatteryOptimizations())
    $power_manager.requestIgnoreBatteryOptimizations();
while (!$floaty.checkPermission())
    $floaty.requestPermission();
auto.waitFor();
var scripts = engines.all();
if (scripts.length > 2)
    for (item of scripts)
        if (item.getSource().toString().indexOf('main.js') == -1)
            item.forceStop();
if (scripts.length < 2)
    engines.execScriptFile('auto_fill_in.js');
scripts = engines.all();
for (item of scripts) {
    var tmp = item.getSource().toString().split('/');
    console.log(tmp[tmp.length - 1] + ' 正在运行。');
}
console.info('如果您想重新设置填报时间，请打开“音量上键停止所有脚本”，然后按下音量上键并重新启动本程序。');

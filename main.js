function ToastInfo(input) {
    toast(input);
    console.info(input);
}
ToastInfo('本程序使用 Auto.js Pro 制作，由 Hollis(his2nd.life) 在 JiyeHoo 的 Auto-Daily-Clock 程序基础上修改而来。');
$settings.setEnabled('foreground_service', true);
$settings.setEnabled('stop_all_on_volume_up', false);
ToastInfo('请确保已取消锁屏密码，已忽略电池优化，已启用前台服务，已启用无障碍服务，已赋予悬浮窗、自启动、常驻通知、后台弹出界面、读写手机储存等权限，钉钉语言已设置为简体中文，程序自动操作时无人工干预。');
ToastInfo('强行停止本程序后，可能需要重新启用无障碍服务。');
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
    toastLog(tmp[tmp.length - 1] + ' 运行中。');
}
ToastInfo('如果您想重新设定填报时间，请打开“音量上键停止所有脚本”，然后按下音量上键并重新启动本程序。');

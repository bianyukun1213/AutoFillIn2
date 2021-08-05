toastLog('本程序使用 Auto.js Pro 制作，由 Hollis(his2nd.life) 在 JiyeHoo 的 Auto-Daily-Clock 程序基础上修改而来。');
$settings.setEnabled('foreground_service', true);
toastLog('请确保已忽略电池优化，已启用前台服务，已启用对应的无障碍服务，已赋予悬浮窗、常驻通知、后台弹出界面、读写手机储存等权限，钉钉语言已设置为简体中文。');
while (!$power_manager.isIgnoringBatteryOptimizations())
    $power_manager.requestIgnoreBatteryOptimizations();
while (!$floaty.checkPermission())
    $floaty.requestPermission();
auto.waitFor();
var storage = storages.create('bianyukun1213@outlook.com:auto_fill_in');
var runAt = new Date();
runAt.setHours(7);
runAt.setMinutes(0);
runAt.setSeconds(0);
if (typeof storage.get('runAt') == 'undefined')
    storage.put('runAt', { hour: runAt.toTimeString().substring(0, 2), minute: runAt.toTimeString().substring(3, 5) });
var running = false;
var complete = false;
rawInput('填报时间（小时与分钟均用两位数字表示）：', storage.get('runAt').hour + ':' + storage.get('runAt').minute, input => {
    if (new RegExp(/^(?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/).test(input)) {
        runAt.setHours(input.split(':')[0]);
        if (input == '00:00' || input == new Date().toTimeString().substring(0, 5))
            runAt.setMinutes(parseInt(input.split(':')[1]) + 1);
        else
            runAt.setMinutes(input.split(':')[1]);
    }
    else
        toastLog('时间格式不正确，将使用默认值。');
    storage.put('runAt', { hour: runAt.toTimeString().substring(0, 2), minute: runAt.toTimeString().substring(3, 5) });
    toastLog('设置填报时间为 ' + runAt.toTimeString().substring(0, 5) + '。');
});
setInterval(() => {
    if (new Date().toTimeString().substring(0, 5) == '00:00')
        complete = false;
    if (new Date().toTimeString().substring(0, 5) == runAt.toTimeString().substring(0, 5))
        FillIn();
}, 1000);
toastLog('运行启动测试，如向您请求启动，请允许。');
launch('com.alibaba.android.rimet');
waitForPackage('com.alibaba.android.rimet');
home();
toastLog('等待。');
function FillIn() {
    if (running || complete)
        return;
    running = true;
    toastLog('开始填报。');
    if (!device.isScreenOn()) {
        device.wakeUp();
        swipe(device.width / 2, device.height, device.width / 2, device.height / 2, 100);
    }
    device.keepScreenDim(5 * 60 * 1000);
    launch('com.alibaba.android.rimet');
    waitForPackage('com.alibaba.android.rimet');
    var item = id('home_app_recycler_view').findOne(5000);
    if (item)
        item.children()[2].click();
    else {
        toast('未找到“工作台”，填报失败。');
        console.error('未找到“工作台”，填报失败。');
        device.cancelKeepingAwake();
        app.startActivity('console');
        complete = true;
        running = false;
        return;
    }
    var fillInBtn = className('android.view.View').text('黑龙江科技大学2021年暑期学生健康数据填报')
        .findOne(5000);
    if (fillInBtn)
        fillInBtn.click();
    else {
        toast('未找到“黑龙江科技大学2021年暑期学生健康数据填报”，填报失败。');
        console.error('未找到“黑龙江科技大学2021年暑期学生健康数据填报”，填报失败。');
        device.cancelKeepingAwake();
        app.startActivity('console');
        complete = true;
        running = false;
        return;
    }
    var todayBtn = className('android.view.View').text('今天')
        .findOne(5000);
    if (todayBtn) {
        todayBtn.click();
        sleep(2000);
    } else {
        toast('未找到“今天”，填报失败。');
        console.error('未找到“今天”，填报失败。');
        device.cancelKeepingAwake();
        app.startActivity('console');
        complete = true;
        running = false;
        return;
    }
    var acquireBtn = text('获取').findOne(5000);
    if (acquireBtn) {
        acquireBtn.click();
        sleep(2000);
    } else {
        toast('未找到“获取”，填报失败。');
        console.error('未找到“获取”，填报失败。');
        device.cancelKeepingAwake();
        app.startActivity('console');
        complete = true;
        running = false;
        return;
    }
    var submitBtn = text('提交').findOne(5000);
    if (submitBtn) {
        submitBtn.click();
        toastLog('填报完成。');
    }
    else {
        toast('未找到“提交”，填报失败。');
        console.error('未找到“提交”，填报失败。');
        app.startActivity('console');
    }
    device.cancelKeepingAwake();
    complete = true;
    running = false;
    return;
}

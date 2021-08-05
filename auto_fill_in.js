toastLog('本程序使用 Auto.js Pro 制作，由 Hollis(his2nd.life) 在 JiyeHoo 的 Auto-Daily-Clock 程序基础上修改而来。');
$settings.setEnabled('foreground_service', true);
toastLog('请确保已忽略电池优化，已启用前台服务，已启用对应的无障碍服务，已赋予悬浮窗权限。');
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
rawInput('自动填报时间：', storage.get('runAt').hour + ':' + storage.get('runAt').minute, input => {
    if (new RegExp(/^(?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/).test(input)) {
        runAt.setHours(input.split(':')[0]);
        if (input == '00:00')
            runAt.setMinutes(1);
        else
            runAt.setMinutes(input.split(':')[1]);
    }
    else
        toastLog('时间格式不正确，将使用默认值。');
    storage.put('runAt', { hour: runAt.toTimeString().substring(0, 2), minute: runAt.toTimeString().substring(3, 5) });
    toastLog('设置自动填报时间为 ' + runAt.toTimeString().substring(0, 5) + '。');
});
setInterval(() => {
    if (new Date().toTimeString().substring(0, 5) == '00:00')
        complete = false;
    if (new Date().toTimeString().substring(0, 5) == runAt.toTimeString().substring(0, 5))
        FillIn();
}, 1000);
toastLog('启动测试，如向您请求启动，请允许。');
launch('com.alibaba.android.rimet');
waitForPackage('com.alibaba.android.rimet');
home();
function FillIn() {
    if (running || complete)
        return;
    running = true;
    toastLog('开始填报。');
    if (!device.isScreenOn()) {
        device.wakeUp();
        swipe(device.width / 2, device.height, device.width / 2, device.height / 2, 100);
    }
    launch('com.alibaba.android.rimet');
    waitForPackage('com.alibaba.android.rimet');
    var item = id('home_app_recycler_view').findOne(5000);
    if (item)
        item.children()[2].click();
    else {
        toastLog('未找到“工作台”。');
        complete = true;
        running = false;
        return;
    }
    var fillInBtn = className('android.view.View').text('黑龙江科技大学2021年暑期学生健康数据填报')
        .findOne(5000);
    if (fillInBtn)
        fillInBtn.click();
    else {
        toastLog('未找到“黑龙江科技大学2021年暑期学生健康数据填报”。');
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
        toastLog('未找到“今天”。');
        complete = true;
        running = false;
        return;
    }
    var acquireBtn = text('获取').findOne(5000);
    if (acquireBtn) {
        acquireBtn.click();
        sleep(2000);
    } else {
        toastLog('未找到“获取”。');
        complete = true;
        running = false;
        return;
    }
    var submitBtn = text('提交').findOne(5000);
    if (submitBtn) {
        submitBtn.click();
        toastLog('填报完成');
    }
    else
        toastLog('未找到“提交”。');
    complete = true;
    running = false;
    return;
}

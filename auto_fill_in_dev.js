function ToastInfo(input) {
    toast(input);
    console.info(input);
}
function ToastWarn(input) {
    toast(input);
    console.warn(input);
}
function ToastError(input) {
    toast(input);
    console.error(input);
}
function SetTimer() {
    rawInput('填报时间（小时与分钟均用两位数字表示）：', storage.get('runAt').hour + ':' + storage.get('runAt').minute, input => {
        if (new RegExp(/^(?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/).test(input)) {
            runAt.setHours(input.split(':')[0]);
            if (input === '00:00' || input === new Date().toTimeString().substring(0, 5))
                runAt.setMinutes(parseInt(input.split(':')[1]) + 1);
            else
                runAt.setMinutes(input.split(':')[1]);
        }
        else
            ToastWarn('时间格式不正确，将使用默认值 07:00。');
        complete = false;
        storage.put('runAt', { hour: runAt.toTimeString().substring(0, 2), minute: runAt.toTimeString().substring(3, 5) });
        ToastInfo('设置填报时间为 ' + runAt.toTimeString().substring(0, 5) + '。');
    });
}
events.broadcast.on('requestStatusText', () => {
    var n = engines.myEngine().getSource().toString().split('/')[engines.myEngine().getSource().toString().split('/').length - 1];
    events.broadcast.emit('respondStatusText', {
        name: n,
        text: n + ' 正在运行，将于 ' + runAt.toTimeString().substring(0, 5) + ' 填报。'
    });
});
var storage = storages.create('life.his2nd.autofillin2');
var runAt = new Date();
runAt.setHours(7);
runAt.setMinutes(0);
runAt.setSeconds(0);
if (typeof storage.get('runAt') === 'undefined')
    storage.put('runAt', { hour: runAt.toTimeString().substring(0, 2), minute: runAt.toTimeString().substring(3, 5) });
var running = false;
var complete = false;
var w = floaty.rawWindow(
    <vertical gravity="center">
        <img id="icon" w="32" h="32" src="data:image/png;base64,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" />
    </vertical>
);
w.setPosition(device.width - 128, device.height / 2);
w.setTouchable(true);
w.icon.visibility = 8;
w.icon.click(function () {
    SetTimer();
});
ToastInfo('点击沙漏图标以设置填报时间，如不设置，将使用默认值 07:00。');
setInterval(() => {
    var sta = context.resources.configuration.orientation;
    sta === 2 ? ui.run(() => { w.icon.visibility = 8 }) : ui.run(() => { w.icon.visibility = 0 });
    if (new Date().toTimeString().substring(0, 5) === '00:00')
        complete = false;
    if (new Date().toTimeString().substring(0, 5) === runAt.toTimeString().substring(0, 5))
        FillIn();
}, 1000);
toastLog('运行启动测试，如向您请求启动，请允许。');
launch('com.alibaba.android.rimet');
waitForPackage('com.alibaba.android.rimet');
app.startActivity('console');
toastLog('等待。');
function FillIn() {
    if (running || complete)
        return;
    running = true;
    ToastInfo('开始填报。');
    if (!device.isScreenOn()) {
        device.wakeUp();
        sleep(2000);
        swipe(device.width / 2, device.height, device.width / 2, device.height / 2, 100);
        sleep(2000);
    }
    device.keepScreenDim(5 * 60 * 1000);
    launch('com.alibaba.android.rimet');
    waitForPackage('com.alibaba.android.rimet');
    var item = id('home_app_recycler_view').findOne(5000);
    if (item) {
        item.children()[2].click();
        sleep(2000);
    }
    else {
        ToastError('未找到“工作台”，填报失败。');
        device.cancelKeepingAwake();
        app.startActivity('console');
        complete = true;
        running = false;
        return;
    }
    var fillInBtn = className('android.view.View').text('黑龙江科技大学2021年暑期学生健康数据填报')
        .findOne(5000);
    if (fillInBtn) {
        fillInBtn.click();
        sleep(2000);
    }
    else {
        ToastError('未找到“黑龙江科技大学2021年暑期学生健康数据填报”，填报失败。');
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
        ToastError('未找到“今天”，填报失败。');
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
        ToastError('未找到“获取”，填报失败。');
        device.cancelKeepingAwake();
        app.startActivity('console');
        complete = true;
        running = false;
        return;
    }
    var submitBtn = text('提交').findOne(5000);
    if (submitBtn) {
        submitBtn.click();
        ToastInfo('填报完成。');
    }
    else {
        ToastError('未找到“提交”，填报失败。');
        app.startActivity('console');
    }
    device.cancelKeepingAwake();
    complete = true;
    running = false;
    return;
}

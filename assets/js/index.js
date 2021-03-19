
// 初始化页面结构
getUserInfo();
function getUserInfo() {
    // 发送axios请求获取数据  渲染昵称和头像
    axios.get('/my/userinfo', {
        // 发送请求头信息
        // headers: {
        //     // 传递身份信息
        //     Authorization: localStorage.getItem('token')
        // }
    }).then(function (res) {
        // 获取用户的基本数据
        let info = res.data.data;
        //判断昵称是否为空  如果为空就用户名代替
        let name = info.nickname || info.username;
        // 欢迎你 用户名（优先使用nickname、没有的话，使用username）
        $('#welcome').text('欢迎 ' + name);
        // 获取用户头像信息 渲染到页面  判断如果没有头像信息就用文本头像代替
        if (info.user_pic) {
            $('.layui-nav-img').attr('src', info.user_pic).show();
            $('.text-avatar-box').hide();
        } else {
            $('.layui-nav-img').hide();
            $('.text-avatar-box').show().children().text(name[0].toUpperCase());
        }
    })
}

$(function () {
    // 加载layer模块
    let layer = layui.layer;
    //点击退出
    $('#btnLogout').click(function () {
        // 确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 确认退出 删除认证信息 'token', 并且返回登录页面
            localStorage.removeItem('token');
            // 并且返回登录页面
            location.href = 'login.html';
            // 关闭 询问框
            layer.close(index);
        });
    })
})
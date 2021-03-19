$(function () {
    // 注册表单
    $('#showReg').click(function () {
        // 隐藏登录表单
        $('.login-form').hide();
        // 显示注册表单
        $('.reg-form').show();
    })
    // 登录表单
    $('#showLogin').click(function () {
        // 显示登录表单
        $('.login-form').show();
        // 隐藏注册表单
        $('.reg-form').hide();
    })

    // 自定义表单验证
    let form = layui.form;
    // 赋值 layui.layer 方法
    let layer = layui.layer;
    // 使用自定义表单验证方法
    form.verify({
        // 获取再次确认密码框的数据
        samePass: function (value) {
            //value：表单的值、item：表单的DOM对象
            // 获取密码框的数值
            let regi_pass = $('#regi_pass').val();
            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value !== regi_pass) {
                //弹出错误信息
                return '两次密码不一致!!!';
            }
        }
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        , pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ]
    });

    //点击注册发送请求
    $('.reg-form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        //获取表单name属性的数据值
        let data = $(this).serialize();
        //发送axios请求
        axios.post('/reguser', data).then(function (res) {
            //判断注册状态
            if (res.data.status !== 0) {
                // 弹出 注册错误信息
                return layer.msg(res.data.message);
            }
            //弹出注册成功信息
            layer.msg('注册成功');
            //触发登录表单
            $('#showLogin').click();
        })
    })
    
    // 点击发送登录请求
    $('.login-form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        //获取表单name属性的数据值
        let data = $(this).serialize();
        //发送axios请求
        axios.post('/api/login', data).then(function (res) {
            //判断注册状态
            if (res.data.status !== 0) {
                // 弹出 注册错误信息
                return layer.msg(res.data.message);
            }
            // 往浏览器存储 token 信息
            localStorage.setItem('token', res.data.token)
            //弹出注册成功信息
            layer.msg('登录成功', {
                icon: 6,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                //do something  // 跳转页面
                location.href = 'index.html';
            });
        })
    })
})
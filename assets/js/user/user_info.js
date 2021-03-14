$(function () {
    let form = layui.form;
    // 函数自执行
    renderForm();
    function renderForm() {
        // 发送axios请求 获取用户基本数据
        axios.get('/my/userinfo').then(res => {
            //给表单赋值
            form.val("formTest", res.data.data);
            //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
        })
    }
    // 自定义判断条件
    form.verify({
        leg: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (value.length > 6) {
                return '昵称长度需要在1-6个字符';
            }
        }
    });
    // 触发表单submit事件
    $('#form').on('submit', function (e) {
        // 阻止表单默认行为
        e.preventDefault();
        // 获取form表单name值
        let data = $(this).serialize();
        //发送axios请求
        axios.post('/my/userinfo', data).then(res => {
             // 如果 响应的信息为错误 执行下列代码
            if (res.data.status !== 0) {
                return layer.msg(res.data.message);
            }
            // 如果 响应的信息为正确 执行下列代码
            layer.msg(res.data.message);
            // 调用当前页面的父页面getUserInfo()方法
            window.parent.getUserInfo();
        })
    })
    // 点击重置按钮
    $('#btnReset').on('click', function (e) {
        // 阻止重置按钮的默认刷新行为
        e.preventDefault();
        // 调用renderForm()方法  重新发送axios请求  重新渲染
        renderForm();
    })
})
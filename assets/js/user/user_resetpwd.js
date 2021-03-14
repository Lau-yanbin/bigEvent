$(function () {
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 判断新密码与原密码是否相同?
        samePwd: function (value) {
            // 如果新密码与原密码相同 执行以下条件
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不能与原密码相同!';
            }
        },
        // 两次新密码是否一致?
        rePwd: function (value) {
            // 如果两次新密码不一致 执行以下条件
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致!'
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
        axios.post('/my/updatepwd', data).then(res => {
            // 如果 响应的信息为错误 执行下列代码
            if (res.data.status !== 0) {
                return layer.msg(res.data.message);
            }
            // 如果 响应的信息为正确 执行下列代码
            layer.msg(res.data.message);
            // 清空form表单
            $('#form')[0].reset();
        })
  })
})
$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    let options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 点击上传头像
    $('#btnChooseImage').on('click', function () {
        //绑定点击事件
        $('#file').click();
    })
    // 触发上传按钮的change事件 
    $('#file').on('change', function () {
        // 获取 用户选择的文件
        let file = this.files[0];
        // 根据选择的文件对象，生成一个临时的url，用于访问被选择的图片
        let newImgURL = URL.createObjectURL(file);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 点击确定按钮 发送axios请求
    $('#btnCreateAvatar').on('click', function () {
        // 将裁剪后的图片，输出为 base64 格式的字符串
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 剪裁得到一张图片（canvas图片）
        // let base64Str = $image.cropper("getCroppedCanvas", {
        //     // 创建一个 Canvas 画布
        //     width: 100,
        //     height: 100,
        // });

        // // 把图片转成base64格式
        // let dataURL = base64Str.toDataURL("image/png"); // 把canvas图片转成base64格式的字符串
        
        // 发送axios请求
        axios.post('/my/update/avatar', 'avatar=' + encodeURIComponent(dataURL)).then(res => {
            // 判断 响应状态 如果错误 执行下列代码
            if (res.data.status !== 0) {
                return layer.msg(res.data.message);
            }
            // 如果正确 执行下列代码
            layer.msg(res.data.message);
            // 调用当前页面的父页面getUserInfo()方法
            window.parent.getUserInfo();
        })
    })
})
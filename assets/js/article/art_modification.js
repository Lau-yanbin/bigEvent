$(function () {
    // layer 全局配置
    let form = layui.form;
    let layer = layui.layer;
    // 发axios请求 获取文章分类列表
    axios.get('/my/article/cates').then(res => {
        // 遍历数组 
        res.data.data.forEach(item => {
            // 动态创建option添加到下拉框中
            $(`<option value="${item.Id}">${item.name}</option>`).appendTo($("[name=cate_id]"));
        })
        // 当option创建添加到下拉框之后，手动更新form表单全部内容
        form.render();
    })
    // 不仅要弹出层，而且还需要获取到对应Id这条数据信息填充到表单中
    let sum = sessionStorage.getItem('id')

    // let query = {
    //     pagenum: 1, // 是	int	页码值
    //     pagesize: 2, // 是	int	每页显示多少条数据
    //     cate_id: "", // "" 所有的文章分类 否	string	文章分类的 Id
    //     state: "", // "" 所有状态 文章状态  可选值有：已发布、草稿
    // }

    // 发送axios请求
    axios.get('/my/article/' + sum, {
        // 请求参数  query是参数变量
        // params: query,
    }).then(res => {
        // 判断 响应状态
        if (res.data.status !== 0) {
            // 状态失败
            return layer.msg(res.data.message);
        }
        // 把获取的数组存到临时变量
        let str = res.data.data;
        // 给对应的表单赋值
        form.val("formTest", {
            Id: str.Id,
            title: str.title,
            cate_id: str.cate_id,
            content: str.content
        });
    })
    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击选择封面按钮 绑定上传文件
    $('#btnChooseCoverImage').on('click', function () {
        // 触发上传点击事件
        $('#fileCover').click();
    })

    // 触发上传按钮的change事件
    // 当文件域的内容改变的时候，更换图片
    $('#fileCover').change(function () {
        // 1. 找到选择的图片（文件对象）
        let file = this.files[0];
        // 判断 用户是否选择图片
        if (!file) {
            // 如果没有选择图片就退出执行
            return;
        }
        // 2. 根据文件对象，生成一个临时的url，用于访问被选择的图片
        let newImgURL = URL.createObjectURL(file)
        // 3. 更换剪裁区的图片的src属性
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    let state; // 定义全局变量
    $('#btnPublish').click(() => state = '已发布')
    // 点击已发布按钮 触发点击事件 修改state变量的值
    $('#btnSave').click(() => state = '草稿')
    // 点击草稿按钮 触发点击事件 修改state变量的值

    // 触发表单submit事件
    $('form').on('submit', function (e) {
        // 阻止表单默认行为
        e.preventDefault();

        // 剪裁得到一张图片（canvas图片）
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(blob => {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到blob文件对象后，进行后续的操作 ==> 通过 FormData来收集数据， ajax提交数据

                // 创建(获取)表单数据的序列化(将数据编译成键值对)
                let fd = new FormData(this)
                // 手动添加表单的cover_img的属性并赋值
                fd.append('linkicon', );
                // 手动添加表单的state的属性并赋值
                fd.append('state', state);

                // 发送axios请求 上传修改的数据
                axios.post("/my/article/add", fd).then((res) => {
                    // 判断 响应状态
                    if (res.data.status !== 0) {
                        // 状态失败
                        return layer.msg(res.data.message);
                    }
                    // 状态成功则跳转页面
                    location.href = '../../../article/art_list.html';
                })
            })
    })
})

$(function () {
    // layer 全局配置
    let layer = layui.layer;
    let form = layui.form;

    // 封装类别功能方法(添加与编辑)!!!
    let getId = () => `<!-- Id名称 -->
            <div class="layui-form-item layui-hide">
                <label class="layui-form-label">分类Id</label>
                <div class="layui-input-block">
                    <input type="text" name="Id" required readonly lay-verify="required" placeholder="请输入Id" autocomplete="off" class="layui-input">
    </div>
    </div>`;
    let getEdit = () => `<button type="reset" id="reset" class="layui-btn layui-btn-primary">重置</button>`;

    // 初始化表单
    getCates();
    function getCates() {
        // 发送axios请求 
        axios.get('/my/article/cates').then(res => {
            // 判断 响应状态
            if (res.data.status !== 0) {
                // 状态失败
                return layer.msg(res.data.message);
            }
            // 获取成功
            layer.msg(res.data.message);
            // 添加前先清空表单
            $('tbody').empty();
            // 把数据显示到页面中 (渲染tr)
            res.data.data.forEach((item) => {
                $(` <tr data-id=${item.Id}>
                    <td>${item.name}</td>
                    <td>${item.alias}</td>
                    <td>
                      <button type="button" class="layui-btn layui-btn-xs btn_edit">编辑</button>
                      <button  type="button" class="layui-btn layui-btn-xs layui-btn-danger btn_delete">删除</button>
                    </td>
                  </tr>`).appendTo($('tbody'));
            });
        })
    }

    // =================== 添加类别功能 ===================
    let formStr = (id, add, callback, list) => `<form id="${id}" class="layui-form" lay-filter="formTest"  action="" style="margin-top: 15px; margin-right: 50px;">
            ${list && list()}
            <!-- 第一行 分类名称 -->
            <div class="layui-form-item">
                <label class="layui-form-label">分类名称</label>
                <div class="layui-input-block">
                  <input type="text" name="name" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
    </div>
    </div>
            <!-- 第二行 分类别名  -->
            <div class="layui-form-item">
                <label class="layui-form-label">分类别名</label>
                <div class="layui-input-block">
                  <input type="text" name="alias" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
    </div>
    </div>
            <!-- 第三行 按钮 -->
            <div class="layui-form-item"> 
                <div class="layui-input-block">
                  <button class="layui-btn" lay-submit lay-filter="formDemo">${add}</button>
               ${callback && callback()}
    </div>
    </div>
  </form>`;

    // index变量存储弹出层的索引
    //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。
    let index;

    // 点击类别添加执行
    $('#btnAddCate').on('click', function () {
        // 自定义 输入框配置项(弹出层 赋值给变量 以便后续关闭)
        //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。
        index = layer.open({
            type: 1, // 层类型 （1 ==> 页面层）
            title: '添加文章类别',
            // 调用类别功能方法
            content: formStr('addForm', '确认添加', getEdit, ''),
            area: ['500px', '251px'] // 定义宽高
        });
        //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。
    })

    //点击确认添加执行
    // 坑：由于addForm是动态创建的，所以需要注册事件委托!!!
    $('body').on('submit', '#addForm', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 收集表单数据
        let data = $(this).serialize();
        // 发送axios请求
        axios.post('/my/article/addcates', data).then(res => {
            // 判断 响应状态
            if (res.data.status !== 0) {
                // 状态失败
                return layer.msg(res.data.message);
            }
            // 获取成功
            // 1. 关闭弹出层
            layer.close(index)
            // 2. 重新发送ajax获取最新的分类数据，渲染展示到页面
            getCates();
        })
    })

    //删除功能
    // 编辑和删除按钮都是动态创建生成的，所以需要事件委托
    $('body').on('click', '.btn_delete', function () {
        // 先获取到Id的值 ==> 在按钮上使用自定义属性存储了Id的值
        let id = $(this).parents('tr').attr('data-id')
        // 弹出询问框
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 发送axios请求 删除对应数据
            axios.get('/my/article/deletecate/' + id).then(res => {
                // 判断 响应状态
                if (res.data.status !== 0) {
                    // 状态失败
                    return layer.msg(res.data.message);
                }
                // 获取成功
                layer.msg(res.data.message);
                // 重新发送ajax获取最新分类数据
                getCates();
            })
            layer.close(index);
        });
    })

    //编辑按钮点击功能
    let id; // 全局 自定义属性存储了Id的值  下面实现编辑功能要用到
    // let give;  // 方法二  重置按钮要用到
    $('body').on('click', '.btn_edit', function () {
        // 自定义 输入框配置项(弹出层 赋值给变量 以便后续关闭)
        //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。
        index = layer.open({
            type: 1, // 层类型 （1 ==> 页面层）
            title: '修改文章类别',
            // 调用类别功能方法
            content: formStr('editForm', '确认修改', '', getId),
            area: ['500px', '251px'] // 定义宽高
        });
        //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。

        // 不仅要弹出层，而且还需要获取到对应Id这条数据信息填充到表单中
        id = $(this).parents('tr').attr('data-id')
        // 发送axios请求
        axios.get('/my/article/cates/' + id).then(res => {
            // 判断 响应状态
            if (res.data.status !== 0) {
                // 状态失败
                return layer.msg(res.data.message);
            }

            // 给表单赋值 填充表单数据
            form.val("formTest", res.data.data);

            // 方法二  重置按钮要用到
            // give = res.data.data;
        })
    })

    // 实现编辑功能
    $('body').on('submit', '#editForm', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 方法二用!!!
        // let data = $(this).serialize() + `&Id=${id}`;

        // 收集表单数据
        let data = $(this).serialize();

        // 需要注意：
        // 1. 该ajax接口，除了需要有name 和 alias 的数据，还需要有数据的Id
        // 2. 如何处理： 在form表单中，添加个name为Id的输入框，方便通过serialize方法收集到Id数据
        // 3. 细节： name为Id的输入框，无需看见，添加类名 layui-hide

        // 发送axios请求
        axios.post('/my/article/updatecate', data).then(res => {
            // 判断 响应状态
            if (res.data.status !== 0) {
                // 状态失败
                return layer.msg(res.data.message);
            }
            // 1. 关闭弹出层
            layer.close(index)
            // 2. 重新发送ajax获取最新分类数据
            getCates();
        })
    })

    // 点击重置按钮  方法二用!!!
    // $('body').on('click', '#reset', function (e) {
    //     console.log(give);
    //     // 阻止重置按钮的默认刷新行为
    //     e.preventDefault();
    //     // 调用getCates()方法  重新发送axios请求  重新渲染
    //     //给表单赋值
    //     form.val("formTest", give);
    // })
})
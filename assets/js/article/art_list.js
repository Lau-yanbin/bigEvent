
$(function () {
    // layer 全局配置
    let laypage = layui.laypage;
    let layer = layui.layer;
    let form = layui.form;
    // 发送axios请求 要传递的参数 
    let query = {
        pagenum: 1, // 是	int	页码值
        pagesize: 2, // 是	int	每页显示多少条数据
        cate_id: "", // "" 所有的文章分类 否	string	文章分类的 Id
        state: "", // "" 所有状态 文章状态  可选值有：已发布、草稿
    }

    // 初始化结构页面结构
    getList();
    function getList() {
        // 发送axios请求
        axios.get('/my/article/list', {
            // 请求参数  query是参数变量
            params: query,
        }).then(res => {
            // 生成结构前 先清空列表
            $('tbody').empty();
            // 遍历响应参数  动态添加列表
            res.data.data.forEach(item => {
                $(`<tr>
                <td>${item.title}</td>
                <td>${item.cate_name}</td>
                <td>${getTime(item.pub_date)}</td>
                <td>${item.state}</td>
                <td>
                  <button type="button" data-id="${item.Id}" class="layui-btn layui-btn-xs btn_edit">编辑</button>
                  <button type="button" data-id="${item.Id}" class="layui-btn layui-btn-danger layui-btn-xs btn_delete">删除</button>
                </td>
              </tr>`).appendTo($('tbody'))
            })
            // 调用分页切换功能
            renderLayPage(res);
        })
    }

    // 实现点击分页切换功能
    function renderLayPage(res) {
        // 创建一个 laypage分页实例
        laypage.render({
            // 分页区域 容器盒子的Id
            elem: 'page-box',         // 注意，这里的 test1 是 ID，不用加 # 号
            count: res.data.total,    // 数据总数，从服务端得到
            curr: query.pagenum,      // 起始页。一般用于刷新类型的跳页以及HASH跳页。
            limit: query.pagesize,    // 每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],   // 自定义排版。
            limits: [1, 2, 5, 10, 20],  // 每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框
            // jump - 切换分页的回调
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                // jump 回调函数的触发时机
                // 第一种情况. laypage.render 初始化渲染分页的时候就会触发一次  first 为 true
                // 第二种情况. 点击分页切换的时候，也会触发 first 为 undefined

                // 在发送请求之前 修改下query查询参数里面的pagenum值
                query.pagenum = obj.curr;
                // 首次（初始化渲染分页的时候）不执行 (判断是否为默认执行 当first为true时 为默认 选择不执行 反之手动执行发送axois请求 )
                if (!first) {
                    //do something
                    // 重新发送ajax获取最新数据  初始化结构页面结构
                    getList();
                }
            }
        });
    }

    // 获取分类数据
    // 发axios请求 获取文章分类列表
    axios.get('/my/article/cates').then(res => {
        // 遍历数组 
        res.data.data.forEach(item => {
            // 动态添加文章类别
            $(`<option value="${item.Id}">${item.name}</option>`).appendTo($('#cateSelect'))
        })
        // 当option创建添加到下拉框之后，手动更新form表单全部内容
        form.render();
    })

    // 实现筛选功能 
    $('#form').on('submit', function (e) {
        // 取消表单默认提交行为
        e.preventDefault();
        // 在发送请求之前，还需要修改下query查询参数里面的cate_id 以及 state 值
        query.cate_id = $('#cateSelect').val();
        query.state = $('#stateSelect').val();
        // 筛选的时候，筛选出第一页的数据来查看(解决小bug)
        query.pagenum = 1;
        // 2. 重新发送ajax获取最新数据  初始化结构页面结构
        getList();
    })

    // 初始化时间格式
    function getTime(time) {
        // 1. 将time 转成对应的日期对象
        let date = new Date(time);
        // 2. 有了日期对象，可以去使用对应的方法来得到需要的年 月 日 ...
        let yy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        // 补零函数
        function addZero(n) {
            return n < 10 ? '0' + n : n
        }
        // 需要将需要的时间格式给返回出去
        return `${addZero(yy)}/${addZero(mm)}/${addZero(dd)} ${addZero(h)}:${addZero(m)}:${addZero(s)}`;
    }

    // 点击删除功能
    // 编辑和删除按钮都是动态创建生成的，所以需要事件委托
    $('body').on('click', '.btn_delete', function () {
        // 先获取到Id的值 ==> 在按钮上使用自定义属性存储了Id的值
        let id = $(this).attr('data-id');
        // 判断当前的窗口删除按钮的个数
        // 当前页面中，只有一个删除按钮了，页码 - 1，就可以展示上一页数据
        if ($('.btn_delete').length === 1) {
            // 如果为一个 则页码 = 1
            if (query.pagenum === 1) {
                query.pagenum = 1;
            } else {
                // 如果不等于一 页码 - 1，就可以展示上一页数据
                query.pagenum--;
            }
        }

        // 弹出询问框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            if ($('#cateSelect'))
                // 发axios请求 删除对应数据
                axios.get('/my/article/delete/' + id).then(res => {
                    // 判断 响应状态
                    if (res.data.status !== 0) {
                        // 状态失败
                        return layer.msg(res.data.message);
                    }
                    // 获取成功
                    layer.msg(res.data.message);
                    // 重新发送ajax获取最新分类数据
                    getList()
                })
            // 关闭询问框
            layer.close(index);
        });
    })

    // 编辑点击事件
    $('body').on('click', '.btn_edit', function () {
        // 先获取到Id的值 ==> 在按钮上使用自定义属性存储了Id的值
        let id = $(this).attr('data-id');
        // 往浏览器上 存储id 数值 (以备另外窗口使用)
        sessionStorage.setItem('id', id)
        // 跳转 修改文章页面
        location.href = '../../../article/art_modification.html';
    })
})
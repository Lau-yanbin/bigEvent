// 优化
// 优化axios请求路径  全局配置根路径
axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net';
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 判断请求路径中是否带有'/my'的路径
    if (config.url.indexOf('/my' !== -1)) {
        // 在发送请求之前在headers中添加Authorization请求头信息
        config.headers.Authorization = localStorage.getItem('token');
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // 判断响应信息data中 status与message的状态
    if (response.data.status === 1 &&
        response.data.message === '身份认证失败！') {
        // 状态为错误 删除认证信息 'token', 并且返回登录页面
        localStorage.removeItem('token');
        location.href = 'login.html';
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
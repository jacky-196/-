console.log("加载成功");
/* 
	加载配置
*/
require.config({
	paths: {
		"jquery": "jquery-1.11.3",
		"jquery-cookie": "jquery.cookie",
		"login": "login",
	},
	//设置依赖
	"jquery-cookie": ["jquery"],
	//声明当前模块不遵从AMD
	"parabola": {
		exports: "_"
	}
})

require(["login"], function (login) {
	login.loginSend();
})
console.log("加载成功");
/* 
	加载配置
*/
require.config({
	paths: {
		"jquery": "jquery-1.11.3",
		"register": "register",
	}
})

require(["register"], function (register) {
	register.registerSend()
})
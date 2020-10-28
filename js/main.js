console.log("加载成功");

require.config({
	paths: {
		"jquery": "jquery-1.11.3",
		"jquery-cookie": "jqquery.cookie",
		"nav": "nav",
		"slide": "slide",
		"data": "data"
	},
	shim: {
		"jquery-cookie": ["jquery"]
	}
})


require(["nav", "slide", "data"], function (nav, slide, data) {
	nav.download();
	nav.banner();

	nav.leftNavTab()
	nav.topNavTab()
	nav.searchTab()

	//商品数据加载
	slide.download()
	slide.slideTab()

	//主页数据下载
	data.download()
	data.tabMenu()
})
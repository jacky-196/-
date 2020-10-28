define(["jquery", "jquery-cookie"], function ($) {
	//加载已经加入购物车的商品
	/* 
		1、cookie只存储  商品的id和数量
		2、加载数据  必须要使用商品的具体信息  数据源
			goodsCarList.json
			goodsList2.json
			【注】找出加入购物车的商品的数据（详情）
			new Promise处理两次按照顺序加载数据
	*/
	function loadCarData() {

		//清空
		$("#J_cartListBody .J_cartGoods").html("");

		new Promise(function (resolve, reject) {
			$.ajax({
				url: "../data/goodsCarList.json",
				success: function (obj) {
					resolve(obj.data);
				},
				error: function (msg) {
					reject(msg);
				}
			})
		}).then(function (arr1) {
			//下载第二份代码
			return new Promise(function (resolve, reject) {
				$.ajax({
					url: "../data/goodsList2.json",
					success: function (arr2) {
						//将两份数据合并
						var newArr = arr1.concat(arr2);
						resolve(newArr);
					},
					error: function (msg) {
						console.log(msg);
					}
				})
			})
		}).then(function (arr) {
			// console.log(arr);
			//arr 所有的商品信息  我们需要在页面上加载购物车的数据
			//通过已经加入购物车的商品  找出这些数据  那些商品被加入了购物车
			//1、在购物车中将所有的数据拿到
			var cookieStr = $.cookie("goods");
			if (cookieStr) {
				var cookieArr = JSON.parse(cookieStr);
				var newArr = [];

				for (var i = 0; i < cookieArr.length; i++) {
					for (var j = 0; j < arr.length; j++) {
						if (cookieArr[i].id == arr[j].product_id || cookieArr[i].id == arr[j].goodsid) {
							arr[j].num = cookieArr[i].num;
							//设置商品id
							arr[j].id = arr[j].product_id ? arr[j].product_id : arr[j].goodsid;
							newArr.push(arr[j]);
						}
					}
				}

				// console.log(newArr);
				//newArr 存储都是购物车中加载的商品  包括信息  数量  id
				//通过循环  将商品信息展示在页面上
				for (var i = 0; i < newArr.length; i++) {
					var node = $(`<div class="item-row clearfix" id = ${newArr[i].id}> 
					<div class="col col-check">  
						<i class="iconfont icon-checkbox icon-checkbox-selected J_itemCheckbox" data-itemid="2192300031_0_buy" data-status="1">√</i>  
					</div> 
					<div class="col col-img">  
						<a href="//item.mi.com/${newArr[i].id}" target="_blank"> 
							<img alt="" src="${newArr[i].image}" width="80" height="80"> 
						</a>  
					</div> 
					<div class="col col-name">  
						<div class="tags">   
						</div>     
						<div class="tags">  
						</div>   
						<h3 class="name">  
							<a href="//item.mi.com/${newArr[i].id}" target="_blank"> 
							${newArr[i].name} 
							</a>  
						</h3>        
					</div> 
					<div class="col col-price"> 
						${newArr[i].price}元 
						<p class="pre-info">  </p> 
					</div> 
					<div class="col col-num">  
						<div class="change-goods-num clearfix J_changeGoodsNum"> 
							<a href="javascript:void(0)" class="J_minus">
								<i class="iconfont"></i>
							</a> 
							<input tyep="text" name="2192300031_0_buy" value="${newArr[i].num}" data-num="1" data-buylimit="20" autocomplete="off" class="goods-num J_goodsNum" "=""> 
							<a href="javascript:void(0)" class="J_plus"><i class="iconfont"></i></a>   
						</div>  
					</div> 
					<div class="col col-total"> 
					${(newArr[i].price * newArr[i].num).toFixed(1)}元 
						<p class="pre-info">  </p> 
					</div> 
					<div class="col col-action"> 
						<a id="2192300031_0_buy" data-msg="确定删除吗？" href="javascript:void(0);" title="删除" class="del J_delGoods"><i class="iconfont"></i></a> 
					</div> 
				</div> `);
					node.appendTo("#J_cartListBody .J_cartGoods");
				}
				isCheckAll();
			}
		})
	}


	function download() {

		$.ajax({
			url: "../data/goodsCarList.json",
			success: function (obj) {
				var arr = obj.data;
				for (var i = 0; i < arr.length; i++) {
					$(`<li class="J_xm-recommend-list span4">    
					<dl> 
						<dt> 
							<a href="#"> 
								<img src="${arr[i].image}" srcset="//i1.mifile.cn/a1/pms_1551867177.2478190!280x280.jpg  2x" alt="小米净水器1A（厨下式）"> 
							</a> 
						</dt> 
						<dd class="xm-recommend-name"> 
							<a href="#"> 
								${arr[i].name} 
							</a> 
						</dd> 
						<dd class="xm-recommend-price">${arr[i].price}元</dd> 
						<dd class="xm-recommend-tips">   ${arr[i].comments}人好评    
							<a href="#" class="btn btn-small btn-line-primary J_xm-recommend-btn" style="display: none;" id = "${arr[i].goodsid}">加入购物车</a>  
						</dd> 
						<dd class="xm-recommend-notice">

						</dd> 
					</dl>  
				</li>`).appendTo("#J_miRecommendBox .xm-recommend ul");
				}

			},
			error: function (msg) {
				console.log(msg);
			}
		})

	}

	function cartHover() {
		//事件委托
		$("#J_miRecommendBox .xm-recommend ul").on("mouseenter", ".J_xm-recommend-list", function () {
			$(this).find(".xm-recommend-tips a").css("display", "block");
		})

		$("#J_miRecommendBox .xm-recommend ul").on("mouseleave", ".J_xm-recommend-list", function () {
			$(this).find(".xm-recommend-tips a").css("display", "none");
		})


		//通过事件委托加入购物车事件
		$("#J_miRecommendBox .xm-recommend ul").on("click", ".xm-recommend-tips .btn", function () {
			var id = this.id;

			var first = $.cookie("goods") == null ? true : false;

			//如果是第一次添加
			if (first) {
				var cookieArr = [{
					id: id,
					num: 1
				}];
				$.cookie("goods", JSON.stringify(cookieArr), {
					expires: 7,
				})
			} else {
				var same = false; //假设之前没有添加过
				var cookieStr = $.cookie("goods");
				var cookieArr = JSON.parse(cookieStr);
				for (var i = 0; i < cookieArr.length; i++) {
					if (cookieArr[i].id == id) {
						//说明之前添加过
						cookieArr[i].num++;
						same = true;
						break;
					}
				}

				if (!same) {
					//没有添加过
					var obj = {
						id: id,
						num: 1
					};
					cookieArr.push(obj);
				}

				//最后  将数据存储在cookie中
				$.cookie("goods", JSON.stringify(cookieArr), {
					expires: 7
				})
			}
			// alert($.cookie("goods"));
			isCheckAll();
			loadCarData()
			return false;
		})
	}

	//全选按钮和单选按钮添加点击
	function checkFunc() {
		//全选
		$("#J_cartBox .list-head .col-check").find("i").click(function () {
			//获取每一个单选商品的筐
			var allChecks = $("#J_cartListBody").find(".item-row .col-check").find("i");

			if ($(this).hasClass("icon-checkbox-selected")) {
				$(this).add(allChecks).removeClass("icon-checkbox-selected");
			} else {
				$(this).add(allChecks).addClass("icon-checkbox-selected");
			}
			isCheckAll();
		})


		//给每一个商品复选框设置点击
		$("#J_cartListBody .J_cartGoods").on("click", ".item-row .col-check i", function () {
			if ($(this).hasClass("icon-checkbox-selected")) {
				$(this).removeClass("icon-checkbox-selected");
			} else {
				$(this).addClass("icon-checkbox-selected");
			}
			isCheckAll();
		})
	}


	//判断有多少个被选中
	function isCheckAll() {
		var allChecks = $("#J_cartListBody").find(".item-row");
		var isAll = true; //假设都选中
		var total = 0; //计算总数
		var count = 0; //计算被选中的数量
		var totalCount = 0 //记录总数
		allChecks.each(function (index, item) {
			if (!$(item).find(".col-check i").hasClass("icon-checkbox-selected")) {
				//判断其中这件商品有没有被选中
				isAll = false;
			} else {
				total += parseFloat($(item).find(".col-price").html().trim()) * parseFloat($(this).find(".col-num input").val());
				//被选中的商品数量
				count += parseInt($(this).find(".col-num input").val());
			}
			//计算所有加在购物车的商品一个有几件
			totalCount += parseInt($(this).find(".col-num input").val());
		})

		//设置
		$("#J_selTotalNum").html(count);
		$("#J_cartTotalNum").html(totalCount);
		$("#J_cartTotalPrice").html(total.toFixed(2));
		

		//判断当前是否是全选
		if (isAll) {
			$("#J_cartBox .list-head .col-check").find("i").addClass("icon-checkbox-selected");
		} else {
			$("#J_cartBox .list-head .col-check").find("i").removeClass("icon-checkbox-selected");
		}
	}

	//给页面上的商品添加删除或者数量增减事件
	function changeCars() {
		//给每一个删除按钮添加事件
		$("#J_cartListBody .J_cartGoods").on("click", ".col-action .J_delGoods", function () {
			var id = $(this).closest(".item-row").remove().attr("id");
			// alert(id);

			//在cookie中删除
			var cookieStr = $.cookie("goods");
			var cookieArr = JSON.parse(cookieStr);
			for (var i = 0; i < cookieArr.length; i++) {
				if (id == cookieArr[i].id) {
					//删除数据
					cookieArr.splice(i, 1);
					break;
				}
			}
			cookieArr.length == 0 ? $.cookie("goods", null) : $.cookie("goods", JSON.stringify(cookieArr), {
				expires: 7
			});
			loadCarData();
			return false;
		})

		//给每一个+和-添加事件
		$("#J_cartListBody .J_cartGoods").on("click", ".J_minus,.J_plus", function () {
			//找到所有商品的id
			var id = $(this).closest(".item-row").attr("id");
			// alert(id);
			//在cookie中删除
			var cookieStr = $.cookie("goods");
			var cookieArr = JSON.parse(cookieStr);

			for (var i = 0; i < cookieArr.length; i++) {
				if (cookieArr[i].id == id) {
					//说明该商品找到
					if (this.className == "J_minus") {
						//数量-1
						cookieArr[i].num == 1 ? alert("修改数量不能小于0！") : cookieArr[i].num--;
					} else {
						cookieArr[i].num++;
					}
					break;
				}
			}

			//更新页面的商品
			$(this).siblings("input").val(cookieArr[i].num);
			//更新一下页面上单个商品的价格
			var price = parseFloat($(this).closest(".col-num").siblings(".col-price").html().trim());
			$(this).closest(".col-num").siblings(".col-total").html((price * cookieArr[i].num).toFixed(2) + "元");


			//最后要更改的数据存储在cookie
			$.cookie("goods", JSON.stringify(cookieArr), {
				expires: 7
			})

			//重新计算总价
			isCheckAll();
			return false;
		})
	}


	return {
		download: download,
		cartHover: cartHover,
		loadCarData: loadCarData,
		checkFunc: checkFunc,
		changeCars: changeCars
	}
})
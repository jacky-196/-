<?php
	header('content-type: text/html;charset="utf-8"');
	
	//定义统一返回格式
	$responseData = array("code" => 0, "message" => "");

	//现将通过post提交的数据全部取出
	$username = $_POST["username"];
	$password = $_POST["password"];
	$repassword = $_POST["repassword"];
	$createtime = $_POST["createtime"];

	//对后台接收到的数据进行一个简单的判断
	if (!$username) {
		$responseData["code"] = 1;
		$responseData["message"] = "用户名不能为空";
		//将数据按照统一的返回格式返回
		echo json_encode($responseData);
		exit;
	}
	if (!$password) {
		$responseData["code"] = 2;
		$responseData["message"] = "密码不能为空";
		//将数据按照统一的返回格式返回
		echo json_encode($responseData);
		exit;
	}
	if (!$repassword) {
		$responseData["code"] = 3;
		$responseData["message"] = "两次密码不一致";
		//将数据按照统一的返回格式返回
		echo json_encode($responseData);
		exit;
	}

	//链接数据库  判断用户名是否注册过
	//1、链接数据库
	$link = mysqli_connect("127.0.0.1:3306", "root", "IlU@1996");
	// var_dump("连接失败");

	//2、判断数据库是否链接成功
	if (!$link) {
		$responseData["code"] = 4;
		$responseData["message"] = "服务器忙";
		//将数据按照统一的返回格式返回
		echo json_encode($responseData);
		exit;
	}

	//3、设置编码集
	mysqli_set_charset($link, "utf8");

	//4、选择数据库
	mysqli_select_db($link, "xiaomi");

	//5、准备sql语句验证是否注册
	$sql = "select * from users where username='{$username}'";

	//6、发送sql语句
	$res = mysqli_query($link, $sql);

	//7、取出一行数据
	$row = mysqli_fetch_assoc($res);
	if($row){
		//注册过
		$responseData["code"] = 5;
		$responseData["message"] = "用户名重名";
		//将数据按照统一的返回格式返回
		echo json_encode($responseData);
		exit;
	}


	//密码加密
	$str = md5(md5(md5($password)."chengdu")."sichuan")."zhongguo";

	//可以注册
	$sql2 = "insert into users(username,password,createtime) values('{$username}','{$str}',{$createtime})";

	//再次发送sql语句
	$res2 = mysqli_query($link,$sql2);

	if(!$res2){
		$responseData["code"] = 6;
		$responseData["message"] = "注册失败";
		//将数据按照统一的返回格式返回
		echo json_encode($responseData);
		exit;
	}


	$responseData["message"] = "注册成功";
		//将数据按照统一的返回格式返回
	echo json_encode($responseData);

	//8、关闭数据库
	mysqli_close($link);
?>
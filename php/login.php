<?php
	header('Content-Type: text/html; charset=utf-8');
	// var_dump($_POST);
	
	/* 
		定义统一返回格式
	*/
	$responseData = array("code" => 0, "message" => "");

	$username = $_POST["username"];
	$password = $_POST["password"];

	/* 
		简单的数据验证
	*/
	if(!$username){
		$responseData["code"] = 1;
		$responseData["message"] ="用户名不能为空";
		echo json_encode($responseData);
		exit;
	}
	if(!$password){
		$responseData["code"] = 2;
		$responseData["message"] ="密码不能为空";
		echo json_encode($responseData);
		exit;
	}

	//1、链接数据库
	$link = mysqli_connect("127.0.0.1", "root", "IlU@1996");

	if(!$link){
		$responseData["code"] = 3;
		$responseData["message"] = "数据库链接失败";
		echo json_encode($responseData);
		exit;
	}

	mysqli_set_charset($link, "utf8");

	mysqli_select_db($link, "xiaomi");

	$str = md5(md5(md5($password)."chengdu")."sichuan")."zhongguo";

	//登录验证
	$sql = "select * from users where username='{$username}' and password='{$str}'";
	// echo $sql;

	$res = mysqli_query($link, $sql);

	//判断返回数据是否存在
	$row = mysqli_fetch_assoc($res);
	// echo $row;

	if(!$row){
		$responseData["code"] = 4;
		$responseData["message"] ="用户名或者密码错误";
		echo json_encode($responseData);
		exit;
	}else{
		$responseData["message"] ="登录成功";
		$responseData["username"] =$row["username"];
		echo json_encode($responseData);
	}

	mysqli_close($link);
?>
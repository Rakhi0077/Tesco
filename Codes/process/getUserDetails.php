<?php

	if (session_status() == PHP_SESSION_NONE)
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);

	$UID=$data->userId;
	
	$response=array();
	$categories=array();
	
	$query="SELECT * FROM users WHERE User_Id='$UID';";
	$result=sqlsrv_query($link,$query,$params,$options);
	$row=sqlsrv_fetch_array($result);
	$response[]=$row;
	
	$query="SELECT * FROM user_category WHERE User_Id='$UID';";
	$result=sqlsrv_query($link,$query,$params,$options);
	while ($row=sqlsrv_fetch_array($result))
		$categories[]=$row;
	
	$response[]=$categories;
	echo json_encode($response);
?>
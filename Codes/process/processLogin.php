<?php

	if (session_status() == PHP_SESSION_NONE)
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
	
	$UID=$data->user_id;
	$PWD=$data->user_passwd;
	
	$query="SELECT * FROM users WHERE User_Id='$UID' AND Passwd='$PWD';";
	$result=sqlsrv_query($link,$query,$params,$options);
	
	$response=[];
	$row=[];
	
	if (sqlsrv_num_rows($result)){
		$query="UPDATE users SET Last_Access_Date=CONVERT(date,GETDATE()) WHERE User_Id='$UID';";
		sqlsrv_query($link,$query);
		$response['status']="loggedIn";
		$response['user_id']=$UID;
		$row=sqlsrv_fetch_array($result);
		$response['user_name']=$row['User_Name'];
		$response['Geography']=$row['Geography'];
		$response['Access_Level']=$row['Access_Level'];
		$response['Master_Access']=$row['Master_Access'];
		$response['Master_Category']=$row['Master_Category'];
	}
	else{
		$response['status']="loggedOut";
	}
	echo json_encode($response);
	
?>
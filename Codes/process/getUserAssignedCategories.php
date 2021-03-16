<?php

	if (session_status() == PHP_SESSION_NONE)
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();	
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);

	$UID=$data->userId;
	$MC=$data->masterCategory;
	
	$query="SELECT * FROM users WHERE User_Id='$UID';";
	$result=sqlsrv_query($link,$query,$params,$options);
	$row=sqlsrv_fetch_array($result);
	$geography=$row['Geography'];
	$access_level=$row['Access_Level'];
	
	

	if ($access_level=="super_user")
		$query="SELECT DISTINCT Category FROM user_category WHERE User_ID='$UID' ORDER BY Category;";
	else
		$query="SELECT DISTINCT Category FROM category_level_rating WHERE Geography='$geography' AND Master_Category='$MC' ORDER BY Category;";
		 
	$result=sqlsrv_query($link,$query,$params,$options);	
	$response=[];
	
	while ($row=sqlsrv_fetch_array($result))
		$response[] =$row['Category'];
	
	echo json_encode($response);
	
?>
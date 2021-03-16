<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	$output=array();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
	
	$ID=$data->ML_ID;
	$userId=$data->userId;
	
	$query="SELECT * FROM master_level_rating WHERE ML_ID=$ID;";
	$result_1=sqlsrv_query($link, $query,$params,$options);
	$validAccess=false;
	
	if (sqlsrv_num_rows($result_1)>0){
		$row=sqlsrv_fetch_array($result_1);
		$output[]=$row;
		$requestGeography=$row['Geography'];
		
		$query="SELECT * FROM users WHERE User_Id='$userId';";
		$result_2=sqlsrv_query($link, $query,$params,$options);
		$row=sqlsrv_fetch_array($result_2);
		$userGeography=$row['Geography'];
		$userAccessLevel=$row['Access_Level'];
		
		
		if ($userAccessLevel=='super_user' && $requestGeography==$userGeography){
			$geographicAccess="YES";
			$output[]=$geographicAccess;
			echo json_encode($output);
			$validAccess=true;
		}
		
		if ($userAccessLevel=='admin' && $requestGeography==$userGeography){
			$geographicAccess="YES";
			$output[]=$geographicAccess;
			echo json_encode($output);
			$validAccess=true;
		}
		
		if ($userAccessLevel=='admin' && $requestGeography!=$userGeography){
			$geographicAccess="NO";
			$output[]=$geographicAccess;
			echo json_encode($output);
			$validAccess=true;
		}
	}
	
	if ($validAccess==false)
		echo json_encode("Invalid Access");

?>
<?php

	if (session_status() == PHP_SESSION_NONE)
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();	
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
	
	$UID=$data->userId;
	$RID=$data->RequestedID;
	
	$query="SELECT * FROM users WHERE User_Id='$UID';";
	$result=sqlsrv_query($link,$query,$params,$options);
	$row=sqlsrv_fetch_array($result);
	$UAccessLevel=$row['Access_Level'];
	$UGeography=$row['Geography'];
	
	$query="SELECT * FROM users WHERE User_Id='$RID';";
	$result=sqlsrv_query($link,$query,$params,$options);
	$row=sqlsrv_fetch_array($result);
	$RGeography=$row['Geography'];
	
	$errorFlag=false;
	$errorMessage="";
	
	if ($UID!=$RID){
		if ($UAccessLevel=="admin"){
			if ($UGeography==$RGeography){
				$query="DELETE FROM users WHERE User_Id='$RID';";
				sqlsrv_query($link,$query,$params,$options);
				
				$query="DELETE FROM user_category WHERE User_ID='$RID';";
				sqlsrv_query($link,$query,$params,$options);
			
			}
			else {
				$errorFlag=true;
				$errorMessage="You don't have delete permission of other geography users";
			}
		}
		else {
			$errorFlag=true;
			$errorMessage="Only admin have permission to delete user from user access list";
		}
	}
	else {
		$errorFlag=true;
		$errorMessage="Sorry you can't delete your Id";
	} 
	
	
	$output=array();
	$output['errorFlag']=$errorFlag;
	$output['errorMessage']=$errorMessage;
	
	echo json_encode($output);
	
?>
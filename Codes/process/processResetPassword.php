<?php

	if (session_status() == PHP_SESSION_NONE)
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
	
	$UserID=$data->userId;
	$oldPasswd=$data->oldPasswd;
	$newPasswd=$data->newPasswd;
	$ConfPasswd=$data->confPasswd;
	
	$errorFlag=false;
	$errorMessage="";
	
	
	//Old Password Validation
	//-----------------------------------------------------------------------------------------------
	$query="SELECT * FROM users WHERE User_Id='$UserID'";
	$result=sqlsrv_query($link,$query,$params,$options);
	
	if (sqlsrv_num_rows($result)>0){
		$row=sqlsrv_fetch_array($result);
		$passwd=$row['Passwd'];
		
		if ($oldPasswd!=$passwd){
			$errorFlag=true;
			$errorMessage="Old password you have entered is wrong";
			goto end;
		}
		
		if (strlen($newPasswd)<5 || strlen($ConfPasswd)<5){
			$errorFlag=true;
			$errorMessage="Password must contain atleast 5 characters";
			goto end;
		
		}
		
		if ($newPasswd!=$ConfPasswd){
			$errorFlag=true;
			$errorMessage="Confirm password must be same as new password";
			goto end;
		}	
	}
	else{
		$errorFlag=true;
		$errorMessage="Hey, be in your limit";
	}
	
	//-----------------------------------------------------------------------------------------------

	if ($errorFlag==false){
		$query="UPDATE users SET Passwd='$newPasswd' WHERE User_Id='$UserID';";
		$res=sqlsrv_query($link,$query,$params,$options);
	}
	
end:

	$output=array();
	$output['errorFlag']=$errorFlag;
	$output['errorMessage']=$errorMessage;
	
	echo json_encode($output);

?>
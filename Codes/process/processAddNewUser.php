<?php

	if (session_status() == PHP_SESSION_NONE)
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
	
	$Geography=$data->userGeography;
	$UserID=$data->userId;
	$UserName=$data->userName;
	$AccessLevel=$data->accessLevel;
	$MasterAccess=$data->masterAccess;
	$Passwd=$data->passwd;
	$ConfPasswd=$data->confPasswd;
	$MasterCategory=$data->masterCategory;
	$Categories=explode(",",implode(",", $data->categories));
	
	
	//User Id Validation
	//-----------------------------------------------------------------------------------------------
	$errorFlag=false;
	$errorMessage="";
	
	if (strlen($UserID)<12){
		$errorFlag=true;
		$errorMessage="Minimum 12 characters required in user id";
		goto end;
	}
	else{
		if (substr($UserID, strlen($UserID)-10,10)!="@tesco.com"){
			$errorFlag=true;
			$errorMessage="User id must be ended with @tesco.com";
			goto end;
		}
		else{
			$query="SELECT * FROM users WHERE User_Id='$UserID';";
			$result=sqlsrv_query($link,$query,$params,$options);
			if (sqlsrv_num_rows($result)){
				$errorFlag=true;
				$errorMessage="$UserID - already registered";
				goto end;
			}
		}
	}
	//-----------------------------------------------------------------------------------------------
	
	
	
	//User Id Validation
	//-----------------------------------------------------------------------------------------------
	if (strlen($UserName)<5){
		$errorFlag=true;
		$errorMessage="Minimum 5 characters required in user name";
		goto end;
	}
	//-----------------------------------------------------------------------------------------------
	
	
	
	//Password Validation
	//-----------------------------------------------------------------------------------------------
	if (strlen($Passwd)<5){
		$errorFlag=true;
		$errorMessage="Password must contain atleast 5 characters";
		goto end;
	}
	else{
		if ($Passwd!=$ConfPasswd){
			$errorFlag=true;
			$errorMessage="Confirm password must be same as password";
			goto end;
		}
	}
	//-----------------------------------------------------------------------------------------------
	

	
	
	//Number of categories Validation
	//-----------------------------------------------------------------------------------------------
	if (count($Categories)==0){
		$errorFlag=true;
		$errorMessage="Atleast one category must be checked";
		goto end;
	}
	//-----------------------------------------------------------------------------------------------
	
	
	if ($errorFlag==false){
		if ($Geography=='UK')
			$MasterCategory="NA";
		
		$query="INSERT INTO users(User_Id,User_Name,Geography,Access_Level,Master_Access,Master_Category,Passwd,Last_Access_Date) VALUES ('$UserID','$UserName','$Geography','$AccessLevel','$MasterAccess','$MasterCategory','$Passwd',CONVERT(date,GETDATE()));";
		$res=sqlsrv_query($link,$query,$params,$options);
		
		if ($AccessLevel!='admin'){
			for ($i=0;$i<count($Categories);$i++){
				$query="INSERT INTO user_category(User_ID,Category) VALUES ('$UserID','$Categories[$i]');";
				$res=sqlsrv_query($link,$query,$params,$options);
			}
		}
	}
	
end:


	$output=array();
	$output['errorFlag']=$errorFlag;
	$output['errorMessage']=$errorMessage;
	
	echo json_encode($output);
	
?>
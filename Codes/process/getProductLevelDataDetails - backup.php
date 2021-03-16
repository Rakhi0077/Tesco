<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
	
	$output=array();
	
	$SN=$data->Supplier_Number;
	$CD=$data->Category_Director;
	$JB=$data->Junior_Buyer;
	$userId=$data->userId;

	$query="SELECT * FROM View_Category_Junior_Level_Data WHERE Supplier_Number='$SN' AND Display_Category_Director='$CD' AND Display_Junior_Buyer='$JB';";
	$result_1=sqlsrv_query($link, $query,$params,$options);
	
	$validAccess=false;

	if (sqlsrv_num_rows($result_1)==1){
		$row=sqlsrv_fetch_array($result_1);
		$output[]=$row;
		$requestGeography=$row['Geography'];
		$requestCategory=$CD;
		
		$query="SELECT Geography,Access_Level FROM users WHERE User_Id='$userId';";
		$result_2=sqlsrv_query($link, $query,$params,$options);
		$row=sqlsrv_fetch_array($result_2);
		$userGeography=$row['Geography'];
		$userAccessLevel=$row['Access_Level'];
		
		//Access Validation for Admin
		if ($userAccessLevel=='admin'){
			if ($userGeography==$requestGeography)
				$categoryAccess="YES";
			else
				$categoryAccess="NO";
			
			$output[]=$categoryAccess;
			echo json_encode($output);
			$validAccess=true;
		}
		else{
			$query="SELECT * FROM user_category WHERE User_ID='$userId' AND Category='$requestCategory';";
			$result_3=sqlsrv_query($link, $query,$params,$options);
		
			if (sqlsrv_num_rows($result_3)>0)
				$categoryAccess="YES";
			else
				$categoryAccess="NO";
			
			if ($userAccessLevel=='super_user' && $userGeography==$requestGeography){
				$output[]=$categoryAccess;
				echo json_encode($output);
				$validAccess=true;
			}
			
			if ($userAccessLevel=='user' && $userGeography==$requestGeography && $categoryAccess=="YES"){
				$output[]=$categoryAccess;
				echo json_encode($output);
				$validAccess=true;
			}
			
		}		
	}
	
	if ($validAccess==false){
		$output[]='Invalid Access';
		echo json_encode($output);
		//echo json_encode("Invalid Access");
	}

		
?>
<?php

	if (session_status() == PHP_SESSION_NONE)
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
	
	$UID=$data->userId;
	$CA=$data->commercialCategory;

	//echo $CA;

	if ($CA=="All")
		$sub_query=" Commercial_Area LIKE '%%' ";
	else
		$sub_query=" Commercial_Area='$CA' ";
	
	
	$query="SELECT * FROM users WHERE User_Id='$UID';";
	$result=sqlsrv_query($link,$query,$params,$options);
	$row=sqlsrv_fetch_array($result);
	$access_level=$row['Access_Level'];
	$geography=$row['Geography'];
	
	/*if ($access_level=="user")
		$query="SELECT DISTINCT REPLACE(Category_Director,'&','_') AS Category_Director, Display_Category_Director FROM user_category WHERE User_ID='$UID' ORDER BY Category;";	
	else
		if ($access_level=="super_user")
			$query="SELECT DISTINCT REPLACE(Category_Area,'&','_') AS Category_Area_Value,Category_Area FROM Suppliers_List WHERE Geography='$geography' AND $sub_query AND Active_Yes_No='Yes' ORDER BY Category_Area;";
		else	
			if ($access_level=="admin"){
				$geography=$data->geography;
				if ($geography=="All")
					$query="SELECT DISTINCT REPLACE(Category_Area,'&','_') AS Category_Area_Value,Category_Area FROM Suppliers_List WHERE $sub_query AND Active_Yes_No='Yes' ORDER BY Category_Area;";
				else 
					$query="SELECT DISTINCT REPLACE(Category_Area,'&','_') AS Category_Area_Value,Category_Area FROM Suppliers_List WHERE Geography='$geography' AND $sub_query AND Active_Yes_No='Yes' ORDER BY Category_Area;";
			}
	*/
	if ($access_level=="user")
		$query="SELECT DISTINCT REPLACE(Display_Category,'&','_') AS Category_Area_Value, Display_Category as Category_Area FROM user_category WHERE User_ID='$UID' ORDER BY Display_Category;";	
	else	
		$query="SELECT DISTINCT REPLACE(Category_Area,'&','_') AS Category_Area_Value,Category_Area FROM Suppliers_List_Category_Tab WHERE $sub_query AND Active_Yes_No='Yes' ORDER BY Category_Area;";
		

	//echo $query;	
	$result=sqlsrv_query($link,$query,$params,$options);	
	$response=[];
	$row=[];
	//$row['Category_Area_Value']='All';
	//$row['Category_Area']='All';
	
	//$response[]=$row;
	while ($row=sqlsrv_fetch_array($result)){
		//echo $row['Category_Area_Value'];
		$response[] =$row;
	}

	echo json_encode($response);
	
	
?>
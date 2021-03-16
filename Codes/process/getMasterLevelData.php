<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	$output=array();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
		
	$UID=$data->userId;
	$geography=$data->geography;
	$department=$data->department;
	$rating=$data->rating;
	$overallrating=$data->overallrating;
	$category=$data->category;
	$strategy=$data->strategy;
	
	$query="SELECT * FROM users WHERE User_Id='$UID';";
	$result=sqlsrv_query($link,$query,$params,$options);
	$row=sqlsrv_fetch_array($result);
	$access_level=$row['Access_Level'];
	
	
	//Manage Geography Data
	//----------------------------------------------------------------------------------------
	if ($access_level=="user" || $access_level=="super_user"){
		$geography=$row['Geography'];
		$sub_query_1=" Geography='$geography' ";
	}
	else {
		if ($geography=="All")
			$sub_query_1=" Geography LIKE '%%' ";
		else
			$sub_query_1=" Geography='$geography' ";
	}
	//----------------------------------------------------------------------------------------
	
	
	if ($strategy=="All")
		$sub_query_2=" Strategy LIKE '%%' ";
	else
		$sub_query_2=" Strategy='$strategy' ";
	
	
	
	//Manage Category Data
	//----------------------------------------------------------------------------------------
	if ($access_level=="user"){
		if ($category=="All"){
			$query="SELECT Category FROM user_category WHERE User_ID='$UID';";
			$result=sqlsrv_query($link,$query,$params,$options);
			$NumberOfCategories=sqlsrv_num_rows($result);
			$catString="";
			while ($row=sqlsrv_fetch_array($result)){
				$catString=$catString."'".$row['Category']."'";
				$NumberOfCategories=$NumberOfCategories-1;
				if ($NumberOfCategories!=0)
					$catString=$catString.",";
			}
			
			$sub_query_3=" Category in ($catString) ";
		}
		else
			$sub_query_3=" Category='$category' ";
	}
	else{
		if ($category=="All")
			$sub_query_3=" Category LIKE '%%' ";
		else
			$sub_query_3=" Category LIKE '%$category%' ";
	}
	
	
	//----------------------------------------------------------------------------------------
	
	
	$sub_query_4=" Overall_Rating BETWEEN  $overallrating";
	
	
	if ($department=="All" AND $rating=="All")
		$query="SELECT * FROM master_level_rating WHERE $sub_query_1 AND $sub_query_2 AND $sub_query_3 AND $sub_query_4 ORDER BY Category,Supplier_Name;";
		
	if ($department=="All" AND $rating!="All")
		$query="SELECT * FROM master_level_rating WHERE $sub_query_1 AND $sub_query_2 AND $sub_query_3 AND $sub_query_4 AND Supply_Chain_Rating=$rating AND Technical_Rating=$rating AND NPD_Rating=$rating AND Buying_Rating=$rating ORDER BY Category,Supplier_Name;";
			 
	if ($department!="All" AND $rating=="All")
		$query="SELECT * FROM master_level_rating WHERE $sub_query_1 AND $sub_query_2 AND $sub_query_3 AND $sub_query_4 ORDER BY Category,Supplier_Name;";
				
	if ($department!="All" AND $rating!="All")
		$query="SELECT * FROM master_level_rating WHERE $sub_query_1 AND $sub_query_2 AND $sub_query_3 AND $sub_query_4 AND $department=$rating ORDER BY Category,Supplier_Name;";
						
					
	$result=sqlsrv_query($link,$query,$params,$options);
		
	if (sqlsrv_num_rows($result)>0){
		while ($row=sqlsrv_fetch_array($result)) {
			$output[]=$row;
		}	
	}
	echo json_encode($output);
?>
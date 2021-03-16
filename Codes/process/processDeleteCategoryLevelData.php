<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	$output=array();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
	
	$ID=$data->CL_ID;
	$userId=$data->userId;
	
	$query="SELECT * FROM category_level_rating WHERE CL_ID='$ID';";
	$result_1=sqlsrv_query($link, $query,$params,$options);
	
	$validAccess=false;
	
	
	if (sqlsrv_num_rows($result_1)>0){
		$row=sqlsrv_fetch_array($result_1);
		$requestGeography=$row['Geography'];
		$requestCategory=$row['Category'];
		$supplierNumber=$row['Supplier_Number'];
		$supplierName=$row['Supplier_Name'];
		
		$query="SELECT Geography,Access_Level FROM users WHERE User_Id='$userId';";
		$result_2=sqlsrv_query($link, $query,$params,$options);
		$row=sqlsrv_fetch_array($result_2);
		$userGeography=$row['Geography'];
		$userAccessLevel=$row['Access_Level'];
		
		if ($userAccessLevel=='admin' && $userGeography==$requestGeography){
			$validAccess=true;
		}
		else{
			if ($userAccessLevel=='super_user' && $userGeography==$requestGeography){
				$query="SELECT * FROM user_category WHERE User_ID='$userId' AND Category='$requestCategory';";
				$result_3=sqlsrv_query($link, $query,$params,$options);
				
				if (sqlsrv_num_rows($result_3)>0)
					$validAccess=true;
			}
		}
	}
		
	if ($validAccess==false)
		echo json_encode("Invalid Access");
	else{
		$query="INSERT INTO deleted_category_level_rating(User_ID,Deleted_Date_Time,CL_ID,Supplier_Number,Supplier_Name, Product_Supplied,Supplier_Code_TTL,Future_Capability,Supplier_Categorization,Master_Category,Category,Number_of_Sites, This_Year_Sales,YOY_Changes,This_Year_Units,This_Year_Margin,Supply_Chain_Rating, Technical_Rating,NPD_Rating, Buying_Rating,Overall_Rating,Strategy,Comments,Geography) SELECT '$userId',GETDATE(),CL_ID,Supplier_Number,Supplier_Name, Product_Supplied,Supplier_Code_TTL,Future_Capability,Supplier_Categorization,Master_Category,Category,Number_of_Sites, This_Year_Sales,YOY_Changes,This_Year_Units,This_Year_Margin,Supply_Chain_Rating, Technical_Rating,NPD_Rating, Buying_Rating,Overall_Rating,Strategy,Comments,Geography FROM category_level_rating WHERE CL_ID='$ID';";
		sqlsrv_query($link, $query,$params,$options);
		$query="DELETE FROM category_level_rating WHERE CL_ID='$ID';";
		sqlsrv_query($link, $query,$params,$options);
		
		echo json_encode("Supplier (".$supplierNumber." ".$supplierName." ) has been deleted");
	}
	
	
?>
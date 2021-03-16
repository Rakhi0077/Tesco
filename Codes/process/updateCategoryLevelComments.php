<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
		
	$output=array();
	
	$ID=$data->CL_ID;
	$userID=$data->userID;
	$C=$data->Comments;
	
	$query="SELECT * FROM category_level_rating WHERE CL_ID='$ID';";
	$result=sqlsrv_query($link, $query,$params,$options);
	$row=sqlsrv_fetch_array($result);
	
	if ($row['Comments']!=$C){
		
		$query="UPDATE category_level_rating SET Comments='$C' WHERE CL_ID='$ID';";
		sqlsrv_query($link, $query,$params,$options);
			
		$query="INSERT INTO log_category_level_rating(CL_ID,User_Id,Last_Modified_Date_Time,Supplier_Number,Supplier_Name, Product_Supplied,Supplier_Code_TTL,Future_Capability,Supplier_Categorization,Master_Category,Category,Number_of_Sites,Sites_Code,Sites_Name,This_Year_Sales,YOY_Changes,This_Year_Units,This_Year_Margin,Supply_Chain_Rating, Technical_Rating,NPD_Rating, Buying_Rating,Overall_Rating,Strategy,Comments,Geography) SELECT CL_ID,'$userID' AS User_Id,GETDATE() AS  Last_Modified_Date_Time,Supplier_Number,Supplier_Name, Product_Supplied,Supplier_Code_TTL,Future_Capability,Supplier_Categorization,Master_Category,Category,Number_of_Sites,Sites_Code,Sites_Name,This_Year_Sales,YOY_Changes,This_Year_Units,This_Year_Margin,Supply_Chain_Rating, Technical_Rating,NPD_Rating, Buying_Rating,Overall_Rating,Strategy,Comments,Geography FROM category_level_rating WHERE CL_ID='$ID';";
		sqlsrv_query($link, $query,$params,$options);
	}
	
?>
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
	
	$query="SELECT ML_ID, A.User_Id,B.User_Name,Last_Modified_Date_Time,Supplier_Number,Supplier_Name,Category,Number_of_Sites,This_Year_Sales,YOY_Changes,This_Year_Units,This_Year_Margin,Supply_Chain_Rating,Technical_Rating,NPD_Rating,Buying_Rating,Overall_Rating,Strategy,Comments,A.Geography FROM log_master_level_rating AS A LEFT JOIN users AS B ON A.User_Id=B.User_Id WHERE ML_ID='$ID' order by Last_Modified_Date_Time ;";
	$result=sqlsrv_query($link,$query,$params,$options);
		
	if (sqlsrv_num_rows($result)>0){	
		while ($row=sqlsrv_fetch_array($result)) {
			$output[]=$row;
		}
	}
	echo json_encode($output);
?>
<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);

	$output_1=array();
	$output_2=array();
	$output_3=array();
	
	$counter=0;
	
	$ID=$data->CL_ID;
	
	$query="SELECT CL_ID, A.User_Id,B.User_Name,Last_Modified_Date_Time,Supplier_Number,Supplier_Name,Product_Supplied,Supplier_Code_TTL, Future_Capability,Supplier_Categorization,A.Master_Category,Category,Number_of_Sites,Sites_Code,Sites_Name,This_Year_Sales,YOY_Changes,This_Year_Units,This_Year_Margin,Supply_Chain_Rating,Technical_Rating,NPD_Rating,Buying_Rating,Overall_Rating,Strategy,Comments,A.Geography FROM log_category_level_rating AS A LEFT JOIN users AS B ON A.User_Id=B.User_Id WHERE CL_ID='$ID' order by Last_Modified_Date_Time;";
	$result=sqlsrv_query($link,$query,$params,$options);
		
	if (sqlsrv_num_rows($result)>0){	
		while ($row=sqlsrv_fetch_array($result)) {
			$output_1[]=$row;
			$counter=$counter+1;
		}
	}
	
	
	
	/*
	if (sqlsrv_num_rows($result)>0){
		while ($row=sqlsrv_fetch_array($result)) {
			$output_2[]=$row;
		}
	}
	
	
	if ($counter>1){
		for ($i=1;$i<=$counter-1;$i++){
			if ($output_1[$i-1].Supplier_Number!=$output_2[$i].Supplier_Number)
				$output_3[$i-1].Supplier_Number="YES";
			else 
				$output_3[$i-1].Supplier_Number=false;
		}
	}
	
	*/
	
	
	echo json_encode($output_1);
?>
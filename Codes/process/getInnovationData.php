<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);

	if (isset($_GET['Supplier_Number']) && isset($_GET['userId'])){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();

		$SN=$_GET['Supplier_Number'];
		$userId=$_GET['userId'];
		
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);		
		$output=array();

		$query="SELECT Customer_Penetration_TY,Customer_Penetration_LY,Customer_Penetration_Change,New_Customers_buying_NPD_vs_Total_Base,Repeat_Rate,Innovation_Score,Innovation_Score_2 FROM Innovation_Dunnhumby_Data WHERE cast(Supplier_Number as varchar(20)) ='$SN';";
		$result=sqlsrv_query($link, $query,$params,$options);

		//echo $query;

		while ($row=sqlsrv_fetch_array($result)){
			$output[]=$row;
		}
		echo json_encode($output);
	}

?>
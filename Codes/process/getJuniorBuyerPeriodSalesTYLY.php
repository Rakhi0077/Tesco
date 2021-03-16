<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);

	if (isset($_GET['Supplier_Number']) && isset($_GET['Category_Director']) && isset($_GET['Junior_Buyer'])  && isset($_GET['userId'])){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();

		

		$SN=$_GET['Supplier_Number'];
		$CD=$_GET['Category_Director'];
		$CD=str_replace("_","&",$CD);
		$JB=$_GET['Junior_Buyer'];
		$JB=str_replace("_","&",$JB);
		
		$userId=$_GET['userId'];

		
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);		
		$output=array();


		$query="SELECT * FROM [dbo].[View_Periodic_Sales_TY_LY_Junior_Buyer] 
				WHERE Supplier_Number='$SN' AND Junior_Area='$JB'
				ORDER BY Year_Period_TY ASC;";

		$result=sqlsrv_query($link, $query,$params,$options);

		//echo $query;

		while ($row=sqlsrv_fetch_array($result)){
			$output[]=$row;
			//echo json_encode($row);
		}
		

		echo json_encode($output);
	}

?>
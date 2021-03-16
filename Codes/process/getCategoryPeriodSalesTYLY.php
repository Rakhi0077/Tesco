<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);


	if (isset($_GET['Supplier_Number']) && isset($_GET['Category_Director']) && isset($_GET['userId'])){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();

		
		$SN=$_GET['Supplier_Number'];
		$CD=$_GET['Category_Director'];
		$CD=str_replace("_","&",$CD);

		
		$userId=$_GET['userId'];

		
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);		
		$output=array();


		$query="SELECT * FROM [dbo].[View_Periodic_Sales_TY_LY_Category] 
				WHERE Parent_Supplier_Number_TFMS='$SN' AND Category_Area='$CD'
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
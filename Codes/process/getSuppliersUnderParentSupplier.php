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
		//$BC=$_GET['Buying_Controller'];
		//$BC=str_replace("_","&",$BC);
		
		$userId=$_GET['userId'];

		
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);		
		$output=array();


		$query="SELECT  distinct Parent_Supplier_Number_TFMS,
						Parent_Supplier_Name,
						Supplier_Number,
						Supplier_Name,
						Category_Area
						from Suppliers_List as sl
				WHERE Active_Yes_No='YES'

				
				AND sl.Parent_Supplier_Number_TFMS='$SN' AND sl.Category_Area='$CD';";

		$result=sqlsrv_query($link, $query,$params,$options);

		//echo $query;

		while ($row=sqlsrv_fetch_array($result)){
			$output[]=$row;
			//echo json_encode($row);
		}
		
		//echo count($output);
		//echo $output;

		echo json_encode($output);
	}

?>
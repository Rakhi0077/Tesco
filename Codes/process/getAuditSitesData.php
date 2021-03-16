<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);

	if (isset($_GET['SC'])){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();

		

		$SC=$_GET['SC'];
		

		
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);		
		$output=array();


		$query="SELECT distinct  Supplier_Name,
						Site_Code,
						dbo.RemoveExtraChars(Site_Name) AS Site_Name
				FROM [SQL_Server_TFMS_Audit_Data_Corrected_FullData]
				where Site_Code='$SC';";

		$result=sqlsrv_query($link, $query,$params,$options);

		//echo $query;

		while ($row=sqlsrv_fetch_array($result)){
			$output[]=$row;
			//echo json_encode($row);
		}
		

		echo json_encode($output);
	}

?>
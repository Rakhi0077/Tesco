<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);

	if ( isset($_GET['userId'])){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();

		

				$userId=$_GET['userId'];

		
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);		
		$output=array();


		$query="SELECT 
				CPS_Last_Updated,
				Complaints_Last_Updated,
				EPW_Last_Updated,
				Sales_Last_Updated,
				CTS_Last_Updated,
				Service_Level_Last_Updated FROM   
				(SELECT Area,Last_Updated FROM View_Last_Updated )Tab1  
				PIVOT  
				(  
				MAx(Last_Updated) FOR Area IN (CPS_Last_Updated,
				Complaints_Last_Updated,
				EPW_Last_Updated,
				Sales_Last_Updated,
				CTS_Last_Updated,
				Service_Level_Last_Updated)) AS Tab2 ;";

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
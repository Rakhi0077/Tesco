<?php

	if (session_status() == PHP_SESSION_NONE)
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
	
	

	//echo $CA;
	$query="
	SELECT  LTRIM(Complaints_Last_Updated) AS Quality_Last_Updated_Week,
	      LTRIM(CTS_Last_Updated) AS Value_Last_Updated_Week,
	      LTRIM(CPS_Last_Updated)AS Innovation_Last_Updated_Quarter,
	      LTRIM(Service_Level_Last_Updated) AS Supply_Last_Updated_Week
	FROM
	(SELECT Area, Last_Updated FROM View_Last_Updated) ps
	PIVOT
	(
	MAX(Last_Updated)
	FOR Area IN
	( Complaints_Last_Updated,
	CTS_Last_Updated,
	CPS_Last_Updated,
	Service_Level_Last_Updated)
	) AS pvt
	group by
	Complaints_Last_Updated,
	CTS_Last_Updated,
	CPS_Last_Updated,
	Service_Level_Last_Updated;";



	$result=sqlsrv_query($link,$query,$params,$options);	
	$response=[];
	//$row=[];

	while ($row=sqlsrv_fetch_array($result)){
		$response[] =$row;
	}

	echo json_encode($response);

?>

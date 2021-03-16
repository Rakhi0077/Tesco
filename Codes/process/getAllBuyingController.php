<?php

	if (session_status() == PHP_SESSION_NONE)
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
	
	$category=str_replace("_","&",$data->category);

	$query="SELECT DISTINCT REPLACE(Product_Area,'&','_') AS Product_Area_Value,Product_Area FROM Suppliers_List WHERE Category_Area='$category' AND Active_Yes_No='Yes' ORDER BY Product_Area;";

	
	$result=sqlsrv_query($link,$query,$params,$options);	
	$response=[];
	$row=[];

	while ($row=sqlsrv_fetch_array($result)){
		$response[] =$row;
	}

	echo json_encode($response);
	
?>
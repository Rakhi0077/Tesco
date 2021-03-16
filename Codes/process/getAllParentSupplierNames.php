<?php

	if (session_status() == PHP_SESSION_NONE)
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
	
	$category=str_replace("_","&",$data->category);
	$commercial=str_replace("_","&",$data->commercial);

	if ($category=="All")
				$sub_query=" Category_Area LIKE '%%' ";
	else
				$sub_query=" Category_Area='$category' ";

	if ($commercial=="All")
				$sub_query2=" Commercial_Area LIKE '%%' ";
	else
				$sub_query2=" Commercial_Area='$commercial' ";


	$query="SELECT DISTINCT REPLACE(Parent_Supplier_Name,'&','_') AS Parent_Supplier_Name_Value,Parent_Supplier_Name  AS Parent_Supplier_Name   FROM Suppliers_List WHERE $sub_query AND $sub_query2 AND  Active_Yes_No='Yes' ORDER BY Parent_Supplier_Name;";

	
	$result=sqlsrv_query($link,$query,$params,$options);	
	$response=[];
	$row=[];

	while ($row=sqlsrv_fetch_array($result)){
		$response[] =$row;
	}

	echo json_encode($response);
	
?>
<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);

	if (isset($_GET['Supplier_Number']) && isset($_GET['Category_Director']) && isset($_GET['Buying_Controller'])  && isset($_GET['userId'])){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();

		

		$SN=$_GET['Supplier_Number'];
		$CD=$_GET['Category_Director'];
		$CD=str_replace("_","&",$CD);
		$BC=$_GET['Buying_Controller'];
		$BC=str_replace("_","&",$BC);
		
		$userId=$_GET['userId'];

		
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);		
		$output=array();




		$query="SELECT distinct 
				epw.Supplier_Name as EPW_SN,
				comp.Supplier_Name as COMP_SN
				FROM View_Rank_QVIS_Buying_Controller AS A
				INNER JOIN Suppliers_List AS B
				ON A.Supplier_Number=B.Supplier_Number AND A.Category_Area=B.Category_Area AND A.Product_Area=B.Product_Area
				left join (select distinct(Supplier_Number),Supplier_Name from [dbo].[SQL_Server_EPW]) as epw
				on A.Supplier_Number=epw.Supplier_Number
				left join (select distinct(Supplier_Account),Supplier_Name from [dbo].[SQL_Server_Complaints]) as  comp
				on A.Supplier_Number=comp.Supplier_Account
				WHERE A.Supplier_Number='$SN' AND A.Category_Area='$CD' AND A.Product_Area='$BC';";


		$result=sqlsrv_query($link, $query,$params,$options);

		//echo $query;

		while ($row=sqlsrv_fetch_array($result)){
			$output[]=$row;
			//echo json_encode($row);
		}
		

		echo json_encode($output);
	}

?>
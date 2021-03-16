<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);

	if (isset($_GET['Supplier_Number']) && isset($_GET['Category_Director'])  && isset($_GET['userId'])){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();

		

		$SN=$_GET['Supplier_Number'];
		$CD=$_GET['Category_Director'];
		$CD=str_replace("_","&",$CD);
		
		
		$userId=$_GET['userId'];

		
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);		
		$output=array();


		$query="SELECT 
	 		 Parent_Supplier_Number_TFMS as Supplier_Code
			,ltrim(rtrim(str(Base_Product_Number))) as Base_Product_Number
			,Product_Desc
    		,CPS
 		FROM View_Rank_Innovation_CPS_Rank_TFTP
 		WHERE CPS_Score=1 AND Parent_Supplier_Number_TFMS='$SN' AND Category_Area='$CD'  ORDER BY CPS DESC;";


		$result=sqlsrv_query($link, $query,$params,$options);

		while ($row=sqlsrv_fetch_array($result)){
			$output[]=$row;
		}
		echo json_encode($output);
	}

?>
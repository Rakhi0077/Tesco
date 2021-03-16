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


		$query="SELECT 
	 		distinct Supplier_Code
			,ltrim(rtrim(str(Base_Product_Number))) as Base_Product_Number
			,Product_Desc
    		,CPS
 		FROM View_Rank_Innovation_CPS_Rank
 		WHERE CPS_Score=1 AND Supplier_Code='$SN' AND Category_Area='$CD' AND Product_Area='$BC' ORDER BY CPS DESC;";

 		//echo $query;

		$result=sqlsrv_query($link, $query,$params,$options);

		while ($row=sqlsrv_fetch_array($result)){
			$output[]=$row;
		}
		echo json_encode($output);
		
	}

?>
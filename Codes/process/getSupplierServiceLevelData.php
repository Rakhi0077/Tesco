<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);

	if (isset($_GET['Supplier_Number']) && isset($_GET['Category_Director']) && isset($_GET['Junior_Buyer']) && isset($_GET['userId'])){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();

		$SN=$_GET['Supplier_Number'];
		$CD=$_GET['Category_Director'];
		$CD=str_replace("_","&",$CD);
		

		$JB=$_GET['Junior_Buyer'];
		$JB=str_replace("_","&",$JB);


		$userId=$_GET['userId'];
		
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);		
		$output=array();


		$query="SELECT
				B.Supplier_Number,
				A.Year_Week_Number,
				B.SL_Percentage
			
			FROM (SELECT DISTINCT Year_week_number FROM Tesco_Calendar WHERE Calendar_Date BETWEEN CONVERT(date, GETDATE() - 371) AND CONVERT(date, GETDATE() - 14)) AS A 
			LEFT JOIN 
			(SELECT A.Supplier_Number,
					Year_Week_Number,
					SL_Percentage FROM View_52_Weeks_Service_Level_Data AS A
			INNER JOIN Suppliers_List AS B
			ON A.Supplier_Number=B.Supplier_Number AND A.Category_Director=B.Category_Director AND A.Junior_Buyer=B.Junior_Buyer
			WHERE A.Supplier_Number='$SN' AND B.Category_Area='$CD' AND B.Junior_Area='$JB') AS B
			ON A.Year_Week_Number=B.Year_Week_Number ORDER BY A.Year_Week_Number DESC;";
		
		//echo $query;

		
		$result=sqlsrv_query($link, $query,$params,$options);

		while ($row=sqlsrv_fetch_array($result)){
			$output[]=$row;
		}
		echo json_encode($output);
		
	}

?>
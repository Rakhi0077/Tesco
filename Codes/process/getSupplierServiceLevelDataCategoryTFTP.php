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

		$userId=$_GET['userId'];
		
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);		
		$output=array();


		$query="SELECT
				B.Supplier_Number,
				A.Year_Week_Number,
				B.SL_Percentage
						
				FROM (SELECT DISTINCT Year_week_number FROM Tesco_Calendar WHERE Calendar_Date BETWEEN CONVERT(date, GETDATE() - 378) AND CONVERT(date, GETDATE() - 14)) AS A 
				LEFT JOIN 
				(SELECT	X.Parent_Supplier_Number_TFMS as Supplier_Number,X.Year_Week_Number,X.Commercial_Director,X.Category_Director,
								1 - (SUM(Total_Shorts)/NULLIF(SUM(Ordered),0)) AS SL_Percentage
						 FROM View_52_Weeks_Service_Level_Data_Category_Tab AS X
						 INNER JOIN (SELECT DISTINCT Parent_Supplier_Number_TFMS,Category_Director,
						 Category_Area,Buying_Controller,Product_Area FROM Suppliers_List_Category_Tab) AS Y
						 ON X.Parent_Supplier_Number_TFMS=Y.Parent_Supplier_Number_TFMS AND X.Category_Director=Y.Category_Director
						 WHERE X.Parent_Supplier_Number_TFMS='$SN' AND Y.Category_Area='$CD'
						 GROUP BY X.Parent_Supplier_Number_TFMS,Year_Week_Number,X.Commercial_Director,X.Category_Director
						 
				) AS B
				ON A.Year_Week_Number=B.Year_Week_Number ORDER BY A.Year_Week_Number DESC;";

		
		//echo $query;

		
		$result=sqlsrv_query($link, $query,$params,$options);

		while ($row=sqlsrv_fetch_array($result)){
			$output[]=$row;
		}
		echo json_encode($output);
		
	}

?>
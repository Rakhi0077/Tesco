<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);

	if (isset($_GET['Supplier_Number']) && isset($_GET['Category_Director']) && isset($_GET['Buying_Controller']) && isset($_GET['userId'])){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();

		$SN=$_GET['Supplier_Number'];
		$CD=$_GET['Category_Director'];
		$BC=$_GET['Buying_Controller'];
		$BC=str_replace("_","&",$BC);
		$CD=str_replace("_","&",$CD);

		$userId=$_GET['userId'];
		
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);		
		$output=array();


		$query="SELECT
				B.Supplier_Number,
				A.Year_Week_Number,
				B.SL_Percentage
						
				FROM (SELECT DISTINCT Year_week_number FROM Tesco_Calendar WHERE Calendar_Date BETWEEN CONVERT(date, GETDATE() - 743) AND CONVERT(date, GETDATE() - 379)) AS A 
				LEFT JOIN 
				(SELECT	X.Supplier_Number,X.Year_Week_Number,X.Commercial_Director,X.Category_Director,X.Buying_Controller,
								1 - (SUM(Total_Shorts)/NULLIF(SUM(Ordered),0)) AS SL_Percentage
						 FROM View_104_Weeks_Service_Level_Data AS X
						 INNER JOIN (SELECT DISTINCT Supplier_Number,Category_Director,Category_Area,Buying_Controller,Product_Area FROM Suppliers_List) AS Y
						 ON X.Supplier_Number=Y.Supplier_Number AND X.Category_Director=Y.Category_Director AND X.Buying_Controller=Y.Buying_Controller
						 WHERE X.Supplier_Number='$SN' AND Y.Category_Area='$CD' AND Y.Product_Area='$BC'
						 GROUP BY X.Supplier_Number,Year_Week_Number,X.Commercial_Director,X.Category_Director,X.Buying_Controller
						 
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
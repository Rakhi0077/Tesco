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


		$query="SELECT  A.Supplier_Name,
						Site_Code,
						dbo.RemoveExtraChars(Site_Name) AS Site_Name,
						Site_Status,
						Audit AS Template,
						CONVERT(VARCHAR, Last_Audit_Date, 105) AS Last_Audit_Date,
						CONVERT(VARCHAR, Due_Date, 105) AS Due_Date,
						Audit_Visit_Status,
						dbo.RemoveExtraChars(Lead_Technical_Manager) AS Lead_Technical_Manager,
						Country,
						Score
				FROM SQL_Server_TFMS_Audit_Data_Corrected AS A
				INNER JOIN (SELECT DISTINCT Supplier_Number,Category_Director,Category_Area,Buying_Controller,Product_Area
							FROM Suppliers_List WHERE Active_Yes_No='YES') AS B

				ON A.Supplier_Number_Corrected=B.Supplier_Number AND A.Buying_Controller=B.Buying_Controller AND A.Category_Director=B.Category_Director
				WHERE Supplier_Number_Corrected='$SN' AND Category_Area='$CD' AND Product_Area='$BC'  ORDER BY CAST(Due_Date AS DATE) DESC;";

		$result=sqlsrv_query($link, $query,$params,$options);

		//echo $query;

		while ($row=sqlsrv_fetch_array($result)){
			$output[]=$row;
			//echo json_encode($row);
		}
		

		echo json_encode($output);
	}

?>
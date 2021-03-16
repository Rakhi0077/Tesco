<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);

	if (isset($_GET['Supplier_Number']) && isset($_GET['Category_Director']) && isset($_GET['Junior_Buyer'])  && isset($_GET['userId'])){

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
				INNER JOIN Suppliers_List AS B

				ON A.Supplier_Number_Corrected=B.Supplier_Number AND A.Junior_Buyer_Corrected=B.Junior_Buyer AND A.Category_Director_Corrected=B.Category_Director
				WHERE Active_Yes_No='YES' AND Supplier_Number_Corrected='$SN' AND Category_Area='$CD' AND Junior_Area='$JB'  ORDER BY CAST(Due_Date AS DATE) DESC;";

		$result=sqlsrv_query($link, $query,$params,$options);

		//echo $query;

		while ($row=sqlsrv_fetch_array($result)){
			$output[]=$row;
			//echo json_encode($row);
		}
		

		echo json_encode($output);
	}

?>
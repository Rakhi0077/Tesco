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


		$query="SELECT distinct A.*,B.*,C.Avg_Quality_Rank,
					C.Avg_Value_Rank,
					C.Avg_Innovation_Rank,
					C.Avg_Supply_Rank
				
				FROM View_Rank_QVIS_By_Junior_Buyer AS A
				INNER JOIN Suppliers_List AS B
				ON A.Supplier_Number=B.Supplier_Number AND A.Category_Area=B.Category_Area AND A.Junior_Area=B.Junior_Area
				INNER JOIN [dbo].[View_Avg_QVIS_Category_Ranks] as C
				on A.Junior_Area=C.Area and C.Unit='Junior'

				WHERE A.Supplier_Number='$SN' AND A.Category_Area='$CD' AND A.Junior_Area='$JB';";
		
		
		

		$result_1=sqlsrv_query($link, $query,$params,$options);
		
		
		$validAccess=false;

		if (sqlsrv_num_rows($result_1)==1){
			$row=sqlsrv_fetch_array($result_1);
			$output[]=$row;
			//$requestGeography=$row['Geography']; Later we will modify this
			$requestGeography='UK';
			$requestCategory=$CD;
			//Get category level data
			
			$query="SELECT Geography,Access_Level FROM users WHERE User_Id='$userId';";
			$result_2=sqlsrv_query($link, $query,$params,$options);
			$row=sqlsrv_fetch_array($result_2);
			$userGeography=$row['Geography'];
			$userAccessLevel=$row['Access_Level'];
			
			//Access Validation for Admin
			if ($userAccessLevel=='admin'){
				if ($userGeography==$requestGeography)
					$categoryAccess="YES";
				else
					$categoryAccess="NO";

				$data = array($output, 'Category_Access' => $categoryAccess);
				$output[] = $data;
				
				echo json_encode($output);
				$validAccess=true;
			}
			else{
				$query="SELECT * FROM user_category WHERE User_ID='$userId' AND Category='$requestCategory';";
				$result_3=sqlsrv_query($link, $query,$params,$options);
			
				if (sqlsrv_num_rows($result_3)>0)
					$categoryAccess="YES";
				else
					$categoryAccess="NO";
				
				if ($userAccessLevel=='super_user' && $userGeography==$requestGeography){
					$data = array($output, 'Category_Access' => $categoryAccess);
					$output[] = $data;

					echo json_encode($output);
					$validAccess=true;
				}
				
				if ($userAccessLevel=='user' && $userGeography==$requestGeography && $categoryAccess=="YES"){
					$data = array($output, 'Category_Access' => $categoryAccess);
					$output[] = $data;

					echo json_encode($output);
					$validAccess=true;
				}
				
			}		
		}
		
		if ($validAccess==false){
			$data = array($output, 'Category_Access' => $categoryAccess);
			$output[] = $data;

			echo json_encode($output);
		}
		
		
	}

?>
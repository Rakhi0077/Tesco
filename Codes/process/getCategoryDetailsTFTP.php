<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);
	

	if (isset($_GET['Supplier_Number']) && isset($_GET['Category_Director'])  && isset($_GET['userId'])){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();

		$SN=$_GET['Supplier_Number'];
		$CD=$_GET['Category_Director'];
		$Comm_D=$_GET['Commercial_Director'];
		$CD=str_replace("_","&",$CD);
		$Comm_D=str_replace("_","&",$Comm_D);
			
		$userId=$_GET['userId'];
		
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);		
		$output=array();
		//$categoryAccess='YES';

		$query="SELECT distinct top 1 A.*,C.Avg_Quality_Rank,
					C.Avg_Value_Rank,
					C.Avg_Innovation_Rank,
					C.Avg_Supply_Rank
			
				FROM [View_Rank_QVIS_By_Category_TFTP] AS A
				
				INNER JOIN [dbo].[View_Avg_QVIS_Category_Ranks] as C
				on A.Category_Area=C.Area and A.Commercial_Area=C.Commercial_Area and C.Unit='Category_TFTP'
				WHERE A.Supplier_Number='$SN' AND A.Category_Area='$CD' and A.Commercial_Area='$Comm_D';";


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
				$query="SELECT * FROM user_category WHERE User_ID='$userId' ;";
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

			//echo json_encode($output);
		}
		
		
	}

?>
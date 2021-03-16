<?php
	
	ini_set('max_execution_time', 300);

	
	//echo $_GET['overallrating'];

	if (isset($_GET['userId']) && isset($_GET['geography']) && isset($_GET['QVIS']) && isset($_GET['rating']) && isset($_GET['overallrating']) && isset($_GET['category']) && isset($_GET['buyingController'])){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
		
		$UID=$_GET['userId'];
		$geography=$_GET['geography'];
		$QVIS=$_GET['QVIS'];
		$rating=$_GET['rating'];
		$overallrating=$_GET['overallrating'];

		$category=$_GET['category'];
		$category=str_replace("_","&",$category);

		$buyingController=$_GET['buyingController'];
		$buyingController=str_replace("_","&",$buyingController);
		
		$output=array();
		
		

		//echo $overallrating; 
		$query="SELECT * FROM users WHERE User_Id='$UID';";
		$result=sqlsrv_query($link,$query,$params,$options);
		$row=sqlsrv_fetch_array($result);
		$access_level=$row['Access_Level'];
		
		//Manage Geography Data
		//----------------------------------------------------------------------------------------
		if ($access_level=="user" || $access_level=="super_user"){
			$geography=$row['Geography'];
			$sub_query_1=" Geography='$geography' ";
		}
		else {
			if ($geography=="All")
				$sub_query_1=" Geography LIKE '%%' ";
			else
				$sub_query_1=" Geography='$geography' ";
		}
		//----------------------------------------------------------------------------------------
		

		if ($buyingController=="All")
			$sub_query_2=" A.Product_Area LIKE '%%' ";
		else
			$sub_query_2=" A.Product_Area='$buyingController' ";
		
		//Manage Category Data
		//----------------------------------------------------------------------------------------
		if ($access_level=="user"){
			if ($category=="All"){
				$query="SELECT DISTINCT Category FROM user_category WHERE User_ID='$UID';";
				$result=sqlsrv_query($link,$query,$params,$options);
				$NumberOfCategories=sqlsrv_num_rows($result);
				$catString="";
				while ($row=$row=sqlsrv_fetch_array($result)){
					$catString=$catString."'".$row['Category']."'";
					$NumberOfCategories=$NumberOfCategories-1;
					if ($NumberOfCategories!=0)
						$catString=$catString.",";
				}
				
				$sub_query_3=" A.Category_Area in ($catString) ";
			}
			else
				$sub_query_3=" A.Category_Area='$category' ";
		}
		else{
			if ($category=="All")
				$sub_query_3=" A.Category_Area LIKE '%%' ";
			else
				$sub_query_3=" A.Category_Area='$category' ";
		}
		//----------------------------------------------------------------------------------------
		
		if ($overallrating=="All")
			$sub_query_4=" QVIS_Rank BETWEEN  1 AND 4 ";
		else
			$sub_query_4=" QVIS_Rank=$overallrating ";


		//SUBSTRING(Supplier_Name,1,28) as 
		$req_columns="A.Supplier_Number,B.Supplier_Name,A.Commercial_Area,A.Category_Area,A.Product_Area,Quality_Rank,Value_Rank,Innovation_Rank,Supply_Rank,QVIS_Rank";

		//$req_columns="Supplier_Number,Display_Junior_Buyer,Display_Category_Director,Geography,Supply_Chain_Rating,Technical_Rating,NPD_Rating,Buying_Rating,Overall_Rating,Strategy";

		//$req_columns="Supplier_Number,SUBSTRING(Supplier_Name, 1, 4),Display_Junior_Buyer,Display_Category_Director,Geography,Supply_Chain_Rating,Technical_Rating,NPD_Rating,Buying_Rating,Overall_Rating,Strategy";
		


		if ($QVIS=="All" AND $rating=="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Buying_Controller AS A INNER JOIN (SELECT DISTINCT Supplier_Number,Supplier_Name,Commercial_Area,Category_Area,Product_Area FROM Suppliers_List) AS B ON A.Supplier_Number=B.Supplier_Number AND A.Category_Area=B.Category_Area AND A.Product_Area=B.Product_Area WHERE $sub_query_2 AND $sub_query_3 AND $sub_query_4 ORDER BY A.Product_Area,QVIS_Rank DESC,Supplier_Name;";
			
		if ($QVIS=="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Buying_Controller AS A INNER JOIN (SELECT DISTINCT Supplier_Number,Supplier_Name,Commercial_Area,Category_Area,Product_Area FROM Suppliers_List) AS B ON A.Supplier_Number=B.Supplier_Number AND A.Category_Area=B.Category_Area AND A.Product_Area=B.Product_Area WHERE $sub_query_2 AND $sub_query_3 AND $sub_query_4 AND Quality_Rank=$rating AND Value_Rank=$rating AND Supply_Rank=$rating ORDER BY A.Product_Area,QVIS_Rank DESC,Supplier_Name;";
				 
		if ($QVIS!="All" AND $rating=="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Buying_Controller AS A INNER JOIN (SELECT DISTINCT Supplier_Number,Supplier_Name,Commercial_Area,Category_Area,Product_Area FROM Suppliers_List) AS B ON A.Supplier_Number=B.Supplier_Number AND A.Category_Area=B.Category_Area AND A.Product_Area=B.Product_Area WHERE $sub_query_2 AND $sub_query_3 AND $sub_query_4 ORDER BY A.Product_Area,QVIS_Rank DESC,Supplier_Name;";
					
		if ($QVIS!="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Buying_Controller AS A INNER JOIN (SELECT DISTINCT Supplier_Number,Supplier_Name,Commercial_Area,Category_Area,Product_Area FROM Suppliers_List) AS B ON A.Supplier_Number=B.Supplier_Number AND A.Category_Area=B.Category_Area AND A.Product_Area=B.Product_Area WHERE $sub_query_2 AND $sub_query_3 AND $sub_query_4 AND $QVIS=$rating ORDER BY A.Product_Area,QVIS_Rank DESC,Supplier_Name;";

		//echo $query;
		
		
		$result=sqlsrv_query($link,$query,$params,$options);
		if (sqlsrv_num_rows($result)>0){	
			while ($row=sqlsrv_fetch_array($result)){
				$output[]=$row;
				//echo $row['Supplier_Number']."_".$row['Supplier_Name'];
			}
		}

		//echo count($output);
		echo json_encode($output);
		//*/
		
	}

	
	
?>
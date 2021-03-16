<?php
	
	ini_set('max_execution_time', 300);

	
	//echo $_GET['overallrating'];

	if (isset($_GET['userId']) && isset($_GET['geography']) && isset($_GET['QVIS']) && isset($_GET['rating']) && isset($_GET['overallrating']) && isset($_GET['category']) && isset($_GET['buyingController']) && isset($_GET['tesco_brand_ind'])){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
		
		$UID=$_GET['userId'];
		$geography=$_GET['geography'];
		$QVIS=$_GET['QVIS'];
		$rating=$_GET['rating'];
		$overallrating=$_GET['overallrating'];
		$tesco_brand_ind=$_GET['tesco_brand_ind'];
		$category=$_GET['category'];
		$category=str_replace("_","&",$category);
		$PSN=$_GET['parent_supplier_name'];
		$buyingController=$_GET['buyingController'];
		$buyingController=str_replace("_","&",$buyingController);
		$PSN=str_replace("_","&",$PSN);


		/*if ($category=="All"){
			$query="SELECT * FROM users WHERE User_Id='$UID';";
			$result=sqlsrv_query($link,$query,$params,$options);
			$row=sqlsrv_fetch_array($result);
			$access_level=$row['Access_Level'];


			if ($access_level=="user")
				$query="SELECT DISTINCT top 1 Display_Category as cat FROM user_category WHERE User_ID='$UID' ORDER BY Display_Category;";	
			else	
				$query="SELECT Distinct top 1 Category_Area as cat FROM Suppliers_List WHERE Active_Yes_No='Yes' ORDER BY Category_Area;";
		
			$result=sqlsrv_query($link,$query,$params,$options);	

			while ($row=sqlsrv_fetch_array($result)){
				$category=$row['cat'];
			}
		}*/

		
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
		if ($PSN=="All")
			$sub_query_6=" B.Parent_Supplier_Name LIKE '%%' ";
		else
			$sub_query_6=" B.Parent_Supplier_Name='$PSN' ";
		
		
		if($tesco_brand_ind=="OL")
			$sub_query_5=" A.Own_Brand_Lines_Count > 0 AND A.Brand_Lines_Count = 0 ";
		if($tesco_brand_ind=="B")
			$sub_query_5=" A.Own_Brand_Lines_Count = 0 AND A.Brand_Lines_Count > 0 ";
		if($tesco_brand_ind=="OL_B"  )
			$sub_query_5=" A.Own_Brand_Lines_Count > 0 AND A.Brand_Lines_Count > 0 ";
		if($tesco_brand_ind=="All"  )
			$sub_query_5=" A.Own_Brand_Lines_Count >= 0 AND A.Brand_Lines_Count >= 0 ";
		
		//Manage Category Data
		//----------------------------------------------------------------------------------------
		if ($access_level=="user"){
			if ($category=="All"){
					$query="SELECT * FROM users WHERE User_Id='$UID';";
					$result=sqlsrv_query($link,$query,$params,$options);
					$row=sqlsrv_fetch_array($result);
					$access_level=$row['Access_Level'];


					$top1="SELECT DISTINCT Display_Category as cat FROM user_category WHERE User_ID='$UID' ORDER BY Display_Category;";
					$result=sqlsrv_query($link,$top1,$params,$options);	

					$NumberOfCategories=sqlsrv_num_rows($result);
					$catString="";
					while ($row=$row=sqlsrv_fetch_array($result)){
						$catString=$catString."'".$row['cat']."'";
						$NumberOfCategories=$NumberOfCategories-1;
						if ($NumberOfCategories!=0)
						$catString=$catString.",";
					}




					/*while ($row=sqlsrv_fetch_array($result)){
							$category=$row['cat'];
					}*/
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

		$sub_query_7="A.Supplier_Number <> '99999' ";

		//SUBSTRING(Supplier_Name,1,28) as 
		$req_columns="B.Parent_Supplier_Name as  Parent_Supplier_Name,B.Parent_Supplier_Number_TFMS,A.Supplier_Number,B.Supplier_Name,A.Commercial_Area,A.Category_Area,A.Buyer_Area,A.Own_Brand_Lines_Count,A.Brand_Lines_Count,A.Product_Area,Quality_Rank,Value_Rank,Innovation_Rank,Supply_Rank,QVIS_Rank";

		//$req_columns="Supplier_Number,Display_Junior_Buyer,Display_Category_Director,Geography,Supply_Chain_Rating,Technical_Rating,NPD_Rating,Buying_Rating,Overall_Rating,Strategy";

		//$req_columns="Supplier_Number,SUBSTRING(Supplier_Name, 1, 4),Display_Junior_Buyer,Display_Category_Director,Geography,Supply_Chain_Rating,Technical_Rating,NPD_Rating,Buying_Rating,Overall_Rating,Strategy";
		


		if ($QVIS=="All" AND $rating=="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Buying_Controller AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Supplier_Number,Supplier_Name,Commercial_Area,Category_Area,Product_Area FROM Suppliers_List) AS B ON A.Supplier_Number=B.Supplier_Number AND A.Category_Area=B.Category_Area AND A.Product_Area=B.Product_Area WHERE $sub_query_2 AND $sub_query_3 AND $sub_query_6 AND $sub_query_4 AND $sub_query_5 AND $sub_query_7 ORDER BY A.Product_Area,QVIS_Rank DESC,Supplier_Name;";
			
		if ($QVIS=="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Buying_Controller AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Supplier_Number,Supplier_Name,Commercial_Area,Category_Area,Product_Area FROM Suppliers_List) AS B ON A.Supplier_Number=B.Supplier_Number AND A.Category_Area=B.Category_Area AND A.Product_Area=B.Product_Area WHERE $sub_query_2 AND $sub_query_3 AND $sub_query_6 AND $sub_query_4 AND $sub_query_7 AND $sub_query_5 AND Quality_Rank=$rating AND Value_Rank=$rating AND Supply_Rank=$rating ORDER BY A.Product_Area,QVIS_Rank DESC,Supplier_Name;";
				 
		if ($QVIS!="All" AND $rating=="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Buying_Controller AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Supplier_Number,Supplier_Name,Commercial_Area,Category_Area,Product_Area FROM Suppliers_List) AS B ON A.Supplier_Number=B.Supplier_Number AND A.Category_Area=B.Category_Area AND A.Product_Area=B.Product_Area WHERE $sub_query_2 AND $sub_query_3 AND $sub_query_4 AND $sub_query_6 AND $sub_query_5 AND $sub_query_7 ORDER BY A.Product_Area,QVIS_Rank DESC,Supplier_Name;";
					
		if ($QVIS!="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Buying_Controller AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Supplier_Number,Supplier_Name,Commercial_Area,Category_Area,Product_Area FROM Suppliers_List) AS B ON A.Supplier_Number=B.Supplier_Number AND A.Category_Area=B.Category_Area AND A.Product_Area=B.Product_Area WHERE $sub_query_2 AND $sub_query_3 AND $sub_query_4 AND  $sub_query_6 AND $QVIS=$rating AND $sub_query_5 AND $sub_query_7  ORDER BY A.Product_Area,QVIS_Rank DESC,Supplier_Name;";

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
<?php
	
	ini_set('max_execution_time', 300);

	
	//echo $_GET['overallrating'];

	if (isset($_GET['userId']) && isset($_GET['commercial_director']) && isset($_GET['QVIS']) && isset($_GET['rating']) && isset($_GET['overallrating']) && isset($_GET['category']) && isset($_GET['tesco_brand_ind'])){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
		
		$UID=$_GET['userId'];
		$Commercial_Area=$_GET['commercial_director'];
		$QVIS=$_GET['QVIS'];
		$rating=$_GET['rating'];
		$overallrating=$_GET['overallrating'];
		$tesco_brand_ind=$_GET['tesco_brand_ind'];
		$category=$_GET['category'];
		$category=str_replace("_","&",$category);
		$PSN=$_GET['parent_supplier_name'];
		// $flag=$_GET['flag'];
		$PSN=str_replace("_","&",$PSN);

		$query="SELECT * FROM users WHERE User_Id='$UID';";
		$result=sqlsrv_query($link,$query,$params,$options);
		$row=sqlsrv_fetch_array($result);
		$access_level=$row['Access_Level'];
		
		/*if ($category=="All"){
			$query="SELECT * FROM users WHERE User_Id='$UID';";
			$result=sqlsrv_query($link,$query,$params,$options);
			$row=sqlsrv_fetch_array($result);
			$access_level=$row['Access_Level'];


			if ($access_level=="user")
				$query="SELECT DISTINCT top 1 Display_Category as cat FROM user_category WHERE User_ID='$UID' ORDER BY Display_Category;";	
			else	
				$query="SELECT DISTINCT top 1 Category_Area as cat FROM Suppliers_List WHERE Active_Yes_No='Yes' ORDER BY Category_Area;";
		
			$result=sqlsrv_query($link,$query,$params,$options);	

			while ($row=sqlsrv_fetch_array($result)){
				$category=$row['cat'];
			}
		}
		*/
		// echo $f;

		if($tesco_brand_ind=="OL")
			$sub_query_5=" A.Own_Brand_Lines_Count > 0 AND A.Brand_Lines_Count = 0 ";
		if($tesco_brand_ind=="B")
			$sub_query_5=" A.Own_Brand_Lines_Count = 0 AND A.Brand_Lines_Count > 0 ";
		if($tesco_brand_ind=="OL_B"  )
			$sub_query_5=" A.Own_Brand_Lines_Count > 0 AND A.Brand_Lines_Count > 0 ";
		if($tesco_brand_ind=="All"  )
			$sub_query_5=" A.Own_Brand_Lines_Count >= 0 AND A.Brand_Lines_Count >= 0 ";

			if ($access_level=="user"){
						if ($category=="All"){
							
							$query="SELECT DISTINCT Display_Category as cat  FROM user_category WHERE User_ID='$UID';";

							$result=sqlsrv_query($link,$query,$params,$options);
							$NumberOfCategories=sqlsrv_num_rows($result);
							$catString="";
							while ($row=$row=sqlsrv_fetch_array($result)){
								$catString=$catString."'".$row['cat']."'";
								$NumberOfCategories=$NumberOfCategories-1;
								if ($NumberOfCategories!=0)
									$catString=$catString.",";
							}
							// echo $catString;
							
							$sub_query_3=" A.Category_Area in ($catString) ";
							// echo $sub_query_3;
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
	

		$output=array();
		
		//echo $overallrating; 
		/*$query="SELECT * FROM users WHERE User_Id='$UID';";
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

		//Manage Category Data
		//----------------------------------------------------------------------------------------
		/*if ($access_level=="user"){
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
		
		//----------------------------------------------------------------------------------------
		*/
		if ($overallrating=="All")
			$sub_query_4=" QVIS_Rank BETWEEN  1 AND 4 ";
		else
			$sub_query_4=" QVIS_Rank=$overallrating ";

		if ($PSN=="All")
			$sub_query_6=" B.Parent_Supplier_Name LIKE '%%' ";
		else
			$sub_query_6=" B.Parent_Supplier_Name='$PSN' ";

		$sub_query_7=" B.Parent_Supplier_Number_TFMS <> '99999' ";

		if($Commercial_Area=='All')
			$sub_query_8="B.Commercial_Area like '%%' ";
		else
			$sub_query_8="B.Commercial_Area='$Commercial_Area' ";

		if($category=='Grocery')
			$sub_query_8="B.Commercial_Area='Packaged'";
		if($category=='Prepared Foods')
			$sub_query_8="B.Commercial_Area='Fresh'";
		
		//SUBSTRING(Supplier_Name,1,28) as 
		$req_columns="replace(B.Parent_Supplier_Name,'(Overall)','') as Parent_Supplier_Name,B.Parent_Supplier_Number_TFMS,A.Commercial_Area,A.Category_Area,A.Own_Brand_Lines_Count,A.Brand_Lines_Count,Quality_Rank,Value_Rank,Innovation_Rank,Supply_Rank,QVIS_Rank";

if($category=="All"){
		if ($QVIS=="All" AND $rating=="All" )
			$query="sELECT distinct $req_columns FROM View_Rank_QVIS_By_Category_TFTP AS A 
					INNER JOIN (

							select DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab
							 where Parent_Supplier_Number_TFMS in 
							 (
							select distinct Parent_Supplier_Number_TFMS from Suppliers_List_Category_Tab as A
							where $sub_query_3
					)

					) AS B 
					ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND 
					A.Category_Area=B.Category_Area 
					and A.Commercial_Area=B.Commercial_Area 
					WHERE  $sub_query_4 AND $sub_query_5 AND $sub_query_6  AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;

			";
			if ($QVIS=="All" AND $rating!="All")
				$query="sELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A 
					INNER JOIN (

							select DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab
							 where Parent_Supplier_Number_TFMS in 
							 (
							select distinct Parent_Supplier_Number_TFMS from Suppliers_List_Category_Tab as A
							where $sub_query_3
					)

					) AS B 
					ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND 
					A.Category_Area=B.Category_Area 
					and A.Commercial_Area=B.Commercial_Area 
					WHERE  Quality_Rank=$rating AND Value_Rank=$rating AND Supply_Rank=$rating AND $sub_query_4 AND $sub_query_5 AND $sub_query_6  AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;

			";
			if ($QVIS!="All" AND $rating=="All")
				$query="sELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A 
					INNER JOIN (

							select DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab
							 where Parent_Supplier_Number_TFMS in 
							 (
							select distinct Parent_Supplier_Number_TFMS from Suppliers_List_Category_Tab as A
							where $sub_query_3
					)

					) AS B 
					ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND 
					A.Category_Area=B.Category_Area 
					and A.Commercial_Area=B.Commercial_Area 
					WHERE  Quality_Rank=$rating AND Value_Rank=$rating AND Supply_Rank=$rating AND $sub_query_4 AND $sub_query_5 AND $sub_query_6  AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;

			";
			if ($QVIS!="All" AND $rating!="All")
				$query="sELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A 
					INNER JOIN (

							select DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab
							 where Parent_Supplier_Number_TFMS in 
							 (
							select distinct Parent_Supplier_Number_TFMS from Suppliers_List_Category_Tab as A
							where $sub_query_3
					)

					) AS B 
					ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND 
					A.Category_Area=B.Category_Area 
					and A.Commercial_Area=B.Commercial_Area 
					WHERE  $QVIS=$rating AND $sub_query_4 AND $sub_query_5 AND $sub_query_6  AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;

			";

}

if($category=="Prepared Foods"){
		if ($QVIS=="All" AND $rating=="All" )
            $query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6  AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
            
			
		if ($QVIS=="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND Quality_Rank=$rating AND Value_Rank=$rating AND Supply_Rank=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7  AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
				 
		if ($QVIS!="All" AND $rating=="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
					
		if ($QVIS!="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area  and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $QVIS=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
}
if($category=="Grocery"){
		if ($QVIS=="All" AND $rating=="All" )
            $query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6  AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
            
			
		if ($QVIS=="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND Quality_Rank=$rating AND Value_Rank=$rating AND Supply_Rank=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7  AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
				 
		if ($QVIS!="All" AND $rating=="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
					
		if ($QVIS!="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area  and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $QVIS=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
}				
if($category=="Bakery & Dairy"){
		if ($QVIS=="All" AND $rating=="All" )
            $query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6  AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
            
			
		if ($QVIS=="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND Quality_Rank=$rating AND Value_Rank=$rating AND Supply_Rank=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7  AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
				 
		if ($QVIS!="All" AND $rating=="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
					
		if ($QVIS!="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area  and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $QVIS=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
}		
if($category=="Beers, Wines & Spirits"){
		if ($QVIS=="All" AND $rating=="All" )
            $query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6  AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
            
			
		if ($QVIS=="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND Quality_Rank=$rating AND Value_Rank=$rating AND Supply_Rank=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7  AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
				 
		if ($QVIS!="All" AND $rating=="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
					
		if ($QVIS!="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area  and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $QVIS=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
}		
if($category=="MFP"){
		if ($QVIS=="All" AND $rating=="All" )
            $query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6  AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
            
			
		if ($QVIS=="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND Quality_Rank=$rating AND Value_Rank=$rating AND Supply_Rank=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7  AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
				 
		if ($QVIS!="All" AND $rating=="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
					
		if ($QVIS!="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area  and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $QVIS=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
}		
if($category=="Health, Beauty & Wellness"){
		if ($QVIS=="All" AND $rating=="All" )
            $query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6  AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
            
			
		if ($QVIS=="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND Quality_Rank=$rating AND Value_Rank=$rating AND Supply_Rank=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7  AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
				 
		if ($QVIS!="All" AND $rating=="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
					
		if ($QVIS!="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area  and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $QVIS=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
}		
if($category=="Household & Petcare"){
		if ($QVIS=="All" AND $rating=="All" )
            $query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6  AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
            
			
		if ($QVIS=="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND Quality_Rank=$rating AND Value_Rank=$rating AND Supply_Rank=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7  AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
				 
		if ($QVIS!="All" AND $rating=="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
					
		if ($QVIS!="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area  and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $QVIS=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
}		
if($category=="Impulse"){
		if ($QVIS=="All" AND $rating=="All" )
            $query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6  AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
            
			
		if ($QVIS=="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND Quality_Rank=$rating AND Value_Rank=$rating AND Supply_Rank=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7  AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
				 
		if ($QVIS!="All" AND $rating=="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
					
		if ($QVIS!="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area  and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $QVIS=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
}		
if($category=="Produce"){
		if ($QVIS=="All" AND $rating=="All" )
            $query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6  AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
            
			
		if ($QVIS=="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND Quality_Rank=$rating AND Value_Rank=$rating AND Supply_Rank=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7  AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
				 
		if ($QVIS!="All" AND $rating=="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
					
		if ($QVIS!="All" AND $rating!="All")
			$query="SELECT distinct $req_columns FROM View_Rank_QVIS_Category_TFTP AS A INNER JOIN (SELECT DISTINCT Parent_Supplier_Name,Parent_Supplier_Number_TFMS,Commercial_Area,Category_Area FROM Suppliers_List_Category_Tab) AS B ON A.Supplier_Number=B.Parent_Supplier_Number_TFMS AND A.Category_Area=B.Category_Area  and A.Commercial_Area=B.Commercial_Area WHERE $sub_query_3 AND $sub_query_4 AND $QVIS=$rating AND $sub_query_5 AND $sub_query_6 AND $sub_query_7 AND $sub_query_8 ORDER BY A.Category_Area,QVIS_Rank DESC,Parent_Supplier_Name;";
}		
//echo $query;
		
		// var_dump($category);

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
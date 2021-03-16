
<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);

	
	//echo $_GET['overallrating'];

	if (isset($_GET['userId']) && isset($_GET['category_area']) && isset($_GET['junior_area']) && isset($_GET['commercialcategory'])){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
		
		$UID=$_GET['userId'];
		$CC=$_GET['commercialcategory'];
		$CA=$_GET['category_area'];
		$CA=str_replace("_","&",$CA);
		$JA=$_GET['junior_area'];
		$JA=str_replace("_","&",$JA);
		/*if ($category=="All"){
			$query="SELECT * FROM users WHERE User_Id='$UID';";
			$result=sqlsrv_query($link,$query,$params,$options);
			$row=sqlsrv_fetch_array($result);
			$access_level=$row['Access_Level'];


			if ($access_level=="user")
				$query="SELECT DISTINCT top 1 Display_Category as cat FROM user_category WHERE User_ID='$UID' ORDER BY Display_Category;";	
			else	
				$query="SELECT DISTINCT  Category_Area as cat FROM Suppliers_List WHERE Active_Yes_No='Yes' ORDER BY Category_Area;";
		
			$result=sqlsrv_query($link,$query,$params,$options);	

			while ($row=sqlsrv_fetch_array($result)){
				$category=$row['cat'];
			}
		}

		//echo $query;
		*/
		$query="SELECT * FROM users WHERE User_Id='$UID';";
		$result=sqlsrv_query($link,$query,$params,$options);
		$row=sqlsrv_fetch_array($result);
		$access_level=$row['Access_Level'];

		if ($access_level=="user"){
			if ($CA=="All"){
				$query="SELECT DISTINCT Display_Category FROM user_category WHERE User_ID='$UID';";
				$result=sqlsrv_query($link,$query,$params,$options);
				$NumberOfCategories=sqlsrv_num_rows($result);
				$catString="";
				while ($row=$row=sqlsrv_fetch_array($result)){
					$catString=$catString."'".$row['Display_Category']."'";
					$NumberOfCategories=$NumberOfCategories-1;
					if ($NumberOfCategories!=0)
						$catString=$catString.",";
				}
				
				$sub_query_3=" A.Category_Area_SL in ($catString) ";
			}
			else
				$sub_query_3=" A.Category_Area_SL='$CA' ";
		}
		else{
			if ($CA=="All")
				$sub_query_3=" A.Category_Area_SL LIKE '%%' ";
			else
				$sub_query_3=" A.Category_Area_SL='$CA' ";

		}

		if($JA=='All')
			$sub_query_1="A.Junior_Area_SL LIKE '%%' ";
		else
			$sub_query_1="A.Junior_Area_SL='$JA' ";


		$output=array();
		
		$query="SELECT   DISTINCT 

							Supplier_Number_SL,
							CAST(Supplier_Name_SL as VARCHAR) as Supplier_Name_SL,
							case when Supplier_Name_TFMS is null then 'Not Found' else CAST(Supplier_Name_TFMS as VARCHAR(50)) end as Supplier_Name_TFMS,
							case when Site_Code_TFMS is null then 'Not Found' else CAST(Site_Code_TFMS as varchar(50)) end as  Site_Code,
							case when Supplier_Name_EPW is null then 'Not Found' else CAST(REPLACE(REPLACE(Supplier_Name_EPW,'''',''),';','')as VARCHAR(100)) end as Supplier_Name_EPW,
							Commercial_Area_SL,
							Category_Area_SL,
							Product_Area_SL,
							Junior_Area_SL,
							FeedBack_Data,
							Comments
					 from [FeedbackData] as A
					 where $sub_query_1 and $sub_query_3 
						order by Supplier_Number_SL desc;";
		$result=sqlsrv_query($link,$query,$params,$options);
		
		
		//----------------------------------------------------------------------------------------
		

		
		if (sqlsrv_num_rows($result)>0){	
			while ($row=sqlsrv_fetch_array($result)){
				
				$output[]=$row;
			}
		}

		//print_r($output);
		echo json_encode($output);
		//*/
		
	}

	
	
?>
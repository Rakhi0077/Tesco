<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);
	

	if (isset($_GET['Supplier_Number']) && isset($_GET['Category_Director']) && isset($_GET['Buying_Controller']) && isset($_GET['userId'])){

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


		$query="SELECT distinct 
		  A.Supplier_Number as Supplier_Number,
    A.Supplier_Name,
    A.Commercial_Area,
    A.Category_Area,
    A.Buying_Controller,
    A.Junior_Buyer,
    A.Buyer_Area,
    A.Junior_Area,
    A.Buyer,
    A.Recall_Count,
    A.Withdrawal_Count,
    A.Withdrawal_Count_LY,
A.Recall_Count_LY,
A.Withdrawal_Count_Buying_Controller_TY,
A.Recall_Count_Buying_Controller_TY,
A.Withdrawal_Count_Buying_Controller_LY,
A.Recall_Count_Buying_Controller_LY,
    A.Own_Brand_Lines_Count,
    A.Brand_Lines_Count,
    A.TOTAL_Complaints_TY,
    A.TOTAL_Complaints_LY,
    A.Overall_Complaints_TY,
    A.Overall_Complaints_LY,
    A.Sales_Volume_TY AS C_Sales_Volume_TY,
    A.Sales_Volume_LY AS C_Sales_Volume_LY,
    A.Complaints_Per_Million_TY,
    A.Complaints_Per_Million_LY,

    
    A.Overall_Sales_Volume_TY,
    A.Overall_Sales_Volume_LY,
    A.Buying_Controller_Complaints_Per_Million_TY,
    A.Buying_Controller_Complaints_Per_Million_LY,
    (A.Buying_Controller_Complaints_Per_Million_TY-A.Buying_Controller_Complaints_Per_Million_LY)/NULLIF(A.Buying_Controller_Complaints_Per_Million_LY,0) AS Buying_Controller_YOY_Complaints_Changes,

    --A.Complaints_Ratio_TY,
    --A.Complaints_Ratio_LY,
    A.YOY_Complaints_Changes,
    A.mean,
    A.third_p_std,
    A.third_n_std,
    A.second_p_std,
    A.second_n_std,
    A.first_p_std,
    A.first_n_std,

    A.Complaints_Rank,

    A.Count_of_Distinct_TPNB_Sold,
    A.Total_EPW_Count,
    A.Total_EPW_Count_LY,
    A.EPW_YOY,
    A.Total_EPW_Count_Buying_Controller_TY,
    A.Total_EPW_Count_Buying_Controller_LY,
    A.EPW_YOY_Buying_Controller,
    A.EPW_Index_to_SKU,
    A.Overall_Count_of_Distinct_TPNB_Sold,
    A.Overall_EPW_Count,
    A.Overall_EPW_Index_to_SKU,
    A.EPW_Rank,


    A.System_TFMS_Rank,
    A.Final_TFMS_Rank,
    A.Quality_Rank,
A.Sales_Value_TY,
A.Sales_Value_LY,
A.Sales_Volume_TY,
A.Sales_volume_LY,
A.COGS_Value_TY,
A.COGS_Value_LY,
A.Sales_Value_Changes,
A.Sales_Volume_Changes,
A.COGS_Value_Changes,
A.Value_Quartile_1,
A.Value_Quartile_2,
A.Value_Quartile_3,
A.Volume_Quartile_1,
A.Volume_Quartile_2,
A.Volume_Quartile_3,
A.Buying_Sales_Value_TY,
A.Buying_Sales_Value_LY,
A.Buying_Sales_Volume_TY,
A.Buying_Sales_Volume_LY,
A.Buying_COGS_Value_TY,
A.Buying_COGS_Value_LY,
A.Buying_YOY_Sales_Value_Changes,
A.Buying_YOY_Sales_Volume_Changes,
A.Buying_YOY_COGS_Value_Changes,
A.Sales_Value_Rank,
A.Sales_Volume_Rank,
A.Sales_ex_VAT_TY,
A.Sales_ex_VAT_LY,
A.Sales_Volume_TY_CGM,
A.Sales_Volume_LY_CGM,
A.Commercial_Gross_Margin_TY,
A.Commercial_Gross_Margin_LY,
A.YOY_Sales_Value_Changes_CGM,
A.YOY_Sales_Volume_Changes_CGM,
A.YOY_CGM_Changes,
A.CGM_Margin_Per_TY,
A.CGM_Margin_Per_LY,
A.YOY_CGM_Per_Changes,
A.CTS_Margin_TY,
A.CTS_Margin_LY,
A.YOY_CTS_Changes,
A.CTS_Margin_Per_TY,
A.CTS_Margin_Per_LY,
A.YOY_CTS_Per_Changes,
A.Buying_Controller_Sales_ex_VAT_TY,
A.Buying_Controller_Sales_ex_VAT_LY,
A.Buying_Controller_Sales_Volume_TY_CGM,
A.Buying_Controller_Sales_Volume_LY_CGM,
A.Buying_Controller_Commercial_Gross_Margin_TY,
A.Buying_Controller_Commercial_Gross_Margin_LY,
A.Buying_Controller_YOY_CGM_Changes,
A.Buying_Controller_CGM_Margin_Per_TY,
A.Buying_Controller_CGM_Margin_Per_LY,
A.Buying_Controller_YOY_CGM_Sales_Value_Changes,
A.Buying_Controller_YOY_CGM_Sales_Volume_Changes,
A.Buying_Controller_YOY_CGM_Per_Changes,
A.Buying_Controller_CTS_Margin_TY,
A.Buying_Controller_CTS_Margin_LY,
A.Buying_Controller_YOY_CTS_Changes,
A.Buying_Controller_CTS_Margin_Per_TY,
A.Buying_Controller_CTS_Margin_Per_LY,
A.Buying_Controller_YOY_CTS_Per_Changes,
A.CTS_Quartile_1,
A.CTS_Quartile_2,
A.CTS_Quartile_3,
A.CGM_Quartile_1,
A.CGM_Quartile_2,
A.CGM_Quartile_3,
A.CTS_YOY_Rank,
A.CGM_YOY_Rank,
A.Value_Rank,
A.Sales_Q1,
A.Sales_Q2,
A.Sales_Q3,
A.Volume_Q1,
A.Volume_Q2,
A.Volume_Q3,
 A.Ordered_TY,
    A.Ordered_Buying_Controller_TY,
    A.Delivered_TY,
    A.Delivered_Buying_Controller_TY,
    A.Total_Shorts_TY,
    A.Total_Shorts_Buying_Controller_TY,
    A.SL_Percentage_TY,
    A.SL_Percentage_Buying_Controller_TY,

    A.Ordered_LY,
    A.Ordered_Buying_Controller_LY,
    A.Delivered_LY,
    A.Delivered_Buying_Controller_LY,
    A.Total_Shorts_LY,
    A.Total_Shorts_Buying_Controller_LY,
    A.SL_Percentage_LY,
    A.SL_Percentage_Buying_Controller_LY,
    A.YoY_SL_Percentage ,
    A.YoY_SL_Percentage_Buying_Controller,


    A.SL_Percentage_Quartile_1,
    A.SL_Percentage_Quartile_2,
    A.SL_Percentage_Quartile_3,
    A.Service_Level_Rank,
    A.Blue_Weeks_TY,
    A.Blue_Weeks_Buying_Controller_TY,
    A.Green_Weeks_TY,
    A.Green_Weeks_Buying_Controller_TY,
    A.Amber_Weeks_TY,
    A.Amber_Weeks_Buying_Controller_TY,
    A.Red_Weeks_TY,
    A.Red_Weeks_Buying_Controller_TY,
    A.Total_Weeks_TY,
    A.Red_Weeks_Percentage_TY,

    A.Blue_Weeks_LY,
    A.Blue_Weeks_Buying_Controller_LY,
    A.Green_Weeks_LY,
    A.Green_Weeks_Buying_Controller_LY,
    A.Amber_Weeks_LY,
    A.Amber_Weeks_Buying_Controller_LY,
    A.Red_Weeks_LY,
    A.Red_Weeks_Buying_Controller_LY,
    A.Total_Weeks_LY,
    A.Red_Weeks_Percentage_LY,
    A.YoY_Red_Weeks_Percentage,
    A.YoY_Red_Weeks_Percentage_Buying_Controller,

    A.Red_Weeks_Percentage_Quartile_1,
    A.Red_Weeks_Percentage_Quartile_2,
    A.Red_Weeks_Percentage_Quartile_3,
    A.Red_Weeks_Quartile_Rank,
    A.Supply_Rank,
A.Number_of_TBNBs_in_Lower_Quartile,
A.Number_of_TBNBs,
A.Pecentage_Lower_Quartile,
A.CPS_Q1,
A.CPS_Q2,
A.CPS_Q3,
A.Innovation_Rank,
A.QVIS_Rank,
B.*,C.Avg_Quality_Rank,
                    C.Avg_Value_Rank,
                    C.Avg_Innovation_Rank,
                    C.Avg_Supply_Rank
            
                
				
				FROM View_Rank_QVIS_By_Buying_Controller AS A
				INNER JOIN (SELECT DISTINCT Supplier_Number,Supplier_Name,Category_Area,Product_Area FROM Suppliers_List) AS B
				ON A.Supplier_Number=B.Supplier_Number AND A.Category_Area=B.Category_Area AND A.Product_Area=B.Product_Area
				INNER JOIN [dbo].[View_Avg_QVIS_Category_Ranks] as C
				on A.Product_Area=C.Area and C.Unit='Product_Area'
				WHERE A.Supplier_Number='$SN' AND A.Category_Area='$CD' AND A.Product_Area='$BC';";
		

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
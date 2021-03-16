<?php

	if (session_status() == PHP_SESSION_NONE)
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);

	$UserID=$data->UserID;
	$Geography=$data->Geography;
	//$TYSal=data->TYSales;
	$TYSal=0;
	$YOYChanges=$data->YOYChanges;
	$TYVolume=$data->TYVolume;
	$TYMargin=$data->TYMargin;
	$MasterCategory=$data->MasterCategory;
	$Category=$data->Category;
	$SCRating=$data->SCRating;
	$TechRating=$data->TechRating;
	$NPDRating=$data->NPDRating;
	$BuyingRating=$data->BuyingRating;
	$SupplierNumber=$data->SupplierNumber;
	$SupplierName=$data->SupplierName;
	$ProductSupplied=$data->ProductSupplied;
	$FutureCapability=$data->FutureCapability;
	$SupplierCategorization=$data->SupplierCategorization;
	$SCTTL=$data->SCTTL;
	$Strategy=$data->Strategy;
	$NOSites=$data->NOSites;
	$Comments=$data->Comments;
	
	$errorFlag=false;
	$errorMessage="";

	
	if ($MasterCategory=="" || ($Geography=='UK' && $MasterCategory!="NA")){
		$errorFlag=true;
		$errorMessage="Please define Master Category, enter NA in case of UK geography";
		goto end;
	}
		
	if ($Category==""){
		$errorFlag=true;
		$errorMessage="Please define product Category";
		goto end;
	}
		
	if ($SCRating=="" || ($SCRating>4 || $SCRating<1)){
		$errorFlag=true;
		$errorMessage="Invalid Supply chain rating, rating must be between 1 and 4";
		goto end;
	}
		 
	if ($TechRating=="" || ($TechRating>4 || $TechRating<1)){
		$errorFlag=true;
		$errorMessage="Invalid Technical rating, rating must be between 1 and 4";
		goto end;
	}
		 
	if ($NPDRating=="" || ($NPDRating>4 || $NPDRating<1)){
		$errorFlag=true;
		$errorMessage="Invalid NPD rating, rating must be between 1 and 4";
		goto end;
	}
		
	if ($BuyingRating=="" || ($BuyingRating>4 || $BuyingRating<1)){
		$errorFlag=true;
		$errorMessage="Invalid Buying rating, rating must be between 1 and 4";
		goto end;
	}
		 
	if ($SupplierName=="" || strlen($SupplierName)<3){
		$errorFlag=true;
		$errorMessage="Invalid supplier name, supplier name must containg atleast 3 characters";
		goto end;
		
	}
	
	/*	 
	if ($NOSites==""){
		$errorFlag=true;
		$errorMessage="Invalid number of site, enter 0 in case if there is no site";
		goto end;
	}
	*/
	
	if ($errorFlag==false){
		
		$overAll=$SCRating+$TechRating+$NPDRating+$BuyingRating;
		$query="SELECT MAX(CL_ID) AS MAX_ID FROM category_level_rating;";
		
		$result=sqlsrv_query($link,$query,$params,$options);
		$row=sqlsrv_fetch_array($result);
		$CL_ID=$row['MAX_ID']+1;
		
		$query="INSERT INTO category_level_rating(CL_ID,Supplier_Number,Supplier_Name,Product_Supplied,Supplier_Code_TTL,Future_Capability,Supplier_Categorization,Master_Category,Category,Number_of_Sites,This_Year_Sales,YOY_Changes,This_Year_Units,This_Year_Margin,Supply_Chain_Rating, Technical_Rating,NPD_Rating,Buying_Rating,Overall_Rating,Strategy,Comments,Geography) VALUES ('$CL_ID','$SupplierNumber','$SupplierName','$ProductSupplied','$SCTTL','$FutureCapability','$SupplierCategorization','$MasterCategory','$Category','$NOSites','$TYSal','$YOYChanges','$TYVolume','$TYMargin','$SCRating','$TechRating','$NPDRating','$BuyingRating','$overAll','$Strategy','$Comments','$Geography')"; 
		sqlsrv_query($link,$query,$params,$options);
		
		//Update log table also
		$query="INSERT INTO log_category_level_rating(CL_ID,User_Id,Last_Modified_Date_Time,Supplier_Number,Supplier_Name,Product_Supplied,Supplier_Code_TTL,Future_Capability,Supplier_Categorization,Master_Category,Category,Number_of_Sites,This_Year_Sales,YOY_Changes,This_Year_Units,This_Year_Margin,Supply_Chain_Rating,Technical_Rating,NPD_Rating,Buying_Rating,Overall_Rating,Strategy,Comments,Geography) VALUES ('$CL_ID','$UserID',GETDATE(),'$SupplierNumber','$SupplierName','$ProductSupplied','$SCTTL','$FutureCapability','$SupplierCategorization','$MasterCategory','$Category','$NOSites','$TYSal','$YOYChanges','$TYVolume','$TYMargin','$SCRating','$TechRating','$NPDRating','$BuyingRating','$overAll','$Strategy','$Comments','$Geography')";
		sqlsrv_query($link,$query,$params,$options);
		
	}
	
end:
	$output=array();
	$output['errorFlag']=$errorFlag;
	$output['errorMessage']=$errorMessage;
	echo json_encode($output);
	
?>
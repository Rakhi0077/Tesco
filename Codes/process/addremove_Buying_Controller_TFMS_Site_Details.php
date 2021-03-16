
<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);

	
	//echo $_GET['overallrating'];

	if (isset($_GET['SiteCode']) && isset($_GET['action']) ){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
		
		
		// $SuppCode=$_GET['SuppCode'];
		$SiteCode=$_GET['SiteCode'];
		$SiteName=$_GET['SiteName'];
		
		$SuppName=$_GET['SuppName'];
		$action=$_GET['action'];
		$comment=$_GET['comment'];
		// // $PC=$_GET['PC'];
		// $JB=str_replace("_","&",$SC);
		// // $CD=str_replace("_","&",$PC);


		

		
		$output=array();
		
		$query="INSERT INTO [TFMS_AddRemove_Sites] (Site_Code,Site_Name,Supplier_Name,Site_Action,Comment)
		VALUES ('$SiteCode','$SiteName','$SuppName','$action','$comment')";
		$result=sqlsrv_query($link,$query,$params,$options);
		
		$update="SELECT  top 1* from [TFMS_AddRemove_Sites];";
		$update_result=sqlsrv_query($link,$update,$params,$options);
		//----------------------------------------------------------------------------------------
		

		
		if (sqlsrv_num_rows($update_result)>0){	
			while ($row=sqlsrv_fetch_array($update_result)){
				
				$output[]=$row;
			}
		}

		//print_r($output);
		echo json_encode($output);
		//*/
		
	}

	
	
?>
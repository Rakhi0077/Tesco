
<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);

	
	//echo $_GET['overallrating'];

	if (isset($_GET['SN']) && isset($_GET['SC']) ){

		include_once ("../Includes/db_connect.php");
		$link=DB_Connect();
		$params = array();
		$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
		
		$SN=$_GET['SN'];
		$SC=$_GET['SC'];
		// $PC=$_GET['PC'];
		$JB=str_replace("_","&",$SC);
		// $CD=str_replace("_","&",$PC);


		

		
		$output=array();
		
		$query="INSERT INTO [TFMS_FeedbackData] (Supplier_Number, Supplier_Code )
		VALUES ('$SN','$SC')";
		$result=sqlsrv_query($link,$query,$params,$options);
		
		$update="SELECT  * from TFMS_FeedbackData
		where  Supplier_Number='$SN';";
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
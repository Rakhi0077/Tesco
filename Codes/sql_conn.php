<?php
	if (session_status() == PHP_SESSION_NONE) 
		session_start();

	ini_set('max_execution_time', 300);

	$link=Other_SQL_Server();
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);		
	$output=array();

	
	function Main_SQL_Server(){	
		$serverName = "dvbussql000q01uk.dev.global.tesco.org";
		$connectionInfo = array("Database"=>"Supplier_ScoreCard");
		$conn = sqlsrv_connect($serverName,$connectionInfo);
			
		if( $conn ) {
			return $conn;
		}else{
			echo "Connection could not be established.<br />";
			die( print_r( sqlsrv_errors(), true));
		}
	}

	function Other_SQL_Server(){	
		
		$user="TESCOGLOBAL\yk96";
		$password="mfaiaK@321";
		$serverName = "PVGHSREPDB001UK.global.tesco.org";
		
		$dsn="SQL_Conn";
		
		$conn=odbc_connect($dsn,$user,$password);
		
		//$connectionInfo = array("Database"=>"CPRCOE","UID"=>"TESCOGLOBAL\yk96", "PWD"=>"mfaiaK@321");
		//$conn = sqlsrv_connect($serverName,$connectionInfo);
			
		if( $conn ) {
			echo "Connected...";
			return $conn;
		}else{
			echo "Connection could not be established with <b color='red'>PVGHSREPDB001UK.global.tesco.org</b> Server<br />";
			die( print_r( sqlsrv_errors(), true));
		}
	}
	


?>
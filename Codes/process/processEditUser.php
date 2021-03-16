<?php

	if (session_status() == PHP_SESSION_NONE)
		session_start();
	
	$data=json_decode(file_get_contents("php://input"));
	include_once ("../Includes/db_connect.php");
	$link=DB_Connect();
	
	$params = array();
	$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET);
	
	$UserID=$data->userId;
	$Geography=$data->userGeography;
	$AccessLevel=$data->accessLevel;
	$UserName=$data->userName;
	$Passwd=$data->passwd;
	$MasterAccess=$data->masterAccess;
	$MasterCategory=$data->masterCategory;
	$Categories=explode(",",implode(",", $data->categories));
	
	$errorFlag=false;
	$errorMessage="";
	
	//User Id Validation
	//-----------------------------------------------------------------------------------------------
	$query="SELECT * FROM users WHERE User_Id='$UserID'";
	$result_1=sqlsrv_query($link,$query,$params,$options);
		
	if (sqlsrv_num_rows($result_1)>0){
		//Category Validation
		$validCategories=true;
		if ($AccessLevel!="admin"){
			
			$oldCategories=[];
			$query="SELECT Category FROM user_category WHERE User_ID='$UserID'";
			$result_2=sqlsrv_query($link,$query,$params,$options);
			$counter=0;
			
			while ($row=sqlsrv_fetch_array($result_2)){
				$oldCategories[$counter]=$row['Category'];
				$counter++;
			}
			
			if ($counter==count($Categories)){
				$newCategoryFlag=false;
				for ($i=0;$i<$counter;$i++){
					$matchFlag=false;
					for ($j=0;$j<count($Categories);$j++){
						if ($oldCategories[$i]==$Categories[$j]){
							$matchFlag=true;
							break;
						}
					}
					if ($matchFlag==false){
						$newCategoryFlag=true;
						break;
					}
				}
					
				if ($newCategoryFlag==false)
					$validCategories=false;
			}
		}
		
		$row=sqlsrv_fetch_array($result_1);
		if ($AccessLevel==$row['Access_Level'] && $UserName==$row['User_Name'] && $Passwd==$row['Passwd'] && $MasterAccess==$row['Master_Access'] && $MasterCategory==$row['Master_Category'] && (($validCategories==true && $AccessLevel=="admin") || ($validCategories==false && $AccessLevel!="admin"))){
			$errorFlag=true;
			$errorMessage="Ooops nothing changed, everything is same as it was before";
			
		}
		else{
			//Admin credential can't be change
			if ($row['Access_Level']=='admin' && $AccessLevel!="admin"){
				$errorFlag=true;
				$errorMessage="Hey, be on your limit";
				goto end;
				
			}
				 
			//Password Validation
			//-----------------------------------------------------------------------------------------------
			if (strlen($Passwd)<5){
				$errorFlag=true;
				$errorMessage="Password must contain atleast 5 characters";
				goto end;
			}
			
			//User Name Validation
			//-----------------------------------------------------------------------------------------------
			if (strlen($UserName)<5){
				$errorFlag=true;
				$errorMessage="User Name must contain atleast 5 characters";
				goto end;
			}
				
			//Number of categories Validation
			//-----------------------------------------------------------------------------------------------
			if (count($Categories)==0){
				$errorFlag=true;
				$errorMessage="Atleast one category must be checked";
				goto end;
			}
			//-----------------------------------------------------------------------------------------------
			
		}	
		
	}
	else{
		$errorFlag=true;
		$errorMessage="Hey, be in your limit";	
	}

	if ($errorFlag==false){
		if ($Geography=='UK')
			$MasterCategory="NA";

		$query="UPDATE users SET User_Name='$UserName',Access_Level='$AccessLevel',Master_Access='$MasterAccess',Master_Category='$MasterCategory',Passwd='$Passwd' WHERE User_Id='$UserID';";
		sqlsrv_query($link,$query,$params,$options);
			
		if ($AccessLevel!='admin'){
			$query="DELETE FROM user_category WHERE User_ID='$UserID';";
			sqlsrv_query($link,$query,$params,$options);
			
			for ($i=0;$i<count($Categories);$i++){
				$query="INSERT INTO user_category(User_ID,Category) VALUES ('$UserID','$Categories[$i]');";
				sqlsrv_query($link,$query,$params,$options);
				
			}
		}
	}
		
end:

	$output=array();
	$output['errorFlag']=$errorFlag;
	$output['errorMessage']=$errorMessage;
	
	echo json_encode($output);
	
?>
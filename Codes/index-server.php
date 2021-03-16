<?php 	
	if(isset($_SERVER['HTTP_USER_AGENT']))
         $agent = $_SERVER['HTTP_USER_AGENT'];

    if(!strlen(strstr($agent,"Chrome")) > 0 ){
		echo "	<div style='position: absolute;
		left:50%;
		top:50%;
		margin-left:-100px;
		margin-top:-20px;
		width: 600px;
		height: 40px;'>
				<span style='color:red; font-weight:bold; font-size:18px;'>Sorry - Please Use Chrome Browser<span>
				</div>";
    }
	else{
		$v=rand(120,899);
?>



<!DOCTYPE html>
<html ng-app="myApp">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
		<title>Server Maintenance| Supplier Scorecard</title>
		
		<script type="text/javascript" src="scripts/angular.min.js"></script>
		<script type="text/javascript" src="scripts/angular-ui-router.min.js"></script>
		<script type="text/javascript" src="scripts/ngStorage.min.js"></script>
		<script type="text/javascript" src="scripts/angular-animate.min.js"></script>
		<script type="text/javascript" src="https://code.jquery.com/jquery.min.js"></script>
		<script type="text/javascript" src="scripts/myScript.js?ver=<?php echo $v;?>"></script>
		
		<link rel="shortcut icon" type="image/x-icon" href="images/fevi.ico" type="path" />
		<link rel="stylesheet" href="styles/partnerstoolkit_style_1.css?ver=<?php echo $v;?>"></link>
		<link rel="stylesheet" href="styles/partnerstoolkit_style_2.css?ver=<?php echo $v;?>"></link>
		<link rel="stylesheet" href="styles/partnerstoolkit_style_3.css?ver=<?php echo $v;?>"></link>
		<link rel="stylesheet" href="styles/myStyle.css?ver=<?php echo $v;?>"></link>
	</head>
	
	<body class="ng-cloak" ng-cloak>
		<div id="app">
		    <div class="main-container">
		        <header>
		            <div class="ddl">
		                <div class="ddll_header_wrapper">
		                    <div class="ddll_direct_header">
		                        <div class="direct_desktop_header">
		                            <div class="top_wrapper">
		                                <div class="tesco_logo">
		                                    <h1><a href="index.php" class="logo"><img src="images/Tesco_Logo.png" alt="Tesco logo"></a></h1>
		                               </div>
		                                <div style="float:right;">
		                               </div>
		                            </div>
		                        </div>
		                    </div>
		                </div>
		            </div>
		        </header>
		        <div class="main-content">
					<center>
						<div style="width: 500px;height:500px; auto;background: #fff;margin-top: 30px;padding-top:100px;">
							<img alt="server_maintanance" src="images/server_maintanance.png">
						</div>
					</center>
				</div>
		        <div class="sticky-footer__footer">
		            <div class="ddl">
		                <footer class="page_footer">
		                    <div class="copy_rights">
		                        <p class="copy_rights_content">
		                            <!-- react-text: 82 -->&copy; Tesco.com
		                            <!-- /react-text -->
		                            <!-- react-text: 83 -->2017
		                            <!-- /react-text -->
		                            <!-- react-text: 84 -->All Rights Reserved
		                            <!-- /react-text -->
		                        </p>
		                    </div>
		                </footer>
		            </div>
		        </div>
		    </div>
		</div>
	</body>
</html>
<?php }?>
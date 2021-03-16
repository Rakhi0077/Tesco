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
		header('Access-Control-Allow-Origin: *');
		$v=rand(120,899);
		
?>

<!DOCTYPE html>
<html ng-app="myApp">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8">

		<title>{{pageTitle}} | QVIS Scorecard</title>
		<base href="/QVIS-scorecard-KT/">
		
		<script type="application/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.2/angular.min.js"></script>
		<script type="application/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/1.0.18/angular-ui-router.min.js"></script>
		<script type="application/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.2/angular-animate.min.js"></script>
		<script type="application/javascript" src="scripts/ngStorage.min.js"></script>
		<script type="application/javascript" src="https://code.jquery.com/jquery.min.js"></script>
		<script type="application/javascript" src="scripts/myScript.js?ver=<?php echo $v;?>"></script>
		<script type="application/javascript" src="scripts/cbpFWTabs.js"></script>
		<script type="application/javascript" src="scripts/FileSaver.js"></script>
		<script src="scripts/chart.js"></script>
  		<script src="scripts/tc-angular-chartjs.js"></script>
  		<script src="scripts/zingchart.min.js"></script>
  		<script src="scripts/zingchart-angularjs.js"></script>
  		<script src="scripts/html2canvas.min.js"></script>
  		<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.22/pdfmake.min.js"></script>

		<link rel="shortcut icon" type="image/x-icon" href="images/fevi.ico" type="path" />
		<link rel="stylesheet" href="styles/partnerstoolkit_style_1.css?ver=<?php echo $v;?>"></link>
		<link rel="stylesheet" href="styles/partnerstoolkit_style_2.css?ver=<?php echo $v;?>"></link>
		<link rel="stylesheet" href="styles/partnerstoolkit_style_3.css?ver=<?php echo $v;?>"></link>
		<link rel="stylesheet" href="styles/myStyle.css?ver=<?php echo $v;?>"></link>

		<link rel="stylesheet" type="text/css" href="styles/demo.css" />
		<link rel="stylesheet" type="text/css" href="styles/tabs.css" />
		<link rel="stylesheet" type="text/css" href="styles/tabstyles.css" />

		<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">

  		
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
		                                    <h1><a href="#" class="logo"><img src="images/Tesco_Logo.png" alt="Tesco logo"></a></h1>
		                               </div>
		                                <div style="float:right;width: 70%;">
		                    				<!-- <div ui-view="user-details"></div> -->
		                    				<div user-header></div>
		                    				<div style="float:right;" class="tooltip">
		                    					<img src="Images/q2.png" alt="HTML tutorial" align="middle" style="width:22px;height:22px;border:0;">
											  <span class="tooltiptext" style="padding-left: 5px;">
<span style="color: #000;font-size: 20px;"><b>How to use this tool:</b></span>
<br>
<br>
	
<span style="color: #000;font-size: 18px;">1. Tabs:</span>
<br>		
&nbsp &nbsp &nbsp &nbsp &nbsp - Click on the tab you’re interested in: Junior Buyer/ Buying controller/ Category director <br>
&nbsp &nbsp &nbsp &nbsp &nbsp - You can click on the TPP view if you’re interested in looking at TPP performance specifically
 <br>
 <br>
<span style="color: #000;font-size: 18px;">2. Filters:</span>
<br>
&nbsp &nbsp &nbsp &nbsp &nbsp - You can filter the information based on your needs – select filter from dropdowns and click on Apply filter
	
<br>
<br>
<span style="color: #000;font-size: 18px;">3. Download Data:</span>
<br>
&nbsp &nbsp &nbsp &nbsp &nbsp- Click on download data button to save a copy in excel
<br>
<br>
<span style="color: #000;font-size: 18px;">4. Supplier Information:</span>
<br>
&nbsp &nbsp &nbsp &nbsp &nbsp- You can click on supplier numbers to go to a deep dive sheet for that specific supplier
<br>
&nbsp &nbsp &nbsp &nbsp &nbsp- You can toggle the tabs to see the Quality, Value, Innovation, Supply and Overall performance metrics 
<br>
	<br>
<span style="color: #000;font-size: 18px;">5. User Inputs:</span>
<br>
&nbsp &nbsp &nbsp &nbsp &nbsp- If you see a any supplier-site information that is not right, please provide feedback through the user input section <br> and we will take care of it in the next release
											  </span>
											</div>
											      
											  		
		                    				<!-- <div style="float:right;"><a    href="mailto:QVIS_Support.tesco.com?subject= Create Username and Password/Support&body=Hi %0D%0APlease provide the following details if you need credentials:%0D%0AName:%0D%0AMailId:%0D%0ADepartment:%0D%0AManager Name:%0D%0AManager Mail :ID%0D%0A %0D%0A Thank You%0D%0A">
															  <img src="Images/q2.png" alt="HTML tutorial" align="middle" style="width:22px;height:22px;border:0;">
											</a></div> -->
		                               </div>
		                            </div>
		                        </div>
		                    </div>
		                </div>
		            </div>
		        </header>

		        <div class="main-content">
					<div ui-view="main-view"></div>
				</div>
		        <div class="sticky-footer__footer">
		            <div class="ddl">
		                <footer class="page_footer">
		                    <div class="copy_rights">
		                        <p class="copy_rights_content">
		                            <!-- react-text: 82 -->&copy; Tesco.com
		                            <!-- /react-text -->
		                            <!-- react-text: 83 -->2018
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
<style>

.tooltip {
  position: relative;
  display: inline-block;
  /*border-bottom: 1px dotted black;*/
}

.tooltip .tooltiptext {

  visibility: hidden;
  width: 800px;
  height: 400px;
  font-size: 15px;
  background-color: #ccc;
  color:#000 ;
  text-align: left;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
 
  top: 100%;
  left: 1%;
  margin-left: -500px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: " ";
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>
<?php }?>
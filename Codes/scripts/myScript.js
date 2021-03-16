//JQUERY
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
$(document).ready(function() {
    function setHeight() {
        windowHeight = $(window).innerHeight();
        $('.main-content').css('min-height', windowHeight-50);
    };
    setHeight();
    $(window).resize(function() {
        setHeight();
    });
    
    $(document).on("click", "#tips-button", function() {
        $(".tips-box").animate({width: "toggle"});
    });
});
//-----------------------------------------------------------------------------------------------------------------------------------------------------------




//AngularJS
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
var app=angular.module("myApp",["ui.router","ngStorage","ngAnimate","tc.chartjs","myApp.radar","zingchart-angularjs"]);
app.config(function($stateProvider,$locationProvider,$urlRouterProvider){
    $stateProvider
    .state("login",{
        url: "/login",
        views:{
            "main-view":{
                templateUrl: "templates/login.php",
                controller: "loginController"
            }
        }
    })
    .state("dashboard",{
        url: "/dashboard",
        views:{
            "main-view":{
                templateUrl: "templates/dashboard.php",
                controller: "dashboardController"
            }
        }
    })
    .state("dashboard.juniorBuyer",{
        url: "/juniorBuyer",
        views:{
            "dashboard-view":{
                templateUrl: "templates/juniorBuyerView.php",
                controller: "dashboardController"
            }
        }
    })
    .state("dashboard.buyingController",{
        url: "/buyingController",
        views:{
            "dashboard-view":{
                templateUrl: "templates/buyingControllerView.php",
                controller: "dashboardController"
            }
        }
    })
    .state("dashboard.merge",{
        url: "/Total",
        views:{
            "dashboard-view":{
                templateUrl: "templates/categoryTotalView.php",
                controller: "dashboardController"
            }
        }
    })
    .state("dashboard.graph",{
        url: "/graph",
        views:{
            "dashboard-view":{
                templateUrl: "templates/graph.php",
                controller: "RadarCtrl"
            }
        }
    })
    .state("dashboard.feedback",{
        url: "/feedback",
        views:{
            "dashboard-view":{
                templateUrl: "templates/feedbackView.php",
                controller: "dashboardController"
            }
        }
    })
    .state("dashboard.category",{
        url: "/category",
        views:{
            "dashboard-view":{
                templateUrl: "templates/categoryView.php",
                controller: "dashboardController"
            }
        }
    })
    
    .state("juniorBuyerDetails",{
        url: "/juniorBuyerDetails/:SN/:CD/:JB",
        views:{
            "main-view":{
                templateUrl: "templates/juniorBuyerDetails.php",
                controller: "juniorBuyerDetailsController"
            }
        }
    })

    .state("buyingControllerDetails",{
        url: "/buyingControllerDetails/:SN/:CD/:BC",
        views:{
            "main-view":{
                templateUrl: "templates/buyingControllerDetails.php",
                controller: "buyingControllerDetailsController"
            }
        }
    })

    .state("categoryDetails",{
        url: "/categoryDetails/:SN/:CD",
        views:{
            "main-view":{
                templateUrl: "templates/categoryDetails.php",
                controller: "categoryDetailsController"
            }
        }
    })

    .state("categoryDetailsTFTP",{
        url: "/categoryDetailsTFTP/:SN/:CD/:Comm_D",
        views:{
            "main-view":{
                templateUrl: "templates/categoryDetailsTFTP.php",
                controller: "categoryDetailsControllerTFTP"
            }
        }
    })
    
    .state("addNewUser",{
        url: "/addNewUser",
        views:{
            "main-view":{
                templateUrl: "templates/addNewUser.php",
                controller: "addNewUserController"
            }
        }
    })
    .state("usersList",{
        url: "/usersList",
        views:{
            "main-view":{
                templateUrl: "templates/usersList.php",
                controller: "usersListController"
            }
        }
    })
    .state("resetPassword",{
        url: "/resetPassword",
        views:{
            "main-view":{
                templateUrl: "templates/resetPassword.php",
                controller: "resetPasswordController"
            }
        }
    })
    .state("addNewLine",{
        url: "/addNewLine",
        views:{
            "main-view":{
                templateUrl: "templates/addNewLine.php",
                controller: "addNewLineController"
            }
        }
    })
    
    $urlRouterProvider.otherwise("login");
    $locationProvider.html5Mode(true);
});


app.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});

app.filter('thousandSuffix', function () {
    
    return function (input, decimals) {
        
        var exp, rounded,
        suffixes = ['K', 'M', 'B', 'T', 'P', 'E'];
        //input=1000000000;

        if(window.isNaN(input))
            return null;

        if (input<0)
            neg=true;
        else
            neg=false;

        if(input < 1000 && input>0)
            return input;

        if(input >= -1000 && input<=1000)
            return input;
        

        if (neg==false){
            exp = Math.floor(Math.log(input) / Math.log(1000));
            return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
       }else{
            
            input=-input;
            exp = Math.floor(Math.log(input) / Math.log(1000));
            return '-'+((input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1]);
       }
    };
});


app.directive("userHeader",function(){
    return {
        templateUrl: "templates/header.php"
    };
    
});

var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};
app.directive("compareTo", compareTo);

app.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
}]);

app.factory("appService",["$http","$sessionStorage","$cacheFactory",function($http,$sessionStorage,$cacheFactory){
    var oService={};
    
    oService.validateloginCredential=function(user_id,passwd){
        return $http.post("process/processLogin.php",{user_id:user_id,user_passwd:passwd}).then(function(response) {
            //alert(response.data.status);
            return response;
        });
    }
    
    oService.getJuniorBuyerRatings=function(geography,QVIS,rating,overallrating,category,JuniorBuyer,tesco_brand_ind,parent_supplier_name){
         // alert(parent_supplier_name);
        return $http.get("process/getJuniorBuyerRatings.php?userId="+$sessionStorage.userID+"&geography="+geography+"&QVIS="+QVIS+"&rating="+rating+"&overallrating="+overallrating+"&category="+category+"&JuniorBuyer="+JuniorBuyer+"&tesco_brand_ind="+tesco_brand_ind+"&parent_supplier_name="+parent_supplier_name,{cache:true}).then(function(response) {
            return response.data;
            console.log(response.data);
        });
    }

    oService.downloadJuniorBuyerRatings=function(geography,QVIS,rating,overallrating,category,JuniorBuyer){
        return $http.get("process/downloadJuniorBuyerRatings.php?userId="+$sessionStorage.userID+"&geography="+geography+"&QVIS="+QVIS+"&rating="+rating+"&overallrating="+overallrating+"&category="+category+"&JuniorBuyer="+JuniorBuyer,{cache:true}).then(function(response) {
            //alert(response.data);
            //console.log(response.data);
            return response.data;
        });
    }
    oService.getFeedbackData=function(CC,CA,JA){
        //alert("In");
        return $http.get("process/getFeedbackData.php?userId="+$sessionStorage.userID+"&commercialcategory="+CC+"&category_area="+CA+"&junior_area="+JA,{cache:true}).then(function(response) {
            //alert(response.data);
            return response.data;
            
            
            
        });
    }
    oService.update_feedbackdata=function(FD,CD,SN,JB){
        //console.log(FD + SN + JB + "Comments" + CD);
        return $http.get("process/updateFeedbackData.php?SN="+SN+"&FD="+FD+"&CD="+CD+"&JB="+JB,{cache:true}).then(function(response) {
            console.log(response.data);
            return response.data;
            
            
            
        });
    }
    oService.updateBuying_feedbackdata=function(FD,CD,SN,JB){
        //console.log(FD + SN + JB + "Comments" + CD);
        return $http.get("process/updateFeedbackData.php?SN="+SN+"&FD="+FD+"&CD="+CD+"&JB="+JB,{cache:true}).then(function(response) {
            console.log(response.data);
            return response.data;
            
            
            
        });
    }
    oService.updateCategory_feedbackdata=function(FD,CD,SN,JB){
        //console.log(FD + SN + JB + "Comments" + CD);
        return $http.get("process/updateFeedbackData.php?SN="+SN+"&FD="+FD+"&CD="+CD+"&JB="+JB,{cache:true}).then(function(response) {
            console.log(response.data);
            return response.data;
            
            
            
        });
    }

    oService.updateJuniorTFMS_Supplier_Details=function(SN,SC){
        //console.log(FD + SN + JB + "Comments" + CD);
        return $http.get("process/updateJuniorTFMS_Supplier_Details.php?SN="+SN+"&SC="+SC,{cache:true}).then(function(response) {
            //console.log(response.data);
            return response.data;
            
            
            
        });
    }
    oService.addremove_Junior_Buyer_TFMS_Site_Details=function(SiteCode,SiteName,SuppName,action,comment){
        console.log(SiteCode + SiteName + SuppName +action +comment);
        return $http.get("process/addremove_Junior_Buyer_TFMS_Site_Details.php?SiteCode="+SiteCode+"&SiteName="+SiteName+"&SuppName="+SuppName+"&action="+action+"&comment="+comment,{cache:true}).then(function(response) {
            //console.log(response.data);
            return response.data;
            
            
            
        });
    }
    oService.addremove_Buying_Controller_TFMS_Site_Details=function(SiteCode,SiteName,SuppName,action,comment){
        console.log(SiteCode + SiteName + SuppName +action +comment);
        return $http.get("process/addremove_Junior_Buyer_TFMS_Site_Details.php?SiteCode="+SiteCode+"&SiteName="+SiteName+"&SuppName="+SuppName+"&action="+action+"&comment="+comment,{cache:true}).then(function(response) {
            //console.log(response.data);
            return response.data;
            
            
            
        });
    }
    oService.addremove_Category_TFMS_Site_Details=function(SiteCode,SiteName,SuppName,action,comment){
        console.log(SiteCode + SiteName + SuppName +action +comment);
        return $http.get("process/addremove_Junior_Buyer_TFMS_Site_Details.php?SiteCode="+SiteCode+"&SiteName="+SiteName+"&SuppName="+SuppName+"&action="+action+"&comment="+comment,{cache:true}).then(function(response) {
            //console.log(response.data);
            return response.data;
            
            
            
        });
    }

    oService.updateCategoryTFMS_Supplier_Details=function(SN,SC){
        //console.log(FD + SN + JB + "Comments" + CD);
        return $http.get("process/updateCategoryTFMS_Supplier_Details.php?SN="+SN+"&SC="+SC,{cache:true}).then(function(response) {
            //console.log(response.data);
            return response.data;
            
            
            
        });
    }
    oService.updateBuyingTFMS_Supplier_Details=function(SN,SC){
        //console.log(FD + SN + JB + "Comments" + CD);
        return $http.get("process/updateBuyingTFMS_Supplier_Details.php?SN="+SN+"&SC="+SC,{cache:true}).then(function(response) {
            //console.log(response.data);
            return response.data;
            
            
            
        });
    }

    oService.getBuyingControllerRatings=function(geography,QVIS,rating,overallrating,category,buyingController,tesco_brand_ind,parent_supplier_name){
        // alert(geography + QVIS + rating + overallrating + category + buyingController + tesco_brand_ind + parent_supplier_name);
        return $http.get("process/getBuyingControllerRatings.php?userId="+$sessionStorage.userID+"&geography="+geography+"&QVIS="+QVIS+"&rating="+rating+"&overallrating="+overallrating+"&category="+category+"&buyingController="+buyingController+"&tesco_brand_ind="+tesco_brand_ind+"&parent_supplier_name="+parent_supplier_name,{cache:true}).then(function(response) {
            return response.data;
        });
    }

    oService.getCategoryDirectorRatings=function(commercialCategory,QVIS,rating,overallrating,category,tesco_brand_ind,parent_supplier_name){
// console.log(geography + QVIS + rating + overallrating + category + tesco_brand_ind + parent_supplier_name);
        return $http.get("process/getCategoryDirectorRatings.php?userId="+$sessionStorage.userID+"&CD="+commercialCategory+"&QVIS="+QVIS+"&rating="+rating+"&overallrating="+overallrating+"&category="+category+"&tesco_brand_ind="+tesco_brand_ind+"&parent_supplier_name="+parent_supplier_name,{cache:true}).then(function(response) {
            return response.data;
            // alert(response.data);
        });
    }
    oService.getCategoryDirectorRatingsTFTP=function(commercial_director,QVIS,rating,overallrating,category,tesco_brand_ind,parent_supplier_name){
        // alert(category + commercial_director + parent_supplier_name +tesco_brand_ind);
        return $http.get("process/getCategoryDirectorRatingsTFTP.php?userId="+$sessionStorage.userID+"&commercial_director="+commercial_director+"&QVIS="+QVIS+"&rating="+rating+"&overallrating="+overallrating+"&commercial_director="+commercial_director+"&category="+category+"&tesco_brand_ind="+tesco_brand_ind+"&parent_supplier_name="+parent_supplier_name,{cache:true}).then(function(response) {
            return response.data;
            // alert(response.data);
        });
    }
    

    
    var PLDCache = $cacheFactory('PLDCache', { capacity: 500 });
    var SSLDCache = $cacheFactory('SSLDCache', { capacity: 500 });
    var TFMSCache = $cacheFactory('TFMSCache', { TFMSCache: 500 });
    var InnovationCache = $cacheFactory('InnovationCache', { InnovationCache: 500 });


    oService.getPLDCacheData=function(SN,CD,JB){
        var key="process/getJuniorBuyerRatingsDetails.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID;
        var cacheData = PLDCache.get(key);

        if (typeof(cacheData)==="object")
            return cacheData;
        else
            return "NotDataInCache";    
    }

    oService.getSSLDCacheData=function(SN,CD,JB){
        var key="process/getSupplierServiceLevelData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID;
        return SSLDCache.get(key);
    }

    oService.getInnovationCacheData=function(SN){
        var key="process/getInnovationData.php?Supplier_Number="+SN+"&userId="+$sessionStorage.userID;
        return InnovationCache.get(key);
    }

    oService.getTFMSCacheData=function(SN){
        var key="process/getTFMSAuditData.php?Supplier_Number="+SN+"&userId="+$sessionStorage.userID;
        return TFMSCache.get(key);
    }

    oService.getJuniorBuyerDetails=function(SN,CD,JB){
        return $http.get("process/getJuniorBuyerDetails.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getJuniorBuyerDetails.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID;
            //PLDCache.put(key,response.data);
            //console.log(response.data);
            return response.data;   
        }); 
    }

    oService.getSupplierServiceLevelDataLastYear=function(SN,CD,JB){    
        //alert("hello jee");
        return $http.get("process/getSupplierServiceLevelDataLastYear.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            var key="process/getSupplierServiceLevelDataLastYear.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID;
            SSLDCache.put(key,response.data);
            //console.log(response.data);
            return response.data;   
        }); 
    }
    oService.getSupplierServiceLevelDataLastYearBuyingController=function(SN,CD,BC){    
        //alert("hello jee");
        return $http.get("process/getSupplierServiceLevelDataLastYearBuyingController.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            var key="process/getSupplierServiceLevelDataLastYearBuyingController.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID;
            SSLDCache.put(key,response.data);
            //console.log(response.data);
            return response.data;   
        }); 
    }
    oService.getSupplierServiceLevelDataCategoryLastYear=function(SN,CD){    
        //alert("hello jee");
        return $http.get("process/getSupplierServiceLevelDataCategoryLastYear.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            var key="process/getSupplierServiceLevelDataCategoryLastYear.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID;
            SSLDCache.put(key,response.data);
            //console.log(response.data);
            return response.data;   
        }); 
    }
    oService.getSupplierServiceLevelDataCategoryTFTPLastYear=function(SN,CD){    
        console.log(SN + CD);
        return $http.get("process/getSupplierServiceLevelDataCategoryTFTPLastYear.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            var key="process/getSupplierServiceLevelDataCategoryTFTPLastYear.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID;
            SSLDCache.put(key,response.data);
            
            return response.data;   
        }); 
    }

    oService.getBuyingControllerDetails=function(SN,CD,BC){
        return $http.get("process/getBuyingControllerDetails.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getBuyingControllerDetails.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID;
            //PLDCache.put(key,response.data);
            return response.data;   
        }); 
    }

    oService.getCategoryDetails=function(SN,CD,BC){
        // alert(SN + CD + BC);
        return $http.get("process/getCategoryDetails.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getBuyingControllerDetails.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID;
            //PLDCache.put(key,response.data);
            return response.data;   
        }); 
    }
    
    oService.getCategoryDetailsTFTP=function(SN,CD,Comm_D){
        // alert(CD);
        return $http.get("process/getCategoryDetailsTFTP.php?Supplier_Number="+SN+"&Commercial_Director="+Comm_D+"&Category_Director="+CD+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getBuyingControllerDetails.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID;
            //PLDCache.put(key,response.data);
            console.log(response.data);
            return response.data;  


        }); 

    }
    

    oService.getSupplierServiceLevelData=function(SN,CD,JB){    
        //alert("hello jee");
        return $http.get("process/getSupplierServiceLevelData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            var key="process/getSupplierServiceLevelData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID;
            SSLDCache.put(key,response.data);
            //console.log(response.data);
            return response.data;   
        }); 
    }

    oService.getSupplierServiceLevelDataBuyingController=function(SN,CD,BC){    
        return $http.get("process/getSupplierServiceLevelDataBuyingController.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getSupplierServiceLevelData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID;
            //SSLDCache.put(key,response.data);
            return response.data;   
        }); 
    }

    oService.getSupplierServiceLevelDataCategory=function(SN,CD){   

        return $http.get("process/getSupplierServiceLevelDataCategory.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getSupplierServiceLevelData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID;
            //SSLDCache.put(key,response.data);
            
            return response.data;   
        }); 
    }

    oService.getSupplierServiceLevelDataCategoryTFTP=function(SN,CD){   

        return $http.get("process/getSupplierServiceLevelDataCategoryTFTP.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getSupplierServiceLevelData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID;
            //SSLDCache.put(key,response.data);
            
            return response.data;   
        }); 
    }

    oService.getInnovationData=function(SN){    
        return $http.get("process/getInnovationData.php?Supplier_Number="+SN+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            var key="process/getInnovationData.php?Supplier_Number="+SN+"&userId="+$sessionStorage.userID;
            InnovationCache.put(key,response.data);
            return response.data;   
        }); 
    }
    


    /*
    oService.getTFMSAuditData=function(SN){ 
        return $http.get("process/getTFMSAuditData.php?Supplier_Number="+SN+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            var key="process/getTFMSAuditData.php?Supplier_Number="+SN+"&userId="+$sessionStorage.userID;
            TFMSCache.put(key,response.data);
            return response.data;   
        }); 
    }
    */
    
    oService.getJuniorBuyerTFMSAuditData=function(SN,CD,JB){
        return $http.get("process/getJuniorBuyerTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getJuniorBuyerTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID;
            //TFMSCache.put(key,response.data);
            //console.log(response.data);
            return response.data;   
        }); 
    }

    oService.getJuniorBuyerPeriodSalesTYLY=function(SN,CD,JB){
        return $http.get("process/getJuniorBuyerPeriodSalesTYLY.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //console.log(response.data);
            return response.data;   
        }); 
    }

    oService.getBuyingControllerPeriodSalesTYLY=function(SN,CD,BC){
        return $http.get("process/getBuyingControllerPeriodSalesTYLY.php?Supplier_Number="+SN+"&Category_Director="+CD+"&BuyingController="+BC+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //console.log(response.data);
            return response.data;   
        }); 
    }

    oService.getCategoryPeriodSalesTYLY=function(SN,CD){
        return $http.get("process/getCategoryPeriodSalesTYLY.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            console.log(response.data);
            return response.data;   
        }); 
    }

    oService.getCategoryPeriodSalesTYLY_TFTP=function(SN,CD,Comm_D){
        return $http.get("process/getCategoryPeriodSalesTYLY_TFTP.php?Supplier_Number="+SN+"&Category_Director="+CD+"&commercialcategory="+Comm_D+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            console.log(response.data);
            return response.data;   
        }); 
    }



    oService.getAuditSitesData=function(SC){
        console.log(SC);
        return $http.get("process/getAuditSitesData.php?SC="+SC,{cache:true}).then(function(response) {
            //var key="process/getJuniorBuyerTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID;
            //TFMSCache.put(key,response.data);
            //console.log(response.data);
            return response.data;   
        }); 
    }
    oService.getJuniorBuyerEpwCompSupplierNames=function(SN,CD,JB){
    
        return $http.get("process/getJuniorBuyerEpwCompSupplierNames.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getJuniorBuyerTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID;
            //TFMSCache.put(key,response.data);
            //console.log(response.data);
            return response.data;   
        }); 
    }


    oService.getBuyingControllerTFMSAuditData=function(SN,CD,BC){
        return $http.get("process/getBuyingControllerTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getBuyingControllerTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID;
            //TFMSCache.put(key,response.data);
            //console.log(response.data);
            return response.data;   
        }); 
    }
    oService.getBuyerControllerEpwCompSupplierNames=function(SN,CD,BC){
        return $http.get("process/getBuyingControllerEpwCompSupplierNames.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getBuyingControllerTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID;
            //TFMSCache.put(key,response.data);
            //console.log(response.data);
            return response.data;   
        }); 
    }
    oService.getCategoryEpwCompSupplierNames=function(SN,CD,BC){
        
        return $http.get("process/getCategoryEpwCompSupplierNames.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getBuyingControllerTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID;
            //TFMSCache.put(key,response.data);
            //console.log(response.data);
            return response.data;   
        }); 
    }
    oService.getCategoryEpwCompSupplierNamesTFTP=function(SN,CD,BC){
        
        return $http.get("process/getCategoryEpwCompSupplierNamesTFTP.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getBuyingControllerTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID;
            //TFMSCache.put(key,response.data);
            //console.log(response.data);
            return response.data;   
        }); 
    }

    oService.getCategoryTFMSAuditData=function(SN,CD,BC){

        return $http.get("process/getCategoryTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getCategoryTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID;
            //TFMSCache.put(key,response.data);
            //console.log(response.data);
        
            return response.data;   
        }); 
    }
    oService.getCategoryTFMSAuditDataTFTP=function(SN,CD,BC){

        return $http.get("process/getCategoryTFMSAuditDataTFTP.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getCategoryTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID;
            //TFMSCache.put(key,response.data);
            //console.log(response.data);
        
            return response.data;   
        }); 
    }
    oService.getSuppliersUnderParentSupplier=function(SN,CD,BC){
        // alert("Hi");
        return $http.get("process/getSuppliersUnderParentSupplier.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getCategoryTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID;
            //TFMSCache.put(key,response.data);
            //console.log(response.data);
        
            return response.data;   
        }); 
    }

     oService.getSuppliersUnderParentSupplierTFTP=function(SN,CD,BC){
        // alert("Hi");
        return $http.get("process/getSuppliersUnderParentSupplierTFTP.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getCategoryTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID;
            //TFMSCache.put(key,response.data);
            //console.log(response.data);
        
            return response.data;   
        }); 
    }
    oService.getCategoryLastUpdated=function(){
        // alert("Hi");
        return $http.get("process/getCategoryLastUpdated.php?&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getCategoryTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID;
            //TFMSCache.put(key,response.data);
            //console.log(response.data);
        
            return response.data;   
        }); 
    }
    oService.getJuniorBuyerLastUpdated=function(){
        // alert("Hi");
        return $http.get("process/getCategoryLastUpdated.php?&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getCategoryTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID;
            //TFMSCache.put(key,response.data);
            //console.log(response.data);
        
            return response.data;   
        }); 
    }
    oService.getBuyingControllerLastUpdated=function(){
        // alert("Hi");
        return $http.get("process/getCategoryLastUpdated.php?&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //var key="process/getCategoryTFMSAuditData.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID;
            //TFMSCache.put(key,response.data);
            //console.log(response.data);
        
            return response.data;   
        }); 
    }

    oService.getJuniorBuyerLowerQuartileTPNBs=function(SN,CD,JB){
        return $http.get("process/getJuniorBuyerLowerQuartileTPNBs.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Junior_Buyer="+JB+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            return response.data;   
        }); 
    }

    oService.getBuyingControllerLowerQuartileTPNBs=function(SN,CD,BC){
        return $http.get("process/getBuyingControllerLowerQuartileTPNBs.php?Supplier_Number="+SN+"&Category_Director="+CD+"&Buying_Controller="+BC+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //console.log(response.data);
            return response.data;   
        }); 
    }

    oService.getCategoryLowerQuartileTPNBs=function(SN,CD){
        return $http.get("process/getCategoryLowerQuartileTPNBs.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //console.log(response.data);
            return response.data;   
        }); 
    }

    oService.getCategoryLowerQuartileTPNBsTFTP=function(SN,CD){
        return $http.get("process/getCategoryLowerQuartileTPNBsTFTP.php?Supplier_Number="+SN+"&Category_Director="+CD+"&userId="+$sessionStorage.userID,{cache:true}).then(function(response) {
            //console.log(response.data);
            return response.data;   
        }); 
    }

    
    




    oService.getCategoryLevelHistoricalData=function(ID){
        return $http.post("process/getCategoryLevelHistoricalData.php",{CL_ID:ID}).then(function(response) {
            return response;    
        }); 
    }
    
    oService.deleteCategoryLevelData=function(ID){
        return $http.post("process/processDeleteCategoryLevelData.php",{CL_ID:ID,userId:$sessionStorage.userID}).then(function(response) {
            return response.data;   
        }); 
    }
    
    oService.getMasterLevelData=function(geography,QVIS,rating,overallrating,category,juniorBuyer){
        return $http.post("process/getMasterLevelData.php",{userId:$sessionStorage.userID,geography:geography,QVIS:QVIS,rating:rating,overallrating:overallrating,category:category,juniorBuyer:juniorBuyer}).then(function(response) {
            return response.data;
            
        });
    }
    oService.getMasterLevelDataDetails=function(ID){
        return $http.post("process/getMasterLevelDataDetails.php",{ML_ID:ID,userId:$sessionStorage.userID}).then(function(response) {
            return response;    
        }); 
    }
    
    oService.getMasterLevelHistoricalData=function(ID){
        return $http.post("process/getMasterLevelHistoricalData.php",{ML_ID:ID}).then(function(response) {
            return response;    
        }); 
    }
    
    oService.getAllCategories=function(geography,commercialCategory){
        return $http.post("process/getAllCategories.php",{userId:$sessionStorage.userID,geography:geography,commercialCategory:commercialCategory}).then(function(response) {
            console.log(response.data);
            return response.data;
        });
    }

    oService.getAllCategoriesTFTP=function(geography,commercialCategory){
        return $http.post("process/getAllCategoriesTFTP.php",{userId:$sessionStorage.userID,geography:geography,commercialCategory:commercialCategory}).then(function(response) {
            console.log(response.data);
            return response.data;
        });
    }

    oService.getAllJuniorBuyers=function(category){
        return $http.post("process/getAllJuniorBuyers.php",{category:category}).then(function(response) {
            return response.data;
        });
    }


    oService.getAllBuyingController=function(category){
        // alert("hello");
        return $http.post("process/getAllBuyingController.php",{category:category}).then(function(response) {
            return response.data;
        });
    }
    oService.getAllParentSupplierNames=function(category,commercial){
        // alert(commercial + category);
        return $http.post("process/getAllParentSupplierNames.php",{category:category,commercial:commercial}).then(function(response) {
            console.log(response.data);
            return response.data;

        });
    }
    oService.getAllParentSupplierNamesTFTP=function(category,commercial){
        // alert(commercial + category);
        return $http.post("process/getAllParentSupplierNamesTFTP.php",{category:category,commercial:commercial}).then(function(response) {
            console.log(response.data);
            return response.data;

        });
    }
    
    oService.getAllCategoriesForNewUser=function(MasterCategory){
        return $http.post("process/getAllCategoriesForNewUser.php",{userId:$sessionStorage.userID,masterCategory:MasterCategory}).then(function(response) {
            return response.data;
        });
    }
    
    oService.getUserAssignedCategories=function(MasterCategory){
        return $http.post("process/getUserAssignedCategories.php",{userId:$sessionStorage.userID,masterCategory:MasterCategory}).then(function(response) {
            return response.data;
        });
    }
    
    oService.submitNewUserFormData=function(userInfo){
        return $http.post("process/processAddNewUser.php",userInfo).then(function(response){
            return response.data;
        });
    }
    
    oService.submitEditUserFormData=function(updatedInfo){
        return $http.post("process/processEditUser.php",updatedInfo).then(function(response){
            return response.data;
        });
    }
    
    oService.submitNewLineFormData=function(newLine){
        return $http.post("process/processNewLine.php",newLine).then(function(response){
            return response.data;
        });
    }
    
    oService.getUserList=function(){
        return $http.post("process/getUsersList.php",{userId:$sessionStorage.userID}).then(function(response){
            return response.data;
        });
    }
    
    oService.getUserDetails=function(ID){
        return $http.post("process/getUserDetails.php",{userId:ID}).then(function(response){
            return response.data;
        });
    }
    
    oService.deleteUserId=function(UID){
        return $http.post("process/deleteUserId.php",{userId:$sessionStorage.userID,RequestedID:UID}).then(function(response){
            return response.data;
        });
    }
    
    oService.submiResetPasswordFormData=function(resetFormData){
        return $http.post("process/processResetPassword.php",resetFormData).then(function(response){
            return response.data;
        });
    }

    oService.getRatingClassName=function(rating){
        rating=parseInt(rating);
        switch (rating){
            case 0:
                return "not-rated";
            case 1:
                return "red-rating";
            case 2:
                return "amber-rating";
            case 3:
                return "green-rating";
            case 4:
                return "blue-rating";
        }
    }
    
    
    oService.getRedGreenClassName=function(value){
        if (value>0)
            return "green";
        else 
            if (value<0)
                return "red";
            else
                return "black";
    }

    oService.getSLClassName=function(value){

        value=parseFloat(value);

        if (value>=0.985)
            return "SL_Blue";

        if (value>=0.965 && value<0.985)
            return "SL_Green";

        if (value>=0.90 && value<0.965)
            return "SL_Amber";

        if (value<0.90)
            return "SL_Red";

        return "SL_Gray";

    }
    
    oService.getRedGreenClassNameReverse=function(value){
        if (value>0)
            return "red";
        else 
            if (value<0)
                return "green";
            else
                return "black";
    }

    oService.getTFMSScoreClassName=function(score){
        score=score.toLowerCase();
        switch (score){
            case "red":
                return "red-rating";
            case "amber":
                return "amber-rating";
            case "double amber":
                return "amber-rating";
            case "green":
                return "green-rating";
            case "blue":
                return "blue-rating";
            default:
                return "not-rated";
        }
    }
    
    oService.clearSessionStorage=function(){
        $sessionStorage.loggedIn=undefined;
        $sessionStorage.userID=undefined;
        $sessionStorage.userName=undefined;
        $sessionStorage.userAccessLevel=undefined;
        $sessionStorage.userMasterAccess=undefined;
        $sessionStorage.userGeography=undefined;
        $sessionStorage.userMasterCategory=undefined;
        $sessionStorage.userName=undefined;
        $sessionStorage.suppliers_feedback=undefined;
        $sessionStorage.suppliers_1=undefined;
        $sessionStorage.suppliers_2=undefined;
        $sessionStorage.tabName=undefined;
        $sessionStorage.tesco_brand_ind=undefined;

        $sessionStorage.commercialCategory="All";
        $sessionStorage.commercialCategoryTFTP-"All";
        $sessionStorage.category="All";
        $sessionStorage.categoryTFTP="All";
        $sessionStorage.juniorBuyer="All";
        $sessionStorage.buyingController="All";
        $sessionStorage.QVIS="All";
        $sessionStorage.rating="All";       
        $sessionStorage.overallrating="All";

    }

    oService.getLastUpdatedWeek=function(){
        return $http.post("process/getLastUpdatedWeek.php",{}).then(function(response){
            //console.log(response.data);
            return response.data;
        });

    }
    oService.getFilteredData=function(filteredData){
        // alert(fileterdData.length);

    }
    return oService;
}]);

app.controller("loginController",["$scope","$rootScope","$location","$sessionStorage","appService","$state",function($scope,$rootScope,$location,$sessionStorage,appService,$state) {
    
    if ($sessionStorage.loggedIn!=undefined)
        $location.path("dashboard/juniorBuyer");
    
    $scope.accountValidation=false;
    $scope.validUser=false;
    $rootScope.hideSearchBox=true;
    $rootScope.pageTitle="Sign in";
    
    

    $scope.validateloginCredential=function(){
        
        if ($scope.loginForm.user_id.$valid && $scope.loginForm.user_passwd.$valid){ 
            
            appService.validateloginCredential($scope.user_id,$scope.user_passwd).then(function(response){
                if (response.data.status=="loggedIn"){
                    $sessionStorage.loggedIn="YES";
                    $sessionStorage.userID=response.data.user_id;
                    $sessionStorage.userName=response.data.user_name;
                    $sessionStorage.userGeography=response.data.Geography;
                    $sessionStorage.userAccessLevel=response.data.Access_Level;
                    $sessionStorage.userMasterAccess=response.data.Master_Access;
                    $sessionStorage.userMasterCategory=response.data.Master_Category;
                    $scope.accountValidation=false;
                    $scope.validUser=false;
                    window.location.reload();
                    // alert($sessionStorage.userAccessLevel);
                    //$location.path("dashboard");
                    
                }
                else{
                    $scope.validUser=true;
                    $scope.accountValidation=true;
                }
                
            });
        }
    }
}]);

angular.module( 'myApp.radar', [] )
.controller("RadarCtrl",["$scope","$rootScope","$location","$sessionStorage","appService","$state", function ( $scope ) {
    $scope.fresh = {
      labels : [ 'Q','V','I','S' ],
      datasets : [
        {
          fillColor : 'rgba(220,220,220,0.5)',
          strokeColor : 'rgba(220,220,220,1)',
          pointColor : 'rgba(220,220,220,1)',
          pointStrokeColor : '#fff',
          data : [ 3,3,3,2]
        },
        {
          fillColor : 'rgba(151,187,205,0.5)',
          strokeColor : 'rgba(151,187,205,1)',
          pointColor : 'rgba(151,187,205,1)',
          pointStrokeColor : '#fff',
          data : [ 4,3,3,2]
        }
      ]
    };
    $scope.packaged = {
      labels : [ 'Q','V','I','S' ],
      datasets : [
        {
          fillColor : 'rgba(220,220,220,0.5)',
          strokeColor : 'rgba(220,220,220,1)',
          pointColor : 'rgba(220,220,220,1)',
          pointStrokeColor : '#fff',
          label:'Before COVID',
          data : [ 4, 3, 3, 2]
          
        },
        {
          fillColor : 'rgba(151,187,205,0.5)',
          strokeColor : 'rgba(151,187,205,1)',
          pointColor : 'rgba(151,187,205,1)',
          pointStrokeColor : '#fff',
          label:'After COVID',
          data : [ 4, 3, 3, 2]
          
        }
      ]
    };
    $scope.options =  {
      segmentShowStroke : true,
      segmentStrokeColor : '#fff',
      segmentStrokeWidth : 24,
      percentageInnerCutout : 50,
      animation : true,
      animationSteps : 25,
      animationEasing : 'easeOutQuart',
      animateRotate : true,
      animateScale : false,
      onAnimationComplete : null,
      scaleOverride: true,
      scaleSteps: 5,
      scaleStepWidth: 1,
      scaleStartValue: 0,
    };
  }]);




app.controller("dashboardController",["$scope","$rootScope","$http","$timeout","$location","$sessionStorage","appService",function($scope,$rootScope,$http,$timeout,$location,$sessionStorage,appService){
    
    if ($sessionStorage.loggedIn==undefined)
        $location.path("login");

    $scope.userName=$sessionStorage.userName;
    $scope.userID=$sessionStorage.userID;
    $rootScope.pageTitle="Dashboard";
    $rootScope.searchValue="";
    $rootScope.hideSearchBox=false;
    $scope.disableGeography=true;
    $scope.disablejuniorBuyer=true;
    $scope.disableViewLevel=true;
    $scope.AccessLevel=$sessionStorage.userAccessLevel;
    $scope.Geography=$sessionStorage.userGeography;
    
    if ($sessionStorage.userAccessLevel=="user" && $sessionStorage.userGeography=="UK")
        $scope.disableViewLevel=true;
    else
        $scope.disableViewLevel=false;
    
    if ($sessionStorage.userAccessLevel=="user" || $sessionStorage.userAccessLevel=="super_user")
        $scope.disableGeography=true;
    else
        $scope.disableGeography=false;
    
    
    if ($sessionStorage.userAccessLevel=="user" && $sessionStorage.userGeography=="UK")
        $scope.disablejuniorBuyer=true;
    else
        $scope.disablejuniorBuyer=false;

    
    if ($sessionStorage.commercialCategory==undefined){
        $scope.commercialCategory="Fresh";
        $sessionStorage.commercialCategory=$scope.commercialCategory;
    }else
        $scope.commercialCategory=$sessionStorage.commercialCategory;


    if ($sessionStorage.commercialCategoryTFTP==undefined){
        $scope.commercialCategoryTFTP="All";
        $sessionStorage.commercialCategoryTFTP=$scope.commercialCategoryTFTP;
    }else
        $scope.commercialCategoryTFTP=$sessionStorage.commercialCategoryTFTP;


    if ($sessionStorage.parent_supplier_name==undefined){
        $scope.parent_supplier_name="All";
        $sessionStorage.parent_supplier_name=$scope.parent_supplier_name;
    }else
        $scope.parent_supplier_name=$sessionStorage.parent_supplier_name;

    if ($sessionStorage.parent_supplier_name_TFTP==undefined){
        $scope.parent_supplier_name_TFTP="All";
        $sessionStorage.parent_supplier_name_TFTP=$scope.parent_supplier_name_TFTP;
    }else
        $scope.parent_supplier_name_TFTP=$sessionStorage.parent_supplier_name_TFTP;

    if ($sessionStorage.juniorBuyer==undefined){
        $scope.juniorBuyer="All";
        $sessionStorage.juniorBuyer=$scope.juniorBuyer;
    }else
        $scope.juniorBuyer=$sessionStorage.juniorBuyer;


    if ($sessionStorage.buyingController==undefined){
        $scope.buyingController="All";
        $sessionStorage.buyingController=$scope.buyingController;
    }else
        $scope.buyingController=$sessionStorage.buyingController;

    

        
    if ($sessionStorage.QVIS==undefined){
        $scope.QVIS="All";
        $sessionStorage.QVIS=$scope.QVIS;
    }else
        $scope.QVIS=$sessionStorage.QVIS;

    
    if ($sessionStorage.rating==undefined){
        $scope.rating="All";
        $scope.ratingStyle={background:'#fff;',color:'#666'};
        $sessionStorage.rating=$scope.rating;
        $sessionStorage.ratingStyle=$scope.ratingStyle;     
    }else{
        $scope.rating=$sessionStorage.rating;
        $scope.ratingStyle=$sessionStorage.ratingStyle;
    }

    
    if ($sessionStorage.overallrating==undefined){
        $scope.overallrating="All";
        $scope.overallRatingStyle={background:'#fff;',color:'#666'};
        $sessionStorage.overallrating=$scope.overallrating;
        $sessionStorage.overallRatingStyle=$scope.overallRatingStyle;
    }else{
        $scope.overallrating=$sessionStorage.overallrating;
        $scope.overallRatingStyle=$sessionStorage.overallRatingStyle;
    }


    if ($sessionStorage.category==undefined){
            appService.getAllCategories($sessionStorage.userGeography,$scope.commercialCategory).then(function(data){
                $scope.categoryData=data;
                $scope.category=$scope.categoryData[0].Category_Area_Value;
            });
        
        $sessionStorage.category=$scope.category;
    }else
        $scope.category=$sessionStorage.category;

    if ($sessionStorage.categoryTFTP==undefined){
            appService.getAllCategoriesTFTP($sessionStorage.userGeography,$scope.commercialCategoryTFTP).then(function(data){
                $scope.categoryDataTFTP=data;
                $scope.categoryTFTP=$scope.categoryDataTFTP[0].Category_Area_Value;
                // alert($scope.categoryDataTFTP);
            });
        
        $sessionStorage.categoryTFTP=$scope.categoryTFTP;
    }else
        $scope.categoryTFTP=$sessionStorage.categoryTFTP;




        

    $scope.getAllCategories=function(){
        if ($sessionStorage.userID!=undefined){
            appService.getAllCategories($sessionStorage.userGeography,$scope.commercialCategory).then(function(data){
                $scope.categoryData=data;
                $scope.category=$scope.categoryData[0].Category_Area_Value;
                $scope.getAllJuniorBuyers($scope.category);
                $scope.getAllBuyingController($scope.category);
                $scope.getAllParentSupplierNames($scope.category,$scope.commercialCategory);
                

            });
        }
    }

    $scope.getAllCategoriesTFTP=function(){
        if ($sessionStorage.userID!=undefined){
            appService.getAllCategoriesTFTP($sessionStorage.userGeography,$scope.commercialCategoryTFTP).then(function(data){
                $scope.categoryDataTFTP=data;
                $scope.categoryTFTP=$scope.categoryDataTFTP[0].Category_Area_Value;
                
                $scope.getAllParentSupplierNamesTFTP($scope.categoryTFTP,$scope.commercialCategoryTFTP);

            });
        }
    }

    $scope.getAllJuniorBuyers=function(){
        appService.getAllJuniorBuyers($scope.category).then(function(data){
            $scope.juniorData=data;
        });
    }

    $scope.getAllParentSupplierNames=function(){
        appService.getAllParentSupplierNames($scope.category,$scope.commercialCategory).then(function(data){
            $scope.parent_supplier_name_data=data;
            console.log(data);
        });
    }
    $scope.getAllParentSupplierNamesTFTP=function(){
        appService.getAllParentSupplierNamesTFTP($scope.categoryTFTP,$scope.commercialCategoryTFTP).then(function(data){
            $scope.parent_supplier_name_data_TFTP=data;
            console.log(data);
        });
    }

    $scope.getAllBuyingController=function(){
         
        appService.getAllBuyingController($scope.category).then(function(data){
            
            $scope.buyingData=data;
            console.log($scope.buyingData);
        });
    }
    
    $scope.getJuniorBuyerRatings=function(init){
        if($scope.tesco_brand_ind==undefined){
            $scope.tesco_brand_ind="All";
        }
        // alert($scope.parent_supplier_name + "Hi");
        if ($scope.category==undefined || $scope.category=="" || $scope.category=="All"){
            $scope.dashboardLoading=true;
            //alert($scope.category);
            $scope.category="All";
        }

        $rootScope.searchValue="";
        $scope.dashboardLoading=true;
    
        if ($sessionStorage.suppliers_1==undefined || $sessionStorage.suppliers_1=="" || init=='btnClicked'){

            appService.getJuniorBuyerRatings($scope.commercialCategory,$scope.QVIS,$scope.rating,$scope.overallrating,$scope.category,$scope.juniorBuyer,$scope.tesco_brand_ind,$scope.parent_supplier_name).then(function(data){
                $scope.dashboardLoading=false;
                $scope.suppliers_1=data;
                $sessionStorage.suppliers_1=$scope.suppliers_1;
                
            });
        }else{
            $scope.suppliers_1=$sessionStorage.suppliers_1;
            $scope.dashboardLoading=false;
        }

        if (init=='start'){
            $scope.getAllCategories();
        }



        //alert("reached");
        //$rootScope.getFinalRating();
        $timeout(function() {
            $rootScope.getFinalRating("btnClicked");
            
            //$scope.displayErrorMsg = false;
            //$scope.$digest();
        }, 3000);   

        $scope.supplier_data_sort_junior = $scope.suppliers_1;
        $scope.thelist=['Parent_Supplier_Name'];
    $scope.orderProp = 'Parent_Supplier_Name';
    $scope.direction = false;

    $scope.sort = function(column) {
        

      if ($scope.orderProp === column) {
        $scope.direction = !$scope.direction;
      } 
    
      else {
        $scope.orderProp = column;
        $scope.direction = false;
      }
    
}

        
    }





    $scope.filteredfeedbackdata=[];
    $scope.getFeedbackData=function(init){

        /*if($scope.commercialCategory==undefined || $scope.commercialCategory=='All')
        {
            $scope.commercialCategory='Fresh';
        }*/
        
        // alert($scope.commercialCategory);
        $scope.dashboardLoading=true;
            appService.getFeedbackData($scope.commercialCategory,$scope.category,$scope.juniorBuyer).then(function(data){
                //console.log(data);
                $scope.dashboardLoading=false;
                $scope.suppliers_feedback=data;
                //console.log(suppliers_feedback);
                $scope.checkfilteredfeedbackdata=$scope.filteredfeedbackdata;

                console.log($scope.checkfilteredfeedbackdata);
            });
        }

    $scope.enabledEdit=[];
    
      $scope.editSupplier=function(SN,index){
            
        console.log("edit index"+index);
        $scope.enabledEdit[index]=true;

      }
      
      $scope.updateSupplier=function(supplier_details,index){
      
        console.log(supplier_details.JA_F);
        console.log(supplier_details.SN_F);
        console.log(supplier_details.FD_F);
        console.log(supplier_details.Comments);
        $scope.feedbackData=supplier_details.FD_F.replace("&","_");
        $scope.FD_Supplier=supplier_details.SN_F.replace("&","_");
        $scope.FD_Junior_Area=supplier_details.JA_F.replace("&","_");
        $scope.commentsData=supplier_details.Comments.replace("&","_");
        console.log($scope.feedbackData);
        console.log($scope.FD_Supplier);
        console.log($scope.FD_Junior_Area);
        console.log("Commenst="+$scope.commentsData);
        appService.update_feedbackdata($scope.feedbackData,$scope.commentsData,$scope.FD_Supplier,$scope.FD_Junior_Area).then(function(data){
                $scope.updated_feedbackData=data;
                
                console.log($scope.updated_feedbackData);
                // alert("Feedback/Commenst Updated for Supplier "+ $scope.FD_Supplier);

            });
        

      }




    $scope.getBuyingControllerRatings=function(init){
        if($scope.tesco_brand_ind==undefined){
            $scope.tesco_brand_ind="All";
        }
        if ($scope.category==undefined || $scope.category=="")
            $scope.category="All";

        $rootScope.searchValue="";
        $scope.dashboardLoading=true;

        if ($sessionStorage.suppliers_2==undefined || init=='btnClicked'){
            appService.getBuyingControllerRatings($scope.commercialCategory,$scope.QVIS,$scope.rating,$scope.overallrating,$scope.category,$scope.buyingController,$scope.tesco_brand_ind,$scope.parent_supplier_name).then(function(data){
                $scope.dashboardLoading=false;
                $scope.suppliers_2=data;
                $sessionStorage.suppliers_2=$scope.suppliers_2;
                
            });
        }else{
            $scope.suppliers_2=$sessionStorage.suppliers_2;
            $scope.dashboardLoading=false;
        }

        if (init=='start'){
            $scope.getAllBuyingController($scope.category);
        }
        $timeout(function() {
            $rootScope.getFinalRating("btnClicked");
            //$scope.displayErrorMsg = false;
            //$scope.$digest();
            

        }, 2000);

        

    $scope.sort = function(column) {
        

      if ($scope.orderProp === column) {
        $scope.direction = !$scope.direction;
      } 
    
      else {
        $scope.orderProp = column;
        $scope.direction = false;
      }
    
}
    }

    $scope.getCategoryDirectorRatings=function(init){
        if($scope.tesco_brand_ind==undefined){
            $scope.tesco_brand_ind="All";
        }
        $rootScope.searchValue="";
        $scope.dashboardLoading=true;


        // alert($scope.parent_supplier_name);

        if ($sessionStorage.suppliers_3==undefined || init=='btnClicked'){
            appService.getCategoryDirectorRatings($scope.commercialCategory,$scope.QVIS,$scope.rating,$scope.overallrating,$scope.category,$scope.tesco_brand_ind,$scope.parent_supplier_name).then(function(data){
                $scope.dashboardLoading=false;
                // alert($scope.commercialCategory);
                $scope.suppliers_3=data;
                $sessionStorage.suppliers_3=$scope.suppliers_3;
                
            });
        }else{
            $scope.suppliers_3=$sessionStorage.suppliers_3;
            $scope.dashboardLoading=false;
        }

        $timeout(function() {
            $rootScope.getFinalRating("btnClicked");
            //$scope.displayErrorMsg = false;
            //$scope.$digest();
            

        }, 2000);
        $scope.supplier_data = $scope.suppliers_3;
        $scope.thelist=['Parent_Supplier_Name'];
    $scope.orderProp = 'Parent_Supplier_Name';
    $scope.direction = false;

    $scope.sort = function(column) {
        

      if ($scope.orderProp === column) {
        $scope.direction = !$scope.direction;
      } 
    
      else {
        $scope.orderProp = column;
        $scope.direction = false;
      }
    
}



    }

$scope.getCategoryDirectorRatingsTFTP=function(init){
        if($scope.tesco_brand_ind==undefined){
            $scope.tesco_brand_ind="All";
        }
        $rootScope.searchValue="";
        $scope.dashboardLoading=true;
        
        if(init=='start'){
            $scope.getAllCategoriesTFTP();
            $scope.getAllParentSupplierNames($scope.categoryTFTP,$scope.commercialCategoryTFTP);
        }
        if ($sessionStorage.suppliers_4==undefined || init=='btnClicked'){
            // alert('Hi' + $sessionStorage.suppliers_4);
            appService.getCategoryDirectorRatingsTFTP($scope.commercialCategoryTFTP,$scope.QVIS,$scope.rating,$scope.overallrating,$scope.categoryTFTP,$scope.tesco_brand_ind,$scope.parent_supplier_name_TFTP).then(function(data){
                $scope.dashboardLoading=false;
                //console.log(data);
                $scope.suppliers_4=data;

                $sessionStorage.suppliers_4=$scope.suppliers_4;
                
            });
        }else{
            $scope.suppliers_4=$sessionStorage.suppliers_4;
            $scope.dashboardLoading=false;
        }

        $timeout(function() {
            $rootScope.getFinalRating("btnClicked");
            //$scope.displayErrorMsg = false;
            //$scope.$digest();
            

        }, 2000);
    

    $scope.sort = function(column) {
       
      if ($scope.orderProp === column) {
        $scope.direction = !$scope.direction;
      } 
    
      else {
        $scope.orderProp = column;
        $scope.direction = false;
      }
    
}

    }

    
    $scope.resetFiltersValue=function(view){
        
        $scope.commercialCategory="All";
        $scope.commercialCategoryTFTP="All";
        $scope.QVIS="All";
        $scope.rating="All";
        $scope.overallrating="All";
        $scope.ratingStyle={background:'#fff;',color:'#666'};
        $scope.overallRatingStyle={background:'#fff;',color:'#666'};
        $scope.parent_supplier_name="All";
        $scope.parent_supplier_name_TFTP="All";

        $sessionStorage.commercialCategory="All";
        $sessionStorage.commercialCategoryTFTP="All";
        $sessionStorage.QVIS="All";
        $sessionStorage.rating="All";
        $sessionStorage.overallrating="All";
        $sessionStorage.ratingStyle=$scope.ratingStyle;
        $sessionStorage.overallRatingStyle=$scope.overallRatingStyle;
        $sessionStorage.parent_supplier_name_TFTP="All";
        $sessionStorage.parent_supplier_name="All";

        $rootScope.searchValue="";
        $scope.getAllCategories();
        $scope.getAllCategoriesTFTP();


        $scope.category="All";
        $scope.categoryTFTP="All";
        $sessionStorage.category="All";
        $sessionStorage.categoryTFTP="All";

        if (view=='1'){
            $scope.getAllJuniorBuyers();
            $scope.juniorBuyer="All";
            $scope.parent_supplier_name="All";
            $sessionStorage.juniorBuyer="All";
            $scope.getJuniorBuyerRatings('btnClicked');
        }

        if (view=='2'){
            $scope.getAllBuyingController();
            $scope.buyingController="All";
            $sessionStorage.buyingController="All";
            $scope.parent_supplier_name="All";
            $scope.getBuyingControllerRatings('btnClicked');
        }

        if (view=='3'){
            $scope.parent_supplier_name="All";
            $scope.getCategoryDirectorRatings('btnClicked');
        }
        if (view=='4'){
            $scope.parent_supplier_name_TFTP="All";
            $scope.getCategoryDirectorRatingsTFTP('btnClicked');
        }
    }

    $scope.saveFiltersValue=function(id,view){
        //alert($scope.commercialCategory);
        $sessionStorage.commercialCategory=$scope.commercialCategory;
        $sessionStorage.commercialCategoryTFTP=$scope.commercialCategoryTFTP;
        $sessionStorage.category=$scope.category;
        $sessionStorage.categoryTFTP=$scope.categoryTFTP;
        $sessionStorage.parent_supplier_name=$scope.parent_supplier_name;

        $sessionStorage.tesco_brand_ind=$scope.tesco_brand_ind;
        $sessionStorage.juniorBuyer=$scope.juniorBuyer;
        $sessionStorage.buyingController=$scope.buyingController;
        $sessionStorage.parent_supplier_name_TFTP=$scope.parent_supplier_name_TFTP;
        
        $sessionStorage.QVIS=$scope.QVIS;
        $sessionStorage.rating=$scope.rating;
        $sessionStorage.overallrating=$scope.overallrating;

        
        if (id=="rating")
            $scope.getRatingBackgroundColor();

        if (id=="overallRating")
            $scope.getOverallRatingBackgroundColor();
        
        if (id=="commercialCategory"){
            
            $scope.getAllCategoriesTFTP();
            
            $scope.getAllCategories();

            
            if ($scope.commercialCategory=="Fresh" || $scope.commercialCategory=="All" ){
                $scope.category="All";
                
            }
            else
                $scope.category="Impulse";

            if ($scope.commercialCategoryTFTP=="Fresh" || $scope.commercialCategoryTFTP=="All" ){
                $scope.categoryTFTP="All";
                
            }
            else
                $scope.categoryTFTP="Grocery";



            


            $sessionStorage.category=$scope.category;
            $sessionStorage.categoryTFTP=$scope.categoryTFTP;

            if (view=='1'){
                $scope.getAllJuniorBuyers();
                $scope.juniorBuyer="All";
                $sessionStorage.juniorBuyer=$scope.juniorBuyer;

                $scope.getAllParentSupplierNames();
                $scope.parent_supplier_name="All";
                $sessionStorage.parent_supplier_name=$scope.parent_supplier_name;
            }
            if (view=='2'){
                $scope.getAllBuyingController();
                $scope.buyingController="All";
                $sessionStorage.buyingController=$scope.buyingController;

                $scope.getAllParentSupplierNames();
                $scope.parent_supplier_name="All";
                $sessionStorage.parent_supplier_name=$scope.parent_supplier_name;


            }
            
        }
        
        if (id=="category"){
            if (view=='1'){
                $scope.getAllJuniorBuyers();
                $scope.juniorBuyer="All";
                $sessionStorage.juniorBuyer=$scope.juniorBuyer;

                $scope.getAllParentSupplierNames();
                $scope.parent_supplier_name="All";
                $sessionStorage.parent_supplier_name=$scope.parent_supplier_name;
            }
            if (view=='2'){
                $scope.getAllBuyingController();
                $scope.buyingController="All";
                $sessionStorage.buyingController=$scope.buyingController;

                $scope.getAllParentSupplierNames();
                $scope.parent_supplier_name="All";
                $sessionStorage.parent_supplier_name=$scope.parent_supplier_name;
            }
            if(view=='3'){
                $scope.getAllParentSupplierNames();
                $scope.parent_supplier_name="All";
                $sessionStorage.parent_supplier_name=$scope.parent_supplier_name;
            }
            if(view=='4'){

                $scope.getAllParentSupplierNamesTFTP();
                $scope.parent_supplier_name_TFTP="All";
                $sessionStorage.parent_supplier_name_TFTP=$scope.parent_supplier_name_TFTP;
            }
        }
        
    }
    
    $scope.filterJuniorLevelData=function(filter){
        var searchVal=filter.searchString.toLowerCase();
        
        return function(supplier) {
            return String(supplier.Supplier_Number).match(searchVal) || (String(supplier.Supplier_Name).toLowerCase()).match(searchVal) || (String(supplier.Category_Area).toLowerCase()).match(searchVal) || (String(supplier.Junior_Area).toLowerCase()).match(searchVal);
        }; 
    }

    $scope.filterBuyingControllerLevelData=function(filter){
        var searchVal=filter.searchString.toLowerCase();
        
        return function(supplier) {
            return String(supplier.Supplier_Number).match(searchVal) || (String(supplier.Supplier_Name).toLowerCase()).match(searchVal) || (String(supplier.Category_Area).toLowerCase()).match(searchVal) || (String(supplier.Product_Area).toLowerCase()).match(searchVal);
        }; 
    }

    $scope.filterCategoryLevelData=function(filter){
        var searchVal=filter.searchString.toLowerCase();
        
        return function(supplier) {
            return (String(supplier.Parent_Supplier_Name).toLowerCase()).match(searchVal) || (String(supplier.Category_Area).toLowerCase()).match(searchVal);
        }; 
    }
    $scope.filterCategoryLevelDataTFTP=function(filter){
        var searchVal=filter.searchString.toLowerCase();
        
        return function(supplier) {
            return (String(supplier.Parent_Supplier_Name).toLowerCase()).match(searchVal) || (String(supplier.Category_Area).toLowerCase()).match(searchVal);
        }; 
    }
    $scope.filterFeedbackData=function(filter){
        var searchVal=filter.searchString.toLowerCase();
        
        return function(supplier) {
            return (String(supplier.Parent_Supplier_Name).toLowerCase()).match(searchVal) || (String(supplier.Category_Area_SL).toLowerCase()).match(searchVal) || (String(supplier.Junior_Area_SL).toLowerCase()).match(searchVal);
        }; 
    }

    $scope.getRatingBackgroundColor=function(){
        if ($scope.rating=="1")
            $scope.ratingStyle={background:'red',color:'#fff'};
        if ($scope.rating=="2")
            $scope.ratingStyle={background:'#ffbf00',color:'#fff'};
        if ($scope.rating=="3")
            $scope.ratingStyle={background:'green',color:'#fff'};
        if ($scope.rating=="4")
            $scope.ratingStyle={background:'blue',color:'#fff'};
        if ($scope.rating=="All")
            $scope.ratingStyle={background:'#fff;',color:'#666'};
    
        $sessionStorage.ratingStyle=$scope.ratingStyle;
    }
    
    $scope.getOverallRatingBackgroundColor=function(){
        if ($scope.overallrating=="1")
            $scope.overallRatingStyle={background:'red',color:'#fff'};
        if ($scope.overallrating=="2")
            $scope.overallRatingStyle={background:'#ffbf00',color:'#fff'};
        if ($scope.overallrating=="3")
            $scope.overallRatingStyle={background:'green',color:'#fff'};
        if ($scope.overallrating=="4")
            $scope.overallRatingStyle={background:'blue',color:'#fff'};
        if ($scope.overallrating=="All")
            $scope.overallRatingStyle={background:'#fff;',color:'#666'};
        
        $sessionStorage.overallRatingStyle=$scope.overallRatingStyle;
    }
    
    
    $scope.getRatingClassName=function(rating){
        return appService.getRatingClassName(rating);   
    }

    $scope.getOverallRatingClassName=function(rating){
        return appService.getOverallRatingClassName(rating);
    }

    /*
    setTimeout(
    function() {
        (function() {
            [].slice.call( document.querySelectorAll( '.tabs' ) ).forEach( function( el ) {
                new CBPFWTabs( el );
            });
        })();
    }, 100);
    */


 $scope.setActiveTabFlag=function(tabName){


        var JBT=document.getElementById('juniorBuyerTab');
        var BCT=document.getElementById('buyingControllerTab');
        var CT=document.getElementById('categoryTab');
        var MT=document.getElementById('mergeTab');
            // var GT=document.getElementById('graphTab');

        if (tabName=="juniorBuyerTab"){
            JBT.classList.add("tab-current");
            BCT.classList.remove("tab-current");
            CT.classList.remove("tab-current");
            MT.classList.remove("tab-current");
            // GT.classList.remove("tab-current");
        }else{
            if (tabName=="buyingControllerTab"){
                BCT.classList.add("tab-current");
                JBT.classList.remove("tab-current");
                CT.classList.remove("tab-current");
                MT.classList.remove("tab-current");
                // GT.classList.remove("tab-current");
            }else{
                if (tabName=="categoryTab"){
                    CT.classList.add("tab-current");
                    BCT.classList.remove("tab-current");
                    JBT.classList.remove("tab-current");
                    MT.classList.remove("tab-current");
                    // GT.classList.remove("tab-current");
                }else{
                    
                    CT.classList.remove("tab-current");
                    BCT.classList.remove("tab-current");
                    JBT.classList.remove("tab-current");
                    MT.classList.add("tab-current");
                    // GT.classList.remove("tab-current");
                }
            }
        }
    
        $sessionStorage.tabName=tabName;

    }


    if ($sessionStorage.tabName!=undefined){
        $scope.setActiveTabFlag($sessionStorage.tabName);
    }

    // This code is written by Rakesh for Last Updated Week
    $scope.getLastUpdatedWeek=function(){

        appService.getLastUpdatedWeek().then(function(data){
                $scope.last_updated_week=data[0];
                //console.log($scope.last_updated_week['Quality_Last_Updated_Week'])
        });
    }

        
        $scope.mymsg="Common india";
    var obj=this;
    obj.filteredData=[];
    $scope.QRank=0;
    $scope.VRank=0;
    $scope.IRank=0;
    $scope.SRank=0;
    $scope.TRank=0;


    $scope.QRANK=0;
    $scope.VRANK=0;
    $scope.IRANK=0;
    $scope.SRANK=0;
    $scope.TRANK=0;
        

    $rootScope.getFinalRating=function(flag_button){


        if (flag_button=="searchBox" ){
            $scope.filtereddata=obj.filteredData;
            
        }
        else
            $scope.filtereddata=$scope.suppliers_1;
        
        Len=$scope.filtereddata.length;

        Q=0;
        V=0;
        I=0;
        S=0;
        
        QC=0;
        VC=0;
        IC=0;
        SC=0;
        

        angular.forEach($scope.filtereddata, function (value, key) { 

            if(value.Quality_Rank>0){
                Q=Q+value.Quality_Rank;
                QC=QC+1;
            }

            if(value.Value_Rank>0){
                V=V+value.Value_Rank;
                VC=VC+1;
            }
            
            if(value.Innovation_Rank>0){
                I=I+value.Innovation_Rank;
                IC=IC+1;
            }
            
            if(value.Supply_Rank>0){
                S=S+value.Supply_Rank;
                SC=SC+1;
            }


            /*if(value.QVIS_Rank>0){
                T=T+value.QVIS_Rank;
                TC=TC+1;
            }*/


        });
        
        if(QC==0)
            $scope.QRank=0;
        else
            $scope.QRank=Q/QC;

        if(VC==0)
            $scope.VRank=0;
        else
            $scope.VRank=V/VC;
        
        if(IC==0)
            $scope.IRank=0;
        else
            $scope.IRank=I/IC;

        if(SC==0)
            $scope.SRank=0;
        else
            $scope.SRank=S/SC;

    
        $scope.TRank=($scope.QRank + $scope.VRank + $scope.IRank + $scope.SRank)/4;

        console.log($scope.QRank);
        console.log($scope.VRank);
        console.log( $scope.IRank);
        console.log($scope.SRank);

        $scope.QRANK=$scope.QRank;
        $scope.VRANK=$scope.VRank;
        $scope.IRANK=$scope.IRank;
        $scope.SRANK=$scope.SRank;
        $scope.TRANK=$scope.TRank;


    }


  
    $scope.exportdata=function(){
        var blob = new Blob([document.getElementById('exportdata').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        console.log(blob);
        saveAs(blob, "Report.xls");
    }

    $scope.downloadJuniorBuyerRatings=function(){
        $rootScope.searchValue="";
        
        

        
            appService.downloadJuniorBuyerRatings($scope.commercialCategory,$scope.QVIS,$scope.rating,$scope.overallrating,$scope.category,$scope.juniorBuyer).then(function(data){
            
                $scope.downloadJunior=data;
                
                
            });
        }

    

/*
    if ($sessionStorage.tabName!=undefined){

        CBPFWTabs.prototype._show(parseInt($sessionStorage.tabName));
        alert("hell");
        
    }

*/


}]);


app.controller("juniorBuyerDetailsController",["$scope","$rootScope","$http","$state","$location","$stateParams","$sessionStorage","appService",function($scope,$rootScope,$http,$state,$location,$stateParams,$sessionStorage,appService){ 
    
    if ($sessionStorage.loggedIn==undefined)
        $location.path("login");
    
    $rootScope.hideSearchBox=true;
    $rootScope.pageTitle="Junior Level Details";


    $scope.SN=$stateParams.SN;
    $scope.CD=$stateParams.CD.replace("&","_");;
    $scope.JB=$stateParams.JB.replace("&","_");
    
    $scope.view_tab='quality';
    $scope.Access_Level=$sessionStorage.userAccessLevel;
    $scope.disableSupplierNumber=true;
    $scope.parentHeight=860;
    $scope.childHeight=800;
    $scope.dashboardLoading=true;

     $scope.weeks=[];
    $scope.pers=[];
    $scope.weeks_LY=[];
    $scope.pers_LY=[];
    $scope.periods_TY=[];
    $scope.periods_sales_TY=[];
    $scope.periods_sales_LY=[];
    $scope.periods_volume_TY=[];
    $scope.periods_volume_LY=[];
    $scope.periods_COGS_TY=[];
    $scope.periods_COGS_LY=[];
    $scope.periods_CGM_TY=[];
    $scope.periods_CGM_LY=[];




    $scope.getJuniorBuyerDetails=function(){
        /*
        var cacheData=appService.getPLDCacheData($scope.SN,$scope.CD,$scope.JB);
        $scope.productLevelData=[];

        

        if (typeof(cacheData)==="object"){
            
            $scope.productLevelData=cacheData;
            $scope.dashboardLoading=false;
            
            if ($scope.productLevelData[1].Category_Access=="No")
                $location.path("/dashboard");

            $scope.Data=$scope.productLevelData[0];
            $scope.Category_Access=$scope.productLevelData[1].Category_Access;
            $scope.SL_Percentage_Data=appService.getSSLDCacheData($scope.SN,$scope.CD);
            $scope.Innovation_Data=appService.getInnovationCacheData($scope.SN);
            $scope.TFMS_Audit_Data=appService.getJBTFMSCacheData($scope.SN);
            
        }
        else{
        */

            appService.getJuniorBuyerDetails($scope.SN,$scope.CD,$scope.JB).then(function(response){
                //console.log(response);
                //alert("calll");
                $scope.productLevelData=response;
                $scope.dashboardLoading=false;

                if ($scope.productLevelData[1].Category_Access=="No")
                    $location.path("/dashboard");

                $scope.Data=$scope.productLevelData[0];
                $scope.Category_Access=$scope.productLevelData[1].Category_Access;

                appService.getJuniorBuyerTFMSAuditData($scope.SN,$scope.CD,$scope.JB).then(function(response){
                    $scope.TFMS_Audit_Data=response;
                });



                appService.getJuniorBuyerPeriodSalesTYLY($scope.SN,$scope.CD,$scope.JB).then(function(response){
                    $scope.Periodic_Sales_JB_Data=response;
                    for (let i = 0; i < 12; i++) {
                        $scope.periods_TY.push(
                            $scope.Periodic_Sales_JB_Data[i].Year_Period_TY
                            
                        );
                        if($scope.Periodic_Sales_JB_Data[i].Sales_ex_VAT_TY){
                        $scope.periods_sales_TY.push(
                            Math.round(($scope.Periodic_Sales_JB_Data[i].Sales_ex_VAT_TY))
                        );
                    }else
                    $scope.periods_sales_TY.push(0
                        );
                        if($scope.Periodic_Sales_JB_Data[i].Sales_ex_VAT_LY){
                        $scope.periods_sales_LY.push(
                            Math.round(($scope.Periodic_Sales_JB_Data[i].Sales_ex_VAT_LY))
                        );
                    }else
                    $scope.periods_sales_LY.push(0
                        );

                        if($scope.Periodic_Sales_JB_Data[i].Sales_Volume_TY){
                        $scope.periods_volume_TY.push(
                            Math.round(($scope.Periodic_Sales_JB_Data[i].Sales_Volume_TY))
                        );
                    }else
                    $scope.periods_volume_TY.push(0
                        );
                        if($scope.Periodic_Sales_JB_Data[i].Sales_Volume_LY){
                        $scope.periods_volume_LY.push(
                            Math.round(($scope.Periodic_Sales_JB_Data[i].Sales_Volume_LY))
                        );
                    }else
                    $scope.periods_volume_LY.push(0
                        );

                        if($scope.Periodic_Sales_JB_Data[i].COGS_TY){
                        $scope.periods_COGS_TY.push(
                            Math.round(($scope.Periodic_Sales_JB_Data[i].COGS_TY))
                        );
                    }else
                    $scope.periods_COGS_TY.push(0
                        );
                        if($scope.Periodic_Sales_JB_Data[i].COGS_LY){
                        $scope.periods_COGS_LY.push(
                            Math.round(($scope.Periodic_Sales_JB_Data[i].COGS_LY))
                        );
                    }else
                    $scope.periods_COGS_LY.push(0
                        );

                        if($scope.Periodic_Sales_JB_Data[i].Commercial_Gross_Margin_TY){
                        $scope.periods_CGM_TY.push(
                            Math.round(($scope.Periodic_Sales_JB_Data[i].Commercial_Gross_Margin_TY))
                        );
                    }else
                    $scope.periods_CGM_TY.push(0
                        );
                        if($scope.Periodic_Sales_JB_Data[i].Commercial_Gross_Margin_LY){
                        $scope.periods_CGM_LY.push(
                            Math.round(($scope.Periodic_Sales_JB_Data[i].Commercial_Gross_Margin_LY))
                        );
                    }else
                    $scope.periods_CGM_LY.push(0
                        );                    
                }
                });

                appService.getJuniorBuyerEpwCompSupplierNames($scope.SN,$scope.CD,$scope.JB).then(function(response){
                    $scope.EpwComp_SN_Data=response;
                    console.log(response);
                });
                appService.getJuniorBuyerLastUpdated().then(function(response){
                    // alert("Hi");
                    $scope.last_updated=response;
                    console.log($scope.last_updated);
                    $scope.sales_last_updated=$scope.last_updated[0]['Sales_Last_Updated'];
                    $scope.compliants_last_updated=$scope.last_updated[0]['Complaints_Last_Updated'];
                    $scope.epw_last_updated=$scope.last_updated[0]['EPW_Last_Updated'];
                    $scope.CPS_last_updated=$scope.last_updated[0]['CPS_Last_Updated'];
                    $scope.service_level_last_updated=$scope.last_updated[0]['Service_Level_Last_Updated'];
                    $scope.CTS_last_updated=$scope.last_updated[0]['CTS_Last_Updated'];

                    // console.log($scope.sales_last_updated);
            });
                

                appService.getJuniorBuyerLowerQuartileTPNBs($scope.SN,$scope.CD,$scope.JB).then(function(response){
                    $scope.LowerQuartileTPNBs=response;
                });

                appService.getSupplierServiceLevelData($scope.SN,$scope.CD,$scope.JB).then(function(response){
                    $scope.SL_Percentage_Data=response;
                    for (let i = 0; i < 51; i++) {
                        $scope.weeks.push(
                            $scope.SL_Percentage_Data[i].Year_Week_Number.toString()
                            
                        );
                        if($scope.SL_Percentage_Data[i].SL_Percentage){
                        $scope.pers.push(
                            Math.round(($scope.SL_Percentage_Data[i].SL_Percentage*100))
                            
                        );
                    }else
                    $scope.pers.push(
                            0
                            
                        );
                    
                }
                });
                appService.getSupplierServiceLevelDataLastYear($scope.SN,$scope.CD,$scope.JB).then(function(response){
                    $scope.SL_Percentage_Data_Last_Year=response;
                    
                    for (let i = 0; i < 51; i++) {
                        $scope.weeks_LY.push(
                            $scope.SL_Percentage_Data_Last_Year[i].Year_Week_Number.toString()
                            
                        );
                        if($scope.SL_Percentage_Data_Last_Year[i].SL_Percentage){
                        $scope.pers_LY.push(
                            Math.round(($scope.SL_Percentage_Data_Last_Year[i].SL_Percentage*100))
                            
                        );
                    }else
                    $scope.pers.push(
                            0
                            
                        );

                    
                }
                });


                $scope.QVIS_Supplier_Values=[$scope.Data.Quality_Rank,$scope.Data.Value_Rank,$scope.Data.Innovation_Rank,$scope.Data.Supply_Rank]
                var count=0;
                $scope.QVIS_Supplier_Values_sum=0;
                var j=0;

                for( j = 0; j <=3; j++ ){
                    
                    if($scope.QVIS_Supplier_Values[j]) {
                        
                        $scope.QVIS_Supplier_Values_sum=$scope.QVIS_Supplier_Values_sum + $scope.QVIS_Supplier_Values[j];
                        count=count+1;
                    }
                    }
                $scope.Avg_QVIS_Supplier_Values=$scope.QVIS_Supplier_Values_sum/count;


                    $scope.add_remove=[
            
                        {var : "Add"},
                        {var : "Remove"}
                        
                        
                    ];
                  $scope.siteArray =
                                        [
                                            // { 'Site_Code': '', 'Site_Name': '','Supplier_Name':'','AddRemove':'','Comment':''},
                                      
                                        ];

                $scope.addRow = function () {
                    // alert('Hi');
                    if ($scope.Site_Code_Input != undefined && $scope.Comment_Input != undefined) {
                        var site = [];
                        site.Site_Code = $scope.Site_Code_Input;
                        appService.getAuditSitesData(site.Site_Code).then(function(response){
                                $scope.AuditSitesData=response;
                                site.Site_Name=$scope.AuditSitesData[0]['Site_Name'];
                                site.Supplier_Name=$scope.AuditSitesData[0]['Supplier_Name'];
                            });
                        
                        site.AddRemove=$scope.AddRemoveInput;

                        site.Comment = $scope.Comment_Input;
                        var keepGoing = true;
                        
                        
                        $scope.siteArray.push(site);

                        // CLEAR TEXTBOX.
                        $scope.Site_Code_Input = null;
                        $scope.Comment_Input = null;
                    }
        };

        
            
            $scope.addremove_Junior_Buyer_TFMS_Site_Details=function(value){

                angular.forEach($scope.siteArray, function (value) {
                // console.log(value);
                
                 
      
                    
                    console.log(value.Site_Code);
                    $scope.Site_Code_Table_Input=value.Site_Code.replace("&","_");
                    $scope.Site_Name_Table_Input=value.Site_Name.replace("&","_");
                    $scope.Supplier_Name_Table_Input=value.Supplier_Name.replace("&","_");
                    $scope.Action_Table_Input=value.AddRemove.replace("&","_");
                    $scope.Comment_Table_Input=value.Comment.replace("&","_");
                    // $scope.TFMS_Update_SC=supplier_details.SC.replace("&","_");
                    // $scope.TFMS_Update_PC=supplier_details.PC.replace("&","_");
                    
                    
                    console.log($scope.Comment_Table_Input);
                    // console.log($scope.TFMS_Update_PC);
                    
                    appService.addremove_Junior_Buyer_TFMS_Site_Details($scope.Site_Code_Table_Input,
                        $scope.Site_Name_Table_Input,$scope.Supplier_Name_Table_Input,$scope.Action_Table_Input,$scope.Comment_Table_Input).then(function(data){
                            $scope.AddRemove_Sites=data;
                            // alert("hi");
                            
                            if($scope.AddRemove_Sites!=undefined){
                            alert("Thanks for your input.Site details will be amended ");
                        }
                        else{
                            alert("Please enter Site Details details");
                        }

                        });
                    

            
                
            });
            
        };

        $scope.removeRow = function (index) {

            var name = $scope.siteArray[index].Site_Code;
    
            $scope.siteArray.splice(index, 1);
    
            // var arrSite = [];
            // angular.forEach($scope.siteArray, function (value) {
            //     if (!value.Remove) {
            //         arrSite.push(value);
            //     }
            // });
            // $scope.siteArray = arrSite;
        };

        $scope.exportdata=function(quality,value,innovation,supply,graph){
                        var blob = new Blob(
                            [
                            document.getElementById(quality).innerHTML,
                            document.getElementById(value).innerHTML,
                            document.getElementById(innovation).innerHTML,
                            document.getElementById(supply).innerHTML,
                            document.getElementById(graph).innerHTML,
                            // document.getElementById(cgm).innerHTML,
                            // document.getElementById(tpnbinlowerquartile).innerHTML,
                            // document.getElementById(servicelevel).innerHTML,
                            // document.getElementById(servicelevelbyweek).innerHTML,
                            // document.getElementById(redweeks).innerHTML,
                            // document.getElementById(summary).innerHTML,

                            ], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                        });
                        console.log(blob);
                        saveAs(blob, "QVIS.xls");
                    };

             $scope.exportpdf = function(id){
        html2canvas(document.getElementById(id), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download(id+".pdf");
            }
        });
    };


                $scope.fresh = {
                  labels : [ 'Q','V','I','S' ],
                  datasets : [
                    {
                      fillColor : 'rgba(220,220,220,0.5)',
                      strokeColor : '#00539f',
                      pointColor : 'rgba(220,220,220,1)',
                      pointStrokeColor : '#fff',
                      label:'Supplier',
                      data : [ $scope.Data.Quality_Rank,$scope.Data.Value_Rank,$scope.Data.Innovation_Rank,$scope.Data.Supply_Rank]
                    },
                    {
                      fillColor : 'rgba(151,187,205,0.5)',
                      strokeColor : '#F75752',
                      pointColor : 'rgba(151,187,205,1)',
                      pointStrokeColor : '#fff',
                      data : [ $scope.Data.Avg_Quality_Rank,$scope.Data.Avg_Value_Rank,$scope.Data.Avg_Innovation_Rank,$scope.Data.Avg_Supply_Rank]
                    }
                  ]
                };
            
            $scope.options =  {
              segmentShowStroke : true,
              segmentStrokeColor : '#fff',
              segmentStrokeWidth : 24,
              percentageInnerCutout : 50,
              animation : true,
              animationSteps : 25,
              animationEasing : 'easeOutQuart',
              animateRotate : true,
              animateScale : false,
              onAnimationComplete : null,
              scaleOverride: true,
              scaleSteps: 5,
              scaleStepWidth: 1,
              scaleStartValue: 0,
            };

        $scope.check_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x4",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.weeks,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#626262"
          },
          item: {
              fontColor: "black"
          },
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.pers,
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.pers_LY,
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },
      }]
    };

        $scope.periodic_sales_JB_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'Sales TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "M",
          'thousands-separator': ",",
          format: "£%v",
          negation: "currency"
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_sales_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_sales_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

        $scope.periodic_volume_JB_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'Volume TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "k",
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_volume_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_volume_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

        $scope.periodic_COGS_JB_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'COGS TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "K",
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_COGS_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_COGS_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

        $scope.periodic_CGM_JB_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'CGM TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "K",
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_CGM_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_CGM_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };



zingchart.MODULESDIR = "https://cdn.zingchart.com/modules/";
  
    $scope.myJson = {
  type: 'radar',
  plot: {
    aspect: 'area',
    animation: {
      effect: 3,
      sequence: 1,
      speed: 700
    }
  },
  scaleV: {
    visible: false
  },
  scaleK: {
    values: '0:3:1',
    labels: ['Q','V','I','S'],
    item: {
      fontColor: '#607D8B',
      backgroundColor: "white",
      borderColor: "#aeaeae",
      borderWidth: 1,
      padding: '5 10',
      borderRadius: 10
    },
    refLine: {
      lineColor: '#c10000'
    },
    tick: {
      lineColor: '#59869c',
      lineWidth: 2,
      lineStyle: 'dotted',
      size: 20
    },
    guide: {
      lineColor: "#607D8B",
      lineStyle: 'solid',
      alpha: 0.3,
      backgroundColor: "#c5c5c5 #718eb4"
    }
  },
  series: [{
      values : [ $scope.Data.Quality_Rank,$scope.Data.Value_Rank,$scope.Data.Innovation_Rank,$scope.Data.Supply_Rank],
      text: 'farm'
    },
    {
      values: [ $scope.Data.Avg_Quality_Rank,$scope.Data.Avg_Value_Rank,$scope.Data.Avg_Innovation_Rank,$scope.Data.Avg_Supply_Rank],
      lineColor: '#53a534',
      backgroundColor: '#689F38'
    }
  ]
};
            $scope.updateJuniorTFMS_Supplier_Details=function(supplier_details){
      
                    // console.log(supplier_details.SN);
                    console.log(supplier_details.SC);
                    // console.log(supplier_details.PC);
                    
                    // $scope.TFMS_Update_SN=supplier_details.SN.replace("&","_");
                    $scope.TFMS_Update_SC=supplier_details.SC.replace("&","_");
                    // $scope.TFMS_Update_PC=supplier_details.PC.replace("&","_");
                    
                    // console.log($scope.TFMS_Update_SN);
                    console.log($scope.TFMS_Update_SC);
                    // console.log($scope.TFMS_Update_PC);
                    
                    appService.updateJuniorTFMS_Supplier_Details($scope.SN,$scope.TFMS_Update_SC).then(function(data){
                            $scope.updated_TFMS_feedbackData=data;
                            
                            console.log($scope.updated_TFMS_feedbackData);
                            alert("Feedback/Commenst Updated for Supplier "+ $scope.TFMS_Update_SN);

                        });
                    

            }







            });
        //}

        if ($scope.Access_Level=='admin')
            $scope.disableSupplierNumber=false;
        else
            $scope.disableSupplierNumber=true;
            
    }

    $scope.changeQVISDiv = function(tab) {
        $scope.view_tab = tab;
    }

    setTimeout(
    function() {
        (function() {
            [].slice.call( document.querySelectorAll( '.tabs' ) ).forEach( function( el ) {
                new CBPFWTabs( el );
            });
        })();
    }, 100);
    

    $scope.SL_Blue_Count=0;
    $scope.SL_Green_Count=0;
    $scope.SL_Amber_Count=0;
    $scope.SL_Red_Count=0;
    $scope.SL_Gray_Count=0;

    $scope.$watch('SL_Percentage_Data', function() {
        $scope.SL_Blue_Count=0;
        $scope.SL_Green_Count=0;
        $scope.SL_Amber_Count=0;
        $scope.SL_Red_Count=0;
        $scope.SL_Gray_Count=0;

        var i=0;
        if ($scope.SL_Percentage_Data!=undefined){

            for (i=0;i<=51;i++){
                value=$scope.SL_Percentage_Data[i].SL_Percentage;
                value=parseFloat(value);

                if (value>=0.985)
                    $scope.SL_Blue_Count++;
                else
                    if (value>=0.965 && value<0.985)
                        $scope.SL_Green_Count++;
                    else
                        if (value>=0.90 && value<0.965)
                            $scope.SL_Amber_Count++;
                        else
                            if (value<0.90)
                                 $scope.SL_Red_Count++;
                            else
                                 $scope.SL_Gray_Count++;

            }
        }

    });
    
    $scope.backToDashboard=function(){
        alert("back to dash");
        $state.go('dashboard');
    }
    
    $scope.getCategoryLevelHistoricalData=function(){   
        appService.getCategoryLevelHistoricalData($scope.ID).then(function(response){
            $scope.historicalData=response.data;
        });
    }
    
    $scope.getAllCategories=function(commercialCategory){
        //alert(commercialCategory);
        appService.getAllCategories($sessionStorage.userGeography,$scope.commercialCategory).then(function(data){

            $scope.categoryData=data;
            
        });
    }

    $scope.getAllCategoriesTFTP=function(commercialCategory){
        //alert(commercialCategory);
        appService.getAllCategoriesTFTP($sessionStorage.userGeography,$scope.commercialCategoryTFTP).then(function(data){

            $scope.categoryDataTFTP=data;
            
        });
    }

    $scope.getNumberformat=function(number){
        return appService.getNumberformat(number);  
    }
    
    $scope.getRatingClassName=function(rating){
        return appService.getRatingClassName(rating);   
    }
    
    $scope.getOverallRatingClassName=function(rating){
        return appService.getOverallRatingClassName(rating);
    }
    
    $scope.getRedGreenClassName=function(value){
        return appService.getRedGreenClassName(value);
    }

    $scope.getRatingStyle=function(value){
        //return appService.getRedGreenClassName(value);
        //alert(value);
        if (value==3){
            alert("yes");

            return {
                    "background-color": green
            };
            alert("No");
            
        }
    }

    
    $scope.getTFMSScoreClassName=function(score){
        return appService.getTFMSScoreClassName(score); 
    }

    $scope.getRedGreenClassNameReverse=function(value){
        return appService.getRedGreenClassNameReverse(value);
    }

    $scope.getSLClassName=function(value){
        return appService.getSLClassName(value);
    }

    $scope.updateCategoryLevelRating=function(){    
        data={
            CL_ID:$scope.ID,
            userID:$sessionStorage.userID,
            Supply_Chain_Rating:$scope.Data.Supply_Chain_Rating,
            Technical_Rating:$scope.Data.Technical_Rating,
            NPD_Rating:$scope.Data.NPD_Rating,
            Buying_Rating:$scope.Data.Buying_Rating
        };
        $http.post("process/updateCategoryLevelRating.php",data).then(function(){
            appService.getCategoryLevelHistoricalData($scope.ID).then(function(response){
                $scope.historicalData=response.data;
            });
        });
    }
    
    $scope.updateCategoryLevelNumbers=function(){
        data={
            CL_ID:$scope.ID,
            userID:$sessionStorage.userID,
            This_Year_Sales:$scope.Data.This_Year_Sales,
            YOY_Changes:$scope.Data.YOY_Changes,
            This_Year_Units:$scope.Data.This_Year_Units,
            This_Year_Margin:$scope.Data.This_Year_Margin
        };
        $http.post("process/updateCategoryLevelNumbers.php",data).then(function(){
            appService.getCategoryLevelHistoricalData($scope.ID).then(function(response){
                $scope.historicalData=response.data;
            });
        });
    }
    
    $scope.updateCategoryLevelSupplierBasicInfo=function(){
        data={
            CL_ID:$scope.ID,
            userID:$sessionStorage.userID,
            Geography:$scope.Data.Geography,
            SupplierNumber:$scope.Data.Supplier_Number,
            Category:$scope.Data.Category,
            SupplierName:$scope.Data.Supplier_Name
        };
        $http.post("process/updateCategoryLevelSupplierBasicInfo.php",data).then(function(){
            appService.getCategoryLevelHistoricalData($scope.ID).then(function(response){
                $scope.historicalData=response.data;
            });
        });
    }
    
    $scope.updateCategoryLevelSitejuniorBuyer=function(){
        data={
            CL_ID:$scope.ID,
            userID:$sessionStorage.userID,
            juniorBuyer:$scope.Data.juniorBuyer,
            Number_of_Sites:$scope.Data.Number_of_Sites,
            Sites_Code:$scope.Data.Sites_Code,
            Sites_Name:$scope.Data.Sites_Name
        };
        $http.post("process/updateCategoryLevelSitejuniorBuyer.php",data).then(function(){
            appService.getCategoryLevelHistoricalData($scope.ID).then(function(response){
                $scope.historicalData=response.data;
            });
        });
    }
    
    $scope.updateCategoryLevelComments=function(){
        data={
            CL_ID:$scope.ID,
            userID:$sessionStorage.userID,
            Comments:$scope.Data.Comments
        };
        $http.post("process/updateCategoryLevelComments.php",data).then(function(){
            appService.getCategoryLevelHistoricalData($scope.ID).then(function(response){
                $scope.historicalData=response.data;
            });
        });
    }
    
    $scope.updateCategoryLevelMoreAboutSupplier=function(){
        data={
            CL_ID:$scope.ID,
            userID:$sessionStorage.userID,
            Product_Supplied:$scope.Data.Product_Supplied,
            Future_Capability:$scope.Data.Future_Capability,
            Supplier_Categorization:$scope.Data.Supplier_Categorization,
            Supplier_Code_TTL:$scope.Data.Supplier_Code_TTL
        };
        $http.post("process/updateCategoryLevelMoreAboutSupplier.php",data).then(function(){
            appService.getCategoryLevelHistoricalData($scope.ID).then(function(response){
                $scope.historicalData=response.data;
            });
        });
    }
    
    
    $scope.animate = false;
    $scope.show_hide="Show";
    
    $scope.play = function(){
        $scope.animate=!$scope.animate;
        if ($scope.animate==false){
            $scope.parentHeight=680;
            $scope.childHeight=610;
            $scope.show_hide="Show";
        }
        else{
            $scope.parentHeight=1030;
            $scope.childHeight=960;
            $scope.show_hide="Hide";
        }
    }
}]);

app.controller("buyingControllerDetailsController",["$scope","$rootScope","$http","$state","$location","$stateParams","$sessionStorage","appService",function($scope,$rootScope,$http,$state,$location,$stateParams,$sessionStorage,appService){    
    
    
    if ($sessionStorage.loggedIn==undefined)
        $location.path("login");
    
    $rootScope.hideSearchBox=true;
    $rootScope.pageTitle="Buying Level Details";


    $scope.SN=$stateParams.SN;
    $scope.CD=$stateParams.CD.replace("&","_");;
    $scope.BC=$stateParams.BC.replace("&","_");
    
    $scope.view_tab='quality';
    $scope.Access_Level=$sessionStorage.userAccessLevel;
    $scope.disableSupplierNumber=true;
    $scope.parentHeight=860;
    $scope.childHeight=800;
    $scope.dashboardLoading=true;
    $scope.weeks=[];
    $scope.pers=[];
    $scope.weeks_LY=[];
    $scope.pers_LY=[];
    $scope.periods_TY=[];
    $scope.periods_sales_TY=[];
    $scope.periods_sales_LY=[];
    $scope.periods_volume_TY=[];
    $scope.periods_volume_LY=[];
    $scope.periods_COGS_TY=[];
    $scope.periods_COGS_LY=[];
    $scope.periods_CGM_TY=[];
    $scope.periods_CGM_LY=[];


    $scope.getBuyingControllerDetails=function(){
    
        appService.getBuyingControllerDetails($scope.SN,$scope.CD,$scope.BC).then(function(response){
            $scope.productLevelData=response;
            $scope.dashboardLoading=false;

            if ($scope.productLevelData[1].Category_Access=="No")
                $location.path("/dashboard");

            $scope.Data=$scope.productLevelData[0];
            $scope.Category_Access=$scope.productLevelData[1].Category_Access;

            appService.getBuyingControllerTFMSAuditData($scope.SN,$scope.CD,$scope.BC).then(function(response){
                console.log(response.data);
                $scope.TFMS_Audit_Data=response;
            });


                appService.getBuyingControllerPeriodSalesTYLY($scope.SN,$scope.CD,$scope.BC).then(function(response){
                    $scope.Periodic_Sales_BC_Data=response;
                    for (let i = 0; i < 12; i++) {
                        $scope.periods_TY.push(
                            $scope.Periodic_Sales_BC_Data[i].Year_Period_TY.toString()
                            
                        );
                        if($scope.Periodic_Sales_BC_Data[i].Sales_ex_VAT_TY){
                        $scope.periods_sales_TY.push(
                            Math.round(($scope.Periodic_Sales_BC_Data[i].Sales_ex_VAT_TY))
                        );
                    }else
                    $scope.periods_sales_TY.push(0
                        );
                        if($scope.Periodic_Sales_BC_Data[i].Sales_ex_VAT_LY){
                        $scope.periods_sales_LY.push(
                            Math.round(($scope.Periodic_Sales_BC_Data[i].Sales_ex_VAT_LY))
                        );
                    }else
                    $scope.periods_sales_LY.push(0
                        );

                        if($scope.Periodic_Sales_BC_Data[i].Sales_Volume_TY){
                        $scope.periods_volume_TY.push(
                            Math.round(($scope.Periodic_Sales_BC_Data[i].Sales_Volume_TY))
                        );
                    }else
                    $scope.periods_volume_TY.push(0
                        );
                        if($scope.Periodic_Sales_BC_Data[i].Sales_Volume_LY){
                        $scope.periods_volume_LY.push(
                            Math.round(($scope.Periodic_Sales_BC_Data[i].Sales_Volume_LY))
                        );
                    }else
                    $scope.periods_volume_LY.push(0
                        );

                        if($scope.Periodic_Sales_BC_Data[i].COGS_TY){
                        $scope.periods_COGS_TY.push(
                            Math.round(($scope.Periodic_Sales_BC_Data[i].COGS_TY))
                        );
                    }else
                    $scope.periods_COGS_TY.push(0
                        );
                        if($scope.Periodic_Sales_BC_Data[i].COGS_LY){
                        $scope.periods_COGS_LY.push(
                            Math.round(($scope.Periodic_Sales_BC_Data[i].COGS_LY))
                        );
                    }else
                    $scope.periods_COGS_LY.push(0
                        );

                        if($scope.Periodic_Sales_BC_Data[i].Commercial_Gross_Margin_TY){
                        $scope.periods_CGM_TY.push(
                            Math.round(($scope.Periodic_Sales_BC_Data[i].Commercial_Gross_Margin_TY))
                        );
                    }else
                    $scope.periods_CGM_TY.push(0
                        );
                        if($scope.Periodic_Sales_BC_Data[i].Commercial_Gross_Margin_LY){
                        $scope.periods_CGM_LY.push(
                            Math.round(($scope.Periodic_Sales_BC_Data[i].Commercial_Gross_Margin_LY))
                        );
                    }else
                    $scope.periods_CGM_LY.push(0
                        );                    
                }
                });

            appService.getBuyerControllerEpwCompSupplierNames($scope.SN,$scope.CD,$scope.BC).then(function(response){
                    
                    $scope.EpwComp_SN_Data_BC=response;
                    console.log(response);
                });
            appService.getBuyingControllerLastUpdated().then(function(response){
                    // alert("Hi");
                    $scope.last_updated=response;
                    console.log($scope.last_updated);
                    $scope.sales_last_updated=$scope.last_updated[0]['Sales_Last_Updated'];
                    $scope.compliants_last_updated=$scope.last_updated[0]['Complaints_Last_Updated'];
                    $scope.epw_last_updated=$scope.last_updated[0]['EPW_Last_Updated'];
                    $scope.CPS_last_updated=$scope.last_updated[0]['CPS_Last_Updated'];
                    $scope.service_level_last_updated=$scope.last_updated[0]['Service_Level_Last_Updated'];
                    $scope.CTS_last_updated=$scope.last_updated[0]['CTS_Last_Updated'];

                    // console.log($scope.sales_last_updated);
            });


            appService.getBuyingControllerLowerQuartileTPNBs($scope.SN,$scope.CD,$scope.BC).then(function(response){
                $scope.LowerQuartileTPNBs=response;
            });

            appService.getSupplierServiceLevelDataBuyingController($scope.SN,$scope.CD,$scope.BC).then(function(response){
                $scope.SL_Percentage_Data=response;

                    for (let i = 0; i < 51; i++) {
                        $scope.weeks.push(
                            $scope.SL_Percentage_Data[i].Year_Week_Number.toString()
                            
                        );
                        if($scope.SL_Percentage_Data[i].SL_Percentage){
                        $scope.pers.push(
                            Math.round(($scope.SL_Percentage_Data[i].SL_Percentage*100))
                            
                        );
                    }else
                    $scope.pers.push(
                            0
                            
                        );
                    
                }
            });
            appService.getSupplierServiceLevelDataLastYearBuyingController($scope.SN,$scope.CD,$scope.BC).then(function(response){
                    $scope.SL_Percentage_Data_Last_Year=response;
                    
                    for (let i = 0; i < 51; i++) {
                        $scope.weeks_LY.push(
                            $scope.SL_Percentage_Data_Last_Year[i].Year_Week_Number.toString()
                            
                        );
                        if($scope.SL_Percentage_Data_Last_Year[i].SL_Percentage){
                        $scope.pers_LY.push(
                            Math.round(($scope.SL_Percentage_Data_Last_Year[i].SL_Percentage*100))
                            
                        );
                    }else
                    $scope.pers.push(
                            0
                            
                        );

                    
                }
                });

            $scope.QVIS_Supplier_Values=[$scope.Data.Quality_Rank,$scope.Data.Value_Rank,$scope.Data.Innovation_Rank,$scope.Data.Supply_Rank]
                var count=0;
                $scope.QVIS_Supplier_Values_sum=0;
                var j=0;

                for( j = 0; j <=3; j++ ){
                    
                    if($scope.QVIS_Supplier_Values[j]) {
                        // console.log($scope.QVIS_Supplier_Values[j]);
                        $scope.QVIS_Supplier_Values_sum=$scope.QVIS_Supplier_Values_sum + $scope.QVIS_Supplier_Values[j];
                        count=count+1;
                    }
                    }
            $scope.Avg_QVIS_Supplier_Values=$scope.QVIS_Supplier_Values_sum/count;

                        $scope.add_remove=[
            
                        {var : "Add"},
                        {var : "Remove"}
                        
                        
                    ];
                  $scope.siteArray =
                                        [
                                            // { 'Site_Code': '', 'Site_Name': '','Supplier_Name':'','AddRemove':'','Comment':''},
                                      
                                        ];

                $scope.addRow = function () {
                    // alert('Hi');
                    if ($scope.Site_Code_Input != undefined && $scope.Comment_Input != undefined) {
                        var site = [];
                        site.Site_Code = $scope.Site_Code_Input;
                        appService.getAuditSitesData(site.Site_Code).then(function(response){
                                $scope.AuditSitesData=response;
                                site.Site_Name=$scope.AuditSitesData[0]['Site_Name'];
                                site.Supplier_Name=$scope.AuditSitesData[0]['Supplier_Name'];
                            });
                        
                        site.AddRemove=$scope.AddRemoveInput;

                        site.Comment = $scope.Comment_Input;
                        var keepGoing = true;
                        
                        
                        $scope.siteArray.push(site);

                        // CLEAR TEXTBOX.
                        $scope.Site_Code_Input = null;
                        $scope.Comment_Input = null;
                    }
        };

        
            
            $scope.addremove_Buying_Controller_TFMS_Site_Details=function(value){

                angular.forEach($scope.siteArray, function (value) {
                // console.log(value);
                
                 
      
                    
                    console.log(value.Site_Code);
                    $scope.Site_Code_Table_Input=value.Site_Code.replace("&","_");
                    $scope.Site_Name_Table_Input=value.Site_Name.replace("&","_");
                    $scope.Supplier_Name_Table_Input=value.Supplier_Name.replace("&","_");
                    $scope.Action_Table_Input=value.AddRemove.replace("&","_");
                    $scope.Comment_Table_Input=value.Comment.replace("&","_");
                    // $scope.TFMS_Update_SC=supplier_details.SC.replace("&","_");
                    // $scope.TFMS_Update_PC=supplier_details.PC.replace("&","_");
                    
                    
                    console.log($scope.Comment_Table_Input);
                    // console.log($scope.TFMS_Update_PC);
                    
                    appService.addremove_Buying_Controller_TFMS_Site_Details($scope.Site_Code_Table_Input,
                        $scope.Site_Name_Table_Input,$scope.Supplier_Name_Table_Input,$scope.Action_Table_Input,$scope.Comment_Table_Input).then(function(data){
                            $scope.AddRemove_Sites=data;
                            // alert("hi");
                            
                            if($scope.AddRemove_Sites!=undefined){
                            alert("Thanks for your input.Site details will be amended ");
                        }
                        else{
                            alert("Please enter Site Details details");
                        }

                        });
                    

            
                
            });
            
        };

        $scope.removeRow = function (index) {

            var name = $scope.siteArray[index].Site_Code;
    
            $scope.siteArray.splice(index, 1);
    
            // var arrSite = [];
            // angular.forEach($scope.siteArray, function (value) {
            //     if (!value.Remove) {
            //         arrSite.push(value);
            //     }
            // });
            // $scope.siteArray = arrSite;
        };


        $scope.exportdata=function(quality,value,innovation,supply,graph){
                        var blob = new Blob(
                            [
                            document.getElementById(quality).innerHTML,
                            document.getElementById(value).innerHTML,
                            document.getElementById(innovation).innerHTML,
                            document.getElementById(supply).innerHTML,
                            document.getElementById(graph).innerHTML,
                            // document.getElementById(cgm).innerHTML,
                            // document.getElementById(tpnbinlowerquartile).innerHTML,
                            // document.getElementById(servicelevel).innerHTML,
                            // document.getElementById(servicelevelbyweek).innerHTML,
                            // document.getElementById(redweeks).innerHTML,
                            // document.getElementById(summary).innerHTML,

                            ], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                        });
                        console.log(blob);
                        saveAs(blob, "QVIS.xls");
                    };

             $scope.exportpdf = function(id){
        html2canvas(document.getElementById(id), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download(id+".pdf");
            }
        });
    };

            $scope.fresh = {
                  labels : [ 'Q','V','I','S' ],
                  datasets : [
                    {
                      fillColor : 'rgba(220,220,220,0.5)',
                      strokeColor : '#00539f',
                      pointColor : 'rgba(220,220,220,1)',
                      pointStrokeColor : '#fff',
                      label:'Supplier',
                      data : [ $scope.Data.Quality_Rank,$scope.Data.Value_Rank,$scope.Data.Innovation_Rank,$scope.Data.Supply_Rank]
                    },
                    {
                      fillColor : 'rgba(151,187,205,0.5)',
                      strokeColor : '#F75752',
                      pointColor : 'rgba(151,187,205,1)',
                      pointStrokeColor : '#fff',
                      data : [ $scope.Data.Avg_Quality_Rank,$scope.Data.Avg_Value_Rank,$scope.Data.Avg_Innovation_Rank,$scope.Data.Avg_Supply_Rank]
                    }
                  ]
                };
            
            $scope.options =  {
              segmentShowStroke : true,
              segmentStrokeColor : '#fff',
              segmentStrokeWidth : 24,
              percentageInnerCutout : 50,
              animation : true,
              animationSteps : 25,
              animationEasing : 'easeOutQuart',
              animateRotate : true,
              animateScale : false,
              onAnimationComplete : null,
              scaleOverride: true,
              scaleSteps: 5,
              scaleStepWidth: 1,
              scaleStartValue: 0,
            };
    zingchart.MODULESDIR = "https://cdn.zingchart.com/modules/";
$scope.SL_Graph_Buying_Controller = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x4",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.weeks,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#626262"
          },
          item: {
              fontColor: "black"
          },
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.pers,
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.pers_LY,
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },
      }]
    };
    

        $scope.periodic_sales_BC_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'Sales TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "M",
          'thousands-separator': ",",
          format: "£%v",
          negation: "currency"
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_sales_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_sales_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

        $scope.periodic_volume_BC_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'Volume TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "k",
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_volume_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_volume_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

        $scope.periodic_COGS_BC_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'COGS TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "K",
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_COGS_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_COGS_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

        $scope.periodic_CGM_BC_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'CGM TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "K",
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_CGM_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_CGM_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

  

            zingchart.MODULESDIR = "https://cdn.zingchart.com/modules/";
  
    $scope.myJson_buyer = {
  type: 'radar',
  plot: {
    aspect: 'area',
    animation: {
      effect: 3,
      sequence: 1,
      speed: 700
    }
  },
  scaleV: {
    visible: false
  },
  scaleK: {
    values: '0:3:1',
    labels: ['Q','V','I','S'],
    item: {
      fontColor: '#607D8B',
      backgroundColor: "white",
      borderColor: "#aeaeae",
      borderWidth: 1,
      padding: '5 10',
      borderRadius: 10
    },
    refLine: {
      lineColor: '#c10000'
    },
    tick: {
      lineColor: '#59869c',
      lineWidth: 2,
      lineStyle: 'dotted',
      size: 20
    },
    guide: {
      lineColor: "#607D8B",
      lineStyle: 'solid',
      alpha: 0.3,
      backgroundColor: "#c5c5c5 #718eb4"
    }
  },
  series: [{
      values : [ $scope.Data.Quality_Rank,$scope.Data.Value_Rank,$scope.Data.Innovation_Rank,$scope.Data.Supply_Rank],
      text: 'farm'
    },
    {
      values: [ $scope.Data.Avg_Quality_Rank,$scope.Data.Avg_Value_Rank,$scope.Data.Avg_Innovation_Rank,$scope.Data.Avg_Supply_Rank],
      lineColor: '#53a534',
      backgroundColor: '#689F38'
    }
  ]
};








        });
    }
    $scope.updateBuyingTFMS_Supplier_Details=function(supplier_details){
      
                    // console.log(supplier_details.SN);
                    console.log(supplier_details.SC);
                    // console.log(supplier_details.PC);
                    
                    // $scope.TFMS_Update_SN=supplier_details.SN.replace("&","_");
                    $scope.TFMS_Update_SC=supplier_details.SC.replace("&","_");
                    // $scope.TFMS_Update_PC=supplier_details.PC.replace("&","_");
                    
                    // console.log($scope.TFMS_Update_SN);
                    console.log($scope.TFMS_Update_SC);
                    // console.log($scope.TFMS_Update_PC);
                    
                    appService.updateBuyingTFMS_Supplier_Details($scope.SN,$scope.TFMS_Update_SC).then(function(data){
                            $scope.updated_TFMS_feedbackData=data;
                            
                            console.log($scope.updated_TFMS_feedbackData);
                            alert("Feedback/Commenst Updated for Supplier "+ $scope.TFMS_Update_SN);

                        });
                    

            }

        
    $scope.changeQVISDiv = function(tab) {
        $scope.view_tab = tab;
    }

    setTimeout(
    function() {
        (function() {
            [].slice.call( document.querySelectorAll( '.tabs' ) ).forEach( function( el ) {
                new CBPFWTabs( el );
            });
        })();
    }, 100);
    

    $scope.SL_Blue_Count=0;
    $scope.SL_Green_Count=0;
    $scope.SL_Amber_Count=0;
    $scope.SL_Red_Count=0;
    $scope.SL_Gray_Count=0;


    $scope.$watch('SL_Percentage_Data', function() {
        $scope.SL_Blue_Count=0;
        $scope.SL_Green_Count=0;
        $scope.SL_Amber_Count=0;
        $scope.SL_Red_Count=0;
        $scope.SL_Gray_Count=0;

        var i=0;

        if ($scope.SL_Percentage_Data!=undefined){


            for (i=0;i<=51;i++){
                value=$scope.SL_Percentage_Data[i].SL_Percentage;
                value=parseFloat(value);

                if (value>=0.985)
                    $scope.SL_Blue_Count++;
                else
                    if (value>=0.965 && value<0.985)
                        $scope.SL_Green_Count++;
                    else
                        if (value>=0.90 && value<0.965)
                            $scope.SL_Amber_Count++;
                        else
                            if (value<0.90)
                                 $scope.SL_Red_Count++;
                            else
                                 $scope.SL_Gray_Count++;

            }
        }

    });
    
    
    
    $scope.getNumberformat=function(number){
        return appService.getNumberformat(number);  
    }
    
    $scope.getRatingClassName=function(rating){
        return appService.getRatingClassName(rating);   
    }
    
    $scope.getOverallRatingClassName=function(rating){
        return appService.getOverallRatingClassName(rating);
    }
    
    $scope.getRedGreenClassName=function(value){
        return appService.getRedGreenClassName(value);
    }
    $scope.getTFMSScoreClassName=function(score){
        return appService.getTFMSScoreClassName(score); 
    }

    $scope.getRedGreenClassNameReverse=function(value){
        return appService.getRedGreenClassNameReverse(value);
    }

    $scope.getSLClassName=function(value){
        return appService.getSLClassName(value);
    }

}]);

app.controller("categoryDetailsController",["$scope","$rootScope","$http","$state","$location","$stateParams","$sessionStorage","appService",function($scope,$rootScope,$http,$state,$location,$stateParams,$sessionStorage,appService){    
    
    
    if ($sessionStorage.loggedIn==undefined)
        $location.path("login");
    
    $rootScope.hideSearchBox=true;
    $rootScope.pageTitle="Category Level Details";


    $scope.SN=$stateParams.SN;
    $scope.CD=$stateParams.CD.replace("&","_");;
    
    $scope.view_tab='quality';
    $scope.Access_Level=$sessionStorage.userAccessLevel;
    $scope.disableSupplierNumber=true;
    $scope.parentHeight=860;
    $scope.childHeight=800;
    $scope.dashboardLoading=true;

    $scope.weeks=[];
    $scope.pers=[];
    $scope.weeks_LY=[];
    $scope.pers_LY=[];
    $scope.periods_TY=[];
    $scope.periods_sales_TY=[];
    $scope.periods_sales_LY=[];
    $scope.periods_volume_TY=[];
    $scope.periods_volume_LY=[];
    $scope.periods_COGS_TY=[];
    $scope.periods_COGS_LY=[];
    $scope.periods_CGM_TY=[];
    $scope.periods_CGM_LY=[];


    $scope.getCategoryDetails=function(){
        // alert('Hi');
        appService.getCategoryDetails($scope.SN,$scope.CD).then(function(response){
            $scope.productLevelData=response;
            $scope.dashboardLoading=false;

            if ($scope.productLevelData[1].Category_Access=="No")
                $location.path("/dashboard");

            $scope.Data=$scope.productLevelData[0];
            $scope.Category_Access=$scope.productLevelData[1].Category_Access;

            appService.getCategoryTFMSAuditData($scope.SN,$scope.CD).then(function(response){

                $scope.TFMS_Audit_Data=response;
            });

                appService.getCategoryPeriodSalesTYLY($scope.SN,$scope.CD).then(function(response){
                    $scope.Periodic_Sales_Cat_Data=response;
                    for (let i = 0; i < 12; i++) {
                        $scope.periods_TY.push(
                            $scope.Periodic_Sales_Cat_Data[i].Year_Period_TY.toString()
                            
                        );
                        if($scope.Periodic_Sales_Cat_Data[i].Sales_ex_VAT_TY){
                        $scope.periods_sales_TY.push(
                            Math.round(($scope.Periodic_Sales_Cat_Data[i].Sales_ex_VAT_TY))
                        );
                    }else
                    $scope.periods_sales_TY.push(0
                        );
                        if($scope.Periodic_Sales_Cat_Data[i].Sales_ex_VAT_LY){
                        $scope.periods_sales_LY.push(
                            Math.round(($scope.Periodic_Sales_Cat_Data[i].Sales_ex_VAT_LY))
                        );
                    }else
                    $scope.periods_sales_LY.push(0
                        );

                        if($scope.Periodic_Sales_Cat_Data[i].Sales_Volume_TY){
                        $scope.periods_volume_TY.push(
                            Math.round(($scope.Periodic_Sales_Cat_Data[i].Sales_Volume_TY))
                        );
                    }else
                    $scope.periods_volume_TY.push(0
                        );
                        if($scope.Periodic_Sales_Cat_Data[i].Sales_Volume_LY){
                        $scope.periods_volume_LY.push(
                            Math.round(($scope.Periodic_Sales_Cat_Data[i].Sales_Volume_LY))
                        );
                    }else
                    $scope.periods_volume_LY.push(0
                        );

                        if($scope.Periodic_Sales_Cat_Data[i].COGS_TY){
                        $scope.periods_COGS_TY.push(
                            Math.round(($scope.Periodic_Sales_Cat_Data[i].COGS_TY))
                        );
                    }else
                    $scope.periods_COGS_TY.push(0
                        );
                        if($scope.Periodic_Sales_Cat_Data[i].COGS_LY){
                        $scope.periods_COGS_LY.push(
                            Math.round(($scope.Periodic_Sales_Cat_Data[i].COGS_LY))
                        );
                    }else
                    $scope.periods_COGS_LY.push(0
                        );

                        if($scope.Periodic_Sales_Cat_Data[i].Commercial_Gross_Margin_TY){
                        $scope.periods_CGM_TY.push(
                            Math.round(($scope.Periodic_Sales_Cat_Data[i].Commercial_Gross_Margin_TY))
                        );
                    }else
                    $scope.periods_CGM_TY.push(0
                        );
                        if($scope.Periodic_Sales_Cat_Data[i].Commercial_Gross_Margin_LY){
                        $scope.periods_CGM_LY.push(
                            Math.round(($scope.Periodic_Sales_Cat_Data[i].Commercial_Gross_Margin_LY))
                        );
                    }else
                    $scope.periods_CGM_LY.push(0
                        );                    
                }
                });

            appService.getSuppliersUnderParentSupplier($scope.SN,$scope.CD).then(function(response){
                    // alert("Hi");
                    $scope.Supplier_under_Parent=response;
                    // console.log($scope.Supplier_under_Parent);
            });
            appService.getCategoryLastUpdated().then(function(response){
                    // alert("Hi");
                    $scope.last_updated=response;
                    console.log($scope.last_updated);
                    $scope.sales_last_updated=$scope.last_updated[0]['Sales_Last_Updated'];
                    $scope.compliants_last_updated=$scope.last_updated[0]['Complaints_Last_Updated'];
                    $scope.epw_last_updated=$scope.last_updated[0]['EPW_Last_Updated'];
                    $scope.CPS_last_updated=$scope.last_updated[0]['CPS_Last_Updated'];
                    $scope.service_level_last_updated=$scope.last_updated[0]['Service_Level_Last_Updated'];
                    $scope.CTS_last_updated=$scope.last_updated[0]['CTS_Last_Updated'];

                    // console.log($scope.sales_last_updated);
            });
            appService.getCategoryEpwCompSupplierNames($scope.SN,$scope.CD,$scope.BC).then(function(response){
                
                    $scope.EpwComp_SN_Data_C=response;
                    console.log(response);
                });

            appService.getCategoryLowerQuartileTPNBs($scope.SN,$scope.CD).then(function(response){
                $scope.LowerQuartileTPNBs=response;
            });

            appService.getSupplierServiceLevelDataCategory($scope.SN,$scope.CD).then(function(response){
                // console.log($scope.CD);
                $scope.SL_Percentage_Data=response;
                for (let i = 0; i < 51; i++) {
                        $scope.weeks.push(
                            $scope.SL_Percentage_Data[i].Year_Week_Number.toString()
                            
                        );
                        if($scope.SL_Percentage_Data[i].SL_Percentage){
                        $scope.pers.push(
                            Math.round(($scope.SL_Percentage_Data[i].SL_Percentage*100))
                            
                        );
                    }else
                    $scope.pers.push(
                            0
                            
                        );
                    
                }
                console.log($scope.SL_Percentage_Data_Last_Year);
                });

                appService.getSupplierServiceLevelDataCategoryLastYear($scope.SN,$scope.CD,$scope.CD).then(function(response){
                    $scope.SL_Percentage_Data_Last_Year=response;
                    
                    for (let i = 0; i < 51; i++) {
                        $scope.weeks_LY.push(
                            $scope.SL_Percentage_Data_Last_Year[i].Year_Week_Number.toString()
                            
                        );
                        if($scope.SL_Percentage_Data_Last_Year[i].SL_Percentage){
                        $scope.pers_LY.push(
                            Math.round(($scope.SL_Percentage_Data_Last_Year[i].SL_Percentage*100))
                            
                        );
                    }else
                    $scope.pers.push(
                            0
                            
                        );
                    
                }
            
                
                });


            $scope.QVIS_Supplier_Values=[$scope.Data.Quality_Rank,$scope.Data.Value_Rank,$scope.Data.Innovation_Rank,$scope.Data.Supply_Rank]
                var count=0;
                $scope.QVIS_Supplier_Values_sum=0;
                var j=0;

                for( j = 0; j <=3; j++ ){
                    
                    if($scope.QVIS_Supplier_Values[j]) {
                        // console.log($scope.QVIS_Supplier_Values[j]);
                        $scope.QVIS_Supplier_Values_sum=$scope.QVIS_Supplier_Values_sum + $scope.QVIS_Supplier_Values[j];
                        count=count+1;
                    }
                    }
            $scope.Avg_QVIS_Supplier_Values=$scope.QVIS_Supplier_Values_sum/count;

            $scope.add_remove=[
            
                        {var : "Add"},
                        {var : "Remove"}
                        
                        
                    ];
                  $scope.siteArray =
                                        [
                                            // { 'Site_Code': '', 'Site_Name': '','Supplier_Name':'','AddRemove':'','Comment':''},
                                      
                                        ];

                $scope.addRow = function () {
                    // alert('Hi');
                    if ($scope.Site_Code_Input != undefined && $scope.Comment_Input != undefined) {
                        var site = [];
                        site.Site_Code = $scope.Site_Code_Input;
                        appService.getAuditSitesData(site.Site_Code).then(function(response){
                                $scope.AuditSitesData=response;
                                site.Site_Name=$scope.AuditSitesData[0]['Site_Name'];
                                site.Supplier_Name=$scope.AuditSitesData[0]['Supplier_Name'];
                            });
                        
                        site.AddRemove=$scope.AddRemoveInput;

                        site.Comment = $scope.Comment_Input;
                        var keepGoing = true;
                        
                        
                        $scope.siteArray.push(site);

                        // CLEAR TEXTBOX.
                        $scope.Site_Code_Input = null;
                        $scope.Comment_Input = null;
                    }
        };

        
            
            $scope.addremove_Category_TFMS_Site_Details=function(value){

                angular.forEach($scope.siteArray, function (value) {
                // console.log(value);
                
                 
      
                    
                    console.log(value.Site_Code);
                    $scope.Site_Code_Table_Input=value.Site_Code.replace("&","_");
                    $scope.Site_Name_Table_Input=value.Site_Name.replace("&","_");
                    $scope.Supplier_Name_Table_Input=value.Supplier_Name.replace("&","_");
                    $scope.Action_Table_Input=value.AddRemove.replace("&","_");
                    $scope.Comment_Table_Input=value.Comment.replace("&","_");
                    // $scope.TFMS_Update_SC=supplier_details.SC.replace("&","_");
                    // $scope.TFMS_Update_PC=supplier_details.PC.replace("&","_");
                    
                    
                    console.log($scope.Comment_Table_Input);
                    // console.log($scope.TFMS_Update_PC);
                    
                    appService.addremove_Category_TFMS_Site_Details($scope.Site_Code_Table_Input,
                        $scope.Site_Name_Table_Input,$scope.Supplier_Name_Table_Input,$scope.Action_Table_Input,$scope.Comment_Table_Input).then(function(data){
                            $scope.AddRemove_Sites=data;
                            // alert("hi");
                            
                            if($scope.AddRemove_Sites!=undefined){
                            alert("Thanks for your input.Site details will be amended ");
                        }
                        else{
                            alert("Please enter Site Details details");
                        }

                        });
                    

            
                
            });
            
        };

        $scope.removeRow = function (index) {

            var name = $scope.siteArray[index].Site_Code;
    
            $scope.siteArray.splice(index, 1);
    
            // var arrSite = [];
            // angular.forEach($scope.siteArray, function (value) {
            //     if (!value.Remove) {
            //         arrSite.push(value);
            //     }
            // });
            // $scope.siteArray = arrSite;
        };

       $scope.exportdata=function(quality,value,innovation,supply,graph){
                        var blob = new Blob(
                            [
                            document.getElementById(quality).innerHTML,
                            document.getElementById(value).innerHTML,
                            document.getElementById(innovation).innerHTML,
                            document.getElementById(supply).innerHTML,
                            document.getElementById(graph).innerHTML,
                            // document.getElementById(cgm).innerHTML,
                            // document.getElementById(tpnbinlowerquartile).innerHTML,
                            // document.getElementById(servicelevel).innerHTML,
                            // document.getElementById(servicelevelbyweek).innerHTML,
                            // document.getElementById(redweeks).innerHTML,
                            // document.getElementById(summary).innerHTML,

                            ], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                        });
                        console.log(blob);
                        saveAs(blob, "QVIS.xls");
                    };

             $scope.exportpdf = function(id){
        html2canvas(document.getElementById(id), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download(id+".pdf");
            }
        });
    };



            $scope.fresh = {
                  labels : [ 'Q','V','I','S' ],
                  datasets : [
                    {
                      fillColor : 'rgba(220,220,220,0.5)',
                      strokeColor : '#00539f',
                      pointColor : 'rgba(220,220,220,1)',
                      pointStrokeColor : '#fff',
                      label:'Supplier',
                      data : [ $scope.Data.Quality_Rank,$scope.Data.Value_Rank,$scope.Data.Innovation_Rank,$scope.Data.Supply_Rank]
                    },
                    {
                      fillColor : 'rgba(151,187,205,0.5)',
                      strokeColor : '#F75752',
                      pointColor : 'rgba(151,187,205,1)',
                      pointStrokeColor : '#fff',
                      data : [ $scope.Data.Avg_Quality_Rank,$scope.Data.Avg_Value_Rank,$scope.Data.Avg_Innovation_Rank,$scope.Data.Avg_Supply_Rank]
                    }
                  ]
                };
            
            $scope.options =  {
              segmentShowStroke : true,
              segmentStrokeColor : '#fff',
              segmentStrokeWidth : 24,
              percentageInnerCutout : 50,
              animation : true,
              animationSteps : 25,
              animationEasing : 'easeOutQuart',
              animateRotate : true,
              animateScale : false,
              onAnimationComplete : null,
              scaleOverride: true,
              scaleSteps: 5,
              scaleStepWidth: 1,
              scaleStartValue: 0,
            };

        zingchart.MODULESDIR = "https://cdn.zingchart.com/modules/";
$scope.SL_Graph_Category_Director = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x4",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.weeks,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#626262"
          },
          item: {
              fontColor: "black"
          },
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.pers,
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.pers_LY,
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },
      }]
    };

        $scope.periodic_sales_Cat_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'Sales TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "M",
          'thousands-separator': ",",
          format: "£%v",
          negation: "currency"
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_sales_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_sales_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

        $scope.periodic_volume_Cat_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'Volume TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "k",
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_volume_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_volume_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

        $scope.periodic_COGS_Cat_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'COGS TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "K",
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_COGS_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_COGS_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

        $scope.periodic_CGM_Cat_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'CGM TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "K",
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_CGM_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_CGM_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

    
            zingchart.MODULESDIR = "https://cdn.zingchart.com/modules/";
  
    $scope.myJson_category = {
  type: 'radar',
  plot: {
    aspect: 'area',
    animation: {
      effect: 3,
      sequence: 1,
      speed: 700
    }
  },
  scaleV: {
    visible: false
  },
  scaleK: {
    values: '0:3:1',
    labels: ['Q','V','I','S'],
    item: {
      fontColor: '#607D8B',
      backgroundColor: "white",
      borderColor: "#aeaeae",
      borderWidth: 1,
      padding: '5 10',
      borderRadius: 10
    },
    refLine: {
      lineColor: '#c10000'
    },
    tick: {
      lineColor: '#59869c',
      lineWidth: 2,
      lineStyle: 'dotted',
      size: 20
    },
    guide: {
      lineColor: "#607D8B",
      lineStyle: 'solid',
      alpha: 0.3,
      backgroundColor: "#c5c5c5 #718eb4"
    }
  },
  series: [{
      values : [ $scope.Data.Quality_Rank,$scope.Data.Value_Rank,$scope.Data.Innovation_Rank,$scope.Data.Supply_Rank],
      text: 'farm'
    },
    {
      values: [ $scope.Data.Avg_Quality_Rank,$scope.Data.Avg_Value_Rank,$scope.Data.Avg_Innovation_Rank,$scope.Data.Avg_Supply_Rank],
      lineColor: '#53a534',
      backgroundColor: '#689F38'
    }
  ]
};








        });
    }
    $scope.updateCategoryTFMS_Supplier_Details=function(supplier_details){
      
                    console.log(supplier_details.SN);
                    console.log(supplier_details.SC);
                    // console.log(supplier_details.PC);
                    
                    $scope.TFMS_Update_SN=supplier_details.SN.replace("&","_");
                    $scope.TFMS_Update_SC=supplier_details.SC.replace("&","_");
                    // $scope.TFMS_Update_PC=supplier_details.PC.replace("&","_");
                    
                    console.log($scope.TFMS_Update_SN);
                    console.log($scope.TFMS_Update_SC);
                    // console.log($scope.TFMS_Update_PC);
                    
                    appService.updateCategoryTFMS_Supplier_Details($scope.TFMS_Update_SN,$scope.TFMS_Update_SC).then(function(data){
                            $scope.updated_TFMS_feedbackData=data;
                            
                            console.log($scope.updated_TFMS_feedbackData);
                            alert("Feedback/Commenst Updated for Supplier "+ $scope.TFMS_Update_SN);

                        });
                    

            }

        
    $scope.changeQVISDiv = function(tab) {
        $scope.view_tab = tab;
    }

    setTimeout(
    function() {
        (function() {
            [].slice.call( document.querySelectorAll( '.tabs' ) ).forEach( function( el ) {
                new CBPFWTabs( el );
            });
        })();
    }, 100);
    

    $scope.SL_Blue_Count=0;
    $scope.SL_Green_Count=0;
    $scope.SL_Amber_Count=0;
    $scope.SL_Red_Count=0;
    $scope.SL_Gray_Count=0;


    $scope.$watch('SL_Percentage_Data', function() {
        $scope.SL_Blue_Count=0;
        $scope.SL_Green_Count=0;
        $scope.SL_Amber_Count=0;
        $scope.SL_Red_Count=0;
        $scope.SL_Gray_Count=0;

        var i=0;
        if ($scope.SL_Percentage_Data!=undefined){

            for (i=0;i<=51;i++){
                value=$scope.SL_Percentage_Data[i].SL_Percentage;
                value=parseFloat(value);

                if (value>=0.985)
                    $scope.SL_Blue_Count++;
                else
                    if (value>=0.965 && value<0.985)
                        $scope.SL_Green_Count++;
                    else
                        if (value>=0.90 && value<0.965)
                            $scope.SL_Amber_Count++;
                        else
                            if (value<0.90)
                                 $scope.SL_Red_Count++;
                            else
                                 $scope.SL_Gray_Count++;

            }
            
        }

    });
    
    
    
    $scope.getNumberformat=function(number){
        return appService.getNumberformat(number);  
    }
    
    $scope.getRatingClassName=function(rating){
        return appService.getRatingClassName(rating);   
    }
    
    $scope.getOverallRatingClassName=function(rating){
        return appService.getOverallRatingClassName(rating);
    }
    
    $scope.getRedGreenClassName=function(value){
        return appService.getRedGreenClassName(value);
    }
    $scope.getTFMSScoreClassName=function(score){
        return appService.getTFMSScoreClassName(score); 
    }

    $scope.getRedGreenClassNameReverse=function(value){
        return appService.getRedGreenClassNameReverse(value);
    }

    $scope.getSLClassName=function(value){
        return appService.getSLClassName(value);
    }

}]);



app.controller("categoryDetailsControllerTFTP",["$scope","$rootScope","$http","$state","$location","$stateParams","$sessionStorage","appService",function($scope,$rootScope,$http,$state,$location,$stateParams,$sessionStorage,appService){    
    
    
    if ($sessionStorage.loggedIn==undefined)
        $location.path("login");
    
    $rootScope.hideSearchBox=true;
    $rootScope.pageTitle="Category Level Details";


    $scope.SN=$stateParams.SN;
    $scope.CD=$stateParams.CD.replace("&","_");
    $scope.Comm_D=$stateParams.Comm_D.replace("&","_");
    
    $scope.view_tab='quality';
    $scope.Access_Level=$sessionStorage.userAccessLevel;
    $scope.disableSupplierNumber=true;
    $scope.parentHeight=860;
    $scope.childHeight=800;
    $scope.dashboardLoading=true;
    $scope.weeks=[];
    $scope.pers=[];
    $scope.weeks_LY=[];
    $scope.pers_LY=[];
    $scope.periods_TY=[];
    $scope.periods_sales_TY=[];
    $scope.periods_sales_LY=[];
    $scope.periods_volume_TY=[];
    $scope.periods_volume_LY=[];
    $scope.periods_COGS_TY=[];
    $scope.periods_COGS_LY=[];
    $scope.periods_CGM_TY=[];
    $scope.periods_CGM_LY=[];


    $scope.getCategoryDetailsTFTP=function(){
    
        appService.getCategoryDetailsTFTP($scope.SN,$scope.CD,$scope.Comm_D).then(function(response){
            $scope.productLevelData=response;
            $scope.dashboardLoading=false;

            if ($scope.productLevelData[1].Category_Access=="No")
                $location.path("/dashboard");

            $scope.Data=$scope.productLevelData[0];
            $scope.Category_Access=$scope.productLevelData[1].Category_Access;

            appService.getCategoryTFMSAuditDataTFTP($scope.SN,$scope.CD).then(function(response){

                $scope.TFMS_Audit_Data=response;
            });
            appService.getSuppliersUnderParentSupplierTFTP($scope.SN,$scope.CD).then(function(response){
                    // alert("Hi");
                    $scope.Supplier_under_Parent=response;
                    // console.log($scope.Supplier_under_Parent);
            });

                appService.getCategoryPeriodSalesTYLY_TFTP($scope.SN,$scope.CD,$scope.Comm_D).then(function(response){
                    $scope.Periodic_Sales_Cat_TFTP_Data=response;
                    for (let i = 0; i < 12; i++) {
                        $scope.periods_TY.push(
                            $scope.Periodic_Sales_Cat_TFTP_Data[i].Year_Period_TY.toString()
                            
                        );
                        if($scope.Periodic_Sales_Cat_TFTP_Data[i].Sales_ex_VAT_TY){
                        $scope.periods_sales_TY.push(
                            Math.round(($scope.Periodic_Sales_Cat_TFTP_Data[i].Sales_ex_VAT_TY))
                        );
                    }else
                    $scope.periods_sales_TY.push(0
                        );
                        if($scope.Periodic_Sales_Cat_TFTP_Data[i].Sales_ex_VAT_LY){
                        $scope.periods_sales_LY.push(
                            Math.round(($scope.Periodic_Sales_Cat_TFTP_Data[i].Sales_ex_VAT_LY))
                        );
                    }else
                    $scope.periods_sales_LY.push(0
                        );

                        if($scope.Periodic_Sales_Cat_TFTP_Data[i].Sales_Volume_TY){
                        $scope.periods_volume_TY.push(
                            Math.round(($scope.Periodic_Sales_Cat_TFTP_Data[i].Sales_Volume_TY))
                        );
                    }else
                    $scope.periods_volume_TY.push(0
                        );
                        if($scope.Periodic_Sales_Cat_TFTP_Data[i].Sales_Volume_LY){
                        $scope.periods_volume_LY.push(
                            Math.round(($scope.Periodic_Sales_Cat_TFTP_Data[i].Sales_Volume_LY))
                        );
                    }else
                    $scope.periods_volume_LY.push(0
                        );

                        if($scope.Periodic_Sales_Cat_TFTP_Data[i].COGS_TY){
                        $scope.periods_COGS_TY.push(
                            Math.round(($scope.Periodic_Sales_Cat_TFTP_Data[i].COGS_TY))
                        );
                    }else
                    $scope.periods_COGS_TY.push(0
                        );
                        if($scope.Periodic_Sales_Cat_TFTP_Data[i].COGS_LY){
                        $scope.periods_COGS_LY.push(
                            Math.round(($scope.Periodic_Sales_Cat_TFTP_Data[i].COGS_LY))
                        );
                    }else
                    $scope.periods_COGS_LY.push(0
                        );

                        if($scope.Periodic_Sales_Cat_TFTP_Data[i].Commercial_Gross_Margin_TY){
                        $scope.periods_CGM_TY.push(
                            Math.round(($scope.Periodic_Sales_Cat_TFTP_Data[i].Commercial_Gross_Margin_TY))
                        );
                    }else
                    $scope.periods_CGM_TY.push(0
                        );
                        if($scope.Periodic_Sales_Cat_TFTP_Data[i].Commercial_Gross_Margin_LY){
                        $scope.periods_CGM_LY.push(
                            Math.round(($scope.Periodic_Sales_Cat_TFTP_Data[i].Commercial_Gross_Margin_LY))
                        );
                    }else
                    $scope.periods_CGM_LY.push(0
                        );                    
                }
                });

            appService.getCategoryLastUpdated().then(function(response){
                    // alert("Hi");
                    $scope.last_updated=response;
                    console.log($scope.last_updated);
                    $scope.sales_last_updated=$scope.last_updated[0]['Sales_Last_Updated'];
                    $scope.compliants_last_updated=$scope.last_updated[0]['Complaints_Last_Updated'];
                    $scope.epw_last_updated=$scope.last_updated[0]['EPW_Last_Updated'];
                    $scope.CPS_last_updated=$scope.last_updated[0]['CPS_Last_Updated'];
                    $scope.service_level_last_updated=$scope.last_updated[0]['Service_Level_Last_Updated'];
                    $scope.CTS_last_updated=$scope.last_updated[0]['CTS_Last_Updated'];

                    // console.log($scope.sales_last_updated);
            });
            appService.getCategoryEpwCompSupplierNamesTFTP($scope.SN,$scope.CD).then(function(response){
                
                    $scope.EpwComp_SN_Data_C=response;
                    console.log(response);
                });

            appService.getCategoryLowerQuartileTPNBsTFTP($scope.SN,$scope.CD).then(function(response){
                $scope.LowerQuartileTPNBs=response;
            });

            appService.getSupplierServiceLevelDataCategoryTFTP($scope.SN,$scope.CD).then(function(response){
                // console.log($scope.CD);
                $scope.SL_Percentage_Data=response;
                for (let i = 0; i < 51; i++) {
                        $scope.weeks.push(
                            $scope.SL_Percentage_Data[i].Year_Week_Number.toString()
                            
                        );
                        if($scope.SL_Percentage_Data[i].SL_Percentage){
                        $scope.pers.push(
                            Math.round(($scope.SL_Percentage_Data[i].SL_Percentage*100))
                            
                        );
                    }else
                    $scope.pers.push(
                            0
                            
                        );
                    
                }
                console.log($scope.SL_Percentage_Data_Last_Year);
                });

                appService.getSupplierServiceLevelDataCategoryTFTPLastYear($scope.SN,$scope.CD).then(function(response){
                    $scope.SL_Percentage_Data_Last_Year=response;
                    
                    for (let i = 0; i < 51; i++) {
                        $scope.weeks_LY.push(
                            $scope.SL_Percentage_Data_Last_Year[i].Year_Week_Number.toString()
                            
                        );
                        if($scope.SL_Percentage_Data_Last_Year[i].SL_Percentage){
                        $scope.pers_LY.push(
                            Math.round(($scope.SL_Percentage_Data_Last_Year[i].SL_Percentage*100))
                            
                        );
                    }else
                    $scope.pers.push(
                            0
                            
                        );
                    
                }
            console.log($scope.SL_Percentage_Data_Last_Year);
                
                });

            $scope.QVIS_Supplier_Values=[$scope.Data.Quality_Rank,$scope.Data.Value_Rank,$scope.Data.Innovation_Rank,$scope.Data.Supply_Rank]
                var count=0;
                $scope.QVIS_Supplier_Values_sum=0;
                var j=0;

                for( j = 0; j <=3; j++ ){
                    
                    if($scope.QVIS_Supplier_Values[j]) {
                        // console.log($scope.QVIS_Supplier_Values[j]);
                        $scope.QVIS_Supplier_Values_sum=$scope.QVIS_Supplier_Values_sum + $scope.QVIS_Supplier_Values[j];
                        count=count+1;
                    }
                    }
            $scope.Avg_QVIS_Supplier_Values=$scope.QVIS_Supplier_Values_sum/count;

            $scope.add_remove=[
            
                        {var : "Add"},
                        {var : "Remove"}
                        
                        
                    ];
                  $scope.siteArray =
                                        [
                                            // { 'Site_Code': '', 'Site_Name': '','Supplier_Name':'','AddRemove':'','Comment':''},
                                      
                                        ];

                $scope.addRow = function () {
                    // alert('Hi');
                    if ($scope.Site_Code_Input != undefined && $scope.Comment_Input != undefined) {
                        var site = [];
                        site.Site_Code = $scope.Site_Code_Input;
                        appService.getAuditSitesData(site.Site_Code).then(function(response){
                                $scope.AuditSitesData=response;
                                site.Site_Name=$scope.AuditSitesData[0]['Site_Name'];
                                site.Supplier_Name=$scope.AuditSitesData[0]['Supplier_Name'];
                            });
                        
                        site.AddRemove=$scope.AddRemoveInput;

                        site.Comment = $scope.Comment_Input;
                        var keepGoing = true;
                        
                        
                        $scope.siteArray.push(site);

                        // CLEAR TEXTBOX.
                        $scope.Site_Code_Input = null;
                        $scope.Comment_Input = null;
                    }
        };

        
            
            $scope.addremove_Category_TFMS_Site_Details=function(value){

                angular.forEach($scope.siteArray, function (value) {
                // console.log(value);
                
                 
      
                    
                    console.log(value.Site_Code);
                    $scope.Site_Code_Table_Input=value.Site_Code.replace("&","_");
                    $scope.Site_Name_Table_Input=value.Site_Name.replace("&","_");
                    $scope.Supplier_Name_Table_Input=value.Supplier_Name.replace("&","_");
                    $scope.Action_Table_Input=value.AddRemove.replace("&","_");
                    $scope.Comment_Table_Input=value.Comment.replace("&","_");
                    // $scope.TFMS_Update_SC=supplier_details.SC.replace("&","_");
                    // $scope.TFMS_Update_PC=supplier_details.PC.replace("&","_");
                    
                    
                    console.log($scope.Comment_Table_Input);
                    // console.log($scope.TFMS_Update_PC);
                    
                    appService.addremove_Category_TFMS_Site_Details($scope.Site_Code_Table_Input,
                        $scope.Site_Name_Table_Input,$scope.Supplier_Name_Table_Input,$scope.Action_Table_Input,$scope.Comment_Table_Input).then(function(data){
                            $scope.AddRemove_Sites=data;
                            // alert("hi");
                            
                            if($scope.AddRemove_Sites!=undefined){
                            alert("Thanks for your input.Site details will be amended ");
                        }
                        else{
                            alert("Please enter Site Details details");
                        }

                        });
                    

            
                
            });
            
        };

        $scope.removeRow = function (index) {

            var name = $scope.siteArray[index].Site_Code;
    
            $scope.siteArray.splice(index, 1);
    
            // var arrSite = [];
            // angular.forEach($scope.siteArray, function (value) {
            //     if (!value.Remove) {
            //         arrSite.push(value);
            //     }
            // });
            // $scope.siteArray = arrSite;
        };

        
        $scope.exportdata=function(quality,value,innovation,supply,graph){
                        var blob = new Blob(
                            [
                            document.getElementById(quality).innerHTML,
                            document.getElementById(value).innerHTML,
                            document.getElementById(innovation).innerHTML,
                            document.getElementById(supply).innerHTML,
                            document.getElementById(graph).innerHTML,
                            // document.getElementById(cgm).innerHTML,
                            // document.getElementById(tpnbinlowerquartile).innerHTML,
                            // document.getElementById(servicelevel).innerHTML,
                            // document.getElementById(servicelevelbyweek).innerHTML,
                            // document.getElementById(redweeks).innerHTML,
                            // document.getElementById(summary).innerHTML,

                            ], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                        });
                        console.log(blob);
                        saveAs(blob, "QVIS.xls");
                    };

             $scope.exportpdf = function(id){
        html2canvas(document.getElementById(id), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download(id+".pdf");
            }
        });
    };



            $scope.fresh = {
                  labels : [ 'Q','V','I','S' ],
                  datasets : [
                    {
                      fillColor : 'rgba(220,220,220,0.5)',
                      strokeColor : '#00539f',
                      pointColor : 'rgba(220,220,220,1)',
                      pointStrokeColor : '#fff',
                      label:'Supplier',
                      data : [ $scope.Data.Quality_Rank,$scope.Data.Value_Rank,$scope.Data.Innovation_Rank,$scope.Data.Supply_Rank]
                    },
                    {
                      fillColor : 'rgba(151,187,205,0.5)',
                      strokeColor : '#F75752',
                      pointColor : 'rgba(151,187,205,1)',
                      pointStrokeColor : '#fff',
                      data : [ $scope.Data.Avg_Quality_Rank,$scope.Data.Avg_Value_Rank,$scope.Data.Avg_Innovation_Rank,$scope.Data.Avg_Supply_Rank]
                    }
                  ]
                };
            
            $scope.options =  {
              segmentShowStroke : true,
              segmentStrokeColor : '#fff',
              segmentStrokeWidth : 24,
              percentageInnerCutout : 50,
              animation : true,
              animationSteps : 25,
              animationEasing : 'easeOutQuart',
              animateRotate : true,
              animateScale : false,
              onAnimationComplete : null,
              scaleOverride: true,
              scaleSteps: 5,
              scaleStepWidth: 1,
              scaleStartValue: 0,
            };
    zingchart.MODULESDIR = "https://cdn.zingchart.com/modules/";
$scope.SL_Graph_Category_TFTP = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x4",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.weeks,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#626262"
          },
          item: {
              fontColor: "black"
          },
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.pers,
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.pers_LY,
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },
      }]
    };

        $scope.periodic_sales_Cat_TFTP_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'Sales TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "M",
          'thousands-separator': ",",
          format: "£%v",
          negation: "currency"
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_sales_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_sales_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

        $scope.periodic_volume_Cat_TFTP_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'Volume TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "k",
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_volume_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_volume_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

        $scope.periodic_COGS_Cat_TFTP_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'COGS TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "K",
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_COGS_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_COGS_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

        $scope.periodic_CGM_Cat_TFTP_graph = {
      gui: {
        contextMenu: {
          button: {
            visible: 0
          }
        }
      },
      title: {
      text: 'CGM TY_LY Periodic Comparision',
      fontSize: 20,
      color: "#434343"
    },
      backgroundColor: "#fff",
      globals: {
          shadow: false,
          fontFamily: "Helvetica"
      },
      type: "area",

      legend: {
          layout: "x2",
          backgroundColor: "transparent",
          borderColor: "transparent",
          marker: {
              borderRadius: "50px",
              borderColor: "transparent"
          },
          item: {
              fontColor: "#000"
          }

      },
      scaleX: {
          maxItems: 52,
          transform: {
              type: 'text'
          },
          zooming: true,
          values: $scope.periods_TY,
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          item: {
              fontColor: "black"
          },
          guide: {
              visible: false
          }
      },
      scaleY: {
          lineColor: "black",
          lineWidth: "1px",
          tick: {
              lineColor: "black",
              lineWidth: "1px"
          },
          guide: {
              lineStyle: "solid",
              lineColor: "#d3d3d3"
          },
          item: {
              fontColor: "black"
          },
          short: true,
          'short-unit': "K",
      },
      tooltip: {
          visible: false
      },
      crosshairX: {
          scaleLabel: {
              backgroundColor: "#fff",
              fontColor: "black"
          },
          plotLabel: {
              backgroundColor: "#434343",
              fontColor: "#FFF",
              _text: "Number of hits : %v"
          }
      },
      plot: {
          lineWidth: "2px",
          aspect: "spline",
          marker: {
              visible: false
          }
      },
      series: [{
          text: "This Year",
          values: $scope.periods_CGM_TY,
          'thousands-separator': ", ",
          backgroundColor1: "#77d9f8",
          backgroundColor2: "#272822",
          lineColor: "#00539f",
          "legend-marker": {
            "background-color": "#00539f"
          },
      }, {
          text: "Last Year",
          values: $scope.periods_CGM_LY,
          'thousands-separator': ", ",
          backgroundColor1: "#4AD8CC",
          backgroundColor2: "#272822",
          lineColor: "red",
          "legend-marker": {
            "background-color": "red"
          },          
      }]
    };

    
            zingchart.MODULESDIR = "https://cdn.zingchart.com/modules/";
  
    $scope.myJson_category_TFTP = {
  type: 'radar',
  plot: {
    aspect: 'area',
    animation: {
      effect: 3,
      sequence: 1,
      speed: 700
    }
  },
  scaleV: {
    visible: false
  },
  scaleK: {
    values: '0:3:1',
    labels: ['Q','V','I','S'],
    item: {
      fontColor: '#607D8B',
      backgroundColor: "white",
      borderColor: "#aeaeae",
      borderWidth: 1,
      padding: '5 10',
      borderRadius: 10
    },
    refLine: {
      lineColor: '#c10000'
    },
    tick: {
      lineColor: '#59869c',
      lineWidth: 2,
      lineStyle: 'dotted',
      size: 20
    },
    guide: {
      lineColor: "#607D8B",
      lineStyle: 'solid',
      alpha: 0.3,
      backgroundColor: "#c5c5c5 #718eb4"
    }
  },
  series: [{
      values : [ $scope.Data.Quality_Rank,$scope.Data.Value_Rank,$scope.Data.Innovation_Rank,$scope.Data.Supply_Rank],
      text: 'farm'
    },
    {
      values: [ $scope.Data.Avg_Quality_Rank,$scope.Data.Avg_Value_Rank,$scope.Data.Avg_Innovation_Rank,$scope.Data.Avg_Supply_Rank],
      lineColor: '#53a534',
      backgroundColor: '#689F38'
    }
  ]
};








        });
    }
    $scope.updateCategoryTFMS_Supplier_Details=function(supplier_details){
      
                    console.log(supplier_details.SN);
                    console.log(supplier_details.SC);
                    // console.log(supplier_details.PC);
                    
                    $scope.TFMS_Update_SN=supplier_details.SN.replace("&","_");
                    $scope.TFMS_Update_SC=supplier_details.SC.replace("&","_");
                    // $scope.TFMS_Update_PC=supplier_details.PC.replace("&","_");
                    
                    console.log($scope.TFMS_Update_SN);
                    console.log($scope.TFMS_Update_SC);
                    // console.log($scope.TFMS_Update_PC);
                    
                    appService.updateCategoryTFMS_Supplier_Details($scope.TFMS_Update_SN,$scope.TFMS_Update_SC).then(function(data){
                            $scope.updated_TFMS_feedbackData=data;
                            
                            console.log($scope.updated_TFMS_feedbackData);
                            alert("Feedback/Commenst Updated for Supplier "+ $scope.TFMS_Update_SN);

                        });
                    

            }

        
    $scope.changeQVISDiv = function(tab) {
        $scope.view_tab = tab;
    }

    setTimeout(
    function() {
        (function() {
            [].slice.call( document.querySelectorAll( '.tabs' ) ).forEach( function( el ) {
                new CBPFWTabs( el );
            });
        })();
    }, 100);
    

    $scope.SL_Blue_Count=0;
    $scope.SL_Green_Count=0;
    $scope.SL_Amber_Count=0;
    $scope.SL_Red_Count=0;
    $scope.SL_Gray_Count=0;


    $scope.$watch('SL_Percentage_Data', function() {
        $scope.SL_Blue_Count=0;
        $scope.SL_Green_Count=0;
        $scope.SL_Amber_Count=0;
        $scope.SL_Red_Count=0;
        $scope.SL_Gray_Count=0;

        var i=0;
        if ($scope.SL_Percentage_Data!=undefined){

            for (i=0;i<=51;i++){
                value=$scope.SL_Percentage_Data[i].SL_Percentage;
                value=parseFloat(value);

                if (value>=0.985)
                    $scope.SL_Blue_Count++;
                else
                    if (value>=0.965 && value<0.985)
                        $scope.SL_Green_Count++;
                    else
                        if (value>=0.90 && value<0.965)
                            $scope.SL_Amber_Count++;
                        else
                            if (value<0.90)
                                 $scope.SL_Red_Count++;
                            else
                                 $scope.SL_Gray_Count++;

            }
            
        }

    });
    
    
    
    $scope.getNumberformat=function(number){
        return appService.getNumberformat(number);  
    }
    
    $scope.getRatingClassName=function(rating){
        return appService.getRatingClassName(rating);   
    }
    
    $scope.getOverallRatingClassName=function(rating){
        return appService.getOverallRatingClassName(rating);
    }
    
    $scope.getRedGreenClassName=function(value){
        return appService.getRedGreenClassName(value);
    }
    $scope.getTFMSScoreClassName=function(score){
        return appService.getTFMSScoreClassName(score); 
    }

    $scope.getRedGreenClassNameReverse=function(value){
        return appService.getRedGreenClassNameReverse(value);
    }

    $scope.getSLClassName=function(value){
        return appService.getSLClassName(value);
    }

}]);





app.controller("headerController",["$scope","$rootScope","$sessionStorage","$state","$location","appService",function($scope,$rootScope,$sessionStorage,$state,$location,appService){   
    
    if ($sessionStorage.userName==undefined)
        $scope.user_name="";
    else{
        if ($sessionStorage.userName.length>18)
            $scope.user_short_name=$sessionStorage.userName.substring(0,18)+"...";
        else
            $scope.user_short_name=$sessionStorage.userName;
    }
    $scope.access_level=$sessionStorage.userAccessLevel;
    
    $scope.clearSessionStorage=function(){
        appService.clearSessionStorage();
        window.location.reload();
    }

    setTimeout(function() {
            $scope.searchBoxValueChange=function(){
                $rootScope.getFinalRating("searchBox");
            }
    }, 3000);

    /*$scope.searchBoxValueChange=function(){
        //alert("called 2");
        $rootScope.getFinalRating();

    }*/
    
}]);



app.controller("addNewUserController",["$scope","$rootScope","$location","$sessionStorage","$timeout","$state","appService",function($scope,$rootScope,$location,$sessionStorage,$timeout,$state,appService) {
    
    if ($sessionStorage.loggedIn==undefined)
        $location.path("login");
    
    if ($sessionStorage.userAccessLevel!='admin')
        $location.path("dashboard");
    
    
    $rootScope.hideSearchBox=true;
    $rootScope.pageTitle="Add New User";
    $scope.newUserGeography=$sessionStorage.userGeography;
    $scope.newUserMasterAccess="NO";
    $scope.newUserAccessLevel="user";
    $scope.newUserMasterCategory="NA";
    $scope.atleastOneSelected="Yes";
    
    if ($scope.newUserGeography!='UK')
        $scope.newUserMasterCategory="Grocery";
    
    $scope.userAccessLevel=false;
    $scope.checkedAll=true;
    $scope.disableMasterAccess=true;
    $scope.categoriesLoading=true;
    
    $scope.successDiv=false;
    $scope.errorDiv=false;
    
    
    $scope.disableCategories=function(){
        if ($scope.newUserAccessLevel=='user' || $scope.newUserAccessLevel=='super_user')
            $scope.userAccessLevel=false;
        else{
            $scope.userAccessLevel=true;
            $scope.checkedAll=false;
            $scope.selectAllCategories();
        }
        
        
        //Manage Master Access Level
        if ($scope.newUserAccessLevel=='user'){
            $scope.newUserMasterAccess="NO";
            $scope.disableMasterAccess=true;
            
        }
        else{
            if ($scope.newUserAccessLevel=='super_user'){
                $scope.newUserMasterAccess="NO";
                $scope.disableMasterAccess=false;
            }
            else{
                
                $scope.newUserMasterAccess="YES";
                $scope.disableMasterAccess=true;
            }
        }
        
        if ($scope.newUserGeography=='UK' || $scope.newUserAccessLevel=='admin')
            $scope.newUserMasterCategory="NA";
        else
            $scope.newUserMasterCategory="Grocery";
        
        $scope.getAllCategoriesForNewUser();
            
    }
    
    
    $scope.getAllCategoriesForNewUser=function(){
        $scope.categoriesLoading=true;
        appService.getAllCategoriesForNewUser($scope.newUserMasterCategory).then(function(data){
            $scope.categoryData=data;
            $scope.checkedAll=true;
            $scope.atleastOneSelected="Yes";
            
            for(var i = 0; i < $scope.categoryData.length; i++)
                $scope.categoryData[i].Selected =true;
            $scope.noSelectedItems=$scope.categoryData.length;
        
            $scope.categoriesLoading=false;
        });
    }
    
    $scope.selectAllCategories=function(){
        if ($scope.checkedAll==false){
            for(var i = 0; i < $scope.categoryData.length; i++)
                $scope.categoryData[i].Selected = true;
            $scope.checkedAll=true;
        }
        else{
            for(var i = 0; i < $scope.categoryData.length; i++)
                $scope.categoryData[i].Selected = false;
            $scope.checkedAll=false;
        }
        $scope.checkAtleastOneCategoryChecked();
    }
    
    $scope.checkAtleastOneCategoryChecked=function(){
        
        var no = 0;    
        for(var i = 0; i < $scope.categoryData.length; i++) {
            if($scope.categoryData[i].Selected == true){
                no++;
            }
        }
        $scope.noSelectedItems = no;
        if ($scope.noSelectedItems==$scope.categoryData.length){
            $scope.checkedAll=true;
            $scope.atleastOneSelected="Yes";
        }
        else{
            if ($scope.noSelectedItems==0){
                $scope.checkedAll=false;
                $scope.atleastOneSelected="";
            }
            else{
                if ($scope.noSelectedItems>0){
                    $scope.checkedAll=false;
                    $scope.atleastOneSelected="Yes";
                }
            }   
        }
    }
    
    
    $scope.submitNewUserFormData=function(){
        
        $scope.selectedCategories=[];
        var selectedCounter=0;
        for(var i = 0; i < $scope.categoryData.length; i++) {
            if($scope.categoryData[i].Selected == true){
                $scope.selectedCategories.push($scope.categoryData[i].Category);
                selectedCounter=selectedCounter+1;
            }
        }
        
        if ($scope.newUserUserId!=undefined && $scope.newUserUserName!=undefined && $scope.newUserPassword!=undefined && $scope.newUserConfirmPassword!=undefined && selectedCounter>0){
            var userInfo={userGeography:$scope.newUserGeography,userId:$scope.newUserUserId,userName:$scope.newUserUserName,accessLevel:$scope.newUserAccessLevel,masterAccess:$scope.newUserMasterAccess,passwd:$scope.newUserPassword,confPasswd:$scope.newUserConfirmPassword,masterCategory:$scope.newUserMasterCategory,categories:$scope.selectedCategories};
            appService.submitNewUserFormData(userInfo).then(function(data){
                
                if (data.errorFlag==true){
                    $scope.successDiv=false;
                    $scope.errorDiv=true;
                    $scope.errorMessage=data.errorMessage;
                     $timeout(function() {
                         $scope.successDiv = false;
                         $scope.errorDiv=false;
                     }, 3000);
                }
                else{
                    $scope.errorDiv=false;
                    $scope.successDiv = true;
                    
                    $timeout(function() {
                        $state.reload();
                     }, 3000);
                }
            });
        }
    }
}]);


app.controller("usersListController",["$scope","$rootScope","$http","$location","$sessionStorage","$timeout","appService",function($scope,$rootScope,$http,$location,$sessionStorage,$timeout,appService){
    
    if ($sessionStorage.loggedIn==undefined)
        $location.path("login");
    
    if ($sessionStorage.userAccessLevel!='admin')
        $location.path("dashboard");
    
    $rootScope.hideSearchBox=true;
    $rootScope.pageTitle="List of Users";
    
    $scope.userID=$sessionStorage.userID;
    $scope.Geography=$sessionStorage.userGeography;
    $scope.atleastOneSelected="Yes";
    
    $scope.disableMasterAccess=true;
    $scope.checkedAll=false;
    $scope.successDiv=false;
    $scope.errorDiv=false;
    $scope.categoriesLoading=true;
    $scope.userListLoading=true;
    $scope.disableAccessLevel=true;
    
    
    $scope.getUsersList=function(){
        $scope.userListLoading=true;
        appService.getUserList().then(function(data){
            $scope.userList=data;
            $scope.userListLoading=false;
            appService.getUserDetails($scope.userList[0].User_Id).then(function(data){
                $scope.userDetails=data[0];
                if ($scope.userDetails.Access_Level=='super_user')
                    $scope.disableMasterAccess=false;
                else
                    $scope.disableMasterAccess=true;
                
                if ($scope.userDetails.Access_Level=='user' || $scope.userDetails.Access_Level=='super_user')
                    $scope.disableAccessLevel=false;
                else
                    $scope.disableAccessLevel=true;
                
                $scope.orgMasterCategory=$scope.userDetails.Master_Category;
                $scope.assignedCategories=data[1];
                $scope.getAllCategories();
            });
        });
    }
    
    
    $scope.getUserDetails=function(ID){
        appService.getUserDetails(ID).then(function(data){
            $scope.userDetails=data[0];
            if ($scope.userDetails.Access_Level=='super_user')
                $scope.disableMasterAccess=false;
            else
                $scope.disableMasterAccess=true;
            
            if ($scope.userDetails.Access_Level=='user' || $scope.userDetails.Access_Level=='super_user')
                $scope.disableAccessLevel=false;
            else
                $scope.disableAccessLevel=true;
            
            $scope.orgMasterCategory=$scope.userDetails.Master_Category;
            $scope.assignedCategories=data[1];
            $scope.getAllCategories();
        });
    }
    
    $scope.deleteUserId=function(UID){
        var x=confirm("Are you sure you want to delete "+UID+"? Click Ok to continue");
        if (x==true){
            appService.deleteUserId(UID).then(function(data){
                
                if (data.errorFlag==true)
                    alert(data.errorMessage);
                else{
                    alert("ID - "+UID+" successfully deleted from user access list");
                    $scope.getUsersList();
                }
                
            });
        }
    }
    
    $scope.getAllCategories=function(){ 
        $scope.categoriesLoading=true;
        appService.getAllCategoriesForNewUser($scope.userDetails.Master_Category).then(function(data){
            $scope.categoryData=data;
            $scope.checkedAll=false;
            $scope.atleastOneSelected="Yes";
            
            if ($scope.assignedCategories.length>0 && $scope.userDetails.Access_Level!="admin"){
                $scope.userAccessLevel=false;
                $counter=0;
                for(var i = 0; i < $scope.categoryData.length; i++){
                    $matchFlag=false;
                    for(var j = 0; j < $scope.assignedCategories.length; j++){
                        if ($scope.categoryData[i].Category==$scope.assignedCategories[j].Category){
                            $scope.categoryData[i].Selected =true;
                            $counter=$counter+1;
                            $matchFlag=true;
                            break;
                        }
                    }
                    if ($matchFlag==false)
                        $scope.categoryData[i].Selected =false;
                }
                $scope.noSelectedItems=$counter;
                
                if ($counter==$scope.categoryData.length)
                    $scope.checkedAll=true;
                else
                    if ($counter==0)
                        $scope.atleastOneSelected="";
                
            }
            else{
                if ($scope.userDetails.Access_Level=='user' || $scope.userDetails.Access_Level=='super_user')
                    $scope.userAccessLevel=false;
                else
                    $scope.userAccessLevel=true;
                            
                $scope.selectAllCategories();
            }
            $scope.categoriesLoading=false;
        }); 
    }
    
    
    $scope.selectAllCategories=function(){
        if ($scope.checkedAll==false){
            for(var i = 0; i < $scope.categoryData.length; i++)
                $scope.categoryData[i].Selected = true;
            $scope.checkedAll=true;
            $scope.atleastOneSelected="Yes";
        }
        else{
            for(var i = 0; i < $scope.categoryData.length; i++)
                $scope.categoryData[i].Selected = false;
            $scope.checkedAll=false;
            $scope.atleastOneSelected="";
        }
    }
    
    $scope.checkAtleastOneCategoryChecked=function(){
    
        var no = 0;    
        for(var i = 0; i < $scope.categoryData.length; i++) {
            if($scope.categoryData[i].Selected == true){
                no++;
            }
        }
        $scope.noSelectedItems = no;
        if ($scope.noSelectedItems==$scope.categoryData.length){
            $scope.checkedAll=true;
            $scope.atleastOneSelected="Yes";
        }
        else{
            if ($scope.noSelectedItems==0){
                $scope.checkedAll=false;
                $scope.atleastOneSelected="";
            }
            else{
                if ($scope.noSelectedItems>0){
                    $scope.atleastOneSelected="Yes";
                    $scope.checkedAll=false;
                }
                    
            }   
        }
    }
    
    
    $scope.disableCategories=function(){
        
        if ($scope.userDetails.Access_Level=='user' || $scope.userDetails.Access_Level=='super_user'){
            if ($scope.userDetails.Access_Level=='user')
                $scope.disableMasterAccess=true;
            else
                $scope.disableMasterAccess=false;
                    
            $scope.userAccessLevel=false;
            $scope.userDetails.Master_Access="NO";
        }
        else{   
            $scope.disableMasterAccess=true;
            $scope.userAccessLevel=true;
            $scope.userDetails.Master_Access="YES";
        }
        
        if ($scope.userDetails.Geography=='UK' || $scope.userDetails.Access_Level=='admin')
            $scope.userDetails.Master_Category="NA";
        else{
            if ($scope.orgMasterCategory=="NA")
                $scope.userDetails.Master_Category="Grocery";
            else
                $scope.userDetails.Master_Category=$scope.orgMasterCategory;
        }
        
        $scope.getAllCategories();
    }
    
    
    $scope.submitEditUserFormData=function(){
        
        $scope.selectedCategories=[];
        var selectedCounter=0;
          
        for(var i = 0; i < $scope.categoryData.length; i++) {
            if($scope.categoryData[i].Selected == true){
                $scope.selectedCategories.push($scope.categoryData[i].Category);
                selectedCounter=selectedCounter+1;
            }
        }
        
        if ($scope.userDetails.User_Name!=undefined && $scope.userDetails.Passwd!=undefined  && selectedCounter>0){
            
            var updatedInfo={userId:$scope.userDetails.User_Id,userGeography:$scope.userDetails.Geography,accessLevel:$scope.userDetails.Access_Level,userName:$scope.userDetails.User_Name,passwd:$scope.userDetails.Passwd,masterAccess:$scope.userDetails.Master_Access,masterCategory:$scope.userDetails.Master_Category,categories:$scope.selectedCategories};
            appService.submitEditUserFormData(updatedInfo).then(function(data){
                
                if (data.errorFlag==true){
                    $scope.successDiv=false;
                    $scope.errorDiv=true;
                    $scope.errorMessage=data.errorMessage;
                     $timeout(function() {
                         $scope.successDiv = false;
                         $scope.errorDiv=false;
                     }, 5000);
                }
                else{
                    $scope.errorDiv=false;
                    $scope.successDiv = true;
                    
                    $timeout(function() {
                        $scope.successDiv = false;
                     }, 5000);
                }
                
            });
        }
    }
    
}]);



app.controller("resetPasswordController",["$scope","$rootScope","$location","$sessionStorage","$timeout","$state","appService",function($scope,$rootScope,$location,$sessionStorage,$timeout,$state,appService) {
    
    if ($sessionStorage.loggedIn==undefined)
        $location.path("login");
    
    $rootScope.hideSearchBox=true;
    $rootScope.pageTitle="Reset Password";  
    $scope.UserId=$sessionStorage.userID;
    
    $scope.submiResetPasswordFormData=function(){
        if ($scope.oldPassword!=undefined && $scope.newPassword!=undefined && $scope.newConfirmPassword!=undefined){
            
            var resetFormData={userId:$scope.UserId,oldPasswd:$scope.oldPassword,newPasswd:$scope.newPassword,confPasswd:$scope.newConfirmPassword};
            appService.submiResetPasswordFormData(resetFormData).then(function(data){   
            
                if (data.errorFlag==true){
                    $scope.successDiv=false;
                    $scope.errorDiv=true;
                    $scope.errorMessage=data.errorMessage;
                    $timeout(function() {
                         $scope.successDiv = false;
                         $scope.errorDiv=false;
                     }, 5000);
                     
                }
                else{
                    $scope.errorDiv=false;
                    $scope.successDiv = true;
                    $timeout(function() {
                        appService.clearSessionStorage();
                        $rootScope.hideSearchBox=true;
                        window.location.reload();
                        //$location.path("login");
                     }, 5000);
                }
            });
        }
    }
}]);

app.controller("addNewLineController",["$scope","$rootScope","$location","$sessionStorage","$timeout","$state","appService",function($scope,$rootScope,$location,$sessionStorage,$timeout,$state,appService) {
    
    if ($sessionStorage.loggedIn==undefined)
        $location.path("login");
    
    $rootScope.hideSearchBox=true;
    $rootScope.pageTitle="Add New Line";
    $scope.successDiv=false;
    $scope.errorDiv=false;
    $scope.disableMasterCategory=true;
    
    if ($sessionStorage.userGeography=='UK')
        MC="NA";
    else{
        if ($sessionStorage.userAccessLevel=='admin'){
            $scope.disableMasterCategory=false;
            MC="Grocery";
        }
        else{
            $scope.disableMasterCategory=true;
            MC=$sessionStorage.userMasterCategory;
        }
    }
    
    $scope.newLine={UserID:$sessionStorage.userID,Geography:$sessionStorage.userGeography,TYSales:0,YOYChanges:0,TYVolume:0,TYMargin:0,MasterCategory:MC,Category:"",SCRating:1,TechRating:2,NPDRating:3,BuyingRating:4,SupplierNumber:"",SupplierName:"",ProductSupplied:"NA",FutureCapability:"NA",SupplierCategorization:"NA",SCTTL:"NA",juniorBuyer:"New",NOSites:0,Comments:""};
    $scope.getUserAssignedCategories=function(){
        appService.getUserAssignedCategories($scope.newLine.MasterCategory).then(function(data){
            $scope.assignedCategories=data;
        });
    }
    
    $scope.submitNewLineFormData=function(){
        if ($scope.newLine.MasterCategory!=undefined && $scope.newLine.Category!=undefined && $scope.newLine.SCRating!=undefined && $scope.newLine.TechRating!=undefined && $scope.newLine.NPDRating!=undefined && $scope.newLine.BuyingRating!=undefined && $scope.newLine.SupplierName!=undefined && $scope.newLine.NOSites!=undefined){
            appService.submitNewLineFormData($scope.newLine).then(function(data){
                if (data.errorFlag==true){
                    $scope.successDiv=false;
                    $scope.errorDiv=true;
                    $scope.errorMessage=data.errorMessage;
                    $timeout(function() {
                         $scope.successDiv = false;
                         $scope.errorDiv=false;
                     }, 5000);   
                }
                else{
                    $scope.errorDiv=false;
                    $scope.successDiv = true;
                    $timeout(function() {
                        $state.reload();
                     }, 6000);
                }   
            });
        }   
    }
    
    $scope.getRatingClassName=function(rating){ 
        return appService.getRatingClassName(rating);
    }
}]);
//-----------------------------------------------------------------------------------------------------------------------------------------------------------

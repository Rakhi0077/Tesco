(
select
distinct(sal.[Base_Product_Number]) as TPNB
,Supplier_Name=NULL
,Supplier_Code=NULL
,Site_Code=NULL
,Site_Name=NULL
,[Period_No],
case when sal.Base_Product_Number = loc.TPNB then 'Fresh'  when sal.Base_Product_Number = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end as Commercial_Director,
case when sal.Base_Product_Number = loc.TPNB then 'Local'  when sal.Base_Product_Number = com.TPNB then 'Commodities' when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end as Category_Director,
cat.Buying_Controller,
cat.Junior_Buyer,
cat.Buyer,
cat.[Product_Sub_Group_Code],
product_sub_group_description as Product_Sub_Group_Description,
Tesco_Brand_Ind
,Specification_Name =NULL
,Total_SalesValue=NULL
,Specification_Number=NULL
,Specification_Type=NULL
,Technical_Manager=NULL
,Status=NULL
, Status2='Sales_With_No_Spec'
,Country=NULL



from (select distinct(Base_Product_Number) ,Period_No from tblSalesDataByWeek uk
		UNION (select distinct(Base_Product_Number) ,Period_No from tblSalesDataByWeekROI)
		) as sal

	inner join tblbprList bpr
	on sal.Base_Product_Number = bpr.Base_Product_Number

	inner join tblCategoryList cat
	on bpr.Product_Sub_Group_Code = cat.Product_Sub_Group_Code

	left join tblLocalTpnbs loc
	on sal.Base_Product_Number = loc.TPNB

	left join tblMarta com
	on sal.Base_Product_Number = com.TPNB
	 
	 left join tblSpecTpnbs spec
	 on sal.Base_Product_Number=spec.TPNB


	where cat.Commercial_Director in ('FRES          H.', 'PACKAGE       D.', 'NONFOODMIS    C.') and 
	spec.TPNB is NULL and [Period_No]=201901
	)
	UNION
	(
	Select
	TPNB,
Supplier_Name
,Supplier_Code
,Site_Code
,Site_Name
,Year_Period
,Commercial_Director
,Category_Director
,Buying_Controller
,Junior_Buyer
,Buyer
,Product_Sub_Group_Code
,Product_Sub_Group_Description
,Tesco_Brand_Ind
,Specification_Name 
,Total_SalesValue
,Specification_Number
,Specification_Type
,Technical_Manager
,Status
,CASE
    WHEN Status = 'Active' and Country = 'No Sales' THEN 'Active-No Sales' 
	WHEN Status = 'De-listed' and Total_SalesValue>1000 THEN 'Delisted With Sales >1000'
	Else Status
	end as Status2
,Country

from
(


Select sptb.Supplier_Name as Supplier_Name
,sptb.Supplier_Code as Supplier_Code
,sptb.Site_Code as Site_Code
,sptb.Site_Name as Site_Name
,sptb.Year_Period
,sptb.TPNB as TPNB
,a1.Total_SalesValue
,bpr.Product_Sub_Group_Code
,bpr.product_sub_group_description as Product_Sub_Group_Description
,case 
		 when bpr.Tesco_Brand_Ind='T' then 'Own Brand Lines' 
		 when bpr.Tesco_Brand_Ind = 'B' then 'Branded Lines'
		 when bpr.Tesco_Brand_Ind not in ('B', 'T') or bpr.Tesco_Brand_Ind is null then 'NA' else Tesco_Brand_Ind end as Tesco_Brand_Ind
,cat.Buying_Controller
,cat.Category_Director
,cat.Buyer
,case 
		   when cat.Commercial_Director = 'FRES          H.' then 'Fresh' 
		   when cat.Commercial_Director = 'PACKAGE       D.' then 'Packaged' 
		   when cat.Commercial_Director = 'HARDLINE      S.' then 'Hardlines'
	       when cat.Commercial_Director = 'CLOTHIN       G.' then 'Clothing'
		   end as Commercial_Director
,cat.Junior_Buyer 
,sptb.Specification_Name as Specification_Name 
,sptb.Specification_Number as Specification_Number
,sptb.Specification_Type as Specification_Type
,sptb.Technical_Manager as Technical_Manager
,sptb.Status as Status
,case when (UK.Base_Product_Number is not null and ROI.Base_Product_Number is not null) then 'UK/ROI'
	when UK.Base_Product_Number is not null then 'UK'
	when ROI.Base_Product_Number is not null then 'ROI'
	else 'No Sales'
	end as Country
	
	
from 
[dbo].tblSpecTpnbs sptb
left join  tblbprList bpr
on sptb.TPNB=RIGHT(bpr.Base_Product_Number,9)
left join [dbo].[tblCategoryList] cat
on cat.Product_Sub_Group_Code=bpr.Product_Sub_Group_Code
left join (select distinct Base_Product_Number from [dbo].[tblSalesDataByWeek]
Union
select distinct Base_Product_Number from [dbo].[tblSalesDataByWeekUKNF]) UK
on sptb.TPNB = UK.Base_Product_Number
left join (select distinct Base_Product_Number from [dbo].[tblSalesDataByWeekROI]) ROI
on sptb.TPNB = ROI.Base_Product_Number
left join 
(
select distinct(sp.TPNB) as BPN,sp.Year_Period as yp,
COALESCE((uk.UK_SalesValue),0)+COALESCE((roi.vol),0)+COALESCE((nf.uknf_vol),0) as Total_SalesValue
from tblSpecTpnbs sp
left join
(select DISTINCT(sdw.Base_Product_Number)
,sdw.Period_No
,SUM((sdw.Scanned_Sales_Value)) as UK_SalesValue
from tblSalesDataByWeek sdw
group by sdw.Base_Product_Number,sdw.Period_No
) uk 
on uk.Base_Product_Number=sp.TPNB and uk.Period_No=sp.Year_Period
left join 
( 
    select DISTINCT(ro.Base_Product_Number),Period_No,
	sum(ro.Scanned_Sales_Value)  as vol
	from tblSalesDataByWeekROI ro
	group by Base_Product_Number,Period_No

) roi on sp.TPNB=roi.Base_Product_Number and roi.Period_No=sp.Year_Period
full join 
( 
    select DISTINCT(uknf.Base_Product_Number),Period_No,
	sum(uknf.Scanned_Sales_Value)  as uknf_vol
	from tblSalesDataByWeekUKNF uknf
	group by Base_Product_Number,Period_No

) nf on sp.TPNB=nf.Base_Product_Number and nf.Period_No=sp.Year_Period

) as a1 
on a1.BPN=sptb.TPNB and a1.yp=sptb.Year_Period
where sptb.Year_Period=201901 
) AS F
)
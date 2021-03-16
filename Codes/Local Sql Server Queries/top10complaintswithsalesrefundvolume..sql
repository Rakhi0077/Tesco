select x.TPNB,
x.Product,
x.Category_Director,
x.Commercial_Director,
x.Product_Sub_Group_Description,
x.Count_Of_Complaints,
x.Year,
x.Period,
x.Week_No,
x.Tesco_or_Branded,
sum(y.Sales) as SalesVolume
	, sum(y.Refund) as RefundVolume
from

(select 
c.TPNB,
c.Product,
c.Category_Director,
c.Commercial_Director,
c.Product_Sub_Group_Description,

c.Count_Of_Complaints,
c.Year,
c.Period,
c.Week_No,

c.Tesco_or_Branded
from
(
Select a.Commercial_Category as Category_Director,
a.Commercial_Director as Commercial_Director,
a.product_sub_group_description as Product_Sub_Group_Description,
a.TPNB,
a.Product,
a.Count_Of_Complaints,
a.ReportingYear as Year,
a.ReportingPeriod as Period,
a.Week_No as Week_No,
a.Tesco_or_Branded,
row_number() over (partition by a.Commercial_Director,a.Commercial_Category,a.ReportingYear,a.ReportingPeriod,a.Week_No ORDER BY a.Count_Of_Complaints desc) as rankcol
from 
(
select count(*) as Count_Of_Complaints,
ReportingYear,
ReportingPeriod,
Week_No,
TPNB,
Product,
Tesco_or_Branded,
pc.Commercial_Category,
pc.Commercial_Director,
pc.product_sub_group_description

from [VwComplaintDetails1] pc
inner join [dbo].[tblbprList] bpr
on pc.TPNB = bpr.Base_Product_Number
inner join [dbo].[tblCategoryList] cat
on bpr.Product_Sub_Group_Code = cat.Product_Sub_Group_Code
where (TPNB IS NOT NULL) and (Commercial_Category IS NOT NULL) and (ReportingPeriod=1 )and (ReportingYear=2019)
group by 
TPNB,
Product,
ReportingYear,
ReportingPeriod,
Week_No,

Tesco_or_Branded,
cat.Category_Director,
pc.Commercial_Category,
pc.Commercial_Director,
pc.product_sub_group_description
) a
) c

where rankcol <=10) as x
left join
(
Select Cast(left(Period_No,4) as int) as RepYear
			, Cast(Right(Period_No,2) as int) as RepPeriod
			, Cast(Right(Week_No, 2) as int) as RepWeek
			, case when sal.Base_Product_Number = loc.TPNB then 'Fresh'  when sal.Base_Product_Number = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end as Commercial_Director
			, case when sal.Base_Product_Number = loc.TPNB then 'Local'  when sal.Base_Product_Number = com.TPNB then 'Commodities' when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end as Category_Director
			, [Buying_Controller]
			, Cast(sal.[Base_Product_Number] as int) as TPNB1
			,case when Tesco_Brand_Ind ='T' then 'Own Brand Lines'
				 when Tesco_Brand_Ind ='B'then 'Branded Lines' else Tesco_Brand_Ind end as Brand_Ind
			, product_sub_group_description
			, Sum(Scanned_Sales_Qty) as Sales
			, sum(Cast(Refund_Qty as Float)) as Refund
		from [dbo].[tblSalesDataByWeekChart] sal

		inner join tblbprList bpr
		on sal.Base_Product_Number = bpr.Base_Product_Number

		inner join VwCategoryList cat
		on bpr.Product_Sub_Group_Code = cat.Product_Sub_Group_Code

		left join tblLocalTpnbs loc
		on sal.Base_Product_Number = loc.TPNB

		left join tblMarta com
		on sal.Base_Product_Number = com.TPNB
		where Cast(Right(Period_No,2) as int)=1 and Cast(left(Period_No,4) as int)=2019
		group by Cast(left(Period_No,4) as int),
				Cast(Right(Period_No,2) as int),
				Cast(Right(Week_No, 2) as int)
			, case when sal.Base_Product_Number = loc.TPNB then 'Fresh'  when sal.Base_Product_Number = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end
			, case when sal.Base_Product_Number = loc.TPNB then 'Local' when sal.Base_Product_Number = com.TPNB then 'Commodities' when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end
			, [Buying_Controller]
			, sal.[Base_Product_Number]
			, product_sub_group_description
			, case when Tesco_Brand_Ind ='T' then 'Own Brand Lines'
				 when Tesco_Brand_Ind ='B'then 'Branded Lines' else Tesco_Brand_Ind end
) as y
				 on x.TPNB=y.TPNB1 and x.Year=y.RepYear and x.Period=y.RepPeriod and x.Week_No=y.RepWeek

group by 
x.TPNB,
x.Product,
x.Category_Director,
x.Commercial_Director,
x.Product_Sub_Group_Description,
x.Count_Of_Complaints,
x.Year,
x.Period,
x.Week_No,
x.Tesco_or_Branded
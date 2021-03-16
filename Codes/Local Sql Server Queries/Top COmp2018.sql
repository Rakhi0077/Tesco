Delete from tblTopComplaintsByWeek
where Year_Period<201901;
insert into [tblTopComplaintsByWeek]

select
TY.Year_Period,
TY.Year_Week,
TY.Area,
TY.Category,
TY.Buying_Controller,
TY.Product_Sub_Group_Description,
TY.TPNB,
TY.Long_Description,
TY.Tesco_Brand_Ind,
TY.Total_Complaints,
TY.Total_Refund,
TY.Total_Quality_Refund,
TY.Units_Sold,
coalesce(case when TY.Complaints_PTD is null then lag(TY.Complaints_YTD) over (partition by TY.TPNB, TY.Year_Period order by TY.Year_Week) else TY.Complaints_PTD end, 0) as Complaints_PTD,
coalesce(case when TY.Refund_PTD is null then lag(TY.Refund_YTD) over (partition by TY.TPNB, TY.Year_Period order by TY.Year_Week) else TY.Refund_PTD end, 0) as Refund_PTD,
coalesce(case when TY.Units_Sold_PTD is null then lag(TY.Units_Sold_YTD) over (partition by TY.TPNB, TY.Year_Period order by TY.Year_Week) else TY.Units_Sold_PTD end, 0) as Units_Sold_PTD,
coalesce(case when TY.Complaints_YTD is null then lag(TY.Complaints_YTD) over (partition by TY.TPNB order by TY.Year_Period) else TY.Complaints_YTD end, 0) as Complaints_YTD,
coalesce(case when TY.Refund_YTD is null then lag(TY.Refund_YTD) over (partition by TY.TPNB order by TY.Year_Period) else TY.Refund_YTD end, 0) as Refund_YTD,
coalesce(case when TY.Units_Sold_YTD is null then lag(TY.Units_Sold_YTD) over (partition by TY.TPNB order by TY.Year_Period) else TY.Units_Sold_YTD end, 0) as Units_Sold_YTD,
LY.Total_Complaints,
LY.Total_Refund,
LY.Total_Quality_Refund,
LY.Units_Sold,
coalesce(case when LY.Complaints_PTD is null then lag(LY.Complaints_YTD) over (partition by LY.TPNB, LY.Year_Period order by LY.Year_Week) else LY.Complaints_PTD end, 0) as Complaints_PTD,
coalesce(case when LY.Refund_PTD is null then lag(LY.Refund_YTD) over (partition by LY.TPNB, LY.Year_Period order by LY.Year_Week) else LY.Refund_PTD end, 0) as Refund_PTD,
coalesce(case when LY.Units_Sold_PTD is null then lag(LY.Units_Sold_YTD) over (partition by LY.TPNB, LY.Year_Period order by LY.Year_Week) else LY.Units_Sold_PTD end, 0) as Units_Sold_PTD,
coalesce(case when LY.Complaints_YTD is null then lag(LY.Complaints_YTD) over (partition by LY.TPNB order by LY.Year_Period) else LY.Complaints_YTD end, 0) as Complaints_YTD,
coalesce(case when LY.Refund_YTD is null then lag(LY.Refund_YTD) over (partition by LY.TPNB order by LY.Year_Period) else LY.Refund_YTD end, 0) as Refund_YTD,
coalesce(case when LY.Units_Sold_YTD is null then lag(LY.Units_Sold_YTD) over (partition by LY.TPNB order by LY.Year_Period) else LY.Units_Sold_YTD end, 0) as Units_Sold_YTD


from

(
select

coalesce(Year_Period, Period_No) as Year_Period,
coalesce(comps.Week_No, refs.Week_No) as Year_Week,
coalesce(comps.Area, refs.Area) as Area,
coalesce(comps.Category, refs.Category) as Category,
coalesce(comps.Buying_Controller, refs.Buying_Controller) as Buying_Controller,
coalesce(comps.Product_Sub_Group_Description, refs.Product_Sub_Group_Description) as Product_Sub_Group_Description,
coalesce(comps.TPNB, refs.TPNB) as TPNB,
coalesce(comps.Long_Description, refs.Long_Description) as Long_Description,
coalesce(comps.Tesco_Brand_Ind, refs.Tesco_Brand_Ind) as Tesco_Brand_Ind,
coalesce(Total_Complaints, 0) as Total_Complaints,
coalesce(Total_Refund, 0) as Total_Refund,
coalesce(Total_Quality_Refund, 0) as Total_Quality_Refund,
coalesce(Units_Sold, 0) as Units_Sold,
Complaints_PTD,
Complaints_YTD,
Refund_PTD,
Refund_YTD,
Units_Sold_PTD,
Units_Sold_YTD

from

(
select
Year_Period,
Week_No,
Area,
Category,
Buying_Controller,
Product_Sub_Group_Description,
TPNB,
Long_Description,
Tesco_Brand_Ind,
Total_Complaints,
Sum(Total_Complaints) over (partition by TPNB, Year_Period order by Week_No rows unbounded preceding) as Complaints_PTD,
Sum(Total_Complaints) over (partition by TPNB order by Week_No rows unbounded preceding) as Complaints_YTD

from
(
SELECT
Year_Period,
(left(Year_Period, 4)*100) + Week_No as Week_No,
case when x.TPNB = loc.TPNB then 'Fresh'  when x.TPNB = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end as Area,
case when x.TPNB = loc.TPNB then 'Local'  when x.TPNB = com.TPNB then 'Commodities' when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end as Category,
case 
when cat.Product_Sub_Group_Code in ('T11AG','T11AH','T11CB','T11CE','T11CG','T11CH','T11CK','T11EB','T11EE','T11EG',
'T11EH','T11GB','T11GE','T11GG','T11GH','T11WA') then 'Filter Cigarettes'
when cat.Product_Sub_Group_Code in ('T13AA','T13AB','T13AC','T13AF','T13AD') then 'Cigars'
when cat.Product_Sub_Group_Code in ('T15AB','T15AE','T15AG','T15AH','T15CB','T15CE','T15CG','T15CF','T15DD','T15EB',
'T15EE','T15EG') then 'Loose Tobacco/ Roll your own'
when cat.Product_Sub_Group_Code in ('T16AB','T16AE','T16AK','T16CB','T16CE','T16CK') then 'Pipe Tobacco'
when cat.Product_Sub_Group_Code in ('T17AA','T17AB','T17AE','T17AG','T17AJ','T17AL') then 'Smoking Accessories'
when cat.Product_Sub_Group_Code in ('T17AC') then 'Vapes or E cigs'
when cat.Product_Sub_Group_Code in ('L11AA') then 'Kiosk'
else cat.Buying_Controller end as Buying_Controller,
product_sub_group_description as Product_Sub_Group_Description,
x.TPNB,
Long_Description,
Tesco_Brand_Ind,
count(x.TPNB) as Total_Complaints

FROM [CPRCOE].[dbo].[tblProductComplaintDetails] x
inner join [tblbprList] as bpr
on x.TPNB = bpr.Base_Product_Number
inner join [VwCategoryList] cat
on bpr.Product_Sub_Group_Code = cat.Product_Sub_Group_Code
left join tblLocalTpnbs loc
on x.TPNB = loc.TPNB
left join tblMarta com
on x.TPNB = com.TPNB


where 
(left(Year_Period, 4)*100) + Week_No between 
201801 and 201852 and cat.Commercial_Director in ('FRES          H.', 'PACKAGE       D.' ,'NONFOODMIS    C.')
--and x.TPNB = 51329951
													
group by 
Year_Period,
Week_No,
case when x.TPNB = loc.TPNB then 'Fresh'  when x.TPNB = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end,
case when x.TPNB = loc.TPNB then 'Local'  when x.TPNB = com.TPNB then 'Commodities' when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end,
case 
when cat.Product_Sub_Group_Code in ('T11AG','T11AH','T11CB','T11CE','T11CG','T11CH','T11CK','T11EB','T11EE','T11EG',
'T11EH','T11GB','T11GE','T11GG','T11GH','T11WA') then 'Filter Cigarettes'
when cat.Product_Sub_Group_Code in ('T13AA','T13AB','T13AC','T13AF','T13AD') then 'Cigars'
when cat.Product_Sub_Group_Code in ('T15AB','T15AE','T15AG','T15AH','T15CB','T15CE','T15CG','T15CF','T15DD','T15EB',
'T15EE','T15EG') then 'Loose Tobacco/ Roll your own'
when cat.Product_Sub_Group_Code in ('T16AB','T16AE','T16AK','T16CB','T16CE','T16CK') then 'Pipe Tobacco'
when cat.Product_Sub_Group_Code in ('T17AA','T17AB','T17AE','T17AG','T17AJ','T17AL') then 'Smoking Accessories'
when cat.Product_Sub_Group_Code in ('T17AC') then 'Vapes or E cigs'
when cat.Product_Sub_Group_Code in ('L11AA') then 'Kiosk'
else cat.Buying_Controller end,
product_sub_group_description,
x.TPNB,
Long_Description,
Tesco_Brand_Ind
) comp
) comps

full outer join

(
select
Period_No,
Week_No,
Area,
Category,
Buying_Controller,
Product_Sub_Group_Description,
TPNB,
Long_Description,
Tesco_Brand_Ind,
Total_Refund,
Total_Quality_Refund,
Sum(Total_Refund) over (partition by TPNB, Period_No order by Week_No rows unbounded preceding) as Refund_PTD,
Sum(Total_Refund) over (partition by TPNB order by Week_No rows unbounded preceding) as Refund_YTD,
coalesce(Units_Sold,0) as Units_Sold,
Sum(coalesce(Units_Sold, 0)) over (partition by TPNB, Period_No order by Week_No rows unbounded preceding) as Units_Sold_PTD,
Sum(coalesce(Units_Sold, 0)) over (partition by TPNB order by Week_No rows unbounded preceding) as Units_Sold_YTD

from
(
SELECT
Period_No,
Week_No,
case when x.Base_Product_Number = loc.TPNB then 'Fresh'  when x.Base_Product_Number = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end as Area,
case when x.Base_Product_Number = loc.TPNB then 'Local' when x.Base_Product_Number = com.TPNB then 'Commodities'  when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end as Category,
case 
when cat.Product_Sub_Group_Code in ('T11AG','T11AH','T11CB','T11CE','T11CG','T11CH','T11CK','T11EB','T11EE','T11EG',
'T11EH','T11GB','T11GE','T11GG','T11GH','T11WA') then 'Filter Cigarettes'
when cat.Product_Sub_Group_Code in ('T13AA','T13AB','T13AC','T13AF','T13AD') then 'Cigars'
when cat.Product_Sub_Group_Code in ('T15AB','T15AE','T15AG','T15AH','T15CB','T15CE','T15CG','T15CF','T15DD','T15EB',
'T15EE','T15EG') then 'Loose Tobacco/ Roll your own'
when cat.Product_Sub_Group_Code in ('T16AB','T16AE','T16AK','T16CB','T16CE','T16CK') then 'Pipe Tobacco'
when cat.Product_Sub_Group_Code in ('T17AA','T17AB','T17AE','T17AG','T17AJ','T17AL') then 'Smoking Accessories'
when cat.Product_Sub_Group_Code in ('T17AC') then 'Vapes or E cigs'
when cat.Product_Sub_Group_Code in ('L11AA') then 'Kiosk'
else cat.Buying_Controller end as Buying_Controller,
product_sub_group_description as Product_Sub_Group_Description,
x.Base_Product_Number as TPNB,
bpr.Long_Description,
bpr.Tesco_Brand_Ind,
sum(Refund_Qty) as Total_Refund,
sum(Quality_Refund_Qty) as Total_Quality_Refund,
coalesce(sum(Scanned_Sales_Qty), 0) as Units_Sold

FROM [CPRCOE].[dbo].[tblSalesDataByWeek] x
inner join [tblbprList] as bpr
on x.Base_Product_Number = bpr.Base_Product_Number
inner join [VwCategoryList] cat
on bpr.Product_Sub_Group_Code = cat.Product_Sub_Group_Code
left join tblLocalTpnbs loc
on x.Base_Product_Number = loc.TPNB
left join tblMarta com
on x.Base_Product_Number = com.TPNB


where 
Week_No between 
201801 and 201852 
and cat.Commercial_Director in ('FRES          H.', 'PACKAGE       D.' ,'NONFOODMIS    C.')
--and x.Base_Product_Number = 51329951
													
group by 
Period_No,
Week_No,
case when x.Base_Product_Number = loc.TPNB then 'Fresh'  when x.Base_Product_Number = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end,
case when x.Base_Product_Number = loc.TPNB then 'Local' when x.Base_Product_Number = com.TPNB then 'Commodities'  when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end,
case 
when cat.Product_Sub_Group_Code in ('T11AG','T11AH','T11CB','T11CE','T11CG','T11CH','T11CK','T11EB','T11EE','T11EG',
'T11EH','T11GB','T11GE','T11GG','T11GH','T11WA') then 'Filter Cigarettes'
when cat.Product_Sub_Group_Code in ('T13AA','T13AB','T13AC','T13AF','T13AD') then 'Cigars'
when cat.Product_Sub_Group_Code in ('T15AB','T15AE','T15AG','T15AH','T15CB','T15CE','T15CG','T15CF','T15DD','T15EB',
'T15EE','T15EG') then 'Loose Tobacco/ Roll your own'
when cat.Product_Sub_Group_Code in ('T16AB','T16AE','T16AK','T16CB','T16CE','T16CK') then 'Pipe Tobacco'
when cat.Product_Sub_Group_Code in ('T17AA','T17AB','T17AE','T17AG','T17AJ','T17AL') then 'Smoking Accessories'
when cat.Product_Sub_Group_Code in ('T17AC') then 'Vapes or E cigs'
when cat.Product_Sub_Group_Code in ('L11AA') then 'Kiosk'
else cat.Buying_Controller end,
product_sub_group_description,
x.Base_Product_Number,
bpr.Long_Description,
bpr.Tesco_Brand_Ind
) ref
) refs

on comps.TPNB = refs.TPNB
and comps.Year_Period = refs.Period_No
and comps.Week_No = refs.Week_No
and comps.Area = refs.Area
and comps.Category = refs.Category
and comps.Buying_Controller = refs.Buying_Controller
and comps.Product_Sub_Group_Description = refs.Product_Sub_Group_Description
and comps.Long_Description = refs.Long_Description
and comps.Tesco_Brand_Ind = refs.Tesco_Brand_Ind
) TY

left join

(
select
coalesce(Year_Period, Period_No) as Year_Period,
coalesce(comps.Week_No, refs.Week_No) as Year_Week,
coalesce(comps.Area, refs.Area) as Area,
coalesce(comps.Category, refs.Category) as Category,
coalesce(comps.Buying_Controller, refs.Buying_Controller) as Buying_Controller,
coalesce(comps.Product_Sub_Group_Description, refs.Product_Sub_Group_Description) as Product_Sub_Group_Description,
coalesce(comps.TPNB, refs.TPNB) as TPNB,
coalesce(comps.Long_Description, refs.Long_Description) as Long_Description,
coalesce(comps.Tesco_Brand_Ind, refs.Tesco_Brand_Ind) as Tesco_Brand_Ind,
coalesce(Total_Complaints, 0) as Total_Complaints,
coalesce(Total_Refund, 0) as Total_Refund,
coalesce(Total_Quality_Refund, 0) as Total_Quality_Refund,
coalesce(Units_Sold, 0) as Units_Sold,
Complaints_PTD,
Complaints_YTD,
Refund_PTD,
Refund_YTD,
Units_Sold_PTD,
Units_Sold_YTD

from

(
select
Year_Period,
Week_No,
Area,
Category,
Buying_Controller,
Product_Sub_Group_Description,
TPNB,
Long_Description,
Tesco_Brand_Ind,
Total_Complaints,
Sum(Total_Complaints) over (partition by TPNB, Year_Period order by Week_No rows unbounded preceding) as Complaints_PTD,
Sum(Total_Complaints) over (partition by TPNB order by Week_No rows unbounded preceding) as Complaints_YTD

from
(
SELECT
Year_Period,
(left(Year_Period, 4)*100) + Week_No as Week_No,
case when x.TPNB = loc.TPNB then 'Fresh' when x.TPNB = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end as Area,
case when x.TPNB = loc.TPNB then 'Local' when x.TPNB = com.TPNB then 'Commodities'
 when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end as Category,
case 
when cat.Product_Sub_Group_Code in ('T11AG','T11AH','T11CB','T11CE','T11CG','T11CH','T11CK','T11EB','T11EE','T11EG',
'T11EH','T11GB','T11GE','T11GG','T11GH','T11WA') then 'Filter Cigarettes'
when cat.Product_Sub_Group_Code in ('T13AA','T13AB','T13AC','T13AF','T13AD') then 'Cigars'
when cat.Product_Sub_Group_Code in ('T15AB','T15AE','T15AG','T15AH','T15CB','T15CE','T15CG','T15CF','T15DD','T15EB',
'T15EE','T15EG') then 'Loose Tobacco/ Roll your own'
when cat.Product_Sub_Group_Code in ('T16AB','T16AE','T16AK','T16CB','T16CE','T16CK') then 'Pipe Tobacco'
when cat.Product_Sub_Group_Code in ('T17AA','T17AB','T17AE','T17AG','T17AJ','T17AL') then 'Smoking Accessories'
when cat.Product_Sub_Group_Code in ('T17AC') then 'Vapes or E cigs'
when cat.Product_Sub_Group_Code in ('L11AA') then 'Kiosk'
else cat.Buying_Controller end as Buying_Controller,
product_sub_group_description as Product_Sub_Group_Description,
x.TPNB,
Long_Description,
Tesco_Brand_Ind,
count(x.TPNB) as Total_Complaints

FROM [CPRCOE].[dbo].[tblProductComplaintDetails] x
inner join [tblbprList] as bpr
on x.TPNB = bpr.Base_Product_Number
inner join [VwCategoryList] cat
on bpr.Product_Sub_Group_Code = cat.Product_Sub_Group_Code
left join tblLocalTpnbs loc
on x.TPNB = loc.TPNB
left join tblMarta com
on x.TPNB = com.TPNB

where 
(left(Year_Period, 4)*100) + Week_No between 
201701 and 201752
and cat.Commercial_Director in ('FRES          H.', 'PACKAGE       D.' ,'NONFOODMIS    C.')
--and x.TPNB = 51329951
													
group by 
Year_Period,
Week_No,
case when x.TPNB = loc.TPNB then 'Fresh'  when x.TPNB = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end,
case when x.TPNB = loc.TPNB then 'Local' when x.TPNB = com.TPNB then 'Commodities'  when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end,
case 
when cat.Product_Sub_Group_Code in ('T11AG','T11AH','T11CB','T11CE','T11CG','T11CH','T11CK','T11EB','T11EE','T11EG',
'T11EH','T11GB','T11GE','T11GG','T11GH','T11WA') then 'Filter Cigarettes'
when cat.Product_Sub_Group_Code in ('T13AA','T13AB','T13AC','T13AF','T13AD') then 'Cigars'
when cat.Product_Sub_Group_Code in ('T15AB','T15AE','T15AG','T15AH','T15CB','T15CE','T15CG','T15CF','T15DD','T15EB',
'T15EE','T15EG') then 'Loose Tobacco/ Roll your own'
when cat.Product_Sub_Group_Code in ('T16AB','T16AE','T16AK','T16CB','T16CE','T16CK') then 'Pipe Tobacco'
when cat.Product_Sub_Group_Code in ('T17AA','T17AB','T17AE','T17AG','T17AJ','T17AL') then 'Smoking Accessories'
when cat.Product_Sub_Group_Code in ('T17AC') then 'Vapes or E cigs'
when cat.Product_Sub_Group_Code in ('L11AA') then 'Kiosk'
else cat.Buying_Controller end,
product_sub_group_description,
x.TPNB,
Long_Description,
Tesco_Brand_Ind
) comp
) comps

full outer join

(
select
Period_No,
Week_No,
Area,
Category,
Buying_Controller,
Product_Sub_Group_Description,
TPNB,
Long_Description,
Tesco_Brand_Ind,
Total_Refund,
Total_Quality_Refund,
Sum(Total_Refund) over (partition by TPNB, Period_No order by Week_No rows unbounded preceding) as Refund_PTD,
Sum(Total_Refund) over (partition by TPNB order by Week_No rows unbounded preceding) as Refund_YTD,
coalesce(Units_Sold,0) as Units_Sold,
Sum(coalesce(Units_Sold, 0)) over (partition by TPNB, Period_No order by Week_No rows unbounded preceding) as Units_Sold_PTD,
Sum(coalesce(Units_Sold, 0)) over (partition by TPNB order by Week_No rows unbounded preceding) as Units_Sold_YTD

from
(
SELECT
Period_No,
Week_No,
case when x.Base_Product_Number = loc.TPNB then 'Fresh'  when x.Base_Product_Number = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end as Area,
case when x.Base_Product_Number = loc.TPNB then 'Local' when x.Base_Product_Number = com.TPNB then 'Commodities'  when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end as Category,
case 
when cat.Product_Sub_Group_Code in ('T11AG','T11AH','T11CB','T11CE','T11CG','T11CH','T11CK','T11EB','T11EE','T11EG',
'T11EH','T11GB','T11GE','T11GG','T11GH','T11WA') then 'Filter Cigarettes'
when cat.Product_Sub_Group_Code in ('T13AA','T13AB','T13AC','T13AF','T13AD') then 'Cigars'
when cat.Product_Sub_Group_Code in ('T15AB','T15AE','T15AG','T15AH','T15CB','T15CE','T15CG','T15CF','T15DD','T15EB',
'T15EE','T15EG') then 'Loose Tobacco/ Roll your own'
when cat.Product_Sub_Group_Code in ('T16AB','T16AE','T16AK','T16CB','T16CE','T16CK') then 'Pipe Tobacco'
when cat.Product_Sub_Group_Code in ('T17AA','T17AB','T17AE','T17AG','T17AJ','T17AL') then 'Smoking Accessories'
when cat.Product_Sub_Group_Code in ('T17AC') then 'Vapes or E cigs'
when cat.Product_Sub_Group_Code in ('L11AA') then 'Kiosk'
else cat.Buying_Controller end as Buying_Controller,
product_sub_group_description as Product_Sub_Group_Description,
x.Base_Product_Number as TPNB,
bpr.Long_Description,
bpr.Tesco_Brand_Ind,
sum(Refund_Qty) as Total_Refund,
sum(Quality_Refund_Qty) as Total_Quality_Refund,
coalesce(sum(Scanned_Sales_Qty), 0) as Units_Sold

FROM [CPRCOE].[dbo].[tblSalesDataByWeek] x
inner join [tblbprList] as bpr
on x.Base_Product_Number = bpr.Base_Product_Number
inner join [VwCategoryList] cat
on bpr.Product_Sub_Group_Code = cat.Product_Sub_Group_Code
left join tblLocalTpnbs loc
on x.Base_Product_Number = loc.TPNB
left join tblMarta com
on x.Base_Product_Number = com.TPNB

where 
Week_No between 
201701 and 201752
and cat.Commercial_Director in ('FRES          H.', 'PACKAGE       D.' ,'NONFOODMIS    C.')
--and x.Base_Product_Number = 51329951
													
group by 
Period_No,
Week_No,
case when x.Base_Product_Number = loc.TPNB then 'Fresh'  when x.Base_Product_Number = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end,
case when x.Base_Product_Number = loc.TPNB then 'Local' when x.Base_Product_Number = com.TPNB then 'Commodities'  when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end,
case 
when cat.Product_Sub_Group_Code in ('T11AG','T11AH','T11CB','T11CE','T11CG','T11CH','T11CK','T11EB','T11EE','T11EG',
'T11EH','T11GB','T11GE','T11GG','T11GH','T11WA') then 'Filter Cigarettes'
when cat.Product_Sub_Group_Code in ('T13AA','T13AB','T13AC','T13AF','T13AD') then 'Cigars'
when cat.Product_Sub_Group_Code in ('T15AB','T15AE','T15AG','T15AH','T15CB','T15CE','T15CG','T15CF','T15DD','T15EB',
'T15EE','T15EG') then 'Loose Tobacco/ Roll your own'
when cat.Product_Sub_Group_Code in ('T16AB','T16AE','T16AK','T16CB','T16CE','T16CK') then 'Pipe Tobacco'
when cat.Product_Sub_Group_Code in ('T17AA','T17AB','T17AE','T17AG','T17AJ','T17AL') then 'Smoking Accessories'
when cat.Product_Sub_Group_Code in ('T17AC') then 'Vapes or E cigs'
when cat.Product_Sub_Group_Code in ('L11AA') then 'Kiosk'
else cat.Buying_Controller end,
product_sub_group_description,
x.Base_Product_Number,
bpr.Long_Description,
bpr.Tesco_Brand_Ind
) ref
) refs

on comps.TPNB = refs.TPNB
and comps.Year_Period = refs.Period_No
and comps.Week_No = refs.Week_No
and comps.Area = refs.Area
and comps.Category = refs.Category
and comps.Buying_Controller = refs.Buying_Controller
and comps.Product_Sub_Group_Description = refs.Product_Sub_Group_Description
and comps.Long_Description = refs.Long_Description
and comps.Tesco_Brand_Ind = refs.Tesco_Brand_Ind
) LY

on TY.Year_Period = LY.Year_Period+100
and TY.Year_Week = LY.Year_Week+100
and TY.TPNB = LY.TPNB




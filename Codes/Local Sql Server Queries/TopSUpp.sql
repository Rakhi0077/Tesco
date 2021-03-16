Delete from tblTopSuppliersByWeek;

insert into [tblTopSuppliersByWeek]
Select
TY.Year_Period,
TY.Week_No,
TY.Supplier_No,
[Supplier_Name],
TY.Area,
TY.Category,
TY.Buying_Controller,
TY.Complaints,
TY.Units_Sold,
TY.Complaints_PTD,
TY.Complaints_YTD,
TY.Units_Sold_PTD,
TY.Units_Sold_YTD,
LY.Complaints,
LY.Units_Sold,
LY.Complaints_PTD,
LY.Complaints_YTD,
LY.Units_Sold_PTD,
LY.Units_Sold_YTD

from

(
Select 
Year_Period,
comps.Week_No,
comps.Supplier_No,
--Supplier_Name,
comps.Area,
comps.Category,
comps.Buying_Controller,
Total_Complaints as Complaints,
Units_Sold,
Complaints_PTD,
Complaints_YTD,
Units_Sold_PTD,
Units_Sold_YTD


from
(
(
select
Year_Period,
Week_No,
Supplier_No,
Area,
Category,
Buying_Controller,
Total_Complaints,
sum(Total_Complaints) over (partition by Supplier_No, Area, Category, Buying_Controller, Year_Period order by Week_No rows unbounded preceding) as Complaints_PTD,
sum(Total_Complaints) over (partition by Supplier_No, Area, Category, Buying_Controller order by Week_No rows unbounded preceding) as Complaints_YTD

from
(
SELECT
Year_Period,
(left(Year_Period, 4)*100) + Week_No as Week_No,
Supplier_Account as Supplier_No,
case when x.TPNB = loc.TPNB then 'Fresh'  when x.TPNB = nit.TPNB then 'Fresh'  when x.TPNB = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end as Area,
case when x.TPNB = loc.TPNB then 'Local' when x.TPNB = com.TPNB then 'Commodities'  when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end as Category,
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
  left join tblNI_LocalTpnbs nit
  on x.TPNB = nit.TPNB
  where (left(Year_Period, 4)*100) + Week_No between 
(select Year_Week_Number from tblTescoCalender
where Year_Number = (select Year_Number from tblTescoCalender where Calendar_Date = dateadd(day, -7, convert(date, getdate())))
		and Week_Number = 1
group by Year_Week_Number)
and
(select Year_Week_Number from tblTescoCalender
where Calendar_Date = dateadd(day, -7, convert(date, getdate())))
  and Supplier_Account is not null
  and cat.Commercial_Director in ('FRES          H.', 'PACKAGE       D.', 'NONFOODMIS    C.'
)
  group by 
  Year_Period, 
  Week_No,
  Supplier_Account,
  case when x.TPNB = loc.TPNB then 'Fresh'  when x.TPNB = nit.TPNB then 'Fresh' when x.TPNB = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end,
  case when x.TPNB = loc.TPNB then 'Local' when x.TPNB = com.TPNB then 'Commodities'    when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end,
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
else Buying_Controller end
  ) a
  ) comps

  inner join ( 
  select
  Period_No,
  Week_No,
  Supplier,
  Area,
  Category,
  Buying_Controller,
  Units_Sold,
  sum(Units_Sold) over (partition by Supplier, Area, Category, Buying_Controller, Period_No order by Week_No rows unbounded preceding) as Units_Sold_PTD,
  sum(Units_Sold) over (partition by Supplier, Area, Category, Buying_Controller order by Week_No rows unbounded preceding) as Units_Sold_YTD

  from
  (
  select  
  Period_No,
  Week_No,
  Supplier,
  case when s.TPNB = loc.TPNB then 'Fresh'   when s.TPNB = nit.TPNB then 'Fresh'  when s.TPNB = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end as Area,
  case when s.TPNB = loc.TPNB then 'Local' when s.TPNB = com.TPNB then 'Commodities'   when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end as Category,
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
  sum(Volume_TY) as Units_Sold
  from [tblSupplierSalesByWeek] s
  inner join [tblbprList] as bpr
  on s.TPNB = bpr.Base_Product_Number
  inner join [VwCategoryList] cat
  on bpr.Product_Sub_Group_Code = cat.Product_Sub_Group_Code
  left join tblLocalTpnbs loc
  on s.TPNB = loc.TPNB
  left join tblMarta com
  on s.TPNB = com.TPNB
left join tblNI_LocalTpnbs nit
  on s.TPNB = nit.TPNB

  where Week_No between 
(select Year_Week_Number from tblTescoCalender
where Year_Number = (select Year_Number from tblTescoCalender where Calendar_Date = dateadd(day, -7, convert(date, getdate())))
		and Week_Number = 1
group by Year_Week_Number)
and
(select Year_Week_Number from tblTescoCalender
where Calendar_Date = dateadd(day, -7, convert(date, getdate())))
  and cat.Commercial_Director in ('FRES          H.', 'PACKAGE       D.', 'NONFOODMIS    C.'
)
  group by 
  Period_No,
  Week_No,
  Supplier,
  case when s.TPNB = loc.TPNB then 'Fresh'  when s.TPNB = nit.TPNB then 'Fresh'  when s.TPNB = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end,
  case when s.TPNB = loc.TPNB then 'Local' when s.TPNB = com.TPNB then 'Commodities'  when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end,
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
else cat.Buying_Controller end
  ) b
  ) sales
  on comps.Supplier_No = sales.Supplier
  and comps.Year_Period = sales.Period_No
  and comps.Week_No = sales.Week_No
  and comps.Area = sales.Area
  and comps.Category = sales.Category
  and comps.Buying_Controller = sales.Buying_Controller
)) TY

left join 
(
Select 
Year_Period,
comps.Week_No,
comps.Supplier_No,
--Supplier_Name,
comps.Area,
comps.Category,
comps.Buying_Controller,
Total_Complaints as Complaints,
Units_Sold,
Complaints_PTD,
Complaints_YTD,
Units_Sold_PTD,
Units_Sold_YTD


from

(
select
Year_Period,
Week_No,
Supplier_No,
Area,
Category,
Buying_Controller,
Total_Complaints,
sum(Total_Complaints) over (partition by Supplier_No, Area, Category, Buying_Controller, Year_Period order by Week_No rows unbounded preceding) as Complaints_PTD,
sum(Total_Complaints) over (partition by Supplier_No, Area, Category, Buying_Controller order by Week_No rows unbounded preceding) as Complaints_YTD

from
(
SELECT
Year_Period,
(left(Year_Period, 4)*100) + Week_No as Week_No,
Supplier_Account as Supplier_No,
case when x.TPNB = loc.TPNB then 'Fresh'  when x.TPNB = nit.TPNB then 'Fresh' when x.TPNB = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end as Area,
case when x.TPNB = loc.TPNB then 'Local' when x.TPNB = com.TPNB then 'Commodities'   when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end as Category,
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
left join tblNI_LocalTpnbs nit
  on x.TPNB = nit.TPNB

  where (left(Year_Period, 4)*100) + Week_No between 
(select Year_Week_Number from tblTescoCalender
where Year_Number = (select Year_Number from tblTescoCalender where Calendar_Date = dateadd(day, -7, convert(date, getdate())))
		and Week_Number = 1
group by Year_Week_Number)-100
and
(select Year_Week_Number from tblTescoCalender
where Calendar_Date = dateadd(day, -7, convert(date, getdate())))-100
  and Supplier_Account is not null
  and cat.Commercial_Director in ('FRES          H.', 'PACKAGE       D.', 'NONFOODMIS    C.'
)
  group by 
  Year_Period, 
  Week_No,
  Supplier_Account,
  case when x.TPNB = loc.TPNB then 'Fresh'  when x.TPNB = nit.TPNB then 'Fresh' when x.TPNB = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end,
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
else cat.Buying_Controller end
  ) a
  ) comps

  inner join ( 
  select
  Period_No,
  Week_No,
  Supplier,
  Area,
  Category,
  Buying_Controller,
  Units_Sold,
  sum(Units_Sold) over (partition by Supplier, Area, Category, Buying_Controller, Period_No order by Week_No rows unbounded preceding) as Units_Sold_PTD,
  sum(Units_Sold) over (partition by Supplier, Area, Category, Buying_Controller order by Week_No rows unbounded preceding) as Units_Sold_YTD

  from
  (
  select  
  Period_No,
  Week_No,
  Supplier,
  case when s.TPNB = loc.TPNB then 'Fresh'   when s.TPNB = nit.TPNB then 'Fresh'  when s.TPNB = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end as Area,
  case when s.TPNB = loc.TPNB then 'Local' when s.TPNB = com.TPNB then 'Commodities'   when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end as Category,
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
  sum(Volume_TY) as Units_Sold
  from [tblSupplierSalesByWeek] s
  inner join [tblbprList] as bpr
  on s.TPNB = bpr.Base_Product_Number
  inner join [VwCategoryList] cat
  on bpr.Product_Sub_Group_Code = cat.Product_Sub_Group_Code
  left join tblLocalTpnbs loc
  on s.TPNB = loc.TPNB
  left join tblMarta com
  on s.TPNB = com.TPNB 
left join tblNI_LocalTpnbs nit
  on s.TPNB = nit.TPNB

  where Week_No between 
(select Year_Week_Number from tblTescoCalender
where Year_Number = (select Year_Number from tblTescoCalender where Calendar_Date = dateadd(day, -7, convert(date, getdate())))
		and Week_Number = 1
group by Year_Week_Number)-100
and
(select Year_Week_Number from tblTescoCalender
where Calendar_Date = dateadd(day, -7, convert(date, getdate())))-100
  and cat.Commercial_Director in ('FRES          H.', 'PACKAGE       D.', 'NONFOODMIS    C.'
)
  group by 
  Period_No,
  Week_No,
  Supplier,
  case when s.TPNB = loc.TPNB then 'Fresh'  when s.TPNB = nit.TPNB then 'Fresh'  when s.TPNB = com.TPNB then 'Fresh' when cat.Commercial_Director = 'FRES          H.' then 'Fresh' else 'Packaged' end,
  case when s.TPNB = loc.TPNB then 'Local' when s.TPNB = com.TPNB then 'Commodities'   when cat.Category_Director = 'BAKERY&DAIR   Y.' then cat.Buying_Controller else cat.Category_Director end,
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
else cat.Buying_Controller end
  ) b
  ) sales
  on comps.Supplier_No = sales.Supplier
  and comps.Year_Period = sales.Period_No
  and comps.Week_No = sales.Week_No
  and comps.Area = sales.Area
  and comps.Category = sales.Category
  and comps.Buying_Controller = sales.Buying_Controller
) LY
on TY.Week_No = LY.Week_No+100
and TY.Supplier_No = LY.Supplier_No
and TY.Buying_Controller = LY.Buying_Controller
and TY.Category = LY.Category
  
  inner join [tblSuppliers] supp
  on TY.Supplier_No = supp.Supplier_No



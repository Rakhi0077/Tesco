select distinct Supplier,Supplier_Name from tblSupplierSalesByWeek
where Supplier_Name like '%GFS%'


select distinct Supplier,Supplier_Name from tblSupplierSalesByWeek
where TPNB=50018831 and Period_No=202007


select distinct Supplier,Supplier_Name from tblSupplierSalesByWeek
where Supplier=67681;


select
 aud.*,
 cal.Year_Week_Number,
 spec.TPNB
from tblAudits as aud
left join tblSpecTpnbs as spec
on spec.Supplier_Code =aud.Supplier_Code and spec.Site_Code=aud.Site_Code
inner join [dbo].[tblTescoCalender] as cal
on cal.Calendar_Date=Convert(date,aud.Due_Date)


select x.Week_No,
x.TPNB,y.Supplier
from
(
select
Week_No,
TPNB,
count(Supplier) as c
from
(select
distinct 
Week_No,
TPNB,
Supplier
from tblSupplierSalesByWeek
)as a
group by 
Week_No,
TPNB
having count(Supplier)=1
) as x
inner join (select distinct Supplier,TPNB,Week_No from tblSupplierSalesByWeek) as y
on x.Week_No=y.Week_No and x.TPNB=y.TPNB;


select
aud.*,
cal.Year_Week_Number,
spec.TPNB,
xy.Supplier
from 

(select distinct Supplier_Code,Supplier_Name,Site_Code,Site_Name,Due_Date from tblAudits) as aud
left join
( select distinct Supplier_Code,Site_Code,TPNB from  tblSpecTpnbs ) as spec
on spec.Supplier_Code =aud.Supplier_Code and spec.Site_Code=aud.Site_Code
inner join [dbo].[tblTescoCalender] as cal
on cal.Calendar_Date=Convert(date,aud.Due_Date)

left join
(
select 
distinct
x.Week_No,
x.TPNB,y.Supplier
from
(
select
Week_No,
TPNB,
count(Supplier) as c
from
(select
distinct 
Week_No,
TPNB,
Supplier
from tblSupplierSalesByWeek
)as a
group by 
Week_No,
TPNB
having count(Supplier)=1
) as x
inner join (select distinct Supplier,TPNB,Week_No from tblSupplierSalesByWeek) as y
on x.Week_No=y.Week_No and x.TPNB=y.TPNB
) as xy
on xy.TPNB=spec.TPNB and xy.Week_No=cal.Year_Week_Number


select distinct a.Supplier_Code,a.Supplier_Name,a.Site_Code,a.Site_Name,b.TPNB from tblAudits as a
left join tblSpecTpnbs as b
on a.Supplier_Code=b.Supplier_Code and a.Site_Code=b.Site_Code
where a.Supplier_Code='14163' and a.Site_Code='A00645';

select distinct Supplier,Supplier_Name from tblSupplierSalesByWeek
where TPNB=50018831 and Period_No=201802;



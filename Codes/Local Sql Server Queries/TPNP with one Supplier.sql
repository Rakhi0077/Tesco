select a.Supplier,
a.Supplier_Name,
c.Parent_Supplier,
c.Parent_Supplier_Name,
a.TPNB,
sum(Sales_TY) as Sales_TY 
 from tblSupplierSalesByWeek as a
 inner join (select distinct Supplier_Number,Parent_Supplier,Parent_Supplier_Name from [tblSupplierList] ) as c
 on c.Supplier_Number=a.Supplier
inner join


(
select 
distinct
x.TPNB,
Supplier,
Supplier_Name
from
(
select
TPNB,
count(Supplier) as c
from
(select
distinct 
TPNB,
Supplier,
SUM(Sales_TY) as Sales
from tblSupplierSalesByWeek
where Week_No>=201933
group by TPNB,
Supplier
having SUM(Sales_TY)>0
)as a
group by 
TPNB
having count(Supplier)=1
) as x
inner join
(select
distinct 
TPNB,
Supplier,
Supplier_Name,
SUM(Sales_TY) as Sales
from tblSupplierSalesByWeek
where Week_No>=201933
group by TPNB,
Supplier,
Supplier_Name
having SUM(Sales_TY)>0
) as y
on x.TPNB=y.TPNB

) as b
on a.TPNB=b.TPNB and a.Supplier=b.Supplier
where a.Week_No>=201933
group by 
a.Supplier,
a.Supplier_Name,
c.Parent_Supplier,
c.Parent_Supplier_Name,
a.TPNB




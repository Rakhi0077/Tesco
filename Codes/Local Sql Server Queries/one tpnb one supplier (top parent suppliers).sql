select aud_spec.*,
one_tpnb_one_supplier.Supplier,
one_tpnb_one_supplier.Supplier_Name,
one_tpnb_one_supplier.Parent_Supplier,
one_tpnb_one_supplier.Parent_Supplier_Name
from

(select 
distinct aud.Supplier_Code,
aud.Supplier_Name,
aud.Site_Code,
aud.Site_Name,
spec.TPNB,
bpr.Long_Description,
cat.Junior_Buyer

from tblAudits as aud
inner join (select distinct Site_Code,Supplier_Code,TPNB from tblSpecTpnbs )as spec
on aud.Supplier_Code=spec.Supplier_Code and aud.Site_Code=spec.Site_Code 
inner join tblbprList as bpr
on bpr.Base_Product_Number=spec.TPNB
inner join (select distinct Product_Sub_Group_Code,Junior_Buyer from tblCategoryList
			where Commercial_Director in ('FRES          H.','PACKAGE       D.')
			) as cat
on cat.Product_Sub_Group_Code=bpr.Product_Sub_Group_Code
) as aud_spec
inner join
(
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
) as one_tpnb_one_supplier
on one_tpnb_one_supplier.TPNB=aud_spec.TPNB
inner join
(select 
top 10
Parent_Supplier,
Parent_Supplier_Name,
Sum(Sales_TY) as Sales_TY
from
(
select 
Week_No,
b.Parent_Supplier,
b.Parent_Supplier_Name,
a.Supplier,
a.Supplier_Name,
TPNB,
c.Tesco_Brand_Ind,
Sales_TY
 from tblSupplierSalesByWeek as a 
 inner join  [tblSupplierList] as b
 on a.Supplier=b.Supplier_Number
 inner join tblbprList as c
 on a.TPNB=c.Base_Product_Number
 where a.Week_No>=201933 and c.Tesco_Brand_Ind='T' 
 )
 as d
 group by Parent_Supplier,
Parent_Supplier_Name
order by Sum(Sales_TY) desc
) as top_parent_Suppliers
on top_parent_Suppliers.Parent_Supplier=one_tpnb_one_supplier.Parent_Supplier


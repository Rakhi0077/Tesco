USE CPRCOE
select 
a.Supplier,
a.Supplier_Name,
cat.Junior_Buyer,
Sum(case when bpr.Tesco_Brand_Ind='T' then 1 else 0 end) as OBL_Count,
Sum(case when bpr.Tesco_Brand_Ind='B' then 1 else 0 end) as BL_Count,
SUm(a.Sales_TY) as Sales


from

(
select 
distinct 
Supplier,
Supplier_Name
,TPNB,
sum(Sales_TY) as Sales_TY  from tblSupplierSalesByWeek
where Week_No>202035 and Sales_TY>0 
group by 
Supplier,
Supplier_Name
,TPNB

) as a
inner join tblbprList as bpr
on a.TPNB=bpr.Base_Product_Number
inner join tblCategoryList as cat
on cat.Product_Sub_Group_Code=bpr.Product_Sub_Group_Code
group by a.Supplier,
a.Supplier_Name,
cat.Junior_Buyer
select distinct TPNB,
Supplier,
c.Junior_Buyer,
c.Category_Director,
b.Tesco_Brand_Ind

 from 
tblSupplierSalesByWeek as a 
inner join tblbprList as b
on a.TPNB=b.Base_Product_Number
inner join tblCategoryList as c
on b.Product_Sub_Group_Code=c.Product_Sub_Group_Code
where c.Category_Director='BW            S.' and b.Tesco_Brand_Ind='T'




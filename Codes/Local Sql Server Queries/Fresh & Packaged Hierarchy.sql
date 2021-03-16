
select 
distinct
Base_Product_Number,
cat.Product_Sub_Group_Code,
Junior_Buyer,
Buying_Controller,
Category_Director,
Commercial_Director,
Company
from tblbprList as bpr
inner join(select * from   tblCategoryList
where Commercial_Director in ('PACKAGE       D.','FRES          H.') ) as cat
on cat.Product_Sub_Group_Code=bpr.Product_Sub_Group_Code
select
year_number,
period_number,
supplier_number,
Commercial_Director,
Category_Director,
Buying_Controller,
Buyer,
Junior_Buyer,
SUM(sales_ex_VAT) as Sales_Value,
SUM(sales_qtywgt) as Sales_Volume,
SUM(COGS) as COGS,
SUM(COmmercial_Gross_Margin) as CGM
from

(
select 
year_number,
period_number,
supplier_number,
tpnb_stnd,
sales_qtywgt,
sales_ex_VAT,
COGS,
Commercial_Gross_Margin,
Sales_Variable_profit,
bpr.Commercial_Director,
bpr.Category_Director,
bpr.Buying_Controller,
bpr.Buyer,
bpr.Junior_Buyer

from dxwi_prod_cts_play_pen.mv44_CTSdata_r_CgmSvpPdStoreProductChannel as supp
inner join dxwi_prod_generic_play_pen.a1_hierarchy_tpnb bpr
on supp.tpnb_stnd = bpr.base_product_number
where supp.year_number=2020 and period_number in (5,6,7)

)
as base
group by year_number,
period_number,
supplier_number,
Commercial_Director,
Category_Director,
Buying_Controller,
Buyer,
Junior_Buyer

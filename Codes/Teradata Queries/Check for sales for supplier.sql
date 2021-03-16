select 
distinct
a.Supplier,
a.Item_L2_SKU,
bpr.Junior_Buyer,
Sales_Value
from DXWV_PROD_UK_VIEW_ACCESS.VWV0LWJ_WK_IT_LS_SUPP as a 
inner join dxwi_prod_generic_play_pen.a1_hierarchy_tpnb bpr
on a.Item_L2_SKU = bpr.base_product_number
where Year_week_Number >=201924 and a.Sales_Value >0 and a.Supplier=40525 and Junior_Buyer='PREMIUMHAIRCARE.'
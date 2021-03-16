select distinct lwj.Supplier,
lwj.Item_L2_SKU,
buy.*
from DXWV_PROD_UK_VIEW_ACCESS.VWV0LWJ_WK_IT_LS_SUPP lwj
inner join DXWI_PROD_VIEW_ACCESS.VWI0bpr_base_product bpr
on lwj.Item_L2_SKU = bpr.base_product_number
inner join DXWI_PROD_VIEW_ACCESS.VWI0WBY_WEEKLY_BUYER_LOOKUP buy
on buy.product_sub_group_code = bpr.product_sub_group_code
where buy.Category_Director in ('FRES          H.', 'PACKAGE       D.')


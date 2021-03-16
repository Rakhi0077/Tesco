select
b.Supplier,
b.Junior_Buyer,
Sum (case when e.tesco_brand_ind='T' then 1 else 0 end) as OBL_Count,
SUm(case when e.tesco_brand_ind='B' then 1 else 0 end) as BL_Count
from

(select 
distinct
a.Supplier,
a.Item_L2_SKU,
bpr.Junior_Buyer
from DXWV_PROD_UK_VIEW_ACCESS.VWV0LWJ_WK_IT_LS_SUPP as a 
inner join dxwi_prod_generic_play_pen.a1_hierarchy_tpnb bpr
on a.Item_L2_SKU = bpr.base_product_number
where Year_week_Number >=201924 and a.Sales_Value >0
) as b
left join (
	select
	c.base_product_number,
	c.tesco_brand_ind,
	d.Junior_Buyer
	from
dxwv_prod_uk_view_access.vwi0bpr_base_product as c
left join dxwi_prod_generic_play_pen.a1_hierarchy_tpnb as d
on c.base_product_number=d.base_product_number
) as e
on b.Item_L2_SKU=e.base_product_number and b.Junior_Buyer=e.Junior_Buyer
where b.Supplier=53954 and b.Junior_Buyer='TURKE         Y.'
group by b.Supplier,
b.Junior_Buyer
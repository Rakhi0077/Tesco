select 
x.Year_Number,
x.Period_Number,
x.Depot_Number,
x.TPND_Traded_Unit,
x.Supplier_Number,
x.Case_Quantity,
y.Base_Product_Number,
y.Junior_Buyer,
y.Category_Director,
y.Commercial_Director,
y.COGS,
Sum(y.Commercial_Gross_Margin) as CGM
from

(

select 
distinct
a.Year_Number,
a.Period_Number,
a.Retail_Outlet_Number,
a.Depot_Number,
a.TPND_Traded_Unit,
a.Base_Product_Number,
buy.Junior_Buyer,
buy.Category_Director,
buy.Commercial_Director,
a.COGS,
b.Commercial_Gross_Margin
from  DXWI_PROD_CTS_PLAY_PEN.NETDEV_CTS_BY_PERIOD as a
inner join dxwi_prod_cts_play_pen.mv44_CTSdata_1_CgmSvpPdStoreProductChannel as b
on a.Year_Number=b.Year_Number and a.Period_Number=b.Period_Number and a.Base_Product_Number=b.tpnb_stnd and a.retail_outlet_number=b.Retail_Outlet_Number
inner join DXWI_PROD_VIEW_ACCESS.VWI0bpr_base_product bpr
on a.Base_Product_Number = bpr.base_product_number
inner join DXWI_PROD_VIEW_ACCESS.VWI0WBY_WEEKLY_BUYER_LOOKUP buy
on buy.product_sub_group_code = bpr.product_sub_group_code
where a.Year_Number =2019 and a.Period_Number=06 and buy.Commercial_Director in ('FRES          H.','PACKAGE       D.') and a.Base_Product_Number='65310375'
) as y

inner join
(
	select 
distinct
cal.Year_Number,
right(CAST(cal.Year_Period_Number AS varchar(50)),2) as Period_Number,
Depot_Number,
TPND_Traded_Unit,
Supplier_Number,
Sum(Case_Quantity) as Case_Quantity
from DXWI_PROD_VIEW_ACCESS.VWI0PLH_PURCHASE_ORDER_DETAIL as pod
left join  DXWV_PROD_UK_VIEW_ACCESS.VWV0CAL_CALENDAR  as cal
on pod.Delivered_Date=cal.Calendar_Date
where cal.Year_Number=2019 and right(CAST(cal.Year_Period_Number AS varchar(50)),2)=06 
group by 1,2,3,4,5
	
) as x
on x.Year_Number=y.Year_Number and x.Period_Number=y.Period_Number and x.Depot_Number=y.Depot_Number and x.TPND_Traded_Unit=y.TPND_Traded_Unit
group by 
x.Year_Number,
x.Period_Number,
x.Depot_Number,
x.TPND_Traded_Unit,
x.Supplier_Number,
x.Case_Quantity,
y.Base_Product_Number,
y.Junior_Buyer,
y.Category_Director,
y.Commercial_Director,
y.COGS

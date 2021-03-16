select 
Base_Product_Number,
Product_Sub_Group_Code,
Sell_By_Weight_Ind,
Change_of_Mind,
GHS_Refund,
Product_Quality,
EPW_Recall,
Refund_Value,
Refund_Weight,
Refund_Qty,
Scanned_Sales_Qty,
Scanned_Sales_Value,
Scanned_Sales_Wgt ,
GrossSales,
Change_Of_Mind_RPMU,
GHS_Refund_RPMU,
Product_Quality_RPMU,
EPW_Recall_RPMU,
((zeroifnull(Change_Of_Mind)+ zeroifnull(GHS_Refund)+zeroifnull(Product_Quality)+zeroifnull(EPW_Recall))*1000000/GrossSales) as OverAllRPMU,
(CASE WHEN  GrossSales= 0 THEN (ZeroIfNull(Refund_Weight)/NULLIF(ZeroIfNull(Scanned_Sales_Wgt),0)) Else (ZeroIfNull(Refund_Qty) / NULLIF(ZeroIfNull(Scanned_Sales_Qty),0)) END) as "ARR"


from
(select 
Base_Product_Number,
Product_Sub_Group_Code,
Sell_By_Weight_Ind,
Change_of_Mind,
GHS_Refund,
Product_Quality,
EPW_Recall,
Refund_Value,
Refund_Weight,
Refund_Qty,
Scanned_Sales_Qty,
Scanned_Sales_Value,
Scanned_Sales_Wgt ,
GrossSales,
((zeroifnull(Change_of_Mind)*1000000)/NULLIF(GrossSales,0)) as Change_Of_Mind_RPMU,
((zeroifnull(GHS_Refund)*1000000)/NULLIF(GrossSales,0)) as GHS_Refund_RPMU,
((zeroifnull(Product_Quality)*1000000)/NULLIF(GrossSales,0)) as Product_Quality_RPMU,
((zeroifnull(EPW_Recall)*1000000)/NULLIF(GrossSales,0)) as EPW_Recall_RPMU

from
(select
Base_Product_Number,
Product_Sub_Group_Code,
Sell_By_Weight_Ind,
Change_of_Mind,
GHS_Refund,
Product_Quality,
EPW_Recall,
Refund_Value,
Refund_Weight,
Refund_Qty,

Scanned_Sales_Qty,
Scanned_Sales_Value,
Scanned_Sales_Wgt ,
SUM(CASE WHEN  Sell_By_Weight_Ind= 'w' THEN (ZeroIfNull(Scanned_Sales_Wgt)+ZeroIfNull(Refund_Weight)) Else (ZeroIfNull(Scanned_Sales_Qty) + ZeroIfNull(Refund_Qty)) END) as "GrossSales"
from (
SELECT
Base_Product_Number,
Product_Sub_Group_Code,
Sell_By_Weight_Ind,

SUM(Change_of_Mind) as Change_of_Mind,
SUM(GHS_Refund) as GHS_Refund,
SUM(Product_Quality) as Product_Quality,
SUM(EPW_Recall) as EPW_Recall,
SUM(Refund_Value) as Refund_Value,
SUM(Refund_Weight) as Refund_Weight,
SUM(Refund_Qty) as Refund_Qty,

SUM(Scanned_Sales_Qty) as Scanned_Sales_Qty,
SUM(Scanned_Sales_Value) as Scanned_Sales_Value,
SUM(Scanned_Sales_Wgt) as Scanned_Sales_Wgt 

FROM

(
SELECT
wks.year_week_number as Week_No,
wks.Base_Product_Number,
bpr.Product_Sub_Group_Code,
Sell_By_Weight_Ind,
B.Refund_Value as Refund_Value,
B.Refund_Wt as Refund_Weight,
B.Refund_Qty as Refund_Qty,


B.Change_of_Mind as Change_of_Mind,
B.GHS_Refund as GHS_Refund,
B.Product_Quality as Product_Quality,
B.EPW_Recall as EPW_Recall,


SUM(Scanned_Sales_Qty) AS Scanned_Sales_Qty,
SUM(Scanned_Sales_Value) Scanned_Sales_Value,
SUM(Scanned_Sales_Wgt) AS Scanned_Sales_Wgt


FROM VWI0WKS_WKLY_STORE_SALES_TPNB AS wks
JOIN VWI0BPR_BASE_PRODUCT AS bpr ON wks.Base_Product_Number = bpr.Base_Product_Number
JOIN VWI0BUY_DAILY_BUYER_LOOKUP AS buy ON bpr.Product_Sub_Group_Code = buy.Product_Sub_Group_Code
JOIN (SELECT year_week_number, year_number, period_number FROM VWI0CAL_CALENDAR GROUP BY 1,2,3) AS cal ON wks.year_week_number = cal.year_week_number
LEFT JOIN 

(
SELECT
bbf.Base_Product_Number,
year_week_number,
SUM(CASE WHEN bbf.Refund_Code = '1' THEN bbf.Refund_Qty Else 0 END) as "Change_of_Mind",
SUM(CASE WHEN bbf.Refund_Code = '2' THEN bbf.Refund_Qty Else 0 END) as "Product_Quality",
SUM(CASE WHEN bbf.Refund_Code = '3' AND Homeshopping_Ind = 'N' then bbf.Refund_Qty Else 0 END) as "EPW_Recall",
SUM(CASE WHEN bbf.Refund_Code = '3' AND Homeshopping_Ind = 'Y' then bbf.Refund_Qty Else 0 END) as "GHS_Refund",
SUM(bbf.Refund_Value) AS Refund_Value,

sum(bbf.Refund_Weight) as Refund_Wt,
SUM(bbf.Refund_Qty) as Refund_Qty


FROM VWI0BBF_DAILY_STR_TPNB_REFUNDS AS bbf
JOIN VWI0BPR_BASE_PRODUCT AS bpr ON bbf.Base_Product_Number = bpr.Base_Product_Number
JOIN VWI0BUY_DAILY_BUYER_LOOKUP AS buy ON bpr.Product_Sub_Group_Code = buy.Product_Sub_Group_Code
JOIN VWI0CAL_CALENDAR AS cal ON bbf.Calendar_Date = cal.Calendar_Date
WHERE bbf.Refund_Code IN ('1','2','3')
and bbf.calendar_date in (sel calendar_date from VWI0CAL_CALENDAR where year_week_number between 201849 and 201852)
AND (Commercial_Director IN ('FRES          H.', 'PACKAGE       D.'))
GROUP BY 1,2
) B

ON B.Base_Product_Number = wks.Base_Product_Number
and wks.year_week_number = B.year_week_number

WHERE wks.Year_Week_Number between 201849 and 201852
AND (Commercial_Director  IN ('FRES          H.', 'PACKAGE       D.'))



GROUP BY 1,2,3,4,5,6,7,8,9,10,11
)Base
GROUP BY 1,2,3
) Gross
group by 1,2,3,4,5,6,7,8,9,10,11,12,13
)RPMU
group by 1,2,3,4,5,6,7,8,9,10,11,12,13,14
)Overall
group by 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18

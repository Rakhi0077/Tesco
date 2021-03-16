select 
try.Product_Sub_Group_Code,
Refund_Wt,
Refund_Qty,
SUM(try.Scanned_Sales_Qty),
SUM(Scanned_Sales_Wgt),
count(distinct(LONG_DESCRIPTION)) as  LG_Count
from 
(

SELECT
wks.Base_Product_Number,
bp.Product_Sub_Group_Code,
Sell_By_Weight_Ind,
bp.LONG_DESCRIPTION,
B.Refund_Wt,
B.Refund_Qty,
SUM(Scanned_Sales_Qty) as Scanned_Sales_Qty,
SUM(Scanned_Sales_Wgt) as Scanned_Sales_Wgt

FROM VWI0WKS_WKLY_STORE_SALES_TPNB AS wks
JOIN VWI0BPR_BASE_PRODUCT AS bp ON wks.Base_Product_Number = bp.Base_Product_Number
JOIN VWI0BUY_DAILY_BUYER_LOOKUP AS buy ON bp.Product_Sub_Group_Code = buy.Product_Sub_Group_Code
LEFT JOIN 

(
SELECT
bpr.Product_Sub_Group_Code,
sum(bbf.Refund_Weight) as Refund_Wt,
SUM(bbf.Refund_Qty) as Refund_Qty


FROM VWI0BBF_DAILY_STR_TPNB_REFUNDS AS bbf
JOIN VWI0BPR_BASE_PRODUCT AS bpr ON bbf.Base_Product_Number = bpr.Base_Product_Number
JOIN VWI0BUY_DAILY_BUYER_LOOKUP AS buy ON bpr.Product_Sub_Group_Code = buy.Product_Sub_Group_Code
JOIN VWI0CAL_CALENDAR AS cal ON bbf.Calendar_Date = cal.Calendar_Date
WHERE bbf.Refund_Code IN ('1','2','3')
and bbf.calendar_date in (sel calendar_date from VWI0CAL_CALENDAR where year_week_number between 201849 and 201852)
AND (Commercial_Director IN ('FRES          H.', 'PACKAGE       D.'))
AND bpr.Product_Sub_Group_Code='F51RE'
GROUP BY 1
) B
on B.Product_Sub_Group_Code=bp.Product_Sub_Group_Code
WHERE wks.Year_Week_Number between 201849 and 201852
AND (Commercial_Director  IN ('FRES          H.', 'PACKAGE       D.'))
AND bp.Product_Sub_Group_Code='F51RE'
GROUP BY 1,2,3,4,5,6
) try
group by 1,2,3
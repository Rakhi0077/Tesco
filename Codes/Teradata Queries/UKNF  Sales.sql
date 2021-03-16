SELECT

Period_No,
Week_No,
Base_Product_Number,
Product_Sub_Group_Code,
Refund_Value,
Quality_Refund_Value,
Refund_Qty,
Quality_Refund_Qty,
Refund_Wt as Refund_Weight,
Quality_Refund_Weight,
Scanned_Sales_Qty,
Scanned_Sales_Value,
Scanned_Sales_Wgt,
(Scanned_Sales_Qty + ZEROIFNULL(Refund_Qty)) AS Gross_Sales_Qty,
(Scanned_Sales_Wgt + ZEROIFNULL(Refund_Wt)) AS Gross_Sales_Wgt

FROM

(
SELECT
(year_number*100)+period_number AS Period_No,
wks.year_week_number as Week_No,
wks.Base_Product_Number,
bpr.Product_Sub_Group_Code,
B.Refund_Value,
Quality_Refund_Value,
B.Refund_Qty,
Quality_Refund_Qty,
B.Refund_Wt,
Quality_Refund_Weight,
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
SUM(bbf.Refund_Qty) AS Refund_Qty,
sum(case when refund_code = 2 then refund_qty else 0 end) as Quality_Refund_Qty,
SUM(bbf.Refund_Value) AS Refund_Value,
sum(case when refund_code = 2 then bbf.Refund_Value else 0 end) as Quality_Refund_Value,
sum(bbf.Refund_Weight) as Refund_Wt,
sum(case when refund_code = 2 then bbf.Refund_Weight else 0 end) as Quality_Refund_Weight

FROM VWI0BBF_DAILY_STR_TPNB_REFUNDS AS bbf
JOIN VWI0BPR_BASE_PRODUCT AS bpr ON bbf.Base_Product_Number = bpr.Base_Product_Number
JOIN VWI0BUY_DAILY_BUYER_LOOKUP AS buy ON bpr.Product_Sub_Group_Code = buy.Product_Sub_Group_Code
JOIN VWI0CAL_CALENDAR AS cal ON bbf.Calendar_Date = cal.Calendar_Date
WHERE bbf.Refund_Code IN ('1','2','3')
and bbf.calendar_date in (sel calendar_date from VWI0CAL_CALENDAR where year_week_number  between 201913  and 201914)
AND (Commercial_Director NOT IN ('FRES          H.', 'PACKAGE       D.', 'TOBACCO & PF  S.') or buy. Product_Sub_Group_Code = 'H37PX')
GROUP BY 1,2
) B

ON B.Base_Product_Number = wks.Base_Product_Number
and wks.year_week_number = B.year_week_number

WHERE wks.Year_Week_Number  between   201913  and 201914
AND (Commercial_Director NOT  IN ('FRES          H.', 'PACKAGE       D.', 'TOBACCO & PF  S.') or buy. Product_Sub_Group_Code = 'H37PX')
GROUP BY 1,2,3,4,5,6,7,8,9,10
)Base
GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
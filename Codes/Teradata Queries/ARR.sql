select 
(Cast(ar.Refund_Qty as Decimal (18,8)) / ar.Scanned_Sales_Qty * 100) as arr


from

(
SELECT
bp.Product_Sub_Group_Code,
B.Refund_Wt,
B.Refund_Qty,
SUM(Scanned_Sales_Qty) AS Scanned_Sales_Qty,
SUM(Scanned_Sales_Value) Scanned_Sales_Value,
SUM(Scanned_Sales_Wgt) AS Scanned_Sales_Wgt


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
AND bpr.Product_Sub_Group_Code='G36ME'
GROUP BY 1
) B

ON B.Product_Sub_Group_Code = bp.Product_Sub_Group_Code

WHERE wks.Year_Week_Number between 201849 and 201852
AND (Commercial_Director  IN ('FRES          H.', 'PACKAGE       D.'))
AND bp.Product_Sub_Group_Code='G36ME'

GROUP BY 1,2,3
) as ar
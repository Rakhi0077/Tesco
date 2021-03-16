SELECT
T1.Year_Week_Number,
T1.Supplier AS Supplier_Number,
T3.Commercial_Director,
T3.Category_Director,
T3.Junior_Buyer,
CAST(SUM(ZEROIFNULL(T1.COGS_Value)) AS DECIMAL(10,0)) AS COGS_Value_TY
FROM DXWV_PROD_UK_VIEW_ACCESS.VWV0LWJ_WK_IT_LS_SUPP AS T1
INNER JOIN DXWV_PROD_UK_VIEW_ACCESS.VWI0BPR_BASE_PRODUCT AS T2
ON T1.Item_L2_SKU=T2.Base_Product_Number
INNER JOIN DXWI_PROD_VIEW_ACCESS.VWI0BUY_DAILY_BUYER_LOOKUP AS T3
ON T2.Product_Sub_Group_Code=T3.Product_Sub_Group_Code WHERE T1.Supplier=11575 and T1.Year_Week_Number>201923 and T3.Junior_Buyer='MFP PIE       S.'
AND T3.Commercial_Director IN ('PACKAGE       D.','FRES          H.')
GROUP BY T1.Year_Week_Number,Supplier_Number,T3.Commercial_Director,T3.Category_Director,T3.Junior_Buyer
ORDER BY T1.Year_Week_Number,Supplier_Number,T3.Commercial_Director,T3.Category_Director,T3.Junior_Buyer;
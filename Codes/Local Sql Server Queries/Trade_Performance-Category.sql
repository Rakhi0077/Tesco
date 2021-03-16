SET tez.queue.name=gg-uk-tescoglobal-hadoop-lab-rcoe;    
 
SELECT 
    A.YEAR_WEEK_NUMBER
    , A.YEAR_NUMBER 
    , A.WEEK_NUMBER 
    , A.BUSINESS_AREA 
    , A.COMMERCIAL_AREA 
    , CASE when A.CATEGORY_AREA='Electrical' THEN 'Home Electrical'
    when A.CATEGORY_AREA='Media & Entertainment' THEN 'Entertainment'
    when A.CATEGORY_AREA='Papershop' THEN 'Stationery and Home Office'
    when A.CATEGORY_AREA='Recreation' THEN 'Everyday Essentials'
    
    when A.CATEGORY_AREA='Seasonal' THEN 'Seasonal Celebrations and Home'
    when A.CATEGORY_AREA='Toys & Nursery' THEN 'Toys Nursery and Sport'
    
            ELSE A.CATEGORY_AREA end AS CATEGORY_AREA 
    , SUM (SALES_TY) AS SALES_TY 
    , SUM (SALES_QTD_TY) AS SALES_QTD_TY 
    , SUM (SALES_YTD_TY) AS SALES_YTD_TY 
    , SUM (TRANSACTIONS_TY) AS TRANSACTIONS_TY 
    , SUM (TRANSACTIONS_QTD_TY) AS TRANSACTIONS_QTD_TY 
    , SUM (TRANSACTIONS_YTD_TY) AS TRANSACTIONS_YTD_TY 
    , SUM (BASKET_VALUE_TY) AS BASKET_VALUE_TY 
    , SUM (BASKET_VALUE_QTD_TY) AS BASKET_VALUE_QTD_TY 
    , SUM (BASKET_VALUE_YTD_TY) AS BASKET_VALUE_YTD_TY 
    , SUM (BASKET_SIZE_TY) AS BASKET_SIZE_TY 
    , SUM (BASKET_SIZE_QTD_TY) AS BASKET_SIZE_QTD_TY 
    , SUM (BASKET_SIZE_YTD_TY) AS BASKET_SIZE_YTD_TY 
    , SUM (ITEM_PRICE_TY) AS ITEM_PRICE_TY 
    , SUM (ITEM_PRICE_QTD_TY) AS ITEM_PRICE_QTD_TY 
    , SUM (ITEM_PRICE_YTD_TY) AS ITEM_PRICE_YTD_TY 
    , SUM (SALES_LY) AS SALES_LY 
    , SUM (SALES_QTD_LY) AS SALES_QTD_LY 
    , SUM (SALES_YTD_LY) AS SALES_YTD_LY 
    , SUM (TRANSACTIONS_LY) AS TRANSACTIONS_LY 
    , SUM (TRANSACTIONS_QTD_LY) AS TRANSACTIONS_QTD_LY 
    , SUM (TRANSACTIONS_YTD_LY) AS TRANSACTIONS_YTD_LY 
    , SUM (BASKET_VALUE_LY) AS BASKET_VALUE_LY 
    , SUM (BASKET_VALUE_QTD_LY) AS BASKET_VALUE_QTD_LY 
    , SUM (BASKET_VALUE_YTD_LY) AS BASKET_VALUE_YTD_LY 
    , SUM (BASKET_SIZE_LY) AS BASKET_SIZE_LY 
    , SUM (BASKET_SIZE_QTD_LY) AS BASKET_SIZE_QTD_LY 
    , SUM (BASKET_SIZE_YTD_LY) AS BASKET_SIZE_YTD_LY 
    , SUM (ITEM_PRICE_LY) AS ITEM_PRICE_LY 
    , SUM (ITEM_PRICE_QTD_LY) AS ITEM_PRICE_QTD_LY 
    , SUM (ITEM_PRICE_YTD_LY) AS ITEM_PRICE_YTD_LY
FROM
    (
        SELECT 
            A1.YEAR_WEEK_NUMBER
            , A2.YEAR_NUMBER 
            , A2.WEEK_NUMBER 
            , A1.BUSINESS_AREA 
            , A1.COMMERCIAL_AREA 
            , A1.category_area
            , SUM (TW_SALES_inc_VAT) AS SALES_TY 
            , SUM (QTD_SALES_inc_VAT) AS SALES_QTD_TY 
            , SUM (YTD_SALES_inc_VAT) AS SALES_YTD_TY 
            , SUM (TW_TRANSACTION_COUNT) AS TRANSACTIONS_TY 
            , SUM (QTD_TRANSACTION_COUNT) AS TRANSACTIONS_QTD_TY 
            , SUM (YTD_TRANSACTION_COUNT) AS TRANSACTIONS_YTD_TY 
            , SUM (TW_SALES_inc_VAT) / SUM (TW_TRANSACTION_COUNT) AS BASKET_VALUE_TY 
            , SUM (QTD_SALES_inc_VAT) / SUM (QTD_TRANSACTION_COUNT) AS BASKET_VALUE_QTD_TY 
            , SUM (YTD_SALES_inc_VAT) / SUM (YTD_TRANSACTION_COUNT) AS BASKET_VALUE_YTD_TY 
            , SUM (TW_TPNB_COUNT) / SUM (TW_TRANSACTION_COUNT) AS BASKET_SIZE_TY 
            , SUM (QTD_TPNB_COUNT) / SUM (QTD_TRANSACTION_COUNT) AS BASKET_SIZE_QTD_TY 
            , SUM (YTD_TPNB_COUNT) / SUM (YTD_TRANSACTION_COUNT) AS BASKET_SIZE_YTD_TY 
            , SUM (TW_TPNB_PRICE_inc_VAT) / SUM (TW_TPNB_COUNT) AS ITEM_PRICE_TY 
            , SUM (QTD_TPNB_PRICE_inc_VAT) / SUM (QTD_TPNB_COUNT) AS ITEM_PRICE_QTD_TY 
            , SUM (YTD_TPNB_PRICE_inc_VAT) / SUM (YTD_TPNB_COUNT) AS ITEM_PRICE_YTD_TY
        FROM lab_rcoe.tradeperformance_category A1
        INNER JOIN LAB_RCOE.TESCO_WEEK A2 
            ON A1.YEAR_WEEK_NUMBER = A2.YEAR_WEEK_NUMBER
        WHERE YEAR_NUMBER = 2019
            AND COUNTRY_CODE < 7
        GROUP BY 
            A1.YEAR_WEEK_NUMBER 
            , A2.YEAR_NUMBER 
            , A2.WEEK_NUMBER 
            , A1.BUSINESS_AREA 
            , A1.COMMERCIAL_AREA 
            , A1.CATEGORY_AREA
    ) A
LEFT JOIN
    (
        SELECT 
            B1.YEAR_WEEK_NUMBER 
            , B2.YEAR_NUMBER 
            , B2.WEEK_NUMBER 
            , B1.BUSINESS_AREA 
            , B1.COMMERCIAL_AREA 
            , B1.category_area
            , SUM (TW_SALES_inc_VAT) AS SALES_LY 
            , SUM (QTD_SALES_inc_VAT) AS SALES_QTD_LY 
            , SUM (YTD_SALES_inc_VAT) AS SALES_YTD_LY 
            , SUM (TW_TRANSACTION_COUNT) AS TRANSACTIONS_LY 
            , SUM (QTD_TRANSACTION_COUNT) AS TRANSACTIONS_QTD_LY 
            , SUM (YTD_TRANSACTION_COUNT) AS TRANSACTIONS_YTD_LY 
            , SUM (TW_SALES_inc_VAT) / SUM (TW_TRANSACTION_COUNT) AS BASKET_VALUE_LY 
            , SUM (QTD_SALES_inc_VAT) / SUM (QTD_TRANSACTION_COUNT) AS BASKET_VALUE_QTD_LY 
            , SUM (YTD_SALES_inc_VAT) / SUM (YTD_TRANSACTION_COUNT) AS BASKET_VALUE_YTD_LY 
            , SUM (TW_TPNB_COUNT) / SUM (TW_TRANSACTION_COUNT) AS BASKET_SIZE_LY 
            , SUM (QTD_TPNB_COUNT) / SUM (QTD_TRANSACTION_COUNT) AS BASKET_SIZE_QTD_LY 
            , SUM (YTD_TPNB_COUNT) / SUM (YTD_TRANSACTION_COUNT) BASKET_SIZE_YTD_LY 
            , SUM (TW_TPNB_PRICE_inc_VAT) / SUM (TW_TPNB_COUNT) AS ITEM_PRICE_LY 
            , SUM (QTD_TPNB_PRICE_inc_VAT) / SUM (QTD_TPNB_COUNT) AS ITEM_PRICE_QTD_LY 
            , SUM (YTD_TPNB_PRICE_inc_VAT) / SUM (YTD_TPNB_COUNT) AS ITEM_PRICE_YTD_LY
        FROM lab_rcoe.tradeperformance_category B1
        INNER JOIN LAB_RCOE.TESCO_WEEK B2 
            ON B1.YEAR_WEEK_NUMBER = B2.YEAR_WEEK_NUMBER
        WHERE YEAR_NUMBER = 2018
            AND COUNTRY_CODE < 7
        GROUP BY 
            B1.YEAR_WEEK_NUMBER 
            , B2.YEAR_NUMBER 
            , B2.WEEK_NUMBER 
            , B1.BUSINESS_AREA 
            , B1.COMMERCIAL_AREA 
            , B1.CATEGORY_AREA
    ) B 
    ON A.WEEK_NUMBER = B.WEEK_NUMBER
        AND A.BUSINESS_AREA = B.BUSINESS_AREA
        AND A.COMMERCIAL_AREA = B.COMMERCIAL_AREA
        AND A.CATEGORY_AREA = B.CATEGORY_AREA
GROUP BY 
    A.YEAR_WEEK_NUMBER 
    , A.YEAR_NUMBER 
    , A.WEEK_NUMBER 
    , A.BUSINESS_AREA 
    , A.COMMERCIAL_AREA 
    , A.CATEGORY_AREA
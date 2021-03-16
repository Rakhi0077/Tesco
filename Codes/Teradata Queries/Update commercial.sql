SEL
distinct
SUP.PARENT_SUPPLIER_ID as Parent_Supplier,
PSN.Parent_Supplier_Name,
qss.supplier as Supplier_Number,
qss.supplier_name  as Supplier_Name,
bpr.Commercial_Director,
bpr.Commercial_Area,
bpr.Category_Director,
bpr.Category_Area,
bpr.Buying_Controller,
bpr.Buyer_Area,
bpr.Buyer,
bpr.Junior_Buyer,
bpr.Junior_Area,
bpr.Product_Area,
case when sales.sales >0 then 'Yes' else 'No' end as Status,
Sum(lwj.COGS_Value) as COGS_TY,
Sum(case when tbi.tesco_brand_ind='T' then 1 else 0 end) as OBL_Count,
Sum(case when tbi.tesco_brand_ind='B' then 1 else 0 end) as BL_Count

FROM DXWV_PROD_UK_VIEW_ACCESS.VWV0LWJ_WK_IT_LS_SUPP lwj
 
inner join dxwi_prod_generic_play_pen.a1_hierarchy_tpnb bpr
on lwj.Item_L2_SKU = bpr.base_product_number
 
inner join DXWV_PROD_UK_VIEW_ACCESS.VWV0QSSC_SUPPLIER qss
on lwj.supplier = qss.supplier

left join DXWI_PROD_VIEW_ACCESS.VWI0BPG_BASE_PROD_SUB_GRP as tbi
on tbi.Base_product_number=lwj.Item_L2_SKU



inner join (select SUM(Sales_value) as sales,Supplier from DXWV_PROD_UK_VIEW_ACCESS.VWV0LWJ_WK_IT_LS_SUPP lwj 
where year_Week_number>=201941
group by 2 ) as sales
on sales.Supplier=lwj.supplier
LEFT JOIN  DXWI_PROD_VIEW_ACCESS. VWI0QPS_SUPPLIER  SUP
ON lwj.supplier = SUP.SUPPLIER_ID
left join DXWV_PROD_UK_VIEW_ACCESS.VWE0QST_PARENT_SUPPLIER PSN
on PSN.Parent_Supplier=SUP.PARENT_SUPPLIER_ID
where  bpr.Commercial_Director in ('PACKAGE       D.','FRES          H.')
group by 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
;


--select * from dxwi_prod_generic_play_pen.a1_hierarchy_tpnb sample 10;
/*select distinct *  from  DXWV_PROD_UK_VIEW_ACCESS.VWV0LWJ_WK_IT_LS_SUPP lwj
where Supplier= 54401
*/
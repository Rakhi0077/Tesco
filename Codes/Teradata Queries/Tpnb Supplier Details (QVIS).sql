SEL
distinct
SUP.PARENT_SUPPLIER_ID as Parent_Supplier,
PSN.Parent_Supplier_Name,
qss.supplier as Supplier_Number,
qss.supplier_name  as Supplier_Name
FROM DXWV_PROD_UK_VIEW_ACCESS.VWV0LWJ_WK_IT_LS_SUPP lwj
 
inner join DXWV_PROD_UK_VIEW_ACCESS.VWV0QSSC_SUPPLIER qss
on lwj.supplier = qss.supplier

LEFT JOIN  DXWI_PROD_VIEW_ACCESS. VWI0QPS_SUPPLIER  SUP
ON lwj.supplier = SUP.SUPPLIER_ID
left join DXWV_PROD_UK_VIEW_ACCESS.VWE0QST_PARENT_SUPPLIER PSN
on PSN.Parent_Supplier=SUP.PARENT_SUPPLIER_ID
where Item_L2_SKU=81158842 

--select * from dxwi_prod_generic_play_pen.a1_hierarchy_tpnb sample 10;
/*select distinct *  from  DXWV_PROD_UK_VIEW_ACCESS.VWV0LWJ_WK_IT_LS_SUPP lwj
where Supplier= 54401
*/
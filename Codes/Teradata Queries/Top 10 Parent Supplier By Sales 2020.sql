SEL
distinct
SUP.PARENT_SUPPLIER_ID as Parent_Supplier,
PSN.Parent_Supplier_Name,
SUm(sales.sales) as Sales

FROM DXWV_PROD_UK_VIEW_ACCESS.VWV0LWJ_WK_IT_LS_SUPP lwj
 
inner join dxwi_prod_generic_play_pen.a1_hierarchy_tpnb bpr
on lwj.Item_L2_SKU = bpr.base_product_number


 
inner join DXWV_PROD_UK_VIEW_ACCESS.VWV0QSSC_SUPPLIER qss
on lwj.supplier = qss.supplier



inner join (select SUM(Sales_value) as sales,Supplier from DXWV_PROD_UK_VIEW_ACCESS.VWV0LWJ_WK_IT_LS_SUPP lwj 
inner join DXWI_PROD_VIEW_ACCESS.VWI0bpr_base_product br
on br.base_product_number=lwj.Item_L2_SKU
where year_Week_number>=201933 and br.Tesco_Brand_Ind='T'
group by 2 ) as sales
on sales.Supplier=lwj.supplier
LEFT JOIN  DXWI_PROD_VIEW_ACCESS. VWI0QPS_SUPPLIER  SUP
ON lwj.supplier = SUP.SUPPLIER_ID
left join DXWV_PROD_UK_VIEW_ACCESS.VWE0QST_PARENT_SUPPLIER PSN
on PSN.Parent_Supplier=SUP.PARENT_SUPPLIER_ID
where bpr.Commercial_Director in ('FRES          H.', 'PACKAGE       D.') and PSN.Parent_Supplier_Name not in ('DUMMY SUPPLIER')
group by 1,2
order by SUm(sales.sales) desc;



select  
bl.retail_outlet_number,
base_product_number,
cplus_department_code,
cps.c_plus_sub_dept_name,
bl.transaction_date,
bl.basket_reference_number,
tender_amount,
item_value,
item_volume,
total_basket_amount,
total_basket_keyed,
total_basket_quantity,
total_basket_weight


from DXWI_PROD_UK_DLWORK_DB01.VWI0FBA_BASKET_HEADER_RECEIPT   bh
left join DXWI_PROD_UK_DLWORK_DB01.VWI0FBB_BASKET_PURCHASE_LINE bl
on bl.transaction_date=bh.transaction_date and bl.retail_outlet_number=bh.retail_outlet_number and bh.basket_reference_number=bl.basket_reference_number
left join DXWI_PROD_VIEW_ACCESS.VWI0CSD_C_PLUS_SUB_DEPT cps 
on cps.c_plus_department=cplus_department_code
where bh.transaction_date= date '2019-05-09' and bh.basket_reference_number=20190510005837576
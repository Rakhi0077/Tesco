select a.* from
(
SELECT 
[Year]
 ,[Withdrawal_Date]
 ,[Period]
 ,[EPW]
 ,[Class]
 ,Case when len(Period)=1 then concat(Year,'0',Period)
	else concat(Year,Period) end as Year_Period,
 replace(replace([Supplier_Name], char(10), ''), char(13), '') as Supplier_Name,
 REPLACE
(REPLACE
(REPLACE
(REPLACE
(REPLACE
(REPLACE
(REPLACE
(REPLACE
(REPLACE
(REPLACE (replace(replace([Supplier_Name], char(10), ''), char(13), ''), '0', ''),
'1', ''),
'2', ''),
'3', ''),
'4', ''),
'5', ''),
'6', ''),
'7', ''),
'8', ''),
'9', '') as Supplier_Name_2
,[Withdrawal_Reason]
 ,[TPNB]
 ,cat.Junior_Buyer
 ,cat.Category_Director
 ,[Countries]
 ,rank() over ( partition by 
 Year
 ,[Withdrawal_Date]
 ,[Period]
 ,[EPW]
 ,[Class]
 ,Supplier_Name
 ,[Withdrawal_Reason]
 ,Countries order by TPNB asc) as rank_tpnb
FROM [CPRCOE].[dbo].[EPW]  as epw
left join ( select distinct Base_Product_Number,Product_Sub_Group_Code from tblbprList) as bpr
on bpr.Base_Product_Number=epw.TPNB
left join tblCategoryList as cat
on cat.Product_Sub_Group_Code = bpr.Product_Sub_Group_Code
 WHERE cat.Commercial_Director in ('FRES          H.','PACKAGE       D.')
 )as a
where a.rank_tpnb=1





 
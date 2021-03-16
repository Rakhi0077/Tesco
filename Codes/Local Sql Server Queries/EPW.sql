USE CPRCOE

SELECT 
*
FROM (SELECT EPW.*, CASE when row_number() over (partition BY Year, EPW ORDER BY TPNB)=1 THEN 1 ELSE 0 end AS Cnt FROM EPW) Base
LEFT JOIN 
(SELECT
      Junior_Buyer,
      Buyer,
      Buying_Controller,
      CASE when Category_Director = 'BAKERY&DAIR   Y.' THEN Buying_Controller ELSE Category_Director end AS  Category_Director,
      (CASE when Commercial_Director = 'FRES          H.' THEN 'Fresh'
            when  Commercial_Director ='PACKAGE       D.' THEN 'Packaged' 
            when  Commercial_Director ='HARDLINE      S.' THEN 'Hardlines' 
            when  Commercial_Director ='CLOTHIN       G.' THEN 'Clothing' 
           ELSE Commercial_Director END) AS Commercial_Director ,

      Company,
      AA.Base_Product_Number,
      Long_Description,
      (CASE when Tesco_Brand_Ind = 'T' THEN 'Own Brand Lines'
            when  Tesco_Brand_Ind ='B' THEN 'Branded Lines' 
           ELSE Tesco_Brand_Ind END) AS Tesco_Brand_Ind ,
      AA.Product_Sub_Group_Code,
      product_sub_group_description

FROM CPRCOE.dbo.tblbprList AS AA
INNER JOIN CPRCOE.dbo.tblHierarchy AS BB
ON AA.Product_Sub_Group_Code = BB.Product_Sub_Group_Code  
WHERE  Commercial_Director not IN 
('TELECOMM      S.','NONFOODMIS    C.','MISC          A.','NULL')
 
 
)CC
 ON Base.TPNB = Base_Product_Number

 WHERE TPNB <> 'N A'
 and TPNB <> 'Missed'
SELECT
	LEFT(A.Supplier_Code,5) AS Supplier_Code,
	A.Supplier_Name,
	A.Site_Code,
	Site_Name,
	Audit,
	Last_Audit_Date,
	Last_Audit_Score,
	Score,
	Due_Date,
	From_Date,
	To_Date,
	Audit_Visit_Id,
	Audit_Visit_Status,
	Site_Status,
	Lead_Technical_Manager,
	Business_Units,
	Country,
	Path,
	OBL_Count,
	BL_Count,
	Junior_Buyer,
	Buyer,
	Buying_Controller,
	Category_Director,
	Commercial_Director
FROM (SELECT DISTINCT CONCAT(Site_Code,Supplier_Code) AS SS_Code,X.* FROM [tblAudits] AS X
	  ) AS A
LEFT JOIN
	(SELECT DISTINCT 
	CONCAT(Site_Code,Supplier_Code) AS SS_Code,
	Site_Code,Supplier_Code,
	sum(case when Tesco_Brand_Ind='T' then 1 else 0 end) as OBL_Count,
	sum(case when Tesco_Brand_Ind='B' then 1 else 0 end) as BL_Count,
	Junior_Buyer,Buyer,
	Buying_Controller,
	Category_Director,
	Commercial_Director
	 FROM (SELECT DISTINCT TPNB,Site_Code,Supplier_Code FROM [tblSpecTpnbs]) AS A
		INNER JOIN
			(SELECT * FROM tblbprList
			 WHERE Product_Sub_Group_Code
			 IN (SELECT Product_Sub_Group_Code FROM [tblCategoryList]
				 WHERE Commercial_Director  IN ('FRES          H.','PACKAGE       D.'))
			) AS TEMP
		on A.TPNB=TEMP.Base_Product_Number
		INNER JOIN [tblCategoryList] AS C
		ON TEMP.Product_Sub_Group_Code=C.Product_Sub_Group_Code
		WHERE Site_Code IS NOT NULL AND Supplier_Code IS NOT NULL
		group by CONCAT(Site_Code,Supplier_Code),
	Site_Code,Supplier_Code,
	Junior_Buyer,Buyer,
	Buying_Controller,
	Category_Director,
	Commercial_Director
	) AS TEMP
ON A.SS_Code=TEMP.SS_Code
WHERE Junior_Buyer IS NOT NULL AND A.Supplier_Code IS NOT NULL



select a.*,
b.Supplier_Number,
b.Comm_Supplier_Name  
from 
[TESCOGLOBAL\YK96].[Firdous_View_Audit_With_Categories_Hierarchy] as a
left join [TESCOGLOBAL\IN22912959].[tblAuditsPythonOutput] as b
on a.Supplier_Code=b.Supplier_Code and a.Junior_Buyer=b.Junior_Buyer


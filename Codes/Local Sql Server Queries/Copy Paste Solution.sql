select [Year]
,[Withdrawal_Date]
,[Period]
,[EPW]
,[Class]
,replace(replace([Supplier_Name], char(10), ''), char(13), '')
,[Withdrawal_Reason]
,[TPNB]
,[Countries] FROM [CPRCOE].[dbo].[EPW]
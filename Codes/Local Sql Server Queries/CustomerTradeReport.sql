
USE [CPRCOE]
GO

/****** Object:  View [dbo].[VwCustomerTradeReport]    Script Date: 10/23/2019 2:48:08 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




CREATE view [dbo].[VwSentiment] as 
Select 
snt.Brand,
left(Week,4) as Year_Number,
right(Week,2) as Week_Number,
Summary_Measure,
Measure,
Score,
WoW,
QTD,
YTD,
YOY_Week,
YOY_QTD,
YOY_YTD,
CTR.TW_Positive as Positive_Comments,
CTR.TW_Negative as Negative_Comments,
CTR.Change_Positive_WoW,
CTR.Change_Negative_WoW,
CTR.Change_Positive_YOY,
Change_Negative_YOY

 from [dbo].[tblSentimentData] as snt


 left join 
 (
Select 
TW.Year_Number,
TW.Week_No,
TW.Brand,
TW.Tag,
TW.Positive as TW_Positive,
TW.Negative as TW_Negative,
LW.Positive  as LW_Positive,
LW.Negative as LW_Negative,
LY.Positive as LY_Positive,
LY.Negative as LY_Negative,
(TW.Positive-LW.Positive) as Change_Positive_WoW,
(TW.Negative-LW.Negative) as  Change_Negative_WoW,
(TW.Positive-LY.Positive) as Change_Positive_YOY,
 (TW.Negative-LY.Negative) as  Change_Negative_YOY

 from
(
select 
Year_Number,
Week_No,
Brand,
Tag,
Case when Brand='Large Stores' then (Positive/11238)*100
else (Positive/5016)*100 end as Positive,

Case when Brand='Large Stores' then (Negative/11238)*100
else (Negative/5016)*100 end as Negative

 from [VwCustomerTradeReport]
where Week_No=34 and Year_Number=2019
) as TW

left join

(
select 
Year_Number,
Week_No,
Brand,
Tag,
Case when Brand='Large Stores' then (Positive/11981)*100
else (Positive/5401)*100 end as Positive,

Case when Brand='Large Stores' then (Negative/11981)*100
else (Negative/5401)*100 end as Negative

 from [VwCustomerTradeReport]
where Week_No=33 and Year_Number=2019
) as LW
on TW.Year_Number=LW.Year_Number  and TW.Brand=LW.Brand and TW.Tag=LW.Tag



left join

(select 
Year_Number,
Week_No,
Brand,
Tag,
Case when Brand='Large Stores' then (Positive/13935)*100
else (Positive/5959)*100 end as Positive,

Case when Brand='Large Stores' then (Negative/13935)*100
else (Negative/5959)*100 end as Negative

 from [VwCustomerTradeReport]
where Week_No=34 and Year_Number=2018
) as LY
on TW.Week_No=LY.Week_No and TW.Brand=LY.Brand and TW.Tag=LY.Tag

) as CTR
on CTR.Year_Number=left(snt.Week,4) and CTR.Week_No=right(snt.Week,2) and CTR.Tag=snt.Measure and CTR.Brand=snt.Brand
where snt.Week=201934

Go
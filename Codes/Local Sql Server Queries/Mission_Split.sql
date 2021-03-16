select
TW.Year_Week_Number,
TW.Area,
TW.Sub_Area,
TW.Mission_Split,
TW.Sales as TW_Sales,
ISNULL((TW.Sales-LY_TW.Sales)/NULLIF(LY_TW.Sales,0),0) as Sales_YOY,
TW.Transaction_Count as TW_T_Count,
ISNULL((TW.Transaction_Count-LY_TW.Transaction_Count)/NULLIF(LY_TW.Transaction_Count,0),0) as T_YOY,
ISNULL((TY_QTD.Sales - LY_QTD.Sales)/NULLIF(LY_QTD.Sales,0),0) as QTD_YOY_Sales,
ISNULL((TY_QTD.T_Count - LY_QTD.T_Count)/NULLIF(LY_QTD.T_Count,0),0) as QTD_YOY_Transactions,
ISNULL((TY.Sales - LY.Sales)/NULLIF(LY.Sales,0),0) as YTD_YOY_Sales,
ISNULL((TY.T_Count - LY.T_Count)/NULLIF(LY.T_Count,0),0) as YTD_YOY_Transactions
from 
(select 
trade.Year_Week_Number,
Area,
Sub_Area,
Mission_Split,
Sales as Sales,
Transaction_Count as Transaction_Count
 from 
[dbo].[tblTradePerformance] trade
where trade.Year_Week_Number = (select (Year_Week_Number) from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()-7))
group by 
trade.Year_Week_Number,
Area,
Sub_Area,
Mission_Split,
Sales,
Transaction_Count
) as TW
left join
(
select 
trade.Year_Week_Number,
Area,
Sub_Area,
Mission_Split,
Sales as Sales,
Transaction_Count as Transaction_Count
 from 
[dbo].[tblTradePerformance] trade
left join (select * from [tblTescoCalender]) cal
on trade.Year_Week_Number=cal.Year_Week_Number
where  trade.Year_Week_Number = (select (Year_Week_Number)-99 from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()-7))
group by 
trade.Year_Week_Number,
Area,
Sub_Area,
Mission_Split,
Sales,
Transaction_Count
) as LY_TW
on TW.Area=LY_TW.Area and TW.Sub_Area=LY_TW.Sub_Area and  TW.Mission_Split=LY_TW.Mission_Split and TW.Year_Week_Number-99=LY_TW.Year_Week_Number
left join
(select 
Area,
Sub_Area,
Mission_Split,
Sum(Sales) as Sales,
Sum(Transaction_Count) as T_Count
from
(

select 
trade.Year_Week_Number,
Area,
Sub_Area,
Mission_Split,
Sales as Sales,
Transaction_Count as Transaction_Count
 from 
[dbo].[tblTradePerformance] trade
left join (select * from [tblTescoCalender]) cal
on trade.Year_Week_Number=cal.Year_Week_Number
where  left(trade.Year_Week_Number,4)=2020 and cal.Quarter_Number=(select Quarter_Number
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()-7)) 
															and 
											trade.Year_Week_Number <= (select (Year_Week_Number)
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()-7))
group by 
trade.Year_Week_Number,
Area,
Sub_Area,
Mission_Split,
Sales,
Transaction_Count
) as a
group by 
Area,
Sub_Area,
Mission_Split
) as TY_QTD
on TW.Area=TY_QTD.Area and TW.Sub_Area=TY_QTD.Sub_Area and  TW.Mission_Split=TY_QTD.Mission_Split
left join
(
select 
Area,
Sub_Area,
Mission_Split,
Sum(Sales) as Sales,
Sum(Transaction_Count) as T_Count
from
(

select 
trade.Year_Week_Number,
Area,
Sub_Area,
Mission_Split,
Sales as Sales,
Transaction_Count as Transaction_Count
 from 
[dbo].[tblTradePerformance] trade
left join (select * from [tblTescoCalender]) cal
on trade.Year_Week_Number=cal.Year_Week_Number
where  left(trade.Year_Week_Number,4)=2019 and cal.Quarter_Number=(select Quarter_Number
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()-7)) 
															and 
											trade.Year_Week_Number <= (select (Year_Week_Number)-99
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()-7)
															and
															trade.Year_Week_Number<>201901
															)
group by 
trade.Year_Week_Number,
Area,
Sub_Area,
Mission_Split,
Sales,
Transaction_Count
) as a
group by 
Area,
Sub_Area,
Mission_Split
) as LY_QTD
on  TW.Area=LY_QTD.Area and TW.Sub_Area=LY_QTD.Sub_Area and  TW.Mission_Split=LY_QTD.Mission_Split
left join
(select 
left(trade.Year_Week_Number,4) as Year,
Area,
Sub_Area,
Mission_Split,
Sum(Sales) as Sales,
Sum(Transaction_Count) as T_Count
 from 
[dbo].[tblTradePerformance] trade
where  left(trade.Year_Week_Number,4)=2020 
group by 
left(trade.Year_Week_Number,4),
Area,
Sub_Area,
Mission_Split
) as TY
on TW.Area=TY.Area and TW.Sub_Area=TY.Sub_Area and  TW.Mission_Split=TY.Mission_Split
left join
(
select 
left(trade.Year_Week_Number,4) as Year,
Area,
Sub_Area,
Mission_Split,
Sum(Sales) as Sales,
Sum(Transaction_Count) as T_Count
 from 
[dbo].[tblTradePerformance] trade
where  left(trade.Year_Week_Number,4)=2019 and trade.Year_Week_Number <= (select (Year_Week_Number)-99
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()-7)
															and
															trade.Year_Week_Number<>201901
															)
group by 
left(trade.Year_Week_Number,4),
Area,
Sub_Area,
Mission_Split
) as LY
on TW.Area=LY.Area and TW.Sub_Area=LY.Sub_Area and  TW.Mission_Split=LY.Mission_Split
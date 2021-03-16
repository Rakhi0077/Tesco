select
Week_No,
Brand as Channel,
Case when Measures='Aisles Staff Friendly' then 'Staff Friendliness'
		when Measures='Aisles Staff Helpful' then 'Staff helpfulness'
		else Measures
		end as Measures,

TY_Tw_Score as TW_Score,
round((TY_Tw_Score-TY_LWScore),1) as WoW,
round((TY_Tw_Score-TY_QTD_Score),1) as vs_QTD,
round((TY_Tw_Score-TY_YTD_Score),1) as vs_YTD,
round((TY_Tw_Score-LY_Tw_Score),1) as YOY_Week,
round((TY_QTD_Score-LY_QTD_Score),1) as YOY_QTD,
round((TY_YTD_Score-LY_YTD_Score),1) as YOY_YTD,
Roshni,
Mayer,
Dawn,
Wicks,
Carol



from
(
select 
TY_Week.Week_No,
TY_Week.Brand,
TY_Week.Measures,
round(TY_Week.Score,1) as TY_Tw_Score,
round(TY_LW.Score,1) as TY_LWScore,
LY_Week.Score as LY_Tw_Score,
TY_QTD.Score as TY_QTD_Score,
LY_QTD.Score as LY_QTD_Score,
TY_YTD.Score as TY_YTD_Score,
LY_YTD.Score as LY_YTD_Score,
round(Family.Roshni,1) as Roshni, 
round(Family.Mayer,1) as Mayer,
round(Family.Dawn,1) as Dawn,
round(Family.Wicks,1) as Wicks,
round(Family.Carol,1)as Carol
from [VwStore_Sentiment_Data] TY_Week


left join 
(
select 
Brand,
Measures,
Week_No,
round(Score,1) as Score`
from [VwStore_Sentiment_Data]
where Year_Number=2018
) as LY_Week
on LY_Week.Brand=TY_Week.Brand and LY_Week.Measures=TY_Week.Measures and LY_Week.Week_No=TY_Week.Week_No
left join 
(
select 
Brand,
Measures,
Week_No,
round(Score,1) as Score
from [VwStore_Sentiment_Data]
where Year_Number=2019
) as TY_LW
on TY_LW.Brand=TY_Week.Brand and TY_LW.Measures=TY_Week.Measures and TY_LW.Week_No=TY_Week.Week_No-1


left join
(
select 
Brand,
Measures,
round(AVG(Score),1) as Score
from [VwStore_Sentiment_Data]
where Year_Number=2019 and Quarter_Number=(select Quarter_Number
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate())) 
															and 
											Week_No <= (select (Week_Number)-1 as Week_No
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()))
group by
Brand,
Measures
) as TY_QTD
on TY_QTD.Brand=TY_Week.Brand and TY_QTD.Measures=TY_Week.Measures


left join 
(
select 
Brand,
Measures,
round(AVG(Score),1) as Score
from [VwStore_Sentiment_Data]
where Year_Number=2018 and Quarter_Number=(select Quarter_Number
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()))
															
															  and 
							Week_No<=(select (Week_Number)-1 as Week_No
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()))
group by
Brand,
Measures
) as LY_QTD
on LY_QTD.Brand=TY_Week.Brand and LY_QTD.Measures=TY_Week.Measures 

left join 
(
select 
Brand,
Measures,
round(AVG(Score),1) as Score
from [VwStore_Sentiment_Data]
where Year_Number=2018 and Week_No<=(select (Week_Number)-1 as Week_No
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()))
group by
Brand,
Measures
) as LY_YTD
on LY_YTD.Brand=TY_Week.Brand and LY_YTD.Measures=TY_Week.Measures

left join 
(
select 
Brand,
Measures,
round(AVG(Score),1) as Score
from [VwStore_Sentiment_Data]
where Year_Number=2019
group by
Brand,
Measures
) as TY_YTD
on TY_YTD.Brand=TY_Week.Brand and TY_YTD.Measures=TY_Week.Measures


left join
(
select
TY_Week.Week_No, 
TY_Week.Measures,
TY_Week.Brand,
round((TY_Week.Roshni-LY_Week.Roshni),1) as Roshni,
round((TY_Week.Mayer-LY_Week.Mayer),1) as Mayer,
round((TY_Week.Dawn-LY_Week.Dawn),1) as Dawn,
round((TY_Week.Wicks-LY_Week.Wicks),1) as Wicks,
round((TY_Week.Carol-LY_Week.Carol),1) as Carol
from 
[VwStore_Sentiment_Data_Family] as TY_Week

left join
(
select
Week_No, 
Measures,
Brand,
Roshni,
Mayer,
Dawn,
Wicks,
Carol

from 
[VwStore_Sentiment_Data_Family] as sf
where sf.Year_Number=2018 and Week_No=(select (Week_Number)-1 as Week_No
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()))
) as LY_Week
on LY_Week.Measures=TY_Week.Measures
 and  LY_Week.Week_No=TY_Week.Week_No  and LY_Week.Brand=TY_Week.Brand


where TY_Week.Year_Number=2019 and TY_Week.Week_No=(select (Week_Number)-1 as Week_No
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()))
) as Family
on Family.Week_No=TY_Week.Week_No and Family.Measures=TY_Week.Measures and Family.Brand=TY_Week.Brand

where  TY_Week.Year_Number=2019 and TY_Week.Week_No=(select (Week_Number)-1 as Week_No
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()))
group by  
TY_Week.Week_No,
TY_Week.Brand,
TY_Week.Measures,
TY_Week.Score,
round(TY_LW.Score,1),
LY_Week.Score,
TY_QTD.Score,
LY_QTD.Score,
TY_YTD.Score,
LY_YTD.Score,
round(Family.Roshni,1),
round(Family.Mayer,1),
round(Family.Dawn,1),
round(Family.Wicks,1),
round(Family.Carol,1)

) as a


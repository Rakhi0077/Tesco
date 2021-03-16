
select*
from
(
  select Score,Week_No,Brand,Measures,Family_Type
  from (	select
			TY_Week.Week_No, 
			TY_Week.Measures,
			TY_Week.Brand,
			TY_Week.Family_Type,
			round((TY_Week.Score-LY_Week.Score),1) as Score
			from 
			[VwStore_Sentiment_Data_Family] as TY_Week
			left join
					(
						select
						Week_No, 
						Measures,
						Brand,
						Family_Type,
						Score 
							from 
							[VwStore_Sentiment_Data_Family] as sf
							where sf.Year_Number=2018 and Week_No=17 and Brand='Large Stores'
						) as LY_Week
						on LY_Week.Measures=TY_Week.Measures and LY_Week.Brand=TY_Week.Brand and LY_Week.Family_Type=TY_Week.Family_Type and  LY_Week.Week_No=TY_Week.Week_No
						where TY_Week.Year_Number=2019 and TY_Week.Week_No=17 and TY_Week.Brand='Large Stores') a
) d
pivot
(
  max(Score)
  for Family_Type in (Roshni, Mayer, Carol, Wicks, Dawn)
) piv;
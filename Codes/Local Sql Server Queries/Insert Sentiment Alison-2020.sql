select * from(
select
Brand as Channel,
concat(2020,Week_No) as Week_No,
case when Measures in ('Staff Proactively Helped','Aisles Staff Helpful','Cashier/ assistant friendly') then 'Colleagues are Helpful'
	  when Measures in ('Product Range','Satisfied with Stock','Ease Find Products','Fresh Food Quality') then 'I Can Get What I Want'
	  when Measures in ('In and around','Checkout Time','Basket/Trolley','Carpark Experience') then 'I Dont Queue'
	  when Measures in ('Customers recommend') then 'Overall'
	  when Measures in ('Satisfied with Prices') then 'Prices are Good'
	  when Measures in ('Clean Store','Tidy Store') then 'The Store is Clean & Tidy'
	  when Measures in ('Overall Easy Experience') then 'Easiest Shopping Trip' 
	  when Brand='Online (GHS)' and Measures in ('Customers Recommend') then 'Overall'
	  when Brand='Online (GHS)' and Measures in ('Delivered Within Booked Slot','Delivery Driver Helpfulness') then 'Colleagues are Helpful'
	  when Brand='Online (GHS)' and Measures in ('Availability - Delivery and C+C (exc. subs)','Fresh Food Quality','Price Satisfaction','Product Quality','Variety Satisfaction')then 'I Can Get What I Want'
	  end as Summary_Meausre,


Case when Measures='Cashier/ assistant friendly' then 'The Cashier / Assistant was Friendly'
		when Measures='Aisles Staff Helpful' then 'The Staff in the Aisles were Helpful'
		when Measures='Carpark Experience' then 'Satisfaction with the Car Park'
		when Measures='Basket/Trolley' then 'Able to Get Trolley / Basket Wanted'
		when Measures='Checkout Time' then 'Satisfaction with Waiting Time'
		when Measures='Product Range' then 'Satisfaction with Food Range'
		when Measures='Satisfied with Stock' then 'Satisfaction with Availability'
		when Measures='Ease Find Products' then 'Ease of Finding Products'
		when Measures='Customers recommend' then 'Customers Recommend'
		when Measures='Satisfied with Prices' then 'Satisfaction with Prices Paid'
		when Measures='Clean Store' then 'Store was Clean'
		when Measures='Tidy Store' then 'Store was Tidy'
		when Measures='Overall Easy Experience' then 'Overall Easy Experience'
		when Measures='Fresh Food Quality' then 'Satisfaction with Fresh Food Quality'
		when Measures='In and around' then 'I Could Get In & Around Easily'
		when Measures='Availability - Delivery and C+C (exc. subs)' then 'Availability Score'
		when Measures='Delivered Within Booked Slot' then 'Delivery On Time Score'
		when Measures='Delivery Driver Helpfulness' then 'Delivery Driver Helpfulness Score'
		when Measures='Product Quality' then 'Product Quality Score'
		when Measures='Variety Satisfaction' then 'Range Satisfaction Score'
		when Measures='Price Satisfaction' then 'Price Satisfaction Score'
		when Measures='Fresh Food Quality' and Brand='Online (GHS)' then 'Fresh Food Quality Score'
		when Measures='Customers Recommend' and Brand='Online (GHS)' then 'NPS Score'


		else Measures
		end as Measures,

TY_Tw_Score as TW_Score,
round((TY_Tw_Score-TY_LWScore),1) as WoW,
round((TY_Tw_Score-TY_QTD_Score),1) as vs_QTD,
round((TY_Tw_Score-TY_YTD_Score),1) as vs_YTD,
Case when LY_Tw_Score=0 then 999 else round((TY_Tw_Score-LY_Tw_Score),1)
  end as YOY_Week,
Case when LY_QTD_Score=0 then 999 else round((TY_QTD_Score-LY_QTD_Score),1)
  end  as YOY_QTD,
Case when LY_YTD_Score=0 then 999 else round((TY_YTD_Score-LY_YTD_Score),1)
  end as YOY_YTD
 




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
LY_YTD.Score as LY_YTD_Score
from [VwStore_Sentiment_Data] TY_Week


left join 
(
select 
Brand,
Measures,
Week_No,
round(Score,1) as Score
from [VwStore_Sentiment_Data]
where Year_Number=2019 
) as LY_Week
on LY_Week.Brand=TY_Week.Brand and LY_Week.Measures=TY_Week.Measures and (LY_Week.Week_No)=TY_Week.Week_No+1
left join 
(
select 
Brand,
Measures,
Week_No,
round(Score,1) as Score
from [VwStore_Sentiment_Data]
where Year_Number=2020 
) as TY_LW
on TY_LW.Brand=TY_Week.Brand and TY_LW.Measures=TY_Week.Measures and TY_LW.Week_No=TY_Week.Week_No-1


left join
(
select 
Brand,
Measures,
round(AVG(Score),1) as Score
from [VwStore_Sentiment_Data]
where Year_Number=2020 and Quarter_Number=(select Quarter_Number
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()-7)) 
															and 
											Week_No <= (select (Week_Number) as Week_No
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()-7))
															and Score <> 0
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
where Year_Number=2019 and Quarter_Number=(select Quarter_Number
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()-7))
															
															  and 
							Week_No<=(select (Week_Number+1) as Week_No
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()-7)
															)and Week_No<>1 and Week_No <>14 and Week_No <>27
															and Score <> 0
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
where Year_Number=2019 and Week_No<=(select (Week_Number+1) as Week_No
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()-7)) and Score <> 0 and Week_No<>1
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
where Year_Number=2020 and Score <> 0 
group by
Brand,
Measures
) as TY_YTD
on TY_YTD.Brand=TY_Week.Brand and TY_YTD.Measures=TY_Week.Measures





where  TY_Week.Year_Number=2020 and TY_Week.Week_No=(select (Week_Number) as Week_No
															from [tblTescoCalender]
															where convert(date,Calendar_Date)=convert(date,getdate()-7))
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
LY_YTD.Score


) as a
) b
where Summary_Meausre is not null


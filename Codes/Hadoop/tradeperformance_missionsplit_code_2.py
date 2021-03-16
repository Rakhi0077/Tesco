from pyspark import SparkConf, SparkContext, HiveContext
import sys
import calendar
from datetime import *
from pyspark.sql.window import Window
from pyspark.sql.functions import *
from pyspark.sql.types import DateType


conf = (SparkConf().set("spark.yarn.queue", "gg-uk-tescoglobal-hadoop-lab-rcoe"))
sc = SparkContext.getOrCreate(conf=conf)
sc.setLogLevel("ERROR")
sqlContext = HiveContext(sc)


sqlContext.setConf("hive.exec.dynamic.partition.mode", "nonstrict")
sqlContext.setConf("hive.optimize.ppd", "true")
sqlContext.setConf("hive.optimize.ppd.storage", "true")
sqlContext.setConf("hive.vectorized.execution.enabled", "true")
sqlContext.setConf("hive.vectorized.execution.reduce.enabled ", " true")
sqlContext.setConf("hive.cbo.enable", "true")
sqlContext.setConf("hive.compute.query.using.stats", "true")
sqlContext.setConf("hive.stats.fetch.column.stats", "true")
sqlContext.setConf("hive.stats.fetch.partition.stats", "true")
sqlContext.setConf("hive.tez.auto.reducer.parallelism", "true")


weekList = sqlContext.sql("select year_week_number from lab_rcoe.tradeperformance_calendar").orderBy(col("year_week_number").asc()).rdd.flatMap(lambda x: x).collect()
runWeek=weekList[2]


runYear=int(str(runWeek)[0:4])
runYear

lastYear=runYear-1
lastYear

LY_TW=runWeek-99
LY_TW
cal = sqlContext.sql("SELECT year_week_number, period_number, quarter_number, year_number FROM lookup.calendar"
).dropDuplicates()


QTD=int(str(cal.filter(col("year_week_number")==runWeek
).select(cal.quarter_number
).dropDuplicates().head()[0]))


TY_QTD_weeks=cal.filter(col("year_week_number")<=runWeek
).filter(col("quarter_number")==QTD
).filter(col("year_number")==runYear
).select("year_week_number").dropDuplicates()

LY_QTD_weeks=cal.filter(col("year_week_number")<=LY_TW
).filter(col("year_week_number")!=201901
).filter(col("year_week_number")!=201914
).filter(col("quarter_number")==QTD
).filter(col("year_number")==lastYear
).select("year_week_number").dropDuplicates()

TY_YTD_Weeks=cal.filter(col("year_week_number")<=runWeek
).filter(col("year_number")==runYear
).select("year_week_number").dropDuplicates()

LY_YTD_Weeks=cal.filter(col("year_week_number")<=LY_TW
).filter(col("year_week_number")!=201901
).filter(col("year_number")==lastYear
).select("year_week_number").dropDuplicates()

TW_data=sqlContext.sql("select year_week_number,area,sub_area,mission_split,sales,transactions from lab_rcoe.tradeperformance_missionsplit"
).filter(col("year_week_number")==runWeek
)

LY_TW_data=sqlContext.sql("select year_week_number,area,sub_area,mission_split,sales,transactions from lab_rcoe.tradeperformance_missionsplit"
).filter(col("year_week_number")==LY_TW
)

TY_QTD_Weeks=TY_QTD_weeks.select("year_week_number").collect()
TY_QTD_Weeks=[int (row.year_week_number) for row in TY_QTD_Weeks]

LY_QTD_Weeks=LY_QTD_weeks.select("year_week_number").collect()
LY_QTD_Weeks=[int (row.year_week_number) for row in LY_QTD_Weeks]

TY_YTD_Weeks=TY_YTD_Weeks.select("year_week_number").collect()
TY_YTD_Weeks=[int (row.year_week_number) for row in TY_YTD_Weeks]

LY_YTD_Weeks=LY_YTD_Weeks.select("year_week_number").collect()
LY_YTD_Weeks=[int (row.year_week_number) for row in LY_YTD_Weeks]


all=sqlContext.sql("select * from lab_rcoe.tradeperformance_missionsplit").dropDuplicates()
groupbylist=["area","sub_area","mission_split"]
TY_QTD_data=all.filter(col("year_week_number").isin(TY_QTD_Weeks)
).groupby(groupbylist
).agg(
sum("sales").alias("sales"),
sum("transactions").alias("transactions")
).select(
"area",
"sub_area",
"mission_split",
col("sales").alias("sales"),
col("transactions").alias("transactions")
)
LY_QTD_data=all.filter(col("year_week_number").isin(LY_QTD_Weeks)
).groupby(groupbylist
).agg(
sum("sales").alias("sales"),
sum("transactions").alias("transactions")
).select(
"area",
"sub_area",
"mission_split",
col("sales").alias("sales"),
col("transactions").alias("transactions")
)

TY_YTD_data=all.filter(col("year_week_number").isin(TY_YTD_Weeks)
).groupby(groupbylist
).agg(
sum("sales").alias("sales"),
sum("transactions").alias("transactions")
).select(
"area",
"sub_area",
"mission_split",
col("sales").alias("sales"),
col("transactions").alias("transactions")
)

LY_YTD_data=all.filter(col("year_week_number").isin(LY_YTD_Weeks)
).groupby(groupbylist
).agg(
sum("sales").alias("sales"),
sum("transactions").alias("transactions")
).select(
"area",
"sub_area",
"mission_split",
col("sales").alias("sales"),
col("transactions").alias("transactions")
)


check=TW_data.join(LY_TW_data,["area","sub_area","mission_split"]).join(
LY_QTD_data,["area","sub_area","mission_split"]).join(
TY_QTD_data,["area","sub_area","mission_split"]).join(
LY_YTD_data,["area","sub_area","mission_split"]).join(
TY_YTD_data,["area","sub_area","mission_split"])

data=check.select(
TW_data.area,
TW_data.sub_area,
TW_data.mission_split,
TW_data.sales.alias("TW_sales"),
TW_data.transactions.alias("TW_transactions"),
LY_TW_data.sales.alias("LYTW_sales"),
LY_TW_data.transactions.alias("LYTW_transactions"),
TY_QTD_data.sales.alias("TYQTD_sales"),
LY_QTD_data.sales.alias("LYQTD_sales"),
TY_QTD_data.transactions.alias("TYQTD_transactions"),
LY_QTD_data.transactions.alias("LYQTD_transactions"),
TY_YTD_data.sales.alias("TYYTD_sales"),
LY_YTD_data.sales.alias("LYYTD_sales"),
TY_YTD_data.transactions.alias("TYYTD_transactions"),
LY_YTD_data.transactions.alias("LYYTD_transactions"),
TW_data.year_week_number.alias("year_week_number")
)
data.registerTempTable("finalTable")
sqlContext.sql("insert overwrite table lab_rcoe.tradeperformance_missionsplit_YOY partition(year_week_number) select * from finalTable")
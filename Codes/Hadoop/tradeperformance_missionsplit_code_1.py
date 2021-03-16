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
weekList=[weekList[0],weekList[2]]


for val in weekList:

	runWeek=val
	runYear=int(str(runWeek)[0:4])


	calIp = sqlContext.sql("SELECT * FROM lookup.calendar"
	).filter(col("year_week_number").isin(runWeek) 
	)


	startDate = str(calIp.agg(min("calendar_date")).head()[0])
	endDate = str(calIp.agg(max("calendar_date")).head()[0])

	salesIp = sqlContext.sql("select * from sales.line_discount_apportionment"
	).filter(col("transaction_date").between(startDate,endDate)
	).alias("salesIp")

	store = sqlContext.sql("select retail_outlet_number, store_format_code, store_format_description, channel, country_code from lookup.store")
	psgExcl = sqlContext.sql("select * from lab_rcoe.trade_performance_psg_exclusions")
	itemHier = sqlContext.sql("select * from lookup.buyer_hierarchy")
	joinPsgExcl = [
	itemHier.product_sub_group_code == psgExcl.product_sub_group_code
	]
	filteredBuyerHier = itemHier.join(psgExcl, joinPsgExcl, "left"
	).filter(psgExcl.product_sub_group_code.isNull()
	).select(
	"base_product_number"
	,"business_area"
	,"commercial_area"
	,"category_area"
	,"product_area"
	)
	joinBuyerHier = [
	salesIp.tpnb == filteredBuyerHier.base_product_number
	]
	joinStore = [
	salesIp.retail_outlet_number == store.retail_outlet_number
	]
	salesHier = salesIp.join(store, joinStore, "left"
	).drop(store.retail_outlet_number
	).join(filteredBuyerHier, joinBuyerHier, "left"
	).filter(store.country_code!=7
	).filter(salesIp.retail_outlet_number>1000
	).filter(col("product_area")!='Opticians'
	).filter(col("product_area")!='Dispensary'
	).select(
	salesIp.tpnb
	,filteredBuyerHier.business_area
	,filteredBuyerHier.commercial_area
	,filteredBuyerHier.category_area
	,salesIp.retail_outlet_number
	,store.store_format_description
	,store.channel
	,salesIp.transaction_number
	,salesIp.quantity
	,salesIp.sales_ex_vat
	,salesIp.sales_inc_vat
	,salesIp.transaction_source
	,store.country_code
	,salesIp.year_week_number
	,salesIp.transaction_date
	)





	MS=salesIp.groupby("transaction_number","year_week_number"
	).agg(sum("quantity").alias("quantity")
	).select(
	"transaction_number",
	col("quantity").alias("quantity")
	,"year_week_number"
	)

	mission_split=MS.withColumn("mission_split",expr(
	"case when quantity>0 and quantity<=20 then 'ms(0-20)' "
	+ "when quantity>20 and quantity<=50 then 'ms(20-50)' "
	+"when quantity>50 and quantity<=70 then 'ms(50-70)' "
	+"when quantity>70 and quantity<=80 then 'ms(70-80)' "
	+ "else 'ms(80 and more)' end "))


	sales_MS_join=[salesHier.transaction_number==mission_split.transaction_number]
	sales_qty_ms_commercial=salesHier.join(mission_split,sales_MS_join,"left"
	).groupby(salesHier.transaction_number,salesHier.commercial_area,mission_split.mission_split,salesHier.year_week_number
	).agg(sum(salesHier.quantity).alias("quantity_sum"),
	sum(salesHier.sales_inc_vat).alias("sales_sum")
	).select(
	salesHier.year_week_number,
	salesHier.transaction_number,
	salesHier.commercial_area,
	mission_split.mission_split,
	col("quantity_sum").alias("quantity"),
	col("sales_sum").alias("sales")
	)
	commercial_data=sales_qty_ms_commercial.groupby("commercial_area","mission_split","year_week_number"
	).agg(sum("sales").alias("sales")
	,countDistinct("transaction_number").alias("No_of_Transactions")
	).select(
	lit("Commercial_Area").alias("Area"),
	"commercial_area",
	"mission_split",
	col("sales").alias("sales"),
	col("No_of_Transactions").alias("transactions_count"),
	"year_week_number"
	)

	sales_qty_ms_category=salesHier.join(mission_split,sales_MS_join,"left"
	).groupby(salesHier.transaction_number,salesHier.category_area,mission_split.mission_split,salesHier.year_week_number
	).agg(sum(salesHier.quantity).alias("quantity_sum"),
	sum(salesHier.sales_inc_vat).alias("sales_sum")
	).select(
	salesHier.year_week_number,
	salesHier.transaction_number,
	salesHier.category_area,
	mission_split.mission_split,
	col("quantity_sum").alias("quantity"),
	col("sales_sum").alias("sales")
	)
	category_data=sales_qty_ms_category.groupby("category_area","mission_split","year_week_number"
	).agg(sum("sales").alias("sales")
	,countDistinct("transaction_number").alias("No_of_Transactions")
	).select(
	lit("Category_Area").alias("Area"),
	"category_area",
	"mission_split",
	col("sales").alias("sales"),
	col("No_of_Transactions").alias("transactions_count"),
	"year_week_number"
	)

	sales_qty_ms_business=salesHier.join(mission_split,sales_MS_join,"left"
	).groupby(salesHier.transaction_number,salesHier.business_area,mission_split.mission_split,salesHier.year_week_number
	).agg(sum(salesHier.quantity).alias("quantity_sum"),
	sum(salesHier.sales_inc_vat).alias("sales_sum")
	).select(
	salesHier.year_week_number,
	salesHier.transaction_number,
	salesHier.business_area,
	mission_split.mission_split,
	col("quantity_sum").alias("quantity"),
	col("sales_sum").alias("sales")
	)
	business_data=sales_qty_ms_business.groupby("business_area","mission_split","year_week_number"
	).agg(sum("sales").alias("sales")
	,countDistinct("transaction_number").alias("No_of_Transactions")
	).select(
	lit("Business_Area").alias("Area"),
	"business_area",
	"mission_split",
	col("sales").alias("sales"),
	col("No_of_Transactions").alias("transactions_count"),
	"year_week_number"
	)

	final_data=commercial_data.unionAll(category_data).unionAll(business_data)
	final_data.registerTempTable("finalTablc")
	sqlContext.sql("insert overwrite table lab_rcoe.tradeperformance_missionsplit partition(year_week_number) select * from finalTablc")



	


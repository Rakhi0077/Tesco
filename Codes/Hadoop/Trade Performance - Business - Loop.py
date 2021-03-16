pyspark --conf spark.yarn.queue=gg-uk-tescoglobal-hadoop-lab-rcoe --master yarn-client --driver-memory 3G --conf spark.yarn.executor.memoryOverhead=8000 --executor-cores 2 --executor-memory 10G --num-executors 300

svc-mstrcprcoe
Gsjsj986Aaq

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


weekList = [201817,201916,201917]



for val in weekList:
	runWeek = val
	runYear = int(str(runWeek)[0:4])
	cal = sqlContext.sql("SELECT year_week_number, period_number, quarter_number, year_number FROM lookup.calendar"
	).dropDuplicates()
	previousWeek = int(cal.select("year_week_number").filter(col("year_week_number")<runWeek).orderBy(col("year_week_number").desc()).head()[0])
	calIp = sqlContext.sql("SELECT * FROM lookup.calendar"
	).filter(col("year_week_number")==runWeek 
	)
	runPeriod = int(calIp.select("period_number").head()[0])  
	runQuarter = int(calIp.select("quarter_number").head()[0])
	startDate = str(calIp.agg(min("calendar_date")).head()[0])
	endDate = str(calIp.agg(max("calendar_date")).head()[0])
	salesIp = sqlContext.sql("select * from sales.line_discount_apportionment"
	).filter(col("transaction_date").between(startDate,endDate)
	).withColumn("tpnb_price_ex_vat", col("sales_ex_vat")/col("quantity")
	).withColumn("tpnb_price_inc_vat", col("sales_inc_vat")/col("quantity")
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
	,salesIp.tpnb_price_ex_vat
	,salesIp.tpnb_price_inc_vat
	,salesIp.transaction_source
	,store.country_code
	,salesIp.year_week_number
	,salesIp.transaction_date
	)
	groupList = [
	"business_area","store_format_description", "channel" ,"country_code" ,"year_week_number"
	]
	TW = salesHier.groupBy(groupList
	).agg(
	countDistinct("transaction_number").alias("transaction_count")
	,count("tpnb").alias("tpnb_count")
	,sum("sales_ex_vat").alias("sales_ex_vat")
	,sum("sales_inc_vat").alias("sales_inc_vat")
	,sum("quantity").alias("quantity")
	,sum("tpnb_price_ex_vat").alias("tpnb_price_ex_vat")
	,sum("tpnb_price_inc_vat").alias("tpnb_price_inc_vat")
	).select(
	"store_format_description"
	,"channel"
	,"business_area"
	,col("transaction_count").alias("tw_transaction_count")
	,col("tpnb_count").alias("tw_tpnb_count")
	,col("sales_ex_vat").alias("tw_sales_ex_vat")
	,col("sales_inc_vat").alias("tw_sales_inc_vat")
	,col("quantity").alias("tw_quantity")
	,col("tpnb_price_ex_vat").alias("tw_tpnb_price_ex_vat")
	,col("tpnb_price_inc_vat").alias("tw_tpnb_price_inc_vat")
	,col("transaction_count").alias("ptd_transaction_count")
	,col("tpnb_count").alias("ptd_tpnb_count")
	,col("sales_ex_vat").alias("ptd_sales_ex_vat")
	,col("sales_inc_vat").alias("ptd_sales_inc_vat")
	,col("quantity").alias("ptd_quantity")
	,col("tpnb_price_ex_vat").alias("ptd_tpnb_price_ex_vat")
	,col("tpnb_price_inc_vat").alias("ptd_tpnb_price_inc_vat")		
	,col("transaction_count").alias("qtd_transaction_count")
	,col("tpnb_count").alias("qtd_tpnb_count")
	,col("sales_ex_vat").alias("qtd_sales_ex_vat")
	,col("sales_inc_vat").alias("qtd_sales_inc_vat")
	,col("quantity").alias("qtd_quantity")
	,col("tpnb_price_ex_vat").alias("qtd_tpnb_price_ex_vat")
	,col("tpnb_price_inc_vat").alias("qtd_tpnb_price_inc_vat")		
	,col("transaction_count").alias("ytd_transaction_count")
	,col("tpnb_count").alias("ytd_tpnb_count")
	,col("sales_ex_vat").alias("ytd_sales_ex_vat")
	,col("sales_inc_vat").alias("ytd_sales_inc_vat")
	,col("quantity").alias("ytd_quantity")
	,col("tpnb_price_ex_vat").alias("ytd_tpnb_price_ex_vat")
	,col("tpnb_price_inc_vat").alias("ytd_tpnb_price_inc_vat")		
	,col("country_code").alias("country_code")
	,lit(runWeek).alias("year_week_number")
	)
	histIp = sqlContext.sql("select * from lab_rcoe.tradeperformance_business"
	).filter(col("year_week_number")==previousWeek
	).alias("histIp")
	histCal = histIp.join(cal, histIp.year_week_number == cal.year_week_number
	).select("histIp.*",cal.period_number,cal.quarter_number,cal.year_number)
	PTD = histCal.filter(col("period_number")==runPeriod
	).select(   
	"store_format_description"
	,"channel"
	,"business_area"
	,lit(0).cast("bigint").alias("tw_transaction_count")
	,lit(0).cast("bigint").alias("tw_tpnb_count")
	,lit(0.0).cast("double").alias("tw_sales_ex_vat")
	,lit(0.0).cast("double").alias("tw_sales_inc_vat")
	,lit(0.0).cast("double").alias("tw_quantity")
	,lit(0.0).cast("double").alias("tw_tpnb_price_ex_vat")
	,lit(0.0).cast("double").alias("tw_tpnb_price_inc_vat")		
	,col("ptd_transaction_count").alias("ptd_transaction_count")
	,col("ptd_tpnb_count").alias("ptd_tpnb_count")
	,col("ptd_sales_ex_vat").alias("ptd_sales_ex_vat")
	,col("ptd_sales_inc_vat").alias("ptd_sales_inc_vat")		
	,col("ptd_quantity").alias("ptd_quantity")
	,col("ptd_tpnb_price_ex_vat").alias("ptd_tpnb_price_ex_vat")
	,col("ptd_tpnb_price_inc_vat").alias("ptd_tpnb_price_inc_vat")		
	,lit(0).cast("bigint").alias("qtd_transaction_count")
	,lit(0).cast("bigint").alias("qtd_tpnb_count")
	,lit(0.0).cast("double").alias("qtd_sales_ex_vat")
	,lit(0.0).cast("double").alias("qtd_sales_inc_vat")
	,lit(0.0).cast("double").alias("qtd_quantity")
	,lit(0.0).cast("double").alias("qtd_tpnb_price_ex_vat")
	,lit(0.0).cast("double").alias("qtd_tpnb_price_inc_vat")		
	,lit(0).cast("bigint").alias("ytd_transaction_count")
	,lit(0).cast("bigint").alias("ytd_tpnb_count")
	,lit(0.0).cast("double").alias("ytd_sales_ex_vat")
	,lit(0.0).cast("double").alias("ytd_sales_inc_vat")
	,lit(0.0).cast("double").alias("ytd_quantity")
	,lit(0.0).cast("double").alias("ytd_tpnb_price_ex_vat")
	,lit(0.0).cast("double").alias("ytd_tpnb_price_inc_vat")		
	,col("country_code").alias("country_code")
	,lit(runWeek).alias("year_week_number")
	)
	QTD = histCal.filter(col("quarter_number")==runQuarter
	).select(   
	"store_format_description"
	,"channel"
	,"business_area"
	,lit(0).cast("bigint").alias("tw_transaction_count")
	,lit(0).cast("bigint").alias("tw_tpnb_count")
	,lit(0.0).cast("double").alias("tw_sales_ex_vat")
	,lit(0.0).cast("double").alias("tw_sales_inc_vat")
	,lit(0.0).cast("double").alias("tw_quantity")
	,lit(0.0).cast("double").alias("tw_tpnb_price_ex_vat")
	,lit(0.0).cast("double").alias("tw_tpnb_price_inc_vat")		
	,lit(0).cast("bigint").alias("ptd_transaction_count")
	,lit(0).cast("bigint").alias("ptd_tpnb_count")
	,lit(0.0).cast("double").alias("ptd_sales_ex_vat")
	,lit(0.0).cast("double").alias("ptd_sales_inc_vat")
	,lit(0.0).cast("double").alias("ptd_quantity")
	,lit(0.0).cast("double").alias("ptd_tpnb_price_ex_vat")
	,lit(0.0).cast("double").alias("ptd_tpnb_price_inc_vat")		
	,col("qtd_transaction_count").alias("qtd_transaction_count")
	,col("qtd_tpnb_count").alias("qtd_tpnb_count")
	,col("qtd_sales_ex_vat").alias("qtd_sales_ex_vat")
	,col("qtd_sales_inc_vat").alias("qtd_sales_inc_vat")		
	,col("qtd_quantity").alias("qtd_quantity")
	,col("qtd_tpnb_price_ex_vat").alias("qtd_tpnb_price_ex_vat")
	,col("qtd_tpnb_price_inc_vat").alias("qtd_tpnb_price_inc_vat")		
	,lit(0).cast("bigint").alias("ytd_transaction_count")
	,lit(0).cast("bigint").alias("ytd_tpnb_count")
	,lit(0.0).cast("double").alias("ytd_sales_ex_vat")
	,lit(0.0).cast("double").alias("ytd_sales_inc_vat")
	,lit(0.0).cast("double").alias("ytd_quantity")
	,lit(0.0).cast("double").alias("ytd_tpnb_price_ex_vat")
	,lit(0.0).cast("double").alias("ytd_tpnb_price_inc_vat")		
	,col("country_code").alias("country_code")
	,lit(runWeek).alias("year_week_number")
	)
	YTD = histCal.filter(col("year_number")==runYear
	).select(   
	"store_format_description"
	,"channel"
	,"business_area"
	,lit(0).cast("bigint").alias("tw_transaction_count")
	,lit(0).cast("bigint").alias("tw_tpnb_count")
	,lit(0.0).cast("double").alias("tw_sales_ex_vat")
	,lit(0.0).cast("double").alias("tw_sales_inc_vat")		
	,lit(0.0).cast("double").alias("tw_quantity")
	,lit(0.0).cast("double").alias("tw_tpnb_price_ex_vat")
	,lit(0.0).cast("double").alias("tw_tpnb_price_inc_vat")		
	,lit(0).cast("bigint").alias("ptd_transaction_count")
	,lit(0).cast("bigint").alias("ptd_tpnb_count")
	,lit(0.0).cast("double").alias("ptd_sales_ex_vat")
	,lit(0.0).cast("double").alias("ptd_sales_inc_vat")		
	,lit(0.0).cast("double").alias("ptd_quantity")
	,lit(0.0).cast("double").alias("ptd_tpnb_price_ex_vat")
	,lit(0.0).cast("double").alias("ptd_tpnb_price_inc_vat")		
	,lit(0).cast("bigint").alias("qtd_transaction_count")
	,lit(0).cast("bigint").alias("qtd_tpnb_count")
	,lit(0.0).cast("double").alias("qtd_sales_ex_vat")
	,lit(0.0).cast("double").alias("qtd_sales_inc_vat")		
	,lit(0.0).cast("double").alias("qtd_quantity")
	,lit(0.0).cast("double").alias("qtd_tpnb_price_ex_vat")
	,lit(0.0).cast("double").alias("qtd_tpnb_price_inc_vat")		
	,col("ytd_transaction_count").alias("ytd_transaction_count")
	,col("ytd_tpnb_count").alias("ytd_tpnb_count")
	,col("ytd_sales_ex_vat").alias("ytd_sales_ex_vat")
	,col("ytd_sales_inc_vat").alias("ytd_sales_inc_vat")		
	,col("ytd_quantity").alias("ytd_quantity")
	,col("ytd_tpnb_price_ex_vat").alias("ytd_tpnb_price_ex_vat")
	,col("ytd_tpnb_price_inc_vat").alias("ytd_tpnb_price_inc_vat")		
	,col("country_code").alias("country_code")
	,lit(runWeek).alias("year_week_number")
	)	
	final = TW.unionAll(PTD).unionAll(QTD).unionAll(YTD
	).groupBy(groupList
	).agg(
	sum("tw_transaction_count").alias("tw_transaction_count")
	,sum("tw_tpnb_count").alias("tw_tpnb_count")
	,sum("tw_sales_ex_vat").alias("tw_sales_ex_vat")
	,sum("tw_sales_inc_vat").alias("tw_sales_inc_vat")
	,sum("tw_quantity").alias("tw_quantity")
	,sum("tw_tpnb_price_ex_vat").alias("tw_tpnb_price_ex_vat")
	,sum("tw_tpnb_price_inc_vat").alias("tw_tpnb_price_inc_vat")		
	,sum("ptd_transaction_count").alias("ptd_transaction_count")
	,sum("ptd_tpnb_count").alias("ptd_tpnb_count")
	,sum("ptd_sales_ex_vat").alias("ptd_sales_ex_vat")
	,sum("ptd_sales_inc_vat").alias("ptd_sales_inc_vat")		
	,sum("ptd_quantity").alias("ptd_quantity")
	,sum("ptd_tpnb_price_ex_vat").alias("ptd_tpnb_price_ex_vat")
	,sum("ptd_tpnb_price_inc_vat").alias("ptd_tpnb_price_inc_vat")		
	,sum("qtd_transaction_count").alias("qtd_transaction_count")
	,sum("qtd_tpnb_count").alias("qtd_tpnb_count")
	,sum("qtd_sales_ex_vat").alias("qtd_sales_ex_vat")
	,sum("qtd_sales_inc_vat").alias("qtd_sales_inc_vat")		
	,sum("qtd_quantity").alias("qtd_quantity")
	,sum("qtd_tpnb_price_ex_vat").alias("qtd_tpnb_price_ex_vat")
	,sum("qtd_tpnb_price_inc_vat").alias("qtd_tpnb_price_inc_vat")		
	,sum("ytd_transaction_count").alias("ytd_transaction_count")
	,sum("ytd_tpnb_count").alias("ytd_tpnb_count")
	,sum("ytd_sales_ex_vat").alias("ytd_sales_ex_vat")
	,sum("ytd_sales_inc_vat").alias("ytd_sales_inc_vat")		
	,sum("ytd_quantity").alias("ytd_quantity")
	,sum("ytd_tpnb_price_ex_vat").alias("ytd_tpnb_price_ex_vat")      
	,sum("ytd_tpnb_price_inc_vat").alias("ytd_tpnb_price_inc_vat")      		
	).select(
	"store_format_description"
	,"channel"
	,"business_area"
	,col("tw_transaction_count").alias("tw_transaction_count")
	,col("tw_tpnb_count").alias("tw_tpnb_count")
	,col("tw_sales_ex_vat").alias("tw_sales_ex_vat")
	,col("tw_sales_inc_vat").alias("tw_sales_inc_vat")		
	,col("tw_quantity").alias("tw_quantity")
	,col("tw_tpnb_price_ex_vat").alias("tw_tpnb_price_ex_vat")
	,col("tw_tpnb_price_inc_vat").alias("tw_tpnb_price_inc_vat")		
	,col("ptd_transaction_count").alias("ptd_transaction_count")
	,col("ptd_tpnb_count").alias("ptd_tpnb_count")
	,col("ptd_sales_ex_vat").alias("ptd_sales_ex_vat")
	,col("ptd_sales_inc_vat").alias("ptd_sales_inc_vat")
	,col("ptd_quantity").alias("ptd_quantity")
	,col("ptd_tpnb_price_ex_vat").alias("ptd_tpnb_price_ex_vat")
	,col("ptd_tpnb_price_inc_vat").alias("ptd_tpnb_price_inc_vat")		
	,col("qtd_transaction_count").alias("qtd_transaction_count")
	,col("qtd_tpnb_count").alias("qtd_tpnb_count")
	,col("qtd_sales_ex_vat").alias("qtd_sales_ex_vat")
	,col("qtd_sales_inc_vat").alias("qtd_sales_inc_vat")
	,col("qtd_quantity").alias("qtd_quantity")
	,col("qtd_tpnb_price_ex_vat").alias("qtd_tpnb_price_ex_vat")
	,col("qtd_tpnb_price_inc_vat").alias("qtd_tpnb_price_inc_vat")				
	,col("ytd_transaction_count").alias("ytd_transaction_count")
	,col("ytd_tpnb_count").alias("ytd_tpnb_count")
	,col("ytd_sales_ex_vat").alias("ytd_sales_ex_vat")
	,col("ytd_sales_inc_vat").alias("ytd_sales_inc_vat")
	,col("ytd_quantity").alias("ytd_quantity")
	,col("ytd_tpnb_price_ex_vat").alias("ytd_tpnb_price_ex_vat")
	,col("ytd_tpnb_price_inc_vat").alias("ytd_tpnb_price_inc_vat")		
	,col("country_code").alias("country_code")
	,lit(runWeek).alias("year_week_number")
	)
	final.registerTempTable("finalTbl")
	sqlContext.sql("insert overwrite table lab_rcoe.tradeperformance_business partition(country_code,year_week_number) select * from finalTbl")

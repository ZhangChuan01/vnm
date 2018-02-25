var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require("../models/goods");

//数据库连接
mongoose.connect('mongodb://127.0.0.1:27017/dumall');
//数据库连接成功
mongoose.connection.on('connected',function () {
	console.log("mongodb connected success");
})
//数据库连接失败
mongoose.connection.on('error',function () {
	console.log("mongodb connected fail");
})
//数据库连接中断
mongoose.connection.on('disconnected',function () {
	console.log("mongodb connected disconnected");
})

//查询商品列表
router.get('/',function(req,res,next){
	//获取参数
	let sort = req.param("sort");
	let page = parseInt(req.param("page"));
	let pageSize = parseInt(req.param("pageSize"));
	let priceLevel = req.param("priceLevel");
	let skip = (page - 1)*pageSize;
	var priceGt = '',priceLte = '';
	let params = {};
	if(priceLevel != "all"){
		switch(priceLevel){
			case "0": priceGt = 0;priceLte = 500;break;
			case "1": priceGt = 500;priceLte = 1000;break;
			case "2": priceGt = 1000;priceLte = 2000;break;
			case "3": priceGt = 2000;priceLte = 5000;break;
		}
		params = {
			salePrice:{
				$gt:priceGt,
				$lte:priceLte
			}
		}
	}
	//获取指定数据排序
	let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
	goodsModel.sort({'salePrice':sort})
	goodsModel.exec({},function(err,doc){
		if(err){
			res.json({
				status: 1,
				msg: err.message
			})
		}else{
			res.json({
				status: 0,
				msg: '',
				result: {
					count: doc.length,
					list: doc
				}
			})
		}
	})
})
//加入购物车
router.post('/addCart',function(req,res,next){
	var userId = "100000077",productId = req.body.productId;
	var User = require("../models/user.js");
	User.findOne({userId:userId},function(err,userDoc){
		if(err){
			res.json({
				status: 1,
				msg: err.message
			})
		}else{
			if(userDoc){
				let goodsItem = '';
				userDoc.cartList.forEach(function(item){
					if(item.productId == productId){
						goodsItem = item;
						item.productNum++
					}
				})
				if(goodsItem){
					userDoc.save(function(err2,doc2){
						if(err){
							res.json({
								status: 1,
								msg: err.message
							})
						}else{
							res.json({
								status: 0,
								msg: '',
								result: "suc"
							})
						}
					})
				}else{
					Goods.findOne({productId:productId},function(err,doc){
						if(err){
							res.json({
								status: 1,
								msg: err.message
							})
						}else{
							if(doc){
								doc.productNum = 1;
								doc.checked = 1;
								userDoc.cartList.push(doc);
								userDoc.save(function(err2,doc2){
									if(err){
										res.json({
											status: 1,
											msg: err.message
										})
									}else{
										res.json({
											status: 0,
											msg: '',
											result: "suc"
										})
									}
								})
							}
						}
					})
				}
			}
		}
	})
})
module.exports = router;
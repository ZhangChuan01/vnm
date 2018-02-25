<template>
	<div>
		<my-header></my-header>
		<div class="nav-breadcrumb-wrap">
		  <div class="container">
		    <nav class="nav-breadcrumb">
		      <a href="/">Home</a>
		      <span>Goods</span>
		    </nav>
		  </div>
		</div>
		<div class="accessory-result-page accessory-page">
		  <div class="container">
		    <div class="filter-nav">
		      <span class="sortby">Sort by:</span>
		      <a href="javascript:void(0)" class="default cur">Default</a>
		      <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
		      <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
		    </div>
		    <div class="accessory-result">
		      <!-- filter -->
		      <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
		        <dl class="filter-price">
		          <dt>Price:</dt>
		          <dd><a href="javascript:void(0)" @click="allGoods" v-bind:class="{'cur':priceChecked=='all'}">All</a></dd>
		          <dd v-for="(price,index) in priceFilter">
		            <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{price.startPrice}} - {{price.endPrice}}</a>
		          </dd>
		        </dl>
		      </div>

		      <!-- search result accessories list -->
		      <div class="accessory-list-wrap">
		        <div class="accessory-list col-4">
		          <ul>
		            <li v-for="(item,index) in goodsList">
		              <div class="pic">
		                <a href="#"><img v-lazy="'./static/' + item.productImage" alt=""></a>
		              </div>
		              <div class="main">
		                <div class="name">{{item.productName}}</div>
		                <div class="price">{{item.salePrice}}</div>
		                <div class="btn-area">
		                  <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
		                </div>
		              </div>
		            </li>
		          </ul>
		          <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
		          	<img src="../assets/loading-bubbles.svg" v-show="loading" alt="">
				  </div>
		        </div>
		      </div>
		    </div>
		  </div>
		</div>
		<div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
		<modal v-bind:mdShow="mdShow" v-on:close="closeModal">
			<p slot="message">请先登录,否则无法加入到购物车</p>
			<div style="text-align:center" slot="btnGroup"><a href="javascript:;" class="btn btn--m" @click="closeModal">关闭</a></div>
		</modal>
		<modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
			<p slot="message">
				<svg class="icon-status-ok">
	              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
	            </svg>
	            <span>加入购物车成功</span>
			</p>
			<div style="text-align:center" slot="btnGroup">
				<a href="javascript:;" class="btn btn--m" @click="mdShowCart=false">继续购物</a>
				<router-link href="javascript:;" class="btn btn--m" to="/cart">查看购物车</router-link>
			</div>
		</modal>
		<my-footer></my-footer>
	</div>
</template>
<style>
	.btn:hover{
		background-color: #ffe5e6;
		transition: all 0.3s ease-out;	}
</style>
<script>
	import './../assets/css/login.css'
	import './../assets/css/base.css'
	import './../assets/css/product.css'
	import myHeader from '../components/header.vue'
	import myFooter from '../components/footer.vue'
	import modal from '../components/modal.vue'
	import axios from 'axios'
	export default {
		data(){
			return {
				goodsList: [],
				priceFilter: [
					{
						startPrice: '0',
						endPrice: '500'
					},
					{
						startPrice: '500',
						endPrice: '1000'
					},
					{
						startPrice: '1000',
						endPrice: '2000'
					},
					{
						startPrice: '2000',
						endPrice: '5000'
					}
				],
				priceChecked: 'all',
				filterBy: false,
				overLayFlag: false,
				sortFlag: true,
				page: 1,
				pageSize: 8,
				busy: true,
				loading: false,
				mdShow: false,
				mdShowCart: false
			}
		},
		components: {myHeader:myHeader,myFooter:myFooter,modal:modal},
		mounted() {
			this.getGoodsList();
		},
		methods: {
			getGoodsList(flag) {
				var param = {
					page: this.page,
					pageSize: this.pageSize,
					sort: this.sortFlag?1:-1,
					priceLevel:this.priceChecked
				}
				this.loading = true;
				axios.get("/goods",{params:param}).then((result) => {
					let res = result.data;
					this.loading = false;
					if(res.status == "0"){
						if(flag){
							this.goodsList = this.goodsList.concat(res.result.list);
							if(res.result.count == 0){
								this.busy = true;
							}else{
								this.busy = false;
							}
						}else{
							this.goodsList = res.result.list;
							this.busy = false;
						}
					}else{
						this.goodsList = res.result.list
					}
					
				})
			},
			showFilterPop(){
				this.filterBy = true;
				this.overLayFlag = true;
			},
			setPriceFilter(index){
				this.priceChecked = index;
				this.page = 1;
				this.closePop();
				this.getGoodsList();
			},
			allGoods(){
				this.priceChecked='all';
				this.page = 1;
				this.closePop();
				this.getGoodsList();
			},
			closePop(){
				this.filterBy = false;
				this.overLayFlag = false;
			},
			sortGoods(){
				this.sortFlag = !this.sortFlag;
				this.page = 1;
				this.getGoodsList();
			},
			loadMore(){
			    this.busy = true;
				setTimeout(() => {
					this.page++;
					this.getGoodsList(true);
			    }, 500);
			},
			addCart(productId){
				axios.post("/goods/addCart",{productId:productId}).then((res) => {
					console.log(res)
					if(res.data.status == 0){
						this.mdShowCart = true;
						this.$store.commit("updateCartCount",1);
					}else{
						this.mdShow = true;
					}
				})
			},
			closeModal(){
				this.mdShow = false;
			}
		}
	}
</script>
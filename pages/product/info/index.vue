<template>
	<view class="DrawerPage" :class="modalName=='viewModal'?'show':''">
		<list-header title="产品管理">
			<template v-slot:default>
				<button class="cu-btn bg-green" style="margin-right: 5px;" @click="showModal" data-target="viewModal">
					<text class="cuIcon-filter"></text> 筛选
				</button>

				<button class="cu-btn bg-purple" v-if="createPowerEnable" @click="add">
					<text class="cuIcon-add"></text> 添加
				</button>
			</template>

			<!-- <template v-slot:search></template> -->
		</list-header>

		<you-scroll @onPullDown="onPullDown" scroll-y="true">
			<view class="cu-list menu sm-border card-menu mt-10">
				<template v-for="(item, index) in list" :key="index">
					<uni-card :cover="item.staticList.split(',')[0]" @click="edit(item)">
						<text class="uni-body">{{item.title}}</text>
					</uni-card>
				</template>
			</view>
		</you-scroll>


	</view>
	<view class="DrawerClose" :class="modalName=='viewModal'?'show':''" @tap="hideModal">
		<text class="cuIcon-pullright"></text>
	</view>
	<scroll-view scroll-y class="DrawerWindow" :class="modalName=='viewModal'?'show':''">
		<view class="form_card">
			<view class="cu-form-group align-start">
				<view class="title">排序</view>
				<picker-single v-model="search.order" name="productOrderSearch"></picker-single>
			</view>
			<view class="cu-form-group">
				<view class="title">名称</view>
				<input type="text" v-model="search.title" />
			</view>
			<select-index-single-sync title="品牌" :req="false" name="getProductTypeAllApi" v-model="search.type">
			</select-index-single-sync>
			<picker-muplt title="品类" :req="false" name="getProductCategoryAllApi"
				v-model="search.category"></picker-muplt>
			<select-index-single-sync title="成色" :req="false" otherName="desc" name="getProductQualityAllApi"
				v-model="search.quality"></select-index-single-sync>
			<view class="cu-form-group">
				<view class="title">来源</view>
				<uni-data-checkbox class="smallCheck" mode="tag" v-model="search.productOriginId"
					:localdata="originList"></uni-data-checkbox>
			</view>
			<select-index-single-sync title="仓库" :req="false" name="getProductStorehouseAllApi"
				v-model="search.quality"></select-index-single-sync>
			<view class="cu-form-group">
				<view class="title">成本价</view>
				<input style="text-align: center;" v-model="search.minCostPrice" placeholder="最小值" type="number">-<input
					v-model="search.maxCostPrice" style="text-align: center;" placeholder="最大值" type="number">
			</view>
			<view class="cu-form-group">
				<view class="title">销售价</view>
				<input style="text-align: center;" v-model="search.minSellingPrice" placeholder="最小值"
					type="number">-<input v-model="search.maxSellingPrice" style="text-align: center;" placeholder="最大值"
					type="number">
			</view>
			<view class="cu-form-group">
				<view class="title">同行价</view>
				<input style="text-align: center;" v-model="search.minPeerPrice" placeholder="最小值" type="number">-<input
					v-model="search.maxPeerPrice" style="text-align: center;" placeholder="最大值" type="number">
			</view>
			<view class="cu-form-group">
				<view class="title">直播价</view>
				<input style="text-align: center;" v-model="search.minLiveBroadcastPrice" placeholder="最小值"
					type="number">-<input v-model="search.maxLiveBroadcastPrice" style="text-align: center;"
					placeholder="最大值" type="number">
			</view>
			<view class="cu-form-group">
				<view class="title">专柜价</view>
				<input style="text-align: center;" v-model="search.minCounterPrice" placeholder="最小值"
					type="number">-<input v-model="search.maxCounterPrice" style="text-align: center;" placeholder="最大值"
					type="number">
			</view>
			<view class="cu-form-group">
				<view class="title">类型</view>
				<uni-data-checkbox class="smallCheck" mode="tag" v-model="search.type"
					:localdata="productTypeMap"></uni-data-checkbox>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">排序</view>
				<picker-single v-model="search.order" name="productOrderSearch"></picker-single>
			</view>
		</view>
		<uni-card>

			<view class="mt-20 mb-10">
				<button class="cu-btn bg-purple" @click="getList(true)">
					<text class="cuIcon-filter"></text> 筛选
				</button>
				&nbsp;
				<button class="cu-btn bg-red" @click="search = {}; searchOrigin = {}; searchUser = {}">
					<text class="cuIcon-refresh"></text> 清空
				</button>
			</view>
		</uni-card>
	</scroll-view>
</template>

<script setup>
	import listHeader from "@/components/listHeader.vue"
	import requst from "@/common/request.js"
	import {
		isLogin
	} from "@/common/login.js"
	import _ from "lodash";
	import {
		ref,
		toRefs
	} from "vue";
	import {
		errorToast
	} from "@/common/toastHelper";
	import {
		checkPower,
		checkPowerCommon
	} from "@/common/power.js"
	import {
		onShow
	} from "@dcloudio/uni-app";
	import youScroll from "@/components/you-scroll.vue"
	import {
		getCustomerAllByPageApi
	} from "@/api/customer";
	import {
		getOriginAllApi
	} from "@/api/origin";
	import {
		getAllUserApi
	} from "@/api/user";
	import {
		intentionTypeMap,
		sexMap,
		customerMap
	} from '@/common/enum';
	import {
		filterArrayByIndex
	} from "@/common/indexSelect";
	import indexSelect from '@/components/indexSelect.vue'
	import {
		getCustomerTagAllApi
	} from "@/api/customerTag";
	import {
		getProductAllInfoApi,
		getProductOriginAllApi
	} from "@/api/product.info";

	import pickerSingle from "@/components/pickerSingle.vue";
	import selectIndexSingleSync from "@/components/selectIndexSingleSync.vue";
	import pickerMuplt from "@/components/pickerMuplt.vue";
	import {
		productTypeMap,
		productForPeopleMap,
		productSizeMap
	} from "@/common/enum.js"
	
	isLogin();


	//权限处理
	const powerBase = "CustomerController";
	const {
		createPowerEnable,
		findOnePowerEnable,
		findAllPowerEnable
	} = checkPowerCommon(powerBase);

	if (!findAllPowerEnable) {
		errorToast(`您没有权限访问这个模块`);
		uni.navigateTo({
			url: "/pages/index/functions"
		})
	}

	//公共区域, 添加跳转
	const add = function() {
		uni.navigateTo({
			url: "/pages/product/info/add"
		})
	}

	const edit = function(item) {
		uni.navigateTo({
			url: "/pages/product/info/add?id=" + item.id
		})
	}

	//////////////////////////// 筛选
	const search = ref({});
	const searchUser = ref({});

	//来源
	const originList = ref([]);
	const getOriginList = function() {
		getProductOriginAllApi().then(res => {
			if (res.status == 200) {
				const r = res.data.map(item => {
					return {
						value: item.id,
						text: item.name
					}
				})
				originList.value = r;
			} else {
				errorToast(res.message || `获取成色错误`)
			}
		})
	}
	getOriginList();



	//////////////////////////// API
	let pageNumber = 1;
	let total = 0;
	const list = ref([])
	const likeArr = ["name", "no", "intention_type", "customer_tag"]
	const getList = function(isClear) {
		const keys = Object.keys(search.value);
		const searchArr = [];
		keys.forEach(key => {
			let param = {
				key,
				value: search.value[key],
				isLike: likeArr.includes(key)
			}
			searchArr.push(param);
		})

		getProductAllInfoApi(pageNumber, searchArr).then(res => {
			if (_.get(res, "status") == 200) {
				list.value = isClear ? res.data.results : list.value.concat(res.data.results);
			} else {
				errorToast(_.get(res, "message", "获取产品列表出错"));
			}
		}).catch(res => {
			errorToast(_.get(res, "message", "获取产品列表出错"));
		})
	}

	const onPullDown = function(done) {
		getList(true).then(() => {
			done();
		})
	}


	//事件
	onShow(() => {
		getList(true);
	})

	//抽屉模块
	const modalName = ref(null);

	function hideModal(e) {
		modalName.value = null
	}

	function showModal(e) {
		modalName.value = e.currentTarget.dataset.target
	}
</script>

<style scoped>

</style>
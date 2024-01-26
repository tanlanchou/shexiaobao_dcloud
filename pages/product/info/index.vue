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

			<template v-slot:search>
				<uni-search-bar @confirm="search" :focus="true" v-model="search.keywords" @input="doSearch"
					@cancel="clear" @clear="clear">
				</uni-search-bar>
				<cc-dropDownMenu :titleArr="titleArr" :dropArr="dropArr"
					@finishDropClick="finishClick"></cc-dropDownMenu>
			</template>
		</list-header>

		<you-scroll @onPullDown="onPullDown" @onLoadMore="onLoadMore" scroll-y="true">
			<uni-list>
				<template v-for="(item, index) in list" :key="index">
					<uni-list-item :title="`产品名称:${item.title}`" clickable
						:note="`状态:${item.status == 2 ? '入库' : '出库'} &nbsp;&nbsp;  产品来源:${item.originName}`" showArrow
						:thumb="item.staticList.split(',')[0]" thumb-size="lg" @click="edit(item)" />
				</template>
			</uni-list>
		</you-scroll>


	</view>
	<view class="DrawerClose" :class="modalName=='viewModal'?'show':''" @tap="hideModal">
		<text class="cuIcon-pullright"></text>
	</view>
	<scroll-view scroll-y class="DrawerWindow" :class="modalName=='viewModal'?'show':''">

		<view class="search_body form_card">
			<!-- 			<view class="cu-form-group align-start">
				<view class="title">排序</view>
				<picker-single v-model="search.order" name="productOrderSearch"></picker-single>
			</view> -->
			<!-- 		<view class="cu-form-group">
				<view class="title">关键字</view>
				<input type="text" v-model="search.keywords" placeholder="名称, 编号, 描述, 颜色等等" />
			</view> -->
			<select-index-single-sync ref="productTypeIdRef" title="品牌" :req="false" name="getProductTypeAllApi"
				v-model="search.productTypeId">
			</select-index-single-sync>
			<picker-muplt title="品类" ref="productCategoryIdRef" :req="false" name="getProductCategoryAllApi"
				v-model="search.productCategoryId"></picker-muplt>
			<select-index-single-sync ref="productQualityIdRef" title="成色" :req="false" otherName="desc"
				name="getProductQualityAllApi" v-model="search.productQualityId"></select-index-single-sync>
			<view class="cu-form-group">
				<view class="title">来源</view>
				<uni-data-checkbox class="smallCheck" mode="tag" v-model="search.productOriginId"
					:localdata="originList"></uni-data-checkbox>
			</view>
			<!-- <select-index-single-sync title="仓库" ref="productStoreIdRef" :req="false" name="getProductStorehouseAllApi"
				v-model="search.productStoreId"></select-index-single-sync> -->
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
			<view class="cu-form-group">
				<view class="title">适用人群</view>
				<picker-single ref="forPeopleRef" v-model="search.forPeople" name="productForPeopleMap"></picker-single>
			</view>
			<view class="cu-form-group">
				<view class="title">尺码</view>
				<picker-single v-model="search.size" name="productSizeMap"></picker-single>
			</view>
			<select-index-muplt-sync title="材质" :req="false" name="getProductMaterialAllApi"
				v-model="search.productMaterial"></select-index-muplt-sync>
			<view class="cu-form-group">
				<view class="title">到货时间</view>
				<uni-datetime-picker :clear-icon="false" :border="false" v-model="search.arraivalRange"
					type="daterange" />
			</view>
			<view class="cu-form-group clear_close">
				<view class="title">入库时间</view>
				<uni-datetime-picker :clear-icon="false" :border="false" v-model="search.inTImeRange"
					type="daterange" />
			</view>
			<select-index-single-sync title="买手" :req="false" name="getAllUserApi"
				v-model="search.buyer"></select-index-single-sync>
			<select-index-muplt-sync title="标签" :req="false" name="getProductTagAllApi"
				v-model="search.productTag"></select-index-muplt-sync>
			<select-index-muplt-sync title="附件" :req="false" name="getProductAttachAllApi"
				v-model="search.productAttach"></select-index-muplt-sync>
			<view class="search_action">
				&nbsp;
				<button class="cu-btn bg-purple" style="width:40%" @click="getList(true)">
					<text class="cuIcon-filter"></text> 筛选
				</button>
				&nbsp;
				<button class="cu-btn bg-red" style="width:40%" @click="searchClear">
					<text class="cuIcon-refresh"></text> 清空
				</button>
				&nbsp;
			</view>
		</view>

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
		customerMap,
		productOrderSearch,
		prodcutStatusMap
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
		getProductOriginAllApi,
		getProductStorehouseAllApi
	} from "@/api/product.info";

	import pickerSingle from "@/components/pickerSingle.vue";
	import selectIndexSingleSync from "@/components/selectIndexSingleSync.vue";
	import selectIndexMupltSync from "@/components/selectIndexMupltSync.vue";
	import pickerMuplt from "@/components/pickerMuplt.vue";
	import {
		productTypeMap,
		productForPeopleMap,
		productSizeMap
	} from "@/common/enum.js"
	import {
		throttle
	} from "../../../common/common";

	isLogin();


	//权限处理
	const powerBase = "CustomerController";
	const {
		createPowerEnable,
		findOnePowerEnable,
		findAllPowerEnable
	} = checkPowerCommon(powerBase);

	if (!findAllPowerEnable) {
		errorToast(`无权访问的模块`);
		setTimeout(() => {
			uni.navigateTo({
				url: "/pages/index/functions"
			})
		}, 1000)

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
	const defaultSearch = {
		order: 0
	};
	const search = ref(_.cloneDeep(defaultSearch));
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

	//////////////////////////// 变量REF和清空
	const productTypeIdRef = ref(null);
	const productQualityIdRef = ref(null);
	const productCategoryIdRef = ref(null);
	// const productStoreIdRef = ref(null);
	const forPeopleRef = ref(null);

	const searchClear = function() {
		search.value = _.cloneDeep(defaultSearch);
		productTypeIdRef.value.clear();
		productQualityIdRef.value.clear();
		productCategoryIdRef.value.clear();
		// productStoreIdRef.value.clear();
		forPeopleRef.value.clear();
	}

	//////////////////////////// API
	let pageNumber = 1;
	let total = 0;
	const list = ref([])
	const likeArr = ["name", "no", "intention_type", "customer_tag"]
	const getList = function(isClear) {

		const r = _.cloneDeep(search.value);
		const params = _.pickBy(r, (value) => value !== null && value !== undefined && value !== '')

		return getProductAllInfoApi(pageNumber, params).then(res => {
			if (_.get(res, "status") == 200) {
				list.value = isClear ? res.data.results : list.value.concat(res.data.results);
				total = res.data.total;
			} else {
				errorToast(_.get(res, "message", "获取产品列表出错"));
			}
		}).catch(res => {
			errorToast(_.get(res, "message", "获取产品列表出错"));
		}).finally(() => {
			if (isClear) {
				hideModal();
			}
		})
	}

	function getStoreHouse() {
		getProductStorehouseAllApi().then(res => {
			if (res.status === 200) {
				const r = res.data.map(item => ({
					text: item.name,
					value: item.id
				}));

				dropArr.value[0] = [{
					text: "不限",
					value: null
				}].concat(r);


			} else {
				errorToast(ex.message || "获取仓库数据出错")
			}
		}).catch(ex => {
			errorToast(ex.message || "获取仓库数据出错")
		})
	}
	getStoreHouse()

	const finishClick = function(resultData) {
		search.value.productStoreId = resultData[0] !== "" ? resultData[0] : null;
		search.value.order = resultData[1] !== "" ? resultData[1] : null;
		search.value.status = resultData[2] !== "" ? resultData[2] : null;
		pageNumber = 1;
		getList(true);
	}

	const onLoadMore = function() {
		console.log()
		const pageCount = Math.ceil(total / 20);
		if (pageCount > pageNumber) {
			pageNumber += 1;
			getList().then(() => {

			})
		}
	}

	const onPullDown = function(done) {
		pageNumber = 1;
		getList(true).then(() => {
			done();
		})
	}

	getList(true);


	const doSearch = throttle(function() {
		pageNumber = 1;
		getList(true);
	}, 1000);

	const titleArr = ref(["仓库", "排序", "状态"]);
	const dropArr = ref([
		[],
		[{
			text: "不限",
			value: null
		}].concat(productOrderSearch.map((item, index) => ({
			text: item,
			value: index
		}))),
		[{
			text: "不限",
			value: null
		}].concat(prodcutStatusMap)
	]);


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
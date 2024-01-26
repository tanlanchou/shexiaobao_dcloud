<template>
	<view class="status_bar"></view>
	<view class="DrawerPage" :class="modalName=='viewModal'?'show':''">
		<list-header title="订单管理">
			<template v-slot:default>
				<button class="cu-btn bg-green" style="margin-right: 5px;" @click="showModal" data-target="viewModal">
					<text class="cuIcon-filter"></text> 筛选
				</button>
				<button class="cu-btn bg-purple" v-if="createPowerEnable" @click="add">
					<text class="cuIcon-add"></text> 添加
				</button>
			</template>
			<template v-slot:search>
				<uni-search-bar @confirm="search" :focus="true" v-model="searchData.keywords" @input="doSearch"
					@cancel="clear" @clear="clear">
				</uni-search-bar>
				<cc-dropDownMenu :titleArr="titleArr" :dropArr="dropArr"
					@finishDropClick="finishClick"></cc-dropDownMenu>
			</template>
		</list-header>
		<you-scroll ref="scroll" @onPullDown="onPullDown" @onLoadMore="onLoadMore">
			<view class="cu-list menu sm-border">
				<uni-list>
					<template v-for="(item, index) in list" :key="index">
						<uni-list-item :title="item.title" clickable
							:note="`销售时间:${moment(item.saleTime).format('YYYY-MM-DD')} 状态:${item.status == 2 ? '撤回':'正常'}`"
							showArrow :thumb="item.img && item.img.split(',')[0]" thumb-size="lg"
							@click="toSee(item)" />
					</template>
				</uni-list>
			</view>
		</you-scroll>
	</view>
	<view class="DrawerClose" :class="modalName=='viewModal'?'show':''" @tap="hideModal">
		<text class="cuIcon-pullright"></text>
	</view>
	<scroll-view scroll-y class="DrawerWindow" :class="modalName=='viewModal'?'show':''">
		<view class="search_body form_card">
			<select-index-single-sync ref="customerRef" title="客户" :req="false" name="getCustomerAllApi"
				v-model="searchData.customerId">
			</select-index-single-sync>
			<picker-muplt title="销售途径" ref="salesChannelsRef" :req="false" name="getSalesChannelsAllInfoApi"
				v-model="searchData.salesChannelsId"></picker-muplt>
			<!-- 			<view class="cu-form-group">
				<view class="title">发货状态</view>
				<uni-data-checkbox class="smallCheck" mode="tag" v-model="searchData.sendStatus"
					:localdata="expressStatusMap"></uni-data-checkbox>
			</view>
			<view class="cu-form-group">
				<view class="title">订单状态</view>
				<uni-data-checkbox class="smallCheck" mode="tag" v-model="searchData.status"
					:localdata="orderStatusMap"></uni-data-checkbox>
			</view> -->
			<view class="cu-form-group">
				<view class="title">收到金额</view>
				<input style="text-align: center;" v-model="searchData.minMoney" placeholder="最小值" type="number">-<input
					v-model="searchData.maxMoney" style="text-align: center;" placeholder="最大值" type="number">
			</view>
			<view class="cu-form-group">
				<view class="title">应收金额</view>
				<input style="text-align: center;" v-model="searchData.minAmountReceivable" placeholder="最小值"
					type="number">-<input v-model="searchData.maxAmountReceivable" style="text-align: center;"
					placeholder="最大值" type="number">
			</view>
			<select-index-single-sync ref="userRef" title="销售" :req="false" name="getAllUserApi"
				v-model="searchData.user"></select-index-single-sync>
			<view class="cu-form-group">
				<view class="title">销售时间</view>
				<uni-datetime-picker :clear-icon="false" :border="false" v-model="searchData.saleRange"
					type="daterange" />
			</view>
			<view class="search_action">
				&nbsp;
				<button class="cu-btn bg-purple" style="width:40%" @click="filter()">
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
	import selectIndexSingleSync from "@/components/selectIndexSingleSync.vue";
	import selectIndexMupltSync from "@/components/selectIndexMupltSync.vue";
	import pickerSingle from "@/components/pickerSingle.vue";
	import pickerMuplt from "@/components/pickerMuplt.vue";
	import {
		isLogin
	} from "@/common/login.js"
	import _ from "lodash";
	import {
		ref,
		toRefs
	} from "vue";
	import {
		expressStatusMap,
		orderStatusMap,
		productOrderSearch
	} from '@/common/enum';
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
		getOrderAllApi
	} from "../../../api/order";
	import moment from "moment";
	import {
		throttle
	} from "../../../common/common";

	isLogin();

	//权限处理
	const powerBase = "OrderController";
	const {
		createPowerEnable,
		findOnePowerEnable,
		findAllPowerEnable
	} = checkPowerCommon(powerBase);

	if (!findAllPowerEnable) {
		errorToast(`您没有权限访问这个模块`);
		setTimeout(() => {
			uni.navigateTo({
				url: "/pages/index/functions"
			})
		}, 1000);
	}



	//搜索
	const customerRef = ref(null);
	const salesChannelsRef = ref(null);
	const userRef = ref(null);
	const filter = function() {
		getList(true)
	}

	const searchClear = function() {
		searchData.value = {};
		customerRef.value.clear();
		salesChannelsRef.value.clear();
		userRef.value.clear();
	}

	const doSearch = throttle(function() {
		getList(true)
	}, 1000);

	const titleArr = ref(["发货状态", "订单状态"]);
	const dropArr = ref([
		[{
			text: "不限",
			value: null
		}].concat(expressStatusMap),
		[{
			text: "不限",
			value: null
		}].concat(orderStatusMap)
	]);

	const finishClick = function(resultData) {
		searchData.value.sendStatus = resultData[0] !== "" ? resultData[0] : null;
		searchData.value.status = resultData[1] !== "" ? resultData[1] : null;
		getList(true);
	}

	//API
	let pageNumber = 1;
	let total = 0;
	const searchData = ref({});
	const list = ref([])
	const likeArr = ["name", "no", "intention_type", "customer_tag"]
	const getList = function(isClear) {

		const params = _.pickBy(_.cloneDeep(searchData.value), _.identity);

		return getOrderAllApi(pageNumber, params).then(res => {
			if (_.get(res, "status") == 200) {
				list.value = isClear ? res.data.results : list.value.concat(res.data.results);
				total = res.data.total;
			} else {
				errorToast(_.get(res, "message", "获取订单列表出错"));
			}
		}).catch(res => {
			errorToast(_.get(res, "message", "获取订单列表出错"));
		})
	}

	const onLoadMore = function(done) {
		const pageCount = Math.ceil(total / 20);
		if (pageCount > pageNumber) {
			pageNumber += 1;
			getList().then(() => {
				done();
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

	//功能性
	const toSee = function(record) {
		uni.navigateTo({
			url: `/pages/order/info/add?id=${record.id}`
		})
	}

	const add = function() {
		uni.navigateTo({
			url: "/pages/order/info/add"
		})
	}

	const modalName = ref(null);

	function hideModal(e) {
		modalName.value = null
	}

	function showModal(e) {
		modalName.value = e.currentTarget.dataset.target
	}
</script>

<style>
</style>
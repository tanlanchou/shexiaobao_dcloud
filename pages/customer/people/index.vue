<template>
	<view class="DrawerPage" :class="modalName=='viewModal'?'show':''">
		<list-header title="客户管理">
			<button class="cu-btn bg-green" style="margin-right: 5px;" @click="showModal" data-target="viewModal">
				<text class="cuIcon-filter"></text> 筛选
			</button>

			<button class="cu-btn bg-purple" v-if="createPowerEnable" @click="add">
				<text class="cuIcon-add"></text> 添加
			</button>
		</list-header>

		<you-scroll @onPullDown="onPullDown" scroll-y="true">
			<view class="cu-list menu sm-border card-menu mt-10">
				<template v-for="(item, index) in list" :key="index">
					<view class="cu-item" @click="findOnePowerEnable && edit(item)">
						<view class="content padding-tb-sm">
							<view>
								<text class="cuIcon-text text-blue margin-right-xs">&nbsp;{{item.name}}</text>
							</view>
						</view>
						<view v-if="findOnePowerEnable">
							<text class="cuIcon-right margin-right-xs"></text>
						</view>
					</view>
				</template>
			</view>
		</you-scroll>


	</view>
	<view class="DrawerClose" :class="modalName=='viewModal'?'show':''" @tap="hideModal">
		<text class="cuIcon-pullright"></text>
	</view>
	<scroll-view scroll-y class="DrawerWindow" :class="modalName=='viewModal'?'show':''">
		<view class="search_body form_card">
			<view class="cu-form-group">
				<view class="title">名称</view>
				<input type="text" v-model="search.name" placeholder="请输入" />
			</view>
			<view class="cu-form-group">
				<view class="title">客户编号</view>
				<input type="text" v-model="search.no" placeholder="请输入" />
			</view>
			<select-index-single-sync title="维护人" ref="maintenanceManRef" :req="true" name="getAllUserApi"
				v-model="search.maintenance_man"></select-index-single-sync>
			<select-index-single-sync title="客户来源" ref="customerOriginRef" :req="true" name="getOriginAllApi"
				v-model="search.customer_origin_id"></select-index-single-sync>
			<view class="cu-form-group">
				<view class="title">客户意向</view>
				<uni-data-checkbox mode="tag" v-model="search.intention_type"
					:localdata="intentionTypeMap"></uni-data-checkbox>
			</view>
			<view class="cu-form-group">
				<view class="title">性别</view>
				<uni-data-checkbox mode="tag" v-model="search.sex" :localdata="sexMap"></uni-data-checkbox>
			</view>
			<view class="cu-form-group">
				<view class="title">类型</view>
				<uni-data-checkbox mode="tag" v-model="search.type" :localdata="customerMap"></uni-data-checkbox>
			</view>

			<select-index-single-sync ref="customerTagRef" title="客户标签" :req="false" name="getCustomerTagAllApi"
				v-model="search.customer_tag"></select-index-single-sync>
			<view class="search_action">
				&nbsp;
				<button class="cu-btn bg-purple" style="width:40%" @click="filter">
					<text class="cuIcon-filter"></text> 筛选
				</button>
				&nbsp;
				<button class="cu-btn bg-red" style="width:40%" @click="clearSearch">
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
		intentionTypeMap,
		sexMap,
		customerMap
	} from '@/common/enum';
	import {
		getCustomerAllApi,
		getCustomerAllByPageApi
	} from "../../../api/customer";

	isLogin();


	//权限处理
	const powerBase = "CustomerController";
	const {
		createPowerEnable,
		findOnePowerEnable,
		findAllPowerEnable
	} = checkPowerCommon(powerBase);

	console.log(findAllPowerEnable)
	if (checkPower(findAllPowerEnable)) {
		errorToast(`您没有权限访问这个模块`);
		uni.navigateTo({
			url: "/pages/index/functions"
		});
	}

	//公共区域, 添加跳转
	const add = function() {
		uni.navigateTo({
			url: "/pages/customer/people/add"
		})
	}

	const edit = function(item) {
		uni.navigateTo({
			url: "/pages/customer/people/add?id=" + item.id
		})
	}

	//////////////////////////// 筛选
	const search = ref({});
	const filter = function() {
		getList(true);
		hideModal();
	}

	//////////////////////////// API
	let pageNumber = 1;
	let total = 0;
	const list = ref([])
	const likeArr = ["name", "no", "intention_type", "customer_tag"]
	const getList = function(isClear) {
		const keys = Object.keys(search.value);
		console.log(keys);
		const searchArr = [];
		keys.forEach(key => {
			let param = {
				key,
				value: search.value[key],
				isLike: likeArr.includes(key)
			}
			searchArr.push(param);
		})
		return getCustomerAllByPageApi(pageNumber, searchArr).then(res => {
			if (_.get(res, "status") == 200) {
				list.value = isClear ? res.data.results : list.value.concat(res.data.results);
			} else {
				errorToast(_.get(res, "message", "获取客户列表出错"));
			}
		}).catch(res => {
			errorToast(_.get(res, "message", "获取客户列表出错"));
		})
	}

	const onPullDown = function(done) {
		getList(true).then(() => {
			done();
		})
	}


	//事件
	const maintenanceManRef = ref(null);
	const customerOriginRef = ref(null);
	const customerTagRef = ref(null);
	
	const clearSearch = function() {
		search.value = {};
		maintenanceManRef.value.clear();
		customerOriginRef.value.clear();
		customerTagRef.value.clear();
	}


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

<style>
</style>
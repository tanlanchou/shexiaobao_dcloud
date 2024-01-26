<template>
	<view class="status_bar"></view>
	<view class="DrawerPage" :class="modalName=='viewModal'?'show':''">
		<list-header :title="title">
			<template v-slot:default>
				<button class="cu-btn bg-green" style="margin-right: 5px;" @click="showModal" data-target="viewModal">
					<text class="cuIcon-filter"></text> 筛选
				</button>

				<button class="cu-btn bg-purple" v-if="createPowerEnable" @click="add">
					<text class="cuIcon-add"></text> 添加
				</button>
			</template>
			<template v-slot:search>
				<uni-search-bar @confirm="search" :focus="true" v-model="search.name" @input="doSearch">
				</uni-search-bar>
			</template>
		</list-header>

		<you-scroll @onPullDown="onPullDown" scroll-y="true">
			<view class="cu-list menu sm-border">
				<template v-for="(item, index) in list" :key="index">
					<view class="cu-item" @click="findOnePowerEnable && jumpToUserDetail(item)">
						<view class="content padding-tb-sm">
							<view>
								<text class="text-blue margin-right-xs"
									:class="!!item.parentId ? 'cuIcon-move' : 'cuIcon-refresharrow'"
									:style="{ paddingLeft: (!!item.parentId ? 25 : 0) + 'px' }">&nbsp;{{item.name}}</text>
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
		<!-- <select-index-single-sync v-if="formData.parentId != 0" title="父节点" :v="formData.parent" :req="false"
			:name="_.get(props, 'options.request.findAll') || '/' +_.get(props, 'options.name') + '?pid=0'"
			v-model="formData.parentId">
		</select-index-single-sync> -->
		<view class="search_body form_card">
			<!-- 			<view class="cu-form-group ">
				<view class="title">名称</view>
				<input type="text" v-model="search.name" placeholder="请输入" />
			</view> -->
			<select-index-single-sync ref="parentIdSearchRef" title="父节点" :req="false"
				:name="_.get(props, 'options.request.findAll') || '/' +_.get(props, 'options.name') + '?pid=0'"
				v-model="search.parentId">
			</select-index-single-sync>
			<view style="text-align: center;" class='mt-10'>
				&nbsp;
				<button class="cu-btn bg-purple" @click="init()">
					<text class="cuIcon-filter"></text> 筛选
				</button>
				&nbsp;
				<button class="cu-btn bg-red" @click="clear">
					<text class="cuIcon-refresh"></text> 清空
				</button>
				&nbsp;
			</view>
		</view>


	</scroll-view>
</template>

<script setup>
	import listHeader from "@/components/listHeader.vue"
	import youScroll from "@/components/you-scroll.vue"
	import selectIndexSingleSync from "@/components/selectIndexSingleSync.vue";
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
	} from "../../common/toastHelper";
	import {
		checkPower
	} from "@/common/power.js"
	import {
		onShow
	} from "@dcloudio/uni-app";
	import {
		parseAndSort
	} from "../../common/tree";
	import {
		throttle
	} from "../../common/common";

	isLogin();

	const props = defineProps({
		title: {
			type: String,
			required: true
		},
		options: {
			type: Object,
			required: true
		}
	})


	if (!props.options || !props.options.name) {
		errorToast(`单个名称组件参数错误`);
		setTimeout(() => {
			uni.navigateBack({
				delta: 1
			})
		}, 1000);
	}

	//权限处理
	const powerBase = _.get(props, "options.controllerName");
	const findAllPowerName = _.get(props, "options.power.findAll") || `${powerBase}_findAll`;
	const createPowerName = _.get(props, "options.power.create") || `${powerBase}_create`;
	const findOnePowerName = _.get(props, "options.power.findOne") || `${powerBase}_findOne`;
	const updatePowerName = _.get(props, "options.power.update") || `${powerBase}_update`;
	const deletePowerName = _.get(props, "options.power.delete") || `${powerBase}_delete`;
	if (!checkPower(findAllPowerName)) {
		errorToast(`您没有权限访问这个模块`);
		setTimeout(() => {
			uni.navigateBack({
				delta: 1
			})
		});
	}

	const createPowerEnable = ref(checkPower(createPowerName));
	const findOnePowerEnable = ref(checkPower(findOnePowerName));

	//参数
	const list = ref([]);
	const parentIdSearchRef = ref(null);

	//API处理
	const search = ref({});
	const getList = function(params) {
		let url = _.get(props, "options.request.findAll") || `/${_.get(props, "options.name")}`
		url += "?1=1";
		const keys = _.keys(params);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (params[key]) {
				url += `&${key}=${params[key]}`;
			}
		}
		return requst({
			url,
			method: `get`,
			isValid: true
		});
	}

	const doSearch = throttle(() => {
		init()
	}, 1000)


	const getListByPage = function() {
		//后续可能存在分页情况
	}

	const init = function(done) {
		getList({
			name: search.value.name,
			pid: search.value.parentId
		}).then(res => {
			if (res.status === 200) {
				let result = res.data;
				if (search.value.name || search.value.pid !== undefined) {
					list.value = result;
				} else {
					const tempResult = [];
					list.value = parseAndSort(result, 0);
				}
			} else {
				errorToast(res.message || `${title}列表查询错误`)
			}
		}).catch(res => {
			console.log("init catch", res)
			errorToast(res.message || `${title}列表查询错误`)
		}).finally(() => {
			hideModal();
			if (typeof done !== 'undefined') {
				console.log(done)
				done();
			}
		})
	}

	//处理方法区域
	const jumpToUserDetail = function(record) {
		if (findOnePowerEnable.value) {
			uni.navigateTo({
				url: `${_.get(props, "options.baseUrl")}/add?id=${record.id}`
			})
		}
	}

	function filter() {

	}

	function add() {
		uni.navigateTo({
			url: `${_.get(props, "options.baseUrl")}/add`
		})
	}

	//事件
	onShow(() => {
		init();
	})

	const clear = function() {
		search.value = {};
		parentIdSearchRef.value.clear();
	}

	const onPullDown = function(done) {
		init(done);
	}

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
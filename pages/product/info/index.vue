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
			<view class="cu-form-group  ">
				<view class="title">名称</view>
				<input type="text" v-model="search.title" />
			</view>
			<select-index-single-sync title="品牌" :req="false" name="getProductTypeAllApi" v-model="search.type">
			</select-index-single-sync>
		</view>
		<uni-card>

			<uni-section title="名称" type="line">
				<uni-easyinput class="input-border-bottom " type="text" :inputBorder="false" v-model="search.name"
					placeholder="名称" prefix-icon="contact"></uni-easyinput>
			</uni-section>
			<uni-section title="产品编号" type="line">
				<uni-easyinput class="input-border-bottom " type="text" :inputBorder="false" v-model="search.no"
					placeholder="产品编号" prefix-icon="contact"></uni-easyinput>
			</uni-section>
			<uni-section title="维护人选择" type="line">
				<text>{{searchUser.nickname}}</text> &nbsp; <button class="cu-btn bg-green round"
					@click="openUserIndex">
					<text class="cuIcon-selection"></text> 选择维护人
				</button>
			</uni-section>
			<uni-section title="产品来源" type="line">
				<text>{{searchOrigin.name}}</text> &nbsp; <button class="cu-btn bg-green round"
					@click="openOriginIndex">
					<text class="cuIcon-selection"></text> 选择来源
				</button>
			</uni-section>
			<uni-section title="产品意向" type="line">
				<uni-data-checkbox mode="tag" v-model="search.intention_type"
					:localdata="intentionTypeMap"></uni-data-checkbox>
			</uni-section>
			<uni-section title="产品标签" type="line">
				<text v-text="search.customer_tag"></text> &nbsp; <button class="cu-btn bg-green round"
					@click="openTagIndex">
					<text class="cuIcon-selection"></text> 选择标签
				</button>
			</uni-section>
			<uni-section title="类型" type="line">
				<uni-data-checkbox mode="tag" v-model="search.type" :localdata="customerMap"></uni-data-checkbox>
			</uni-section>
			<uni-section title="性别" type="line">
				<uni-data-checkbox mode="tag" v-model="search.sex" :localdata="sexMap"></uni-data-checkbox>
			</uni-section>
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

	<index-select ref="userListRef" title="维护人选择" v-if="userDataLoadFlag" :list="userList" :isSingle="true"
		:isShowSelect="true" @indexSelect="userBindClick"></index-select>

	<index-select ref="tagListRef" title="产品标签" v-if="tagDataLoadFlag" :list="tagList" :isSingle="false"
		:isShowSelect="true" @indexSelect="tagBindClick"></index-select>

	<index-select ref="originListRef" title="产品来源" v-if="originDataLoadFlag" :list="originList" :isSingle="true"
		:isShowSelect="true" @indexSelect="originBindClick"></index-select>
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
		getProductAllInfoApi
	} from "@/api/product.info";

	import pickerSingle from "@/components/pickerSingle.vue";
	import selectIndexSingleSync from "@/components/selectIndexSingleSync.vue";
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

	//////////////////////////// 维护人API
	const userListRef = ref(null);
	const userDataLoadFlag = ref(false);
	const userList = ref([]);
	const userOriginList = ref([]);

	const getUserList = function() {
		getAllUserApi().then(res => {
			if (res.status == 200) {
				userOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result = filterArrayByIndex(res.data.map(item => `${item.nickname}(${item.phoneNumber})`));
				userList.value = result;
				setTimeout(() => {
					userDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取用户错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取用户错误`)
		});
	}

	const openUserIndex = function() {
		userListRef.value.open();
	}

	const userBindClick = function(source) {
		let str = source.name;
		try {
			let tempArr = str.split('(');
			let phoneNumber = tempArr[1].substring(0, tempArr[1].length - 1);
			const result = userOriginList.value.find(item => item.phoneNumber == phoneNumber);
			if (result) {
				searchUser.value = result;
				search.value.maintenance_man = result.id;
			} else {
				errorToast("数据格式出错, 请刷新后重试");
			}
		} catch (ex) {
			console.error(ex.message);
			errorToast("数据格式出错, 请刷新后重试");
		}
	}
	getUserList();

	/////////////////////////////// 标签
	const tagListRef = ref(null);
	const tagDataLoadFlag = ref(false);
	const tagList = ref([]);
	const tagOriginList = ref([]);
	const getTagList = function() {
		getCustomerTagAllApi().then(res => {
			if (res.status === 200) {
				tagOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result = filterArrayByIndex(res.data.map(item => item.name));
				tagList.value = result;
				setTimeout(() => {
					tagDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取产品标签错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取产品标签错误`)
		});
	}

	const tagBindClick = function(source) {
		try {
			search.value.customer_tag = source.map(item => item.name).join(',')
		} catch (ex) {
			console.error(ex.message);
			errorToast("数据格式出错, 请刷新后重试");
		}
	}

	const openTagIndex = function() {
		tagListRef.value.open();
	}
	getTagList();

	//来源
	const originListRef = ref(null);
	const originDataLoadFlag = ref(false);
	const originList = ref([]);
	const originOriginList = ref([]);
	const searchOrigin = ref({});

	const getOriginList = function() {
		getOriginAllApi().then(res => {
			if (res.status === 200) {
				originOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result = filterArrayByIndex(res.data.map(item => item.name));
				originList.value = result;
				setTimeout(() => {
					originDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取产品标签错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取产品标签错误`)
		});
	}

	const openOriginIndex = function() {
		originListRef.value.open();
	}
	const originBindClick = function(source) {
		try {
			const result = originOriginList.value.find(item => item.name == source.name);
			if (!result) {
				errorToast("来源数据错误");
				return;
			}
			search.value.customer_origin_id = result.id;
			searchOrigin.value = result;
		} catch (ex) {
			console.error(ex.message);
			errorToast("数据格式出错, 请刷新后重试");
		}
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

<style>
</style>
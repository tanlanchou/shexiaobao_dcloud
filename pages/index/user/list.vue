<template>
	<view class="status_bar"></view>
	<view class="DrawerPage" :class="modalName=='viewModal'?'show':''">
		<list-header title="用户列表">
			<template v-slot:default>
				<button class="cu-btn bg-green" @tap="showModal" data-target="viewModal">
					<text class="cuIcon-filter"></text> 筛选
				</button>
			</template>
			<template v-slot:search>
				<uni-search-bar @confirm="search" :focus="true" v-model="searchData.keywords" @input="doSearch">
				</uni-search-bar>
				<cc-dropDownMenu :titleArr="titleArr" :dropArr="dropArr"
					@finishDropClick="finishClick"></cc-dropDownMenu>
			</template>
		</list-header>
		<you-scroll ref="scroll" @onPullDown="onPullDown" @onLoadMore="onLoadMore">
			<view class="cu-list menu sm-border">
				<template v-for="(item, index) in list" :key="index">
					<view class="cu-item" @click="jumpToUserDetail(item)">
						<view class="content padding-tb-sm">
							<view>
								<text class="cuIcon-profile text-blue margin-right-xs">&nbsp;{{item.nickname}}</text>
							</view>
							<view class="text-gray text-sm">
								<text class="cuIcon-phone margin-right-xs">{{item.phoneNumber}}</text>
								<text class="cuIcon-profile margin-right-xs">{{item.role.name}}</text>
							</view>
						</view>
						<view>
							<text class="cuIcon-right margin-right-xs"></text>
						</view>
					</view>
				</template>
			</view>
			<!-- <div class="loadingText">正在努力加载...</div> -->
		</you-scroll>
	</view>
	<view class="DrawerClose" :class="modalName=='viewModal'?'show':''" @tap="hideModal">
		<text class="cuIcon-pullright"></text>
	</view>
	<scroll-view scroll-y class="DrawerWindow" :class="modalName=='viewModal'?'show':''">
		<view class="search_body form_card">
			<!-- 			<view class="cu-form-group align-start">
				<view class="title">排序</view>
				<picker-single v-model="searchData.order" name="userOrderSearch"></picker-single>
			</view> -->
			<!-- 			<view class="cu-form-group">
				<view class="title">昵称</view>
				<input type="text" v-model="searchData.nickname" placeholder="请输入" />
			</view>
			<view class="cu-form-group">
				<view class="title">手机号</view>
				<input type="number" v-model="searchData.phoneNumber" placeholder="请输入" />
			</view> -->
			<select-index-single-sync ref="roleRef" title="角色" :req="false" name="getAllRoleApi"
				v-model="searchData.roleId"></select-index-single-sync>
			<!-- <view class="cu-form-group">
				<view class="title">状态</view>
				<picker-single ref="statusRef" v-model="searchData.status" mode="plus"
					name="userStatusToWords"></picker-single>
			</view> -->
			<view class="cu-form-group">
				<view class="title">创建时间</view>
				<uni-datetime-picker :clear-icon="false" :border="false" v-model="searchData.createTimeRange"
					type="daterange" />
			</view>
			<view class="cu-form-group clear_close">
				<view class="title">登录时间</view>
				<uni-datetime-picker :clear-icon="false" :border="false" v-model="searchData.loginRange"
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

<script>
	import listHeader from '@/components/listHeader.vue'
	import youScroll from '@/components/you-scroll.vue'
	import selectIndexSingleSync from "@/components/selectIndexSingleSync.vue";
	import pickerSingle from "@/components/pickerSingle.vue";
	import {
		errorToast,
		loadingToast,
		successToast
	} from '@/common/toastHelper';
	import {
		isLogin
	}
	from '@/common/login'
	import {
		getAllUserByPageApi
	} from '@/api/user'
	import fullScreenDrawer from '@/mixins/fullScreenDrawer';
	import {
		getAllRoleApi
	} from '@/api/role';
	import {
		filterArrayByIndex
	} from '@/common/indexSelect';
	import indexSelect from '@/components/indexSelect.vue'
	import _ from "lodash";
	import {
		userStatus,
		userStatusForIndexSelect,
		userStatusToWords,
		userOrderSearch
	} from '@/common/enum'
	import {
		throttle
	} from '../../../common/common';

	export default {
		components: {
			listHeader,
			youScroll,
			indexSelect,
			selectIndexSingleSync,
			pickerSingle
		},
		mixins: [fullScreenDrawer],
		data() {
			return {
				pageNumber: 1,
				total: 0,
				list: [],
				searchData: {},
				originRoleList: [],
				roleList: [],
				roleDataLoadFlag: false,
				userStatusList: userStatusForIndexSelect,
				titleArr: ["排序", "状态"],
				dropArr: [
					[{
						text: "不限",
						value: null
					}].concat(userOrderSearch.map((item, index) => ({
						text: item,
						value: index
					}))), [{
						text: "不限",
						value: null
					}].concat(userStatusToWords.map((item, index) => ({
						text: item,
						value: index + 1
					})))
				]
			}
		},
		onShow() {
			if (!!isLogin()) {
				this.init(true);
			}
		},
		methods: {
			filter() {
				this.init(true);
				this.hideModal();
			},
			doSearch: throttle(function() {
				this.pageNumber = 1;
				this.init(true);
			}, 1000),
			finishClick: function(resultData) {
				this.searchData.order = resultData[0] !== "" ? resultData[0] : null;
				this.searchData.status = resultData[1] !== "" ? resultData[1] : null;
				this.init(true);
			},
			init(isClear) {
				const params = _.pickBy(_.cloneDeep(this.searchData), (value) => value !== null && value !== undefined &&
					value !== '')
				return getAllUserByPageApi(this.pageNumber, params).then(res => {
					if (res.status == 200) {
						this.list = isClear ? res.data.results : this.list.concat(res.data.results);
						this.total = res.data.total;
					} else {
						errorToast(res.message || "获取用户列表失败")
					}
				}).catch(res => {
					errorToast(res.message || "获取用户列表失败")
				})
			},
			onPullDown(done) {
				this.pageNumber = 1;
				this.init(true).finally(() => {
					done()
				})
			},
			onLoadMore() {
				const pageCount = Math.ceil(this.total / 20);
				if (pageCount > this.pageNumber) {
					this.pageNumber += 1;
					this.init();
				}
			},
			jumpToUserDetail(item) {
				uni.navigateTo({
					url: `/pages/index/user/detail?id=${item.id}`
				})
			},
			searchClear() {
				this.searchData = {};
				this.$refs.statusRef.clear();
				this.$refs.roleRef.clear();
			}
		}
	}
</script>

<style scoped>

</style>
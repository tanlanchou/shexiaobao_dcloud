<template>
	<view class="status_bar"></view>
	<view class="">
		<!-- 顶部个人信息 -->
		<view class="bg-white">
			<view class="flex padding">
				<view class="padding-lr-xs">
					<view class="cu-avatar lg round" :style="{ backgroundImage: 'url(' + user.img + ')' }">
					</view>
				</view>
				<view class="padding-xs text-xl text-black">
					<view>你好，{{ user.nickname }}</view>
					<view class="cu-tag round line-green sm">{{ user.role && user.role.name }}</view>
				</view>
			</view>
		</view>

		<view class="cu-bar margin-lr-xs margin-top-sm grid col-4 no-border bg-white radius-lg-top">
			<view class="action">
				<text class="text-xl text-black">我的功能</text>
			</view>
			<view class="action">
				<a href="javascript:;" @click="jumpToAllFunction" class="text-lg no-line">全部功能<text
						class="cuIcon-right"></text></a>
			</view>
		</view>
		<view class="cu-list grid col-4 no-border text-black margin-lr-xs padding-bottom radius-lg-bottom">
			<view class="cu-item" v-for="(item,index) in iconList" :key="index" @click="jumpToFunction(item)">
				<view :class="item.icon" style="font-size: 56rpx;">

				</view>
				<text>{{item.name}}</text>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		clearSyncStorage,
		getMenuStorage,
		getUserStorage,
		isLogin,
		setMenuStorage,
		setPowerStorage,
		setUserStorage
	} from '@/common/login.js'
	import info from '@/components/info.vue'
	import {
		getMenuApi
	} from '../../api/menu';
	import {
		getRolePowerList
	} from '../../api/power';
	import {
		getUserInfoApi
	} from '../../api/user';
	import {
		defaultIcon
	} from '../../common/common';
	import {
		userKey
	} from '../../common/enum';
	import {
		getCommonMenus
	} from '../../common/power';
	import {
		errorToast,
		successToast
	} from '../../common/toastHelper';
	export default {
		data() {
			return {
				user: {},
				iconList: []
			}
		},
		onReady() {
			if (!!isLogin()) {
				//this.getUserInfo();

				const userLocalResult = getUserStorage();
				console.log("userLocalResult", userLocalResult);
				if (!userLocalResult) {
					//清空, 怕清空不全
					clearSyncStorage();

					//需要同步
					this.getUserInfo().then(() => {
						this.getPowerInfo(this.user.roleId);
					})
					this.getMenuInfo();
				} else {
					this.user = userLocalResult
					const menus = getCommonMenus();
					this.iconList = menus;
				}
			}
		},
		methods: {
			getPowerInfo(id) {
				return getRolePowerList(id).then(res => {
					if (res.status === 200) {
						setPowerStorage(res.data);
					} else {
						errorToast(res.message || `获取权限失败`);
					}
				}).catch(res => {
					errorToast(res.message || `获取权限失败`);
				})
			},
			getMenuInfo() {
				return getMenuApi().then(res => {
					if (res.status === 200) {
						setMenuStorage(res.data);
					} else {
						errorToast(res.message || `获取菜单失败`);
					}
				}).catch(res => {
					errorToast(res.message || `获取菜单失败`);
				})
			},
			getUserInfo() {

				return getUserInfoApi().then(res => {
					if (res.status == 200) {
						setUserStorage(JSON.parse(JSON.stringify(res.data)));
						this.user = res.data;
						this.user.img = this.user.img ? this.user.img : defaultIcon;
					} else {
						errorToast(res.message || "获取用户信息失败，请稍后再试")
					}
				}).catch(res => {
					errorToast(res.message || "获取用户信息失败，请稍后再试")
				})
			},
			jumpToAllFunction() {
				uni.navigateTo({
					url: "/pages/index/functions"
				})
			},
			jumpToFunction(record) {
				uni.navigateTo({
					url: record.url
				})
			}
		}
	}
</script>

<style>

</style>
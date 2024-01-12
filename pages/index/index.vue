<template>
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
		<!-- 基本数据 -->
		<!-- <view class="cu-list grid col-4 no-border padding-lr-xs radius-lg-bottom">
	    <view class="cu-item">
	      <view class="text-black text-bold text-xxl">
	        6
	      </view>
	      <text>优惠券</text>
	    </view>
	    <view class="cu-item">
	      <view class="text-black text-bold text-xxl">
	        0
	      </view>
	      <text>权益卡</text>
	    </view>
	    <view class="cu-item">
	      <view class="text-black text-bold text-xxl">
	        4
	      </view>
	      <text>保修卡</text>
	    </view>
	    <view class="cu-item">
	      <view class="text-black text-bold text-xxl">
	        11
	      </view>
	      <text>收据</text>
	    </view>
	  </view> -->
		<!-- 助力/推荐/邀请 -->
		<!-- 	  <view class="margin-top-sm padding-lr-xs">
	    <view class="bg-brown light radius-lg shadow-blur">
	      <view class="flex padding-tb-sm padding-lr-sm justify-between">
	        <view class="padding-xs">
	          <view>9.9元开通超级会员最高可省￥40</view>
	        </view>
	        <view class="">
	          <view class="cu-btn round bg-black">开通会员</view>
	        </view>
	      </view>
	    </view>
	  </view> -->
		<!-- 常用功能 -->
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
			<view class="cu-item" v-for="(item,index) in iconList" :key="index" :bindtap="item.bindtap">
				<view :class="['cuIcon-'+item.icon,'text-'+item.color,'text-shadow']" style="font-size: 56rpx;">
					<view class="cu-tag badge" v-if="item.badge!=0">
						<block v-if="item.badge!=1">{{item.badge>99?"99+":item.badge}}</block>
					</view>
				</view>
				<text>{{item.name}}</text>
			</view>
		</view>

		<!-- 	  <view class="margin-top-sm padding-lr-xs">
	    <view class="bg-white light radius-lg shadow-blur">
	      <view class="flex padding-tb-sm padding-lr-sm justify-between">
	        <view class="padding-xs">
	          <view class="text-xl text-black">惊喜连连·洁净一秋</view>
	          <view class="padding-top-xs">家居清洗限时<text class="text-red text-bold"> 6.6折 </text><text class="cuIcon-roundrightfill text-red"></text></view>
	        </view>
	        <view class="">
	          <view class="cu-btn round bg-gradual-pinknew margin-top-sm">6折优惠</view>
	        </view>
	      </view>
	    </view>
	  </view> -->
		<!-- 其他功能 -->
		<!-- <view class="cu-bar margin-lr-xs margin-top grid col-4 no-border bg-white radius-lg-top">
	    <view class="action">
	      <text class="text-xl">其他功能</text>
	    </view>
	  </view>
	  <view class="cu-list grid col-4 no-border text-black margin-lr-sm padding-bottom radius-lg-bottom">
	    <view class="cu-item" v-for="(item,index) in iconOtherList" :key="index" :bindtap="item.bindtap">
	      <view :class="['cuIcon-'+item.icon,'text-'+item.color,'text-shadow']" style="font-size: 56rpx;">
	        <view class="cu-tag badge" v-if="item.badge!=0">
	          <block v-if="item.badge!=1">{{item.badge>99?"99+":item.badge}}</block>
	        </view>
	      </view>
	      <text>{{item.name}}</text>
	    </view>
	  </view> -->

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
				this.getUserInfo();

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
						this.user.img = this.user.img ? this.user.img :
							'https://image.meiye.art/Fha6tqRTIwHtlLW3xuZBJj8ZXSX3?imageMogr2/thumbnail/450x/interlace/1';
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
			}
		}
	}
</script>

<style>

</style>
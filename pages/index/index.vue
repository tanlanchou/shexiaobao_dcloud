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
					<view class="cu-tag round line-green sm">角色 {{ user.roleId }}</view>
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
		isLogin
	} from '@/common/login.js'
	import info from '@/components/info.vue'
	import {
		getUserInfoApi
	} from '../../api/user';
	import {
		errorToast,
		successToast
	} from '../../common/toastHelper';
	export default {
		data() {
			return {
				user: {},
				iconList: [{
						icon: 'moneybagfill',
						color: 'blue',
						badge: 0,
						name: '产品入库'
					}, {
						icon: 'presentfill',
						color: 'red',
						badge: 0,
						name: '订单开单',
						bindtap: "bindZan"
					}, {
						icon: 'formfill',
						color: 'purple',
						badge: 0,
						name: '所有产品',
						bindtap: "showResource"
					}, {
						icon: 'shopfill',
						color: 'green',
						badge: 0,
						name: '用户管理',
						bindtap: "bindPoint"
					}, {
						icon: 'shopfill',
						color: 'green',
						badge: 0,
						name: '附件管理',
						bindtap: "bindPoint"
					}, {
						icon: 'shopfill',
						color: 'green',
						badge: 0,
						name: '品类管理',
						bindtap: "bindPoint"
					},
					{
						icon: 'shopfill',
						color: 'green',
						badge: 0,
						name: '角色管理',
						bindtap: "bindPoint"
					}
				],
				iconOtherList: [{
					icon: 'location',
					color: 'blue',
					badge: 0,
					name: '地址管理'
				}, {
					icon: 'service',
					color: 'blue',
					badge: 0,
					name: '电话客服',
					bindtap: "bindZan"
				}, {
					icon: 'mark',
					color: 'blue',
					badge: 0,
					name: '在线客服',
					bindtap: "showResource"
				}, {
					icon: 'mail',
					color: 'blue',
					badge: 0,
					name: '投诉',
					bindtap: "bindCollect"
				}, {
					icon: 'settings',
					color: 'blue',
					badge: 0,
					name: '设置',
					bindtap: "bindZan"
				}]
			}
		},
		onReady() {
			isLogin();
			getUserInfoApi().then(res => {
				if (res.status == 200) {
					this.user = res.data;
					this.user.img = this.user.img ? this.user.img :
						'https://image.meiye.art/Fha6tqRTIwHtlLW3xuZBJj8ZXSX3?imageMogr2/thumbnail/450x/interlace/1';
				} else {
					errorToast(res.message || "登录失败，请稍后再试")
				}
			}).catch(res => {
				errorToast(res.message || "登录失败，请稍后再试")
			})
		},
		methods: {
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
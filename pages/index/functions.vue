<template>
	<list-header title="全部功能"></list-header>
	<view class="cu-list grid col-4 no-border text-black padding-bottom">
		<view class="cu-item" v-for="(item,index) in iconList" :key="index" :bindtap="item.bindtap">
			<a class="no-line" href="javascript:;" @click="goto(item.url)">
				<view :class="['cuIcon-'+item.icon,'text-'+item.color,'text-shadow']" style="font-size: 56rpx;">
					<view class="cu-tag badge" v-if="item.badge!=0">
						<block v-if="item.badge!=1">{{item.badge>99?"99+":item.badge}}</block>
					</view>
				</view>
				<text>{{item.name}}</text>
			</a>
		</view>
	</view>
</template>

<script>
	import {
		isLogin
	} from '@/common/login.js'
	import listHeader from '@/components/listHeader.vue'

	export default {
		components: {
			listHeader
		},
		data() {
			return {
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
						url: `/pages/index/user/list`,
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
						url: "/pages/index/role/roleList",
						bindtap: "bindPoint"
					}
				],
			}
		},
		onReady() {
			isLogin()
		},
		methods: {
			goto(url) {
				if (url) {
					uni.redirectTo({
						url: url
					})
				}
			}
		}
	}
</script>

<style>

</style>
<template>
	<view class="status_bar"></view>
	<list-header title="角色列表">
		<button class="cu-btn bg-purple" @click="jumpToRoleAdd">
			<text class="cuIcon-add"></text> 添加
		</button>
	</list-header>
	<uni-card>
		<view class="cu-list grid col-3">
			<view class="cu-item" v-for="(item,index) in list" :key="index" @click="jumpToRoleEdit(item)">
				<view class="cuIcon-cardboardfill text-grey"></view>
				<text>{{item.name}}</text>
			</view>
		</view>
	</uni-card>
</template>

<script>
	import listHeader from '@/components/listHeader.vue'
	import {
		getAllRoleApi
	} from '@/api/role.js'
	import {
		errorToast
	} from '../../../common/toastHelper'
	export default {
		components: {
			listHeader
		},
		data() {
			return {
				list: []
			}
		},
		methods: {
			jumpToRoleAdd() {
				uni.navigateTo({
					url: "/pages/index/role/roleAdd"
				})
			},
			jumpToRoleEdit(item) {
				uni.navigateTo({
					url: "/pages/index/role/roleAdd?id=" + item.id
				})
			},
			init() {
				getAllRoleApi().then(res => {
					if (res.status == 200) {
						this.list = res.data
					} else {
						errorToast(res.message || "获取角色列表失败")
					}
				}).catch(res => {
					errorToast(res.message || "获取角色列表失败")
				})
			}
		},
		onShow() {
			this.init()
		},
	}
</script>

<style>
</style>
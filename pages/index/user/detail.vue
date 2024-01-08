<template>
	<list-header title="用户详情">
		<button class="cu-btn bg-red" @click="delete">
			<text class="cuIcon-delete"></text> 禁用
		</button>
	</list-header>
	<uni-card>
		<form>
			<view class="cu-form-group">
				<view class="uni-padding-wrap mb-30">
					<uni-section title="昵称" type="line">
						<uni-easyinput class="input-border-bottom " type="text" :inputBorder="false"
							v-model="formData.nickname" placeholder="昵称" prefix-icon="contact"></uni-easyinput>
					</uni-section>
					<uni-section title="手机号" type="line">
						<uni-easyinput class="input-border-bottom " type="text" :inputBorder="false"
							v-model="formData.phoneNumber" placeholder="手机号" prefix-icon="phone"></uni-easyinput>
					</uni-section>
					<uni-section title="角色选择" type="line">
						<uni-data-select v-model="value" :localdata="range" @change="change"
							label="角色选择"></uni-data-select>
					</uni-section>
					<uni-section title="创建时间" type="line">
						<text>2024年1月8日17:02:15</text>
					</uni-section>
					<uni-section title="最后登录时间" type="line">
						<text>2024年1月8日17:02:15</text>
					</uni-section>
					<uni-section title="当前状态" type="line">
						<text>未验证</text>
					</uni-section>
				</view>
			</view>
		</form>
	</uni-card>
</template>

<script>
	import listHeader from '@/components/listHeader.vue'
	import youScroll from '@/components/you-scroll.vue'
	import {
		getUserInfoByIdApi
	} from '@/api/user'

	export default {
		components: {
			listHeader,
			youScroll
		},
		data() {
			return {
				formData: {},
				id: -1,
			}
		},
		onLoad(option) {
			if (option && option.id) {
				this.id = option.id;
				this.init();
			}
		},
		methods: {
			init() {
				getUserInfoByIdApi(this.id).then(res => {
					if (res.status == 200) {
						this.formData = res.data
					}
				}).catch(res => {
					errorToast(res.message || "获取用户列表失败")
				})
			},
			onPullDown() {
				this.init()
			}
		}
	}
</script>

<style>
</style>
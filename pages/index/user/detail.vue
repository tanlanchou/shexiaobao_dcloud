<template>

	<list-header title="用户详情">
		<button class="cu-btn bg-purple" @click="update">
			<text class="cuIcon-add"></text> 提交
		</button>
	</list-header>
	<uni-card>
		<view class="form_list">
			<view class="cu-form-group">
				<view class="title">昵称 *</view>
				<input type="text" v-model="formData.nickname" placeholder="请输入" />
			</view>
			<view class="cu-form-group">
				<view class="title">手机号 *</view>
				<input type="number" disabled="true" v-model="formData.phoneNumber" placeholder="请输入" />
			</view>
			<select-index-single-sync title="角色" :v="formData.role" :req="true" name="getAllRoleApi"
				v-model="formData.roleId"></select-index-single-sync>
			<view class="cu-form-group">
				<view class="title">创建时间 *</view>
				<input type="text" disabled="true" v-model="formData.creationTime" placeholder="请输入" />
			</view>
			<view class="cu-form-group">
				<view class="title">最后登录 *</view>
				<input type="text" disabled="true" v-model="formData.lastLoginTime" placeholder="请输入" />
			</view>
			<view class="cu-form-group">
				<view class="title">状态</view>
				<picker-single v-model="formData.status" mode="plus" name="userStatusToWords"></picker-single>
			</view>
		</view>
	</uni-card>

</template>

<script>
	import listHeader from '@/components/listHeader.vue'
	import youScroll from '@/components/you-scroll.vue'
	import selectIndexSingleSync from "@/components/selectIndexSingleSync.vue";
	import pickerSingle from "@/components/pickerSingle.vue";
	import {
		getUserInfoByIdApi,
		updateUserInfoByIdApi
	} from '@/api/user'
	import {
		errorToast,
		loadingToast,
		successToast
	} from '@/common/toastHelper';
	import {
		onMounted,
		ref
	} from 'vue'

	import moment from 'moment'
	import {
		userStatus,
		userStatusForIndexSelect,
		userStatusToWords
	} from '@/common/enum'
	import {
		isLogin
	} from '@/common/login'

	export default {
		components: {
			listHeader,
			youScroll,
			selectIndexSingleSync,
			pickerSingle
		},
		data() {
			return {
				formData: {},
				id: -1
			}
		},
		onLoad(option) {
			if (isLogin()) {
				if (option && option.id) {
					this.userStatusList = userStatusForIndexSelect;
					this.id = option.id;
					this.init();
				}
			}
		},
		onReady(option) {},
		methods: {
			update() {

				if (this.id == -1) {
					errorToast(`数据出错, 请退出后重试`);
					return
				}

				if (!this.formData.nickname || this.formData.nickname.length < 2 || this.formData.nickname.length > 10) {
					errorToast(`昵称长度必须超过2位且不超过10位`)
					return
				}

				if (!this.formData.status) {
					errorToast(`请选择用户状态`)
					return
				}

				if (!this.formData.roleId) {
					errorToast(`请选择用户角色`)
					return
				}



				updateUserInfoByIdApi(this.id, {
					nickname: this.formData.nickname,
					roleId: this.formData.roleId,
					status: this.formData.status
				}).then(res => {
					if (res.status == 200) {
						successToast(`提交用户数据成功`);
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 1000);
					} else {
						errorToast(res.message || "提交用户数据失败1")
					}
				}).catch(res => {
					errorToast(res.message || "提交用户数据失败2")
				})
			},
			init() {
				getUserInfoByIdApi(this.id).then(res => {
					if (res.status == 200) {
						this.formData = res.data;
						this.formData.creationTime = moment(this.formData.creationTime).format(
							'YYYY年MM月DD日 HH:mm:ss')
						this.formData.lastLoginTime = moment(this.formData.lastLoginTime).format(
							'YYYY年MM月DD日 HH:mm:ss')
					} else {
						errorToast(res.message || "获取用户列表失败")
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
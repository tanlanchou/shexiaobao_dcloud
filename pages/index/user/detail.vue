<template>

	<list-header title="用户详情">
		<button class="cu-btn bg-red round" @click="disableUser">
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
						<!-- {{JSON.stringify(this.formData.role)}} -->
						<text>{{this.formData.role && this.formData.role.name}}</text> &nbsp; <button
							class="cu-btn bg-green round" @click="this.$refs.roleListRef.open()">
							<text class="cuIcon-selection"></text> 选择角色
						</button>
					</uni-section>
					<uni-section title="创建时间" type="line">
						<text>{{ this.formData.creationTime }}</text>
					</uni-section>
					<uni-section title="最后登录时间" type="line">
						<text>{{ this.formData.lastLoginTime }}</text>
					</uni-section>
					<uni-section title="当前状态" type="line">
						{{this.formData.status}}
						<text>{{ userstatsToWords(this.formData.status) }}</text>
					</uni-section>
				</view>
			</view>
		</form>
	</uni-card>
	<!-- 	<uni-drawer ref="test" class="t-drawer" mode="right" :mask-click="false">
		<list-header title="用户详情" :back="false">
			<button class="cu-btn bg-red" @click="this.$refs.test.close()">
				<text class="cuIcon-close"></text> 关闭
			</button>
		</list-header>
		<uni-indexed-list :options="roleList" :show-select="true" @click="bindClick" style="margin-top: 55px;" />
	</uni-drawer> -->
	<index-select ref="roleListRef" title="角色选择" v-if="roleDataLoadFlag" :list="roleList" :isSingle="true"
		:isShowSelect="true" @indexSelect="bindClick"></index-select>

	<index-select ref="statusListRef" title="用户状态选择" :list="userStatusList" :isSingle="true" :isShowSelect="true"
		@indexSelect="statusClick"></index-select>
</template>

<script>
	import listHeader from '@/components/listHeader.vue'
	import youScroll from '@/components/you-scroll.vue'
	import indexSelect from '@/components/indexSelect.vue'
	import {
		getUserInfoByIdApi
	} from '@/api/user'
	import {
		getAllRoleApi
	} from '@/api/role.js'
	import {
		getFirstLetter,
		filterArrayByIndex
	} from '@/common/indexSelect.js'
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
		userStatusForIndexSelect
	} from '../../../common/enum'



	export default {
		components: {
			listHeader,
			youScroll,
			indexSelect
		},
		data() {
			return {
				formData: {},
				roleList: [],
				originRoleList: [],
				id: -1,
				showRight: null,
				userStatusList: [],
				roleDataLoadFlag: false,
				statusDataLoadFlag: false,
			}
		},
		onLoad(option) {
			if (option && option.id) {
				this.userStatusList = userStatusForIndexSelect;
				this.id = option.id;
				this.init();
			}
		},
		onReady(option) {
			
			let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			console.log(JSON.stringify(routes))
			let curRoute = routes[routes.length - 1].route //获取当前页面路由
			console.log(curRoute)
			let curParam = routes[routes.length - 1].options; //获取路由参数
			console.log("curParam", curParam);
		},
		methods: {
			userstatsToWords(status) {
				console.log("status", status)
				const keys = Object.keys(userStatus);
				for (let i = 0; i < keys.length; i++) {
					if (keys[i] == status) return keys[i];
				}
				return "未知";
			},
			bindClick(source) {
				const result = this.originRoleList.find(item => {
					return item.name == source.name;
				});

				if (!result) {
					errorToast(`未知错误,请退出后重试`);
					return;
				}

				this.formData.role = result;
				this.formData.roleId = result.id;
			},
			statusClick(source) {
				const result = this.originRoleList.find(item => {
					return item.name == source.name;
				});
			},
			disableUser() {

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

				getAllRoleApi().then(res => {
					if (res.status == 200) {
						this.originRoleList = res.data;
						const arr = this.originRoleList.map(item => item.name);
						this.roleList = filterArrayByIndex(arr);
						this.roleDataLoadFlag = true
					} else {
						errorToast(res.message || "获取用户列表失败")
					}
				}).catch(res => {
					console.error(res);
					errorToast(res.message || "获取角色列表失败")
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
<template>
	<view class="DrawerPage" :class="modalName=='viewModal'?'show':''">
		<list-header title="用户列表">
			<button class="cu-btn bg-green" @tap="showModal" data-target="viewModal">
				<text class="cuIcon-filter"></text> 筛选
			</button>
		</list-header>
		<you-scroll ref="scroll" @onPullDown="onPullDown" @onLoadMore="onLoadMore">
			<view class="cu-list menu sm-border card-menu mt-10">
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
		<uni-card>
			<uni-section title="昵称" type="line">
				<uni-easyinput class="input-border-bottom " type="text" :inputBorder="false"
					v-model="searchData.nickname" placeholder="昵称" prefix-icon="contact"></uni-easyinput>
			</uni-section>
			<uni-section title="手机号" type="line">
				<uni-easyinput class="input-border-bottom" type="text" :inputBorder="false"
					v-model="searchData.phoneNumber" placeholder="手机号" prefix-icon="phone"></uni-easyinput>
			</uni-section>
			<uni-section title="角色" type="line">
				<text>{{searchData.role && this.searchData.role.name}}</text> &nbsp; <button
					class="cu-btn bg-green round" @click="this.$refs.roleListRef.open()">
					<text class="cuIcon-selection"></text> 选择角色
				</button>
			</uni-section>
			<uni-section title="状态" type="line">
				<text>{{ userstatsToWords(this.searchData.status) }}</text> &nbsp; <button class="cu-btn bg-green round"
					@click="this.$refs.statusListRef.open()">
					<text class="cuIcon-vip"></text> 选择状态
				</button>
			</uni-section>
			<view class="mt-40">
				<button class="cu-btn bg-purple" @click="filter">
					<text class="cuIcon-filter"></text> 筛选
				</button>
				&nbsp;
				<button class="cu-btn bg-red" @click="searchData = {}">
					<text class="cuIcon-refresh"></text> 清空
				</button>
			</view>

		</uni-card>
	</scroll-view>

	<index-select ref="roleListRef" title="角色选择" v-if="roleDataLoadFlag" :list="roleList" :isSingle="true"
		:isShowSelect="true" @indexSelect="bindClick"></index-select>

	<index-select ref="statusListRef" title="用户状态选择" :list="userStatusList" :isSingle="true" :isShowSelect="true"
		@indexSelect="statusClick"></index-select>
</template>

<script>
	import listHeader from '@/components/listHeader.vue'
	import youScroll from '@/components/you-scroll.vue'
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

	import {
		userStatus,
		userStatusForIndexSelect,
		userStatusToWords
	} from '@/common/enum'
	export default {
		components: {
			listHeader,
			youScroll,
			indexSelect
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
			}
		},
		onReady() {
			if (!!isLogin()) {
				this.roleInit();
				this.init();
			}
		},
		methods: {
			filter() {
				this.init(true);
				this.hideModal();
			},
			statusClick(source) {
				this.searchData.status = userStatusToWords.indexOf(source.name) + 1
			},
			userstatsToWords(status) {
				if (status) {
					return userStatusToWords[status - 1]
				}
			},
			roleInit() {
				getAllRoleApi().then(res => {
					if (res.status == 200) {
						this.originRoleList = res.data;
						const arr = this.originRoleList.map(item => item.name);
						this.roleList = filterArrayByIndex(arr);
						this.roleDataLoadFlag = true;
					} else {
						errorToast(res.message || "获取角色列表失败")
					}
				}).catch(res => {
					console.error(res);
					errorToast(res.message || "获取角色列表失败")
				})
			},
			init(isClear) {
				return getAllUserByPageApi(this.pageNumber, this.searchData).then(res => {
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

				const pageCount = Math.ceil(this.total / 20)
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
			bindClick(source) {
				const result = this.originRoleList.find(item => {
					return item.name == source.name;
				});
				if (!result) {
					errorToast(`未知错误,请退出后重试`);
					return;
				}

				this.searchData.role = result;
				this.searchData.roleId = result.id;
			},
		}
	}
</script>

<style scoped>

</style>
<template>
	<list-header title="用户列表"></list-header>
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
</template>

<script>
	import listHeader from '@/components/listHeader.vue'
	import youScroll from '@/components/you-scroll.vue'
	import {
		getAllUserByPageApi
	} from '../../../api/user'
	export default {
		components: {
			listHeader,
			youScroll
		},
		data() {
			return {
				pageNumber: 1,
				total: 0,
				list: [],
			}
		},
		onReady() {
			this.init()
		},
		methods: {
			init(isClear) {
				return getAllUserByPageApi(this.pageNumber).then(res => {
					if (res.status == 200) {
						console.log(`res.data.results`, res)
						this.list = isClear ? res.data.results : this.list.concat(res.data.results);
						console.log(`this.list`, this.list)
						this.total = res.data.total;
						console.log(`res.data.total`, res.data.total)
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
				this.pageNumber += 1;
				this.init();
			},
			jumpToUserDetail(item) {
				uni.navigateTo({
					url: `/pages/index/user/detail?id=${item.id}`
				})
			}
		}
	}
</script>

<style scoped>
	.cu-list.menu>.cu-item .content>uni-image {
		width: 2.6em;
	}
</style>
<template>
	<view class="status_bar"></view>
	<list-header class="header_fixed" title="全部功能"></list-header>
	<scroll-view scroll-y="true" class="card_fixed_50">
		<uni-card title="常用功能" thumbnail="" v-if="iconList['80'] && iconList['80'].length > 0" note="Tips">
			<view class="cu-list grid col-4 no-border text-black padding-bottom">
				<view class="cu-item" v-for="(item, index) in iconList['80']" :key="index" :bindtap="item.bindtap">
					<a class="no-line" href="javascript:;" @click="goto(item.url)">
						<view :class="[item.icon, 'text-' + item.color, 'text-shadow']" style="font-size: 56rpx">
							<view class="cu-tag badge" v-if="item.badge && item.badge != 0">
								<block v-if="item.badge != 1">{{
		          item.badge > 99 ? "99+" : item.badge
		        }}</block>
							</view>
						</view>
						<text>{{ item.name }}</text>
					</a>
				</view>
			</view>
		</uni-card>

		<uni-card title="系统功能" thumbnail="" v-if="iconList['90'] && iconList['90'].length > 0" note="Tips">
			<view class="cu-list grid col-4 no-border text-black padding-bottom">
				<view class="cu-item" v-for="(item, index) in iconList['90']" :key="index" :bindtap="item.bindtap">
					<a class="no-line" href="javascript:;" @click="goto(item.url)">
						<view :class="[item.icon, 'text-' + item.color, 'text-shadow']" style="font-size: 56rpx">
							<view class="cu-tag badge" v-if="item.badge && item.badge != 0">
								<block v-if="item.badge != 1">{{
		          item.badge > 99 ? "99+" : item.badge
		        }}</block>
							</view>
						</view>
						<text>{{ item.name }}</text>
					</a>
				</view>
			</view>
		</uni-card>
	</scroll-view>
</template>

<script>
	import {
		isLogin
	} from "@/common/login.js";
	import listHeader from "@/components/listHeader.vue";
	import {
		menuKey
	} from "../../common/enum";
	import {
		getMenusGroupByType
	} from "../../common/power";

	export default {
		components: {
			listHeader,
		},
		data() {
			return {
				iconList: [],
			};
		},
		onReady() {
			if (!!isLogin()) {
				const result = getMenusGroupByType();
				this.iconList = result;
			}
		},
		methods: {
			goto(url) {
				if (url) {
					uni.navigateTo({
						url: url,
					});
				}
			},
		},
	};
</script>

<style>
</style>
<template>
	<view>
		<view class="status_bar"></view>
		<view class="bg-white input-border-bottom">
			<view class="cu-bar">
				<view class="action">
					<a href="javascript:;" class="no-line" @click="backTo">
						<text v-if="back" class="cuIcon-back text-blue">&nbsp;&nbsp;</text>
						<text v-else class="cuIcon-titles text-blue">&nbsp;&nbsp;</text>
						<text class="text-xl text-bold">{{ title }}</text>
					</a>
				</view>
				<view class="padding-lr-sm">
					<slot name="default"></slot>
				</view>
			</view>
			<view lass="cu-bar bg-white">
				<slot name="search"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: String,
			back: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			backTo() {
				if (this.back) {
					uni.navigateBack({
						delta: 1
					});
				}
			}
		}
	}
</script>

<style>
</style>
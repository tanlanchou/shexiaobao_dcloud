<template>

	<view class="cu-bar bg-white">
		<view class="action">
			<a href="javascript:;" class="no-line" @click="backTo">
				<text class="cuIcon-back text-black">&nbsp;&nbsp;&nbsp;</text>
				<text class="text-xl text-bold">{{ title }}</text>
			</a>
		</view>
		<view class="padding-lr-sm">
			<slot></slot>
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
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style>
</style>
<template>
	<list-header class="header_fixed" :title="title">
		<button v-if="updatePowerEnable || createEnable" class="cu-btn bg-purple mr-10" style="margin-right: 5px;"
			@click="add">
			<text class="cuIcon-add"></text> 提交
		</button>
		<button v-if="deletePowerEnable && _id" class="cu-btn bg-red" @click="deleteItem">
			<text class="cuIcon-delete"></text> 撤销
		</button>
	</list-header>
</template>

<script setup>
	import {
		isLogin
	} from '@/common/login';
	import listHeader from "@/components/listHeader.vue"
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		errorToast,
		successToast
	} from "@/common/toastHelper";
	import {
		checkPowerCommon
	} from "@/common/power";
	import {
		ref
	} from 'vue';

	isLogin();

	let _id;
	const title = ref("");
	onLoad((options) => {
		if (options.id) _id = options.id;

		if (_id) {
			title.value = "订单编辑";
			getOne(_id)
		} else {
			title.value = "订单添加";
			getMySelf();
		}
	});

	//权限
	const {
		createEnable,
		findOnePowerEnable,
		updatePowerEnable,
		deletePowerEnable
	} = checkPowerCommon("CustomerController")

	if (!findOnePowerEnable) {
		errorToast(`您没有权限访问这个模块，正在为您跳转`);
		uni.navigateBack({
			delta: 1
		});
	}
</script>

<style>
</style>
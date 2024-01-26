<template>
	<list title="销售渠道管理" :options="options" />
</template>

<script setup>
	import list from "@/components/tree/list.vue"
	import {
		ref
	} from "vue";
	const options = ref({
		controllerName: "SalesChannelsController",
		name: "sales/channels",
		baseUrl: "/pages/order/channels",
		power: {}
	})
</script>

<style>
</style>
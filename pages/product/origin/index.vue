<template>
	<list title="商品来源管理" :options="options" />
</template>

<script setup>
	import list from "@/components/single/list.vue"
	import {
		ref
	} from "vue";
	const options = ref({
		controllerName: "ProductOriginController",
		name: "product/origin",
		baseUrl: "/pages/product/origin",
		power: {}
	})
</script>

<style>
</style>
<template>
	<list title="仓库管理" :options="options" />
</template>

<script setup>
	import list from "@/components/single/list.vue"
	import {
		ref
	} from "vue";
	const options = ref({
		controllerName: "ProductStorehouseController",
		name: "product/storehouse",
		baseUrl: "/pages/product/storehouse",
		power: {}
	})
</script>

<style>
</style>
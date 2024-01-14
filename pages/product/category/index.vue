<template>
	<list title="品类管理" :options="options" />
</template>

<script setup>
	import list from "@/components/tree/list.vue"
	import {
		ref
	} from "vue";
	const options = ref({
		controllerName: "ProductCategoryController",
		name: "product/category",
		baseUrl: "/pages/product/category",
		power: {},
	})
</script>

<style>
</style>
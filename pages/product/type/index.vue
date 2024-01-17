<template>
	<list title="品牌管理" :options="options" />
</template>

<script setup>
	import list from "@/components/single/list.vue"
	import {
		ref
	} from "vue";
	const options = ref({
		controllerName: "ProductTypeController",
		name: "product/type",
		baseUrl: "/pages/product/type",
		power: {}
	})
</script>

<style>
</style>
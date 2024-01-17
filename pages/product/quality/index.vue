<template>
	<list title="品质管理" :options="options" />
</template>

<script setup>
	import list from "@/components/single/list.vue"
	import {
		ref
	} from "vue";
	const options = ref({
		controllerName: "ProductQualityController",
		name: "product/quality",
		baseUrl: "/pages/product/quality",
		power: {}
	})
</script>

<style>
</style>
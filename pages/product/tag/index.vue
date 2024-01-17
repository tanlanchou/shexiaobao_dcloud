<template>
	<list title="标签管理" :options="options" />
</template>

<script setup>
	import list from "@/components/single/list.vue"
	import {
		ref
	} from "vue";
	const options = ref({
		controllerName: "ProductTagController",
		name: "product/tag",
		baseUrl: "/pages/product/tag",
		power: {}
	})
</script>

<style>
</style>
<template>
	<list title="材质管理" :options="options" />
</template>

<script setup>
	import list from "@/components/single/list.vue"
	import {
		ref
	} from "vue";
	const options = ref({
		controllerName: "ProductMaterialController",
		name: "product/material",
		baseUrl: "/pages/product/material",
		power: {}
	})
</script>

<style>
</style>
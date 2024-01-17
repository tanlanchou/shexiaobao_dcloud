<template>
	<list title="客户标签管理" :options="options" />
</template>

<script setup>
	import list from "@/components/single/list.vue"
	import {
		ref
	} from "vue";
	const options = ref({
		controllerName: "CustomerTagController",
		name: "customer/tag/tag",
		baseUrl: "/pages/customer/tag",
		power: {}
	})
</script>

<style>
</style>
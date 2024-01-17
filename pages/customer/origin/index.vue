<template>
	<list title="客户来源管理" :options="options" />
</template>

<script setup>
	import list from "@/components/single/list.vue"
	import {
		ref
	} from "vue";
	const options = ref({
		controllerName: "OriginController",
		name: "origin",
		baseUrl: "/pages/customer/origin",
		power: {}
	})
</script>

<style>
</style>
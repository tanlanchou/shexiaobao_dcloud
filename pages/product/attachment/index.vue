<template>
	<list title="附件管理" :options="options" />
</template>

<script setup>
	import list from "@/components/single/list.vue"
	import {
		ref
	} from "vue";
	const options = ref({
		controllerName: "ProductAttachmentController",
		name: "product/attachment",
		baseUrl: "/pages/product/attachment",
		power: {}
	})
</script>

<style>
</style>
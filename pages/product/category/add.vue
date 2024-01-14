<template>
	<add-single :title="title" :id="id" :options="options"></add-single>
</template>

<script>
	import addSingle from '@/components/tree/add.vue'
	export default {
		components: {
			addSingle
		},
		data() {
			return {
				options: {
					controllerName: "ProductCategoryController",
					name: "product/category",
					baseUrl: "/pages/product/category",
					power: {}
				},
				title: "品类管理",
				id: 0
			}
		},
		onLoad(options) {
			if(options.id) {
				this.id = options.id
			}
		}
	}
</script>

<style>
</style>
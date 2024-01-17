<template>
	<add-single :title="title" :id="id" :options="options"></add-single>
</template>

<script>
	import addSingle from '@/components/single/add.vue'
	export default {
		components: {
			addSingle
		},
		data() {
			return {
				options: {
					controllerName: "ProductTypeController",
					name: "product/type",
					baseUrl: "/pages/product/type",
					power: {}
				},
				title: "品牌管理",
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
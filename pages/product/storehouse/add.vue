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
					controllerName: "ProductStorehouseController",
					name: "product/storehouse",
					baseUrl: "/pages/product/storehouse",
					power: {}
				},
				title: "仓库管理",
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
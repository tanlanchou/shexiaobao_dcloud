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
					controllerName: "CustomerTagController",
					name: "customer/tag/tag",
					baseUrl: "/pages/customer/tag",
					power: {}
				},
				title: "客户标签管理",
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
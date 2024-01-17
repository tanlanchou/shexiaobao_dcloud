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
					controllerName: "OriginController",
					name: "origin",
					baseUrl: "/pages/customer/origin",
					power: {}
				},
				title: "客户来源管理",
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
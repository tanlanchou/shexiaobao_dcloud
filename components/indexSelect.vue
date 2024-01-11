<template>
	<uni-drawer ref="test" class="t-drawer" mode="right" :mask-click="false">
		<list-header :title="title" :back="false">
			<button v-if="!isSingle" class="cu-btn bg-red" @click="bindClick">
				<text class="cuIcon-close"></text> 确定
			</button>
			<button class="cu-btn bg-red" @click="closeMySelf">
				<text class="cuIcon-close"></text> 关闭
			</button>
		</list-header>
		<view class="flex flex-wrap input-border-bottom" style="padding: 5px 12px">
			<uni-easyinput v-model="searchData" class="margin-right-sm" placeholder="搜索" />
			<button class="cu-btn bg-green" @click="search">
				<text class="cuIcon-search"></text> 搜索
			</button>
		</view>
		<uni-indexed-list :options="myList" :show-select="isShowSelect" @click="bindClick" style="margin-top: 103px;" />
	</uni-drawer>
</template>

<script setup>
	import listHeader from '@/components/listHeader.vue'
	import {
		ref
	} from 'vue';
	import {
		errorToast
	} from '../common/toastHelper';
	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
		list: {
			type: Array,
			required: true
		},
		isSingle: {
			type: Boolean,
			required: false,
			default: true
		},
		isShowSelect: {
			type: Boolean,
			required: false,
			default: true
		}
	});

	const test = ref(null);
	const closeMySelf = function() {
		test.value.close();
	}

	const open = function() {
		test.value.open();
	}

	defineExpose({
		open
	})

	const myList = ref([]);
	myList.value = JSON.parse(JSON.stringify(props.list));

	const emits = defineEmits(['indexSelect'])
	const bindClick = function(e) {
		if (props.isSingle) {
			emits('indexSelect', e.item);
			closeMySelf();
		} else {
			if (e.select.length > 0) {
				emits('indexSelect', e.select);
				closeMySelf();
			} else {
				errorToast("请至少选择一项")
			}
		}
	}

	const searchData = ref('');
	const search = function() {
		myList.value = JSON.parse(JSON.stringify(props.list));
		myList.value.forEach(item => {
			item.data = item.data.filter(name => name.indexOf(searchData.value) > -1)
		})
	}
</script>

<style>
</style>
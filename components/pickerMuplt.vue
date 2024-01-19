<template>
	<view class="cu-form-group">
		<view class="title">{{title}} {{req ? "*" : ""}}</view>
		<picker ref="categoryListRef" v-if="categoryDataLoadFlag" mode="multiSelector" @change="categoryChange"
			@columnchange="categoryColumnChange" :range="categoryList">
			<view class="picker">
				{{formCategory.name || "请选择"}}
			</view>
		</picker>
	</view>
</template>

<script setup>
	import {
		ref,
		defineProps,
		defineEmits
	} from 'vue';
	import {
		getProductCategoryAllApi
	} from '../api/product.info';

	const props = defineProps({
		name: {
			type: String,
			required: true
		},
		modelValue: {
			type: Number,
			default: -1
		},
		title: {
			type: String,
			required: true
		},
		req: {
			type: Boolean,
			default: false
		}
	});

	//集合
	const a = {
		getProductCategoryAllApi
	}

	const emit = defineEmits(['update:modelValue']);

	const categoryListRef = ref(null);
	const categoryDataLoadFlag = ref(false);
	const categoryList = ref([]);
	const categoryOriginList = ref([]);
	const formCategory = ref({});
	let firstArr = [];

	const getCategoryList = function() {
		return a[props.name]().then(res => {
			if (res.status == 200) {
				categoryOriginList.value = JSON.parse(JSON.stringify(res.data));
				firstArr = categoryOriginList.value.filter(item => item.parentId == 0);
				const secondArr = categoryOriginList.value.filter(item => item.parentId == firstArr[0].id);
				categoryList.value = [firstArr.map(item => item.name), secondArr.map(item => item.name)];
				setTimeout(() => {
					categoryDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取${props.title}错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取${props.title}错误`)
		});
	}

	const categoryColumnChange = function(e) {
		if (e.detail.column == 0) {
			const r = firstArr[e.detail.value];
			const secondArr = categoryOriginList.value.filter(item => item.parentId == r.id);
			categoryList.value[1] = secondArr.map(item => item.name);
		}
	}

	const categoryChange = function(e) {
		const indexOne = e.detail.value[0];
		const indexTwo = e.detail.value[1];
		const r = firstArr[indexOne];
		const secondArr = categoryOriginList.value.filter(item => item.parentId == r.id);
		if (secondArr.length == 0) {
			formCategory.value = r;
		} else {
			formCategory.value = secondArr[indexTwo];
		}
		emit('update:modelValue', formCategory.value.id);
	}
	getCategoryList();

	// const categoryColumnChange = function(e) {
	// 	if (e.detail.column == 0) {
	// 		const r = firstArr[e.detail.value];
	// 		const secondArr = categoryOriginList.value.filter(item => item.parentId == r.id);
	// 		categoryList.value[1] = secondArr.map(item => item.name);
	// 	}
	// }

	// const productForPeopleMap = ref(a[props.name]);
	// const forPeopleIndex = ref(props.modelValue);

	// const forPeoplePickerChange = function(e) {
	// 	forPeopleIndex.value = e.detail.value;
	// 	emit('update:modelValue', forPeopleIndex.value);
	// }
</script>

<style>
</style>
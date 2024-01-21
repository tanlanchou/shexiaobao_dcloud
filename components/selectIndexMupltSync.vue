<template>
	<view class="cu-form-group" @click="openTypeIndex">
		<view class="title">{{title}} {{req ? "*" : ""}}</view>
		<view>
			<text>{{formType && formType.join(',') || "请选择"}}</text>
			<text class="cuIcon-right"></text>
		</view>
	</view>

	<index-select ref="typeListRef" :title="title + '选择'" v-if="typeDataLoadFlag" :list="typeList" :isSingle="false"
		:isShowSelect="true" @indexSelect="typeBindClick"></index-select>
</template>

<script setup>
	import {
		getProductTypeAllApi,
		getProductQualityAllApi,
		getProductStorehouseAllApi,
		getProductMaterialAllApi,
		getProductTagAllApi,
		getProductAttachAllApi
	} from "@/api/product.info";
	import indexSelect from '@/components/indexSelect.vue'
	import {
		filterArrayByIndex
	} from '@/common/indexSelect';
	import {
		errorToast
	} from "@/common/toastHelper";
	import {
		ref,
		defineProps,
		defineEmits,
		nextTick
	} from 'vue';

	//集合
	const a = {
		getProductTypeAllApi,
		getProductQualityAllApi,
		getProductStorehouseAllApi,
		getProductMaterialAllApi,
		getProductTagAllApi,
		getProductAttachAllApi
	}

	const props = defineProps({
		title: {
			type: String,
			required: true
		},
		req: {
			type: Boolean,
			default: false
		},
		name: {
			type: String,
			required: true
		},
		modelValue: {
			type: Number,
			default: -1
		},
		ljz: {
			type: Boolean,
			default: true
		},
		otherName: {
			type: String
		}
	});

	const emit = defineEmits(['update:modelValue']);

	//品牌
	const typeListRef = ref(null);
	const typeDataLoadFlag = ref(false);
	const typeList = ref([]);
	const typeOriginList = ref([]);
	const formType = ref([]);

	//getProductTypeAllApi
	const getTypeList = function() {
		return a[props.name]().then(res => {
			if (res.status == 200) {
				typeOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result;
				if (props.otherName) {
					result = filterArrayByIndex(res.data.map(item =>
						`${item.name}---${item[props.otherName]}`));
				} else {
					result = filterArrayByIndex(res.data.map(item => item.name));
				}
				typeList.value = result;
			} else {
				errorToast(res.message || `获取品牌错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取品牌错误`)
		});
	}

	const openTypeIndex = function() {
		if (props.ljz && typeList.value.length == 0) {
			getTypeList().then(() => {
				typeDataLoadFlag.value = true;
				nextTick(() => {
					typeListRef.value.open();
				})
			})
		} else {
			typeListRef.value.open();
		}
	}

	const typeBindClick = function(source) {

		let names = [];
		console.log(source)
		source.forEach(item => {
			let str = item.name;
			if (props.otherName) {
				str = str.split('---')[0];
			}
			names.push(str);
		})

		let results = [];
		names.forEach(name => {
			const result = typeOriginList.value.find(item => item.name == name);
			if (result) {
				results.push(result);
			}
		})


		formType.value = results.map(item => item.name);
		emit('update:modelValue', results.map(item => item.name));

	}

	if (!props.ljz) {
		getTypeList()
	}
</script>

<style>
</style>
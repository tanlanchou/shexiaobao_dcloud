<template>
	<view class="cu-form-group" @click="openTypeIndex">
		<view class="title">{{title}} {{req ? "*" : ""}}</view>
		<view>
			<text>{{getName(formType) || getName(props.v) || "请选择"}}</text>
			<text class="cuIcon-right"></text>
		</view>
	</view>

	<index-select ref="typeListRef" :title="title + '选择'" v-if="typeDataLoadFlag" :list="typeList" :isSingle="true"
		:isShowSelect="true" @indexSelect="typeBindClick"></index-select>
</template>

<script setup>
	import {
		getProductTypeAllApi,
		getProductQualityAllApi,
		getProductStorehouseAllApi,
		getProductTagAllApi,
		getProductAttachAllApi
	} from "@/api/product.info";
	import {
		getAllUserApi
	} from "../api/user";


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
		getAllUserApi,
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
		},
		v: {
			type: Object,
			required: false
		}
	});

	const emit = defineEmits(['update:modelValue']);

	//品牌
	const typeListRef = ref(null);
	const typeDataLoadFlag = ref(false);
	const typeList = ref([]);
	const typeOriginList = ref([]);
	const formType = ref({});

	//getProductTypeAllApi
	const getTypeList = function() {
		return a[props.name]().then(res => {
			if (res.status == 200) {
				typeOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result;
				if (props.otherName) {
					result = filterArrayByIndex(res.data.map(item =>
						`${getName(item)}---${item[props.otherName]}`));
				} else {
					result = filterArrayByIndex(res.data.map(item => getName(item)));
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
	
	function getName(data) {
		if(data) {
			return data.name || data.nickname
		}
		return;
	}

	const typeBindClick = function(source) {
		let str = getName(source);
		try {

			let result;
			if (props.otherName) {
				str = str.split('---')[0];
			}

			result = typeOriginList.value.find(item => getName(item) == str);


			if (result) {
				formType.value = result;
				emit('update:modelValue', result.id);
			} else {
				errorToast("数据格式出错, 请刷新后重试");
			}
		} catch (ex) {
			console.error(ex.message);
			errorToast("数据格式出错, 请刷新后重试");
		}
	}

	if (!props.ljz) {
		getTypeList()
	}
	
	function clear() {
		formType.value = {};
	}
	
	defineExpose({
		clear
	})
</script>

<style>
</style>
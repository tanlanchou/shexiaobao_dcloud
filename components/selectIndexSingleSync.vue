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
		getAllRoleApi
	} from "@/api/role";
	import {
		getAllUserApi
	} from "@/api/user";
	import {
		getOriginAllApi
	} from "@/api/origin";
	import {
		getCustomerTagAllApi
	} from "@/api/customerTag";
	import {
		getCustomerAllApi
	} from "../api/customer";




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
	import request from "@/common/request";

	//集合
	const a = {
		getProductTypeAllApi,
		getProductQualityAllApi,
		getProductStorehouseAllApi,
		getAllUserApi,
		getProductTagAllApi,
		getProductAttachAllApi,
		getAllRoleApi,
		getOriginAllApi,
		getCustomerTagAllApi,
		getCustomerAllApi
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
		},
		isObject: {
			type: Boolean,
			default: false
		}
	});

	const emit = defineEmits(['update:modelValue']);

	//品牌
	const typeListRef = ref(null);
	const typeDataLoadFlag = ref(false);
	const typeList = ref([]);
	const typeOriginList = ref([]);
	const formType = ref({});

	const buildFunc = function(name) {

		return request({
			url: name,
			method: `get`,
			isValid: true
		});
	}

	//getProductTypeAllApi
	const getTypeList = function() {
		let func = a[props.name];
		if (func === undefined || func === null) {
			func = () => buildFunc(props.name);
		}
		return func().then(res => {
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
				errorToast(res.message || `获取${props.title}错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取${props.title}错误`)
			console.error(res);
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
		if (data) {
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
				emit('update:modelValue', props.isObject ? result : result.id);
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
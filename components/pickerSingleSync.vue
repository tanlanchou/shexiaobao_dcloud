<template>
	<picker @change="forPeoplePickerChange" :value="forPeopleIndex" :range="productForPeopleMap">
		<view class="picker">
			{{ forPeopleIndex > -1 ? productForPeopleMap[forPeopleIndex] : '请选择' }}
		</view>
	</picker>
</template>

<script setup>
	import {
		ref,
		defineProps,
		defineEmits
	} from 'vue';

	const props = defineProps({
		name: {
			type: String,
			required: true
		},
		modelValue: {
			type: Number,
			default: -1
		}
	});

	const emit = defineEmits(['update:modelValue']);

	const productForPeopleMap = ref(a[props.name]);
	
	const getQualityList = function() {
		return getProductQualityAllApi().then(res => {
			if (res.status == 200) {
				qualityOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result = filterArrayByIndex(res.data.map(item => `${item.name}---${item.desc}`));
				qualityList.value = result;
				setTimeout(() => {
					qualityDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取成色错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取成色错误`)
		});
	}
	const forPeopleIndex = ref(props.modelValue);

	const forPeoplePickerChange = function(e) {
		forPeopleIndex.value = e.detail.value;
		emit('update:modelValue', forPeopleIndex.value);
	}
</script>

<style>
</style>
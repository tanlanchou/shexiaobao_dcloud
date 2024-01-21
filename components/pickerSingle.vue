<template>
	<picker @change="forPeoplePickerChange" :value="forPeopleIndex" :range="productForPeopleMap">
		<view class="picker">
			{{ forPeopleIndex > -1 ? productForPeopleMap[forPeopleIndex] : modelValue > -1 ? productForPeopleMap[modelValue] : '请选择' }}
		</view>
	</picker>
</template>

<script setup>
	import {
		ref,
		defineProps,
		defineEmits
	} from 'vue';
	import * as a from "@/common/enum.js";

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
	const forPeopleIndex = ref(-1);

	const forPeoplePickerChange = function(e) {
		forPeopleIndex.value = e.detail.value;
		emit('update:modelValue', forPeopleIndex.value);
	}

	function clear() {
		forPeopleIndex.value = {};
	}

	defineExpose({
		clear
	})
</script>

<style>
</style>
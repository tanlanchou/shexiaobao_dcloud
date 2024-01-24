<template>
	<picker @change="forPeoplePickerChange" :value="forPeopleIndex" :range="productForPeopleMap">
		<view class="picker">
			{{ forPeopleIndex > -1 ? productForPeopleMap[forPeopleIndex] : 
			(modelValue != undefined && modelValue > -1) ? productForPeopleMap[mode == "normal"? modelValue : modelValue - 1] : 
			'请选择' }}
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
		},
		mode: {
			type: String,
			default: "normal"
		}
	});

	const emit = defineEmits(['update:modelValue']);
	const productForPeopleMap = ref(a[props.name]);
	const forPeopleIndex = ref(-1);
	const forPeoplePickerChange = function(e) {
		forPeopleIndex.value = e.detail.value;
		emit('update:modelValue', props.mode == "normal" ? forPeopleIndex.value : forPeopleIndex.value + 1);
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
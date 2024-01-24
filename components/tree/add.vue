<template>
	<view>
		<list-header class="header_fixed" :title="myTitle">
			<button v-if="updateEnable || createEnable" class="cu-btn bg-purple mr-10" style="margin-right: 5px;"
				@click="add">
				<text class="cuIcon-add"></text> 提交
			</button>
			<button v-if="deleteEnable && _id > 0" class="cu-btn bg-red" @click="deleteItem">
				<text class="cuIcon-delete"></text> 删除
			</button>
		</list-header>
		<uni-card class="form_card card_fixed">
			<view class="cu-form-group ">
				<view class="title">名称 *</view>
				<input type="text" v-model="formData.name" placeholder="请输入" />
			</view>
			<select-index-single-sync v-if="formData.parentId != 0" title="父节点" :v="formData.parent" :req="false"
				:name="_.get(props, 'options.request.findAll') || '/' +_.get(props, 'options.name') + '?pid=0'"
				v-model="formData.parentId">
			</select-index-single-sync>
		</uni-card>

	</view>

	<uni-popup ref="alertDialog" type="dialog">
		<uni-popup-dialog type="warn" cancelText="关闭" confirmText="同意" title="通知" content="删除以后不可恢复, 确认删除?"
			@confirm="dialogConfirm"></uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
	import requst from "@/common/request.js"
	import _, {
		get
	} from "lodash";
	import listHeader from "@/components/listHeader.vue"
	import {
		ref
	} from "vue";
	import {
		errorToast,
		successToast
	} from "../../common/toastHelper";
	import {
		checkPower
	} from "../../common/power";

	import selectIndexSingleSync from "@/components/selectIndexSingleSync.vue";

	const props = defineProps({
		title: {
			type: String,
			required: true
		},
		id: {
			type: Number,
			required: false
		},
		options: {
			type: Object,
			required: true
		}
	});


	//参数

	const _title = _.get(props, "title");
	const _id = _.get(props, "id");

	const defaultParent = {
		id: 0,
		name: "无",
		parentId: 0
	}


	//权限
	const powerBase = _.get(props, "options.controllerName");
	const createPowerName = _.get(props, "options.power.create") || `${powerBase}_create`;
	const findOnePowerName = _.get(props, "options.power.findOne") || `${powerBase}_findOne`;
	const findAllPowerName = _.get(props, "options.power.findAll") || `${powerBase}_findAll`;
	const updatePowerName = _.get(props, "options.power.update") || `${powerBase}_update`;
	const deletePowerName = _.get(props, "options.power.delete") || `${powerBase}_delete`;

	const createEnable = ref(checkPower(createPowerName));
	const findAllEnable = ref(checkPower(findAllPowerName));
	const findOneEnable = ref(checkPower(findOnePowerName));
	const updateEnable = ref(checkPower(updatePowerName));
	const deleteEnable = ref(checkPower(deletePowerName));

	if (!findOneEnable) {
		errorToast(`您没有权限访问这个模块，正在为您跳转`);
		uni.navigateBack({
			delta: 1
		});
	}


	//判断
	const formData = ref({});
	const myTitle = ref("");
	if (_id) {
		myTitle.value = _title + "编辑"
	} else {
		myTitle.value = _title + "添加"
	}

	//API
	const model = ref({});
	const getOne = function() {
		let url = _.get(props, "options.request.findOne") || `/${_.get(props, "options.name")}`
		url += `/${_id}`;
		return requst({
			url,
			method: `get`,
			isValid: true
		});
	}

	const add = function() {
		const name = _.get(formData.value, "name");
		if (!name || name.length < 2 || name.length > 15) {
			errorToast(`名称长度必须超过1位且不超过15位`);
			return;
		}

		let parentId = _.get(formData.value, "parentId");
		if (!parentId) parentId = 0;

		let url = _.get(props, "options.request.create") || `/${_.get(props, "options.name")}`
		let r;
		if (_id) {
			r = requst({
				url: `${url}/${_id}`,
				method: `put`,
				isValid: true,
				data: {
					name,
					parentId
				}
			});
		} else {
			r = requst({
				url,
				method: `post`,
				isValid: true,
				data: {
					name,
					parentId
				}
			});
		}

		r.then(res => {
			if (res.status === 200) {
				successToast(`提交成功，正在为您跳转`);
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 1000)
			} else {
				errorToast(res.message || `${_title}提交错误`)
			}
		}).catch(res => {
			errorToast(res.message || `${_title}提交错误`)
		})
	}


	//删除功能
	const alertDialog = ref(null);
	const dialogConfirm = function() {
		let url = _.get(props, "options.request.delete") || `/${_.get(props, "options.name")}`
		requst({
			url: `${url}/${_id}`,
			method: `DELETE`,
			isValid: true
		}).then(res => {
			if (res.status === 200) {
				successToast(`删除成功，正在为您跳转`);
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 1000)
			} else {
				errorToast(res.message || `${_title}删除错误`)
			}
		}).catch(res => {
			errorToast(res.message || `${_title}删除错误`)
		})
	}

	const deleteItem = function() {
		alertDialog.value.open()
	}

	const init = function() {
		if (_id) {
			getOne().then(res => {
				if (res.status === 200) {
					formData.value = res.data;
				} else {
					errorToast(res.message || `${_title}查询错误`)
				}
			}).catch(res => {
				errorToast(res.message || `${_title}查询错误`)
			})
		}
	}
	init();

	//
	const bindClick = function(source) {
		if (source.id == 0) {
			formData.value.parentName = source.name;
			formData.value.parentId = source.id;
		} else {
			const result = _originRoleList.value.find(item => {
				return item.name == source.name;
			});

			if (!result) {
				errorToast(`未知错误,请退出后重试`);
				return;
			}

			formData.value.parentName = result.name;
			formData.value.parentId = result.id;
		}



	}
</script>
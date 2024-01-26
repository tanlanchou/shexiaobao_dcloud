<template>
	<list-header class="header_fixed" :title="title">
		<button v-if="updatePowerEnable || createEnable" class="cu-btn bg-purple mr-10" style="margin-right: 5px;"
			@click="add">
			<text class="cuIcon-add"></text> 提交
		</button>
		<button v-if="deletePowerEnable && _id" class="cu-btn bg-red" @click="deleteItem">
			<text class="cuIcon-delete"></text> 删除
		</button>
	</list-header>
	<scroll-view scroll-y="true" class="card_fixed">
		<uni-card>
			<view class="form_list">
				<view class="cu-form-group">
					<view class="title">名称 *</view>
					<input type="text" v-model="formData.name" placeholder="请输入" />
				</view>
				<view class="cu-form-group">
					<view class="title">客户编号 *</view>
					<input type="text" v-model="formData.no" placeholder="请输入" />
				</view>
				<select-index-single-sync title="维护人" :v="formData.user" :req="true" name="getAllUserApi"
					v-model="formData.maintenanceMan"></select-index-single-sync>
				<select-index-single-sync title="客户来源" :v="formData.customerOrigin" :req="true" name="getOriginAllApi"
					v-model="formData.customerOriginId"></select-index-single-sync>
			</view>

		</uni-card>
		<view class="form_split"> --------其他信息(可选) -------- </view>

		<view class="form_card">
			<view class="cu-form-group">
				<view class="title">类型</view>
				<uni-data-checkbox mode="tag" v-model="formData.type" :localdata="customerMap"></uni-data-checkbox>
			</view>
			<view class="cu-form-group">
				<view class="title">客户意向</view>
				<uni-data-checkbox mode="tag" multiple v-model="formData.intentionType"
					:localdata="intentionTypeMap"></uni-data-checkbox>
			</view>
			<view class="cu-form-group  align-start">
				<view class="title">客户意向描述</view>
				<textarea maxlength="-1" v-model="formData.intention" placeholder="请输入"></textarea>
			</view>
			<view class="cu-form-group">
				<view class="title">性别</view>
				<uni-data-checkbox mode="tag" v-model="formData.sex" :localdata="sexMap"></uni-data-checkbox>
			</view>
			<select-index-muplt-sync title="客户标签" :v="formData.customerTag" :req="false" name="getCustomerTagAllApi"
				v-model="formData.customerTag"></select-index-muplt-sync>
		</view>

		<view class="form_split"> --------头像(可选) -------- </view>
		<view class="form_card">
			<form>
				<view class="cu-form-group" style="padding-top: 5px !important;">

					<sunui-upimg url="http://192.168.5.46:3001/static/upload" ref="iconRef" title="上传头像"
						@upload="handleLoaded" :before-upload="handleChange" :number="1">
						<template v-slot:icon>
							<text class="s-add-list-btn-icon">+</text>
						</template>
					</sunui-upimg>
				</view>
			</form>
		</view>
		<view class="form_split"> --------描述(可选) -------- </view>
		<view class="form_card">
			<view class="cu-form-group  align-start">
				<view class="title">描述</view>
				<textarea maxlength="-1" v-model="formData.desc" placeholder="请输入"></textarea>
			</view>
		</view>

	</scroll-view>
	<uni-popup ref="alertDialog" type="dialog">
		<uni-popup-dialog type="warn" cancelText="关闭" confirmText="同意" title="通知" content="删除以后不可恢复, 确认删除?"
			@confirm="dialogConfirm"></uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
	import {
		isLogin
	} from '@/common/login';
	import selectIndexSingleSync from "@/components/selectIndexSingleSync.vue";
	import selectIndexMupltSync from "@/components/selectIndexMupltSync.vue";
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
	} from "@/common/toastHelper";
	import {
		checkPowerCommon
	} from "@/common/power";
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app";
	import {
		addCustomerApi,
		deleteCustomerOneApi,
		getCustomerOneApi,
		updateCustomerApi
	} from "@/api/customer";
	import {
		getUserInfoApi
	} from '@/api/user';
	import {
		intentionTypeMap,
		sexMap,
		customerMap
	} from '@/common/enum';




	isLogin()

	//判断是否是编辑
	let _id;
	const title = ref("");
	onLoad((options) => {
		if (options.id) _id = options.id;

		if (_id) {
			title.value = "客户编辑";
			getOne(_id)
		} else {
			title.value = "客户添加";
			getMySelf();
		}

	});


	//权限
	const {
		createPowerEnable,
		findOnePowerEnable,
		updatePowerEnable,
		deletePowerEnable
	} = checkPowerCommon("CustomerController")

	if (!findOnePowerEnable) {
		errorToast(`您没有权限访问这个模块，正在为您跳转`);
		setTimeout(() => {
			uni.navigateTo({
				url: "/pages/index/functions"
			})
		}, 1000);
	}



	//上传
	const iconRef = ref(null)
	const formIcon = ref('');
	const handleLoaded = function(result) {
		formIcon.value = result[0].url;
	}

	const handleChange = function() {
		setTimeout(() => {
			iconRef.value.upload();
		}, 1);
	}

	//添加和编辑
	const formData = ref({
		intentionType: [1],
		type: 1,
		sex: 1,
		customerTag: ""
	});
	const formUser = ref({});

	const getOne = function(id) {
		getCustomerOneApi(id).then(res => {
			if (res.status === 200) {
				formData.value = res.data;
				if (_.get(formData, "value.intentionType") && _.isString(formData.value.intentionType)) {
					let arr = _.split(formData.value.intentionType, ',');
					let tempArr = arr.map(item => Number(item));
					formData.value.intentionType = tempArr;
				}
				if (iconRef && iconRef.value) {
					formIcon.value = formData.value.img;
					iconRef.value.setItems([
						formData.value.img
					]);
				}
			} else {
				errorToast(res.message || `获取列表错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取列表错误`)
		})
	}

	function validateParams() {
		if (!_.get(formData, "value.name") ||
			_.get(formData, "value.name.length") < 2 || _.get(formData, "value.name.length") > 10) {
			errorToast('名称必填, 长度2-10个字');
			return;
		}

		if (!_.get(formData, "value.no") || _.get(formData, "value.no.length") < 2 || _.get(formData,
				"value.no.length") > 10) {
			errorToast('客户编号, 长度2-10个字');
			return;
		}

		if (_.get(formData, "value.maintenanceMan") === undefined || _.get(formUser, "value.maintenanceMan") === null) {
			errorToast('请选择维护人');
			return;
		}

		if (_.get(formData, "value.customerOriginId") === undefined || _.get(formData, "value.customerOriginId") ===
			null) {
			errorToast('请选择客户来源');
			return;
		}
		return true;
	}

	const add = function() {
		if (!validateParams()) return;

		const params = Object.assign({}, formData.value);
		params.img = formIcon.value;

		if (params.customerTag && Array.isArray(params.customerTag)) {
			params.customerTag = params.customerTag.join(',')
		}

		if (params.intentionType && Array.isArray(params.intentionType)) {
			params.intentionType = params.intentionType.join(',')
		}

		let request;
		if (_.isEmpty(_id)) {
			request = addCustomerApi(params);
		} else {
			request = updateCustomerApi(_id, params);
		}

		request.then(res => {
			if (_.isEqual(_.get(res, "status"), 200)) {
				successToast("提交成功, 正在为您跳转");
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/customer/people/index"
					})
				}, 1000)
			} else {
				errorToast(_.get(res, "message", "提交客户信息出错"))
			}
		}).catch(res => errorToast(_.get(res, "message", "提交客户信息出错")))
	}

	const getMySelf = function() {
		if (!_id) {
			getUserInfoApi().then(res => {
				if (res.status == 200) {
					formData.value.user = res.data;
					formData.value.maintenanceMan = res.data.id;
				} else {
					errorToast(res.message || `获取用户信息错误`)
				}
			}).catch(res => {
				errorToast(res.message || `获取用户信息错误`)
			});
		}
	}

	const init = function() {
		if (_id) {
			getOne(_id);
		}
	}

	//删除功能
	const alertDialog = ref(null);
	const dialogConfirm = function() {
		deleteCustomerOneApi(_id).then(res => {
			if (res.status === 200) {
				successToast(`删除成功，正在为您跳转`);
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/customer/people/index"
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
</script>
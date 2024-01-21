<template>
	<view>
		<list-header class="header_fixed" :title="title">
			<button v-if="updatePowerEnable || createEnable" class="cu-btn bg-purple mr-10" style="margin-right: 5px;"
				@click="add">
				<text class="cuIcon-add"></text> 提交
			</button>
			<button v-if="deletePowerEnable && _id" class="cu-btn bg-red" @click="deleteItem">
				<text class="cuIcon-delete"></text> 删除
			</button>
		</list-header>
		<uni-card class="form_card card_fixed">
			<form>
				<view class="cu-form-group">
					<view class="uni-padding-wrap">
						<uni-section title="名称 *" type="line">
							<uni-easyinput class="input-border-bottom " type="text" :inputBorder="false"
								v-model="formData.name" placeholder="请输入名称" prefix-icon="font"></uni-easyinput>
						</uni-section>
					</view>
					<view class="uni-padding-wrap">
						<uni-section title="客户编号 *" type="line">
							<uni-easyinput class="input-border-bottom " type="text" :inputBorder="false"
								v-model="formData.no" placeholder="建议手机号后4位"
								prefix-icon="smallcircle-filled"></uni-easyinput>
						</uni-section>
					</view>
					<view class="uni-padding-wrap">
						<uni-section title="维护人选择 *" type="line">
							<text>{{formUser.nickname}}</text> &nbsp; <button class="cu-btn bg-green round"
								@click="openUserIndex">
								<text class="cuIcon-selection"></text> 选择维护人
							</button>
						</uni-section>
					</view>
					<view class="uni-padding-wrap mb-20">
						<uni-section title="客户来源 *" type="line">
							<text>{{formOrigin.name}}</text> &nbsp; <button class="cu-btn bg-green round"
								@click="openOriginIndex">
								<text class="cuIcon-selection"></text> 选择来源
							</button>
						</uni-section>
					</view>
				</view>
			</form>
		</uni-card>
		<uni-card class="form_card">
			<form>
				<view class="cu-form-group">
					<view class="uni-padding-wrap">
						<uni-section title="客户意向" type="line">
							<uni-data-checkbox mode="tag" multiple v-model="formData.intentionType"
								:localdata="intentionTypeMap"></uni-data-checkbox>
						</uni-section>
					</view>
					<view class="uni-padding-wrap">
						<uni-section title="客户意向描述" type="line">
							<uni-easyinput type="textarea" autoHeight v-model="formData.intention"
								placeholder="请输入客户意向描述"></uni-easyinput>
						</uni-section>
					</view>
					<view class="uni-padding-wrap">
						<uni-section title="类型" type="line">
							<uni-data-checkbox mode="tag" v-model="formData.type"
								:localdata="customerMap"></uni-data-checkbox>
						</uni-section>
					</view>
					<view class="uni-padding-wrap">
						<uni-section title="性别" type="line">
							<uni-data-checkbox mode="tag" v-model="formData.sex"
								:localdata="sexMap"></uni-data-checkbox>
						</uni-section>
					</view>
					<view class="uni-padding-wrap mb-20">
						<uni-section title="客户标签" type="line">
							<text v-text="formData.customerTag"></text> &nbsp; <button class="cu-btn bg-green round"
								@click="openTagIndex">
								<text class="cuIcon-selection"></text> 选择标签
							</button>
						</uni-section>
					</view>
				</view>
			</form>
		</uni-card>
		<uni-card class="form_card" title="头像">
			<form>
				<view class="cu-form-group" style="padding-top: 5px !important;">

					<sunui-upimg url="http://192.168.2.247:3001/static/upload" ref="iconRef" title="上传头像"
						@upload="handleLoaded" :before-upload="handleChange" :number="1">
						<template v-slot:icon>
							<text class="s-add-list-btn-icon">+</text>
						</template>
					</sunui-upimg>
				</view>
			</form>
		</uni-card>
		<uni-card class="form_card">
			<form>
				<view class="cu-form-group">
					<view class="uni-padding-wrap mb-20">
						<uni-section title="描述" type="line">
							<uni-easyinput type="textarea" autoHeight v-model="formData.desc"
								placeholder="请输入描述"></uni-easyinput>
						</uni-section>
					</view>
				</view>
			</form>
		</uni-card>
	</view>

	<index-select ref="userListRef" title="维护人选择" v-if="userDataLoadFlag" :list="userList" :isSingle="true"
		:isShowSelect="true" @indexSelect="userBindClick"></index-select>

	<index-select ref="tagListRef" title="客户标签" v-if="tagDataLoadFlag" :list="tagList" :isSingle="false"
		:isShowSelect="true" @indexSelect="tagBindClick"></index-select>

	<index-select ref="originListRef" title="客户来源" v-if="originDataLoadFlag" :list="originList" :isSingle="true"
		:isShowSelect="true" @indexSelect="originBindClick"></index-select>

	<uni-popup ref="alertDialog" type="dialog">
		<uni-popup-dialog type="warn" cancelText="关闭" confirmText="同意" title="通知" content="删除以后不可恢复, 确认删除?"
			@confirm="dialogConfirm"></uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
	import {
		isLogin
	} from '@/common/login';

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
		getCustomerAllApi,
		getCustomerOneApi,
		updateCustomerApi
	} from "@/api/customer";
	import {
		intentionTypeMap,
		sexMap,
		customerMap
	} from '@/common/enum';
	import {
		getCustomerTagAllApi
	} from '@/api/customerTag';
	import {
		getAllUserApi,
		getUserInfoApi
	} from '@/api/user';
	import indexSelect from '@/components/indexSelect.vue'
	import {
		filterArrayByIndex
	} from '@/common/indexSelect';
	import {
		getOriginAllApi
	} from '@/api/origin.js';

	isLogin()

	//判断是否是编辑
	let _id;
	const title = ref("");
	onLoad((options) => {
		if (options.id) _id = options.id;

		Promise.all([getTagList(), getUserList(), getOriginList()]).then(res => {
			getOne(_id)
		})

		if (_id) {
			title.value = "客户编辑";
		} else {
			title.value = "客户添加";
			getMySelf();
		}

	});


	//权限
	const {
		createEnable,
		findOnePowerEnable,
		updatePowerEnable,
		deletePowerEnable
	} = checkPowerCommon("CustomerController")

	if (!findOnePowerEnable) {
		errorToast(`您没有权限访问这个模块，正在为您跳转`);
		uni.navigateBack({
			delta: 1
		});
	}


	//标签	
	const tagListRef = ref(null);
	const tagDataLoadFlag = ref(false);
	const tagList = ref([]);
	const tagOriginList = ref([]);

	const getTagList = function() {
		return getCustomerTagAllApi().then(res => {
			if (res.status === 200) {
				tagOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result = filterArrayByIndex(res.data.map(item => item.name));
				tagList.value = result;
				setTimeout(() => {
					tagDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取客户标签错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取客户标签错误`)
		});
	}

	const tagBindClick = function(source) {
		try {
			formData.value.customerTag = source.map(item => item.name).join(',')
		} catch (ex) {
			console.error(ex.message);
			errorToast("数据格式出错, 请刷新后重试");
		}
	}

	const openTagIndex = function() {
		tagListRef.value.open();
	}

	//用户
	const userListRef = ref(null);
	const userDataLoadFlag = ref(false);
	const userList = ref([]);
	const userOriginList = ref([]);

	const getUserList = function() {
		return getAllUserApi().then(res => {
			if (res.status == 200) {
				userOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result = filterArrayByIndex(res.data.map(item => `${item.nickname}(${item.phoneNumber})`));
				userList.value = result;
				setTimeout(() => {
					userDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取用户错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取用户错误`)
		});
	}

	const openUserIndex = function() {
		userListRef.value.open();
	}

	const userBindClick = function(source) {
		let str = source.name;
		try {
			let tempArr = str.split('(');
			let phoneNumber = tempArr[1].substring(0, tempArr[1].length - 1);
			const result = userOriginList.value.find(item => item.phoneNumber == phoneNumber);
			if (result) {
				formUser.value = result;
			} else {
				errorToast("数据格式出错, 请刷新后重试");
			}
		} catch (ex) {
			console.error(ex.message);
			errorToast("数据格式出错, 请刷新后重试");
		}
	}

	const getMySelf = function() {
		if (!_id) {
			getUserInfoApi().then(res => {
				if (res.status == 200) {
					formUser.value = res.data;
				} else {
					errorToast(res.message || `获取用户信息错误`)
				}
			}).catch(res => {
				errorToast(res.message || `获取用户信息错误`)
			});
		}
	}


	//来源
	const originListRef = ref(null);
	const originDataLoadFlag = ref(false);
	const originList = ref([]);
	const originOriginList = ref([]);
	const formOrigin = ref({});

	const getOriginList = function() {
		return getOriginAllApi().then(res => {
			if (res.status === 200) {
				originOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result = filterArrayByIndex(res.data.map(item => item.name));
				originList.value = result;
				setTimeout(() => {
					originDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取客户标签错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取客户标签错误`)
		});
	}

	const openOriginIndex = function() {
		originListRef.value.open();
	}
	const originBindClick = function(source) {
		try {
			const result = originOriginList.value.find(item => item.name == source.name);
			if (!result) {
				errorToast("来源数据错误");
				return;
			}
			formData.value.customerOriginId = result.id;
			formOrigin.value = result;
		} catch (ex) {
			console.error(ex.message);
			errorToast("数据格式出错, 请刷新后重试");
		}
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

				const userResult = userOriginList.value.find(item => item.id == res.data.maintenanceMan);
				if (userResult) {
					formUser.value = userResult;
				}

				const originResult = originOriginList.value.find(item => item.id == res.data.customerOriginId);
				if (originResult) {
					formOrigin.value = originResult;
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

		if (!_.get(formData, "value.name") || _.get(formData, "value.no.length") < 2 || _.get(formData,
				"value.no.length") > 10) {
			errorToast('客户编号, 成都2-10个字');
			return;
		}

		if (!_.get(formUser, "value") || !_.get(formUser, "value.id")) {
			errorToast('请选择维护人');
			return;
		}

		if (!_.get(formOrigin, "value") || !_.get(formOrigin, "value.id")) {
			errorToast('请选择客户来源');
			return;
		}
		return true;
	}

	const add = function() {
		if (!validateParams()) return;

		const params = {};
		params.name = _.get(formData.value, "name");
		params.no = _.get(formData.value, "no");
		params.maintenanceMan = _.get(formUser.value, "id");
		params.intention = _.get(formData.value, "intention");
		params.intentionType = _.join(_.get(formData.value, "intentionType"), ',');
		params.type = _.get(formData.value, "type");
		params.sex = _.get(formData.value, "sex");
		params.customerTag = _.get(formData.value, "customerTag");
		params.customerOriginId = _.get(formOrigin.value, "id");
		params.img = formIcon.value;
		params.desc = _.get(formData.value, "desc");


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
</script>
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


	<uni-card class="form_card card_fixed" title="商品图片">
		<sunui-upimg class="smallContent" style="margin-top: 5px !important;" url="http://localhost:3001/static/upload"
			ref="iconRef" title="上传" @upload="handleLoaded" :before-upload="handleChange" :number="9">
			<template v-slot:icon>
				<text class="s-add-list-btn-icon">+</text>
			</template>
		</sunui-upimg>
	</uni-card>

	<view class="form_card">
		<view class="cu-form-group  align-start">
			<view class="title">名称 *</view>
			<textarea v-model="formData.title" placeholder="请输入名称"></textarea>
		</view>
		<view class="cu-form-group" @click="openTypeIndex">
			<view class="title">品牌 *</view>
			<view>
				<text>{{formType.name || "请选择"}}</text>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">品类 *</view>
			<picker ref="categoryListRef" v-if="categoryDataLoadFlag" mode="multiSelector" @change="categoryChange"
				@columnchange="categoryColumnChange" :range="categoryList">
				<view class="picker">
					{{formCategory.name || "请选择"}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group" @click="openQualityIndex">
			<view class="title">成色 *</view>
			<view>
				<text>{{formQuality.name || "请选择"}}</text>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">来源 *</view>
			<uni-data-checkbox class="smallCheck" mode="tag" v-model="formData.productOriginId"
				:localdata="originList"></uni-data-checkbox>
		</view>
		<view class="cu-form-group">
			<view class="title">来源方 *</view>
			<input type="text" v-model="formData.originName" placeholder="请输入商品来源方" />
		</view>
		<view class="cu-form-group" @click="openStoreIndex">
			<view class="title">仓库 *</view>
			<view>
				<text>{{formStore.name || "请选择"}}</text>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">店铺编号 *</view>
			<input type="text" v-model="formData.no" placeholder="仓库货编" />
		</view>
	</view>
	<view class="form_split"> -------- 价格(可选) -------- </view>
	<view class="form_card">
		<view class="cu-form-group">
			<view class="title">成本价</view>
			<input type="number" v-model="formData.costPrice" placeholder="请输入" />
			<text class='cuIcon-moneybag text-black'></text>
		</view>
		<view class="cu-form-group">
			<view class="title">销售价</view>
			<input type="number" v-model="formData.sellingPrice" placeholder="请输入" />
			<text class='cuIcon-moneybag text-black'></text>
		</view>
		<view class="cu-form-group">
			<view class="title">同行价</view>
			<input type="number" v-model="formData.peerPrice" placeholder="请输入" />
			<text class='cuIcon-moneybag text-black'></text>
		</view>
		<view class="cu-form-group">
			<view class="title">直播价</view>
			<input type="number" v-model="formData.liveBroadcastPrice" placeholder="请输入" />
			<text class='cuIcon-moneybag text-black'></text>
		</view>
		<view class="cu-form-group">
			<view class="title">专柜价</view>
			<input type="number" v-model="formData.counterPrice" placeholder="请输入" />
			<text class='cuIcon-moneybag text-black'></text>
		</view>
	</view>
	<view class="form_split"> -------- 其他(可选) -------- </view>
	<view class="form_card">
		<view class="cu-form-group">
			<view class="title">类型</view>
			<uni-data-checkbox class="smallCheck" mode="tag" v-model="formData.type"
				:localdata="productTypeMap"></uni-data-checkbox>
		</view>
		<view class="cu-form-group">
			<view class="title">镭射刻印</view>
			<input type="number" v-model="formData.laserMarking" placeholder="请输入" />
			<text class='cuIcon-discover text-black'></text>
		</view>
		<view class="cu-form-group">
			<view class="title">适用人群</view>
			<picker @change="forPeoplePickerChange" :value="forPeopleIndex" :range="productForPeopleMap">
				<view class="picker">
					{{forPeopleIndex>-1?productForPeopleMap[forPeopleIndex]:'请选择'}}
				</view>
			</picker>
		</view>
	</view>
	<view class="form_card mt-10">
		<view class="cu-form-group">
			<view class="title">尺码</view>
			<picker @change="sizePickerChange" :value="sizeIndex" :range="productSizeMap">
				<view class="picker">
					{{sizeIndex>-1?productSizeMap[sizeIndex]:'请选择'}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">尺寸</view>
			<input type="number" v-model="formData.sizes" placeholder="请输入" />
			<text class='cuIcon-discover text-black'></text>
		</view>
		<view class="cu-form-group" @click="openMaterialIndex">
			<view class="title">材质</view>
			<view>
				<text>{{formMaterial}}</text>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">商品颜色</view>
			<input type="number" v-model="formData.color" placeholder="请输入" />
			<text class='cuIcon-colorlens text-black'></text>
		</view>

	</view>

	<view class="form_card mt-10">
		<view class="cu-form-group">
			<view class="title">商品数量</view>
			<input type="number" v-model="formData.count" value="1" disabled="true" placeholder="请输入" />
			<text class='text-black'></text>
		</view>
		<view class="cu-form-group">
			<view class="title">到货时间</view>
			<picker mode="date" :value="arrivalTimeIndex" start="2024-01-01" end="2025-09-01"
				@change="arrivalTimePickerChange">
				<view class="picker">
					{{arrivalTimeIndex}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">入库时间</view>
			<picker mode="date" :value="inTimeIndex" start="2024-01-01" end="2025-09-01" @change="inTimePickerChange">
				<view class="picker">
					{{inTimeIndex}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group" @click="openUserIndex">
			<view class="title">买手 *</view>
			<view>
				<text>{{formUser.nickname}}</text>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="cu-form-group" @click="openTagIndex">
			<view class="title">标签</view>
			<view>
				<text>{{formTag}}</text>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="cu-form-group" @click="openAttachIndex">
			<view class="title">附件</view>
			<view>
				<text>{{formAttach}}</text>
				<text class="cuIcon-right"></text>
			</view>
		</view>

		<view class="cu-form-group  align-start">
			<view class="title">备注</view>
			<textarea maxlength="-1" v-model="formData.description" placeholder="请输入"></textarea>
		</view>
	</view>

	<index-select ref="typeListRef" title="品牌选择" v-if="typeDataLoadFlag" :list="typeList" :isSingle="true"
		:isShowSelect="true" @indexSelect="typeBindClick"></index-select>

	<index-select ref="qualityListRef" title="成色选择" v-if="qualityDataLoadFlag" :list="qualityList" :isSingle="true"
		:isShowSelect="true" @indexSelect="qualityBindClick"></index-select>

	<index-select ref="storeListRef" title="仓库选择" v-if="storeDataLoadFlag" :list="storeList" :isSingle="true"
		:isShowSelect="true" @indexSelect="storeBindClick"></index-select>

	<index-select ref="materialListRef" title="材质选择" v-if="materialDataLoadFlag" :list="materialList" :isSingle="false"
		:isShowSelect="true" @indexSelect="materialBindClick"></index-select>

	<index-select ref="userListRef" title="买手选择" v-if="userDataLoadFlag" :list="userList" :isSingle="true"
		:isShowSelect="true" @indexSelect="userBindClick"></index-select>

	<index-select ref="tagListRef" title="标签选择" v-if="tagDataLoadFlag" :list="tagList" :isSingle="false"
		:isShowSelect="true" @indexSelect="tagBindClick"></index-select>

	<index-select ref="attachListRef" title="附件选择" v-if="attachDataLoadFlag" :list="attachList" :isSingle="false"
		:isShowSelect="true" @indexSelect="attachBindClick" />

	<uni-popup ref="alertDialog" type="dialog">
		<uni-popup-dialog type="warn" cancelText="关闭" confirmText="同意" title="通知" content="删除以后不可恢复, 确认删除?"
			@confirm="dialogConfirm"></uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
	//公共
	import {
		isLogin
	} from '@/common/login';
	import {
		getProductCategoryAllApi,
		getProductTypeAllApi,
		getProductQualityAllApi,
		getProductOriginAllApi,
		getProductStorehouseAllApi,
		getProductMaterialAllApi,
		getProductTagAllApi,
		getProductAttachAllApi,
		addProductInfoApi,
		updateProductInfoApi
	} from '@/api/product.info';
	import {
		getAllUserApi,
		getUserInfoApi
	} from '@/api/user';
	import {
		checkPowerCommon
	} from '@/common/power';

	isLogin();

	import {
		ref
	} from "vue";
	import {
		errorToast,
		successToast
	} from "@/common/toastHelper";
	import _ from "lodash";
	import indexSelect from '@/components/indexSelect.vue'
	import {
		filterArrayByIndex
	} from '@/common/indexSelect';

	import moment from "moment";

	import {
		productTypeMap,
		productForPeopleMap,
		productSizeMap
	} from "@/common/enum.js"

	//导航
	import listHeader from "@/components/listHeader.vue"

	//权限
	const {
		createEnable,
		findOnePowerEnable,
		updatePowerEnable,
		deletePowerEnable
	} = checkPowerCommon("ProductInfoController")

	if (!findOnePowerEnable) {
		errorToast(`您没有权限访问这个模块，正在为您跳转`);
		uni.navigateBack({
			delta: 1
		});
	}

	if (!findOnePowerEnable) {
		errorToast(`您没有权限访问这个模块，正在为您跳转`);
		uni.navigateBack({
			delta: 1
		});
	}


	//事件
	import {
		onLoad
	} from "@dcloudio/uni-app";
	let _id;
	const title = ref("");
	onLoad((options) => {
		if (options.id) _id = options.id;

		Promise.all([getTypeList(), getCategoryList(), getQualityList(), getOriginList(), getStoreList(),
			getMaterialList(), getUserList(), getTagList(), getAttachList()
		]).then(() => {
			if (_id) {
				getOne(_id);
			} else {
				getMySelf();
			}
		})
		// getTypeList();
		// getCategoryList();
		// getQualityList();
		// getOriginList();
		// getStoreList();
		// getMaterialList();
		// getUserList();
		// getTagList();
		// getAttachList();

		if (_id) {
			title.value = "产品编辑";
		} else {
			title.value = "产品添加";
		}
	});

	//单选
	const forPeopleIndex = ref(-1);
	const forPeoplePickerChange = function(e) {
		forPeopleIndex.value = e.detail.value;
		formData.value.forPeople = e.detail.value;
	}

	const sizeIndex = ref(-1);
	const sizePickerChange = function(e) {
		sizeIndex.value = e.detail.value;
		formData.value.size = e.detail.value;
	}

	const arrivalTimeIndex = ref(moment().format('YYYY-MM-DD'));
	const arrivalTimePickerChange = function(e) {
		arrivalTimeIndex.value = e.detail.value;
		formData.value.arrivalTime = e.detail.value;
	}

	const inTimeIndex = ref(moment().format('YYYY-MM-DD'));
	const inTimePickerChange = function(e) {

		inTimeIndex.value = e.detail.value;
		formData.value.inTime = e.detail.value;
	}

	//图片上传
	const iconRef = ref(null);
	const formIcon = ref([]);
	const handleLoaded = function(result) {
		if (result.length > 0) {
			const iconArr = result.map(item => item.url);
			formIcon.value = iconArr;
		}
	}

	const handleChange = function(a, b) {
		setTimeout(() => {
			iconRef.value.upload();
		}, 1);
	}

	//品牌
	const typeListRef = ref(null);
	const typeDataLoadFlag = ref(false);
	const typeList = ref([]);
	const typeOriginList = ref([]);
	const formType = ref({});

	const getTypeList = function() {
		return getProductTypeAllApi().then(res => {
			if (res.status == 200) {
				typeOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result = filterArrayByIndex(res.data.map(item => item.name));
				typeList.value = result;
				setTimeout(() => {
					typeDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取品牌错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取品牌错误`)
		});
	}

	const openTypeIndex = function() {
		typeListRef.value.open();
	}

	const typeBindClick = function(source) {
		let str = source.name;
		try {
			const result = typeOriginList.value.find(item => item.name == str);
			if (result) {
				formType.value = result;
				formData.value.productTypeId = result.id;
			} else {
				errorToast("数据格式出错, 请刷新后重试");
			}
		} catch (ex) {
			console.error(ex.message);
			errorToast("数据格式出错, 请刷新后重试");
		}
	}

	//品类
	const categoryListRef = ref(null);
	const categoryDataLoadFlag = ref(false);
	const categoryList = ref([]);
	const categoryOriginList = ref([]);
	const formCategory = ref({});
	let firstArr = [];

	const getCategoryList = function() {
		return getProductCategoryAllApi().then(res => {
			if (res.status == 200) {
				categoryOriginList.value = JSON.parse(JSON.stringify(res.data));
				firstArr = categoryOriginList.value.filter(item => item.parentId == 0);
				const secondArr = categoryOriginList.value.filter(item => item.parentId == firstArr[0].id);
				categoryList.value = [firstArr.map(item => item.name), secondArr.map(item => item.name)];
				setTimeout(() => {
					categoryDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取品类错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取品类错误`)
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
		formData.value.productCategoryId = formCategory.value.id;
	}

	//成色
	const qualityListRef = ref(null);
	const qualityDataLoadFlag = ref(false);
	const qualityList = ref([]);
	const qualityOriginList = ref([]);
	const formQuality = ref({});

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

	const openQualityIndex = function() {
		qualityListRef.value.open();
	}

	const qualityBindClick = function(source) {
		let str = source.name;
		try {
			const name = str.substring(0, str.indexOf('-'));
			const result = qualityOriginList.value.find(item => item.name == name);
			if (result) {
				formQuality.value = result;
				formData.value.productQualityId = result.id;
			} else {
				errorToast("数据格式出错, 请刷新后重试");
			}
		} catch (ex) {
			console.error(ex.message);
			errorToast("数据格式出错, 请刷新后重试");
		}
	}

	//来源
	const originList = ref([]);
	const getOriginList = function() {
		getProductOriginAllApi().then(res => {
			if (res.status == 200) {
				const r = res.data.map(item => {
					return {
						value: item.id,
						text: item.name
					}
				})
				originList.value = r;
			} else {
				errorToast(res.message || `获取成色错误`)
			}
		})
	}

	//仓库
	const storeListRef = ref(null);
	const storeDataLoadFlag = ref(false);
	const storeList = ref([]);
	const storeOriginList = ref([]);
	const formStore = ref({});

	const getStoreList = function() {
		return getProductStorehouseAllApi().then(res => {
			if (res.status == 200) {
				storeOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result = filterArrayByIndex(res.data.map(item => item.name));
				storeList.value = result;
				setTimeout(() => {
					storeDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取仓库错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取仓库错误`)
		});
	}

	const openStoreIndex = function() {
		storeListRef.value.open();
	}

	const storeBindClick = function(source) {
		let str = source.name;
		try {
			const result = storeOriginList.value.find(item => item.name == str);
			if (result) {
				formStore.value = result;
				formData.value.productStoreId = result.id;
			} else {
				errorToast("数据格式出错, 请刷新后重试");
			}
		} catch (ex) {
			console.error(ex.message);
			errorToast("数据格式出错, 请刷新后重试");
		}
	}

	//材质
	const materialListRef = ref(null);
	const materialDataLoadFlag = ref(false);
	const materialList = ref([]);
	const materialOriginList = ref([]);
	const formMaterial = ref("");

	const getMaterialList = function() {
		return getProductMaterialAllApi().then(res => {
			if (res.status == 200) {
				materialOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result = filterArrayByIndex(res.data.map(item => item.name));
				materialList.value = result;
				setTimeout(() => {
					materialDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取材质错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取材质错误`)
		});
	}

	const openMaterialIndex = function() {
		materialListRef.value.open();
	}

	const materialBindClick = function(source) {
		try {
			const result = source.map(item => item.name).join(',')
			if (result) {
				formMaterial.value = result;
				formData.value.productMaterial = result;
			} else {
				errorToast("数据格式出错, 请刷新后重试");
			}
		} catch (ex) {
			console.error(ex.message);
			errorToast("数据格式出错, 请刷新后重试");
		}
	}

	//买手
	const userListRef = ref(null);
	const userDataLoadFlag = ref(false);
	const userList = ref([]);
	const userOriginList = ref([]);
	const formUser = ref({});

	const getUserList = function() {
		return getAllUserApi().then(res => {
			if (res.status == 200) {
				userOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result = filterArrayByIndex(res.data.map(item => `${item.nickname}(${item.role.name})`));
				userList.value = result;
				setTimeout(() => {
					userDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取买手错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取买手错误`)
		});
	}

	const openUserIndex = function() {
		userListRef.value.open();
	}

	const userBindClick = function(source) {
		let str = source.name;
		try {
			str = str.substring(0, str.indexOf('('))
			const result = userOriginList.value.find(item => item.nickname == str);
			if (result) {
				formUser.value = result;
				formData.value.buyer = result.id;
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
					formData.value.buyer = res.data.id;
				} else {
					errorToast(res.message || `获取用户信息错误`)
				}
			}).catch(res => {
				errorToast(res.message || `获取用户信息错误`)
			});
		}
	}

	//标签
	const tagListRef = ref(null);
	const tagDataLoadFlag = ref(false);
	const tagList = ref([]);
	const tagOriginList = ref([]);
	const formTag = ref("");

	const getTagList = function() {
		return getProductTagAllApi().then(res => {
			if (res.status == 200) {
				tagOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result = filterArrayByIndex(res.data.map(item => item.name));
				tagList.value = result;
				setTimeout(() => {
					tagDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取标签错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取标签错误`)
		});
	}

	const openTagIndex = function() {
		tagListRef.value.open();
	}

	const tagBindClick = function(source) {
		try {
			const result = source.map(item => item.name).join(',')
			if (result) {
				formTag.value = result;
				formData.value.productTag = result;
			} else {
				errorToast("数据格式出错, 请刷新后重试");
			}
		} catch (ex) {
			console.error(ex.message);
			errorToast("数据格式出错, 请刷新后重试");
		}
	}

	//附件
	const attachListRef = ref(null);
	const attachDataLoadFlag = ref(false);
	const attachList = ref([]);
	const attachOriginList = ref([]);
	const formAttach = ref("");

	const getAttachList = function() {
		return getProductAttachAllApi().then(res => {
			if (res.status == 200) {
				attachOriginList.value = JSON.parse(JSON.stringify(res.data));
				let result = filterArrayByIndex(res.data.map(item => item.name));
				attachList.value = result;
				setTimeout(() => {
					attachDataLoadFlag.value = true;
				})
			} else {
				errorToast(res.message || `获取附件错误`)
			}
		}).catch(res => {
			errorToast(res.message || `获取附件错误`)
		});
	}

	const openAttachIndex = function() {
		attachListRef.value.open();
	}

	const attachBindClick = function(source) {

		try {
			const result = source.map(item => item.name).join(',')
			if (result) {
				formAttach.value = result;
				formData.value.productAttach = result;
			} else {
				errorToast("数据格式出错, 请刷新后重试");
			}
		} catch (ex) {
			console.error(ex.message);
			errorToast("数据格式出错, 请刷新后重试");
		}
	}

	//编辑
	import {
		getProductInfoOneApi
	} from '@/api/product.info';

	const formData = ref({});
	const getOne = function(id) {
		return getProductInfoOneApi(id).then(res => {
			if (_.isEqual(_.get(res, "status"), 200)) {
				formData.value = _.get(res, "data");
				const imgString = _.get(res, "data.staticList");
				if (!_.isEmpty(imgString)) {
					const imgs = _.split(imgString, ',');
					formIcon.value = imgs;
					iconRef.value.setItems(imgs);
				}

				const productTypeId = _.get(res, "data.productTypeId");
				if (productTypeId) {
					const r = typeOriginList.value.find(item => item.id == productTypeId);
					if (r) formType.value = r;
				}

				const productCategoryId = _.get(res, "data.productCategoryId");
				if (productCategoryId) {
					const r = categoryOriginList.value.find(item => item.id == productCategoryId);
					if (r) formCategory.value = r;
				}

				const productQualityId = _.get(res, "data.productQualityId");
				if (productCategoryId) {
					const r = qualityOriginList.value.find(item => item.id == productQualityId);
					if (r) formQuality.value = r;
				}

				const productStoreId = _.get(res, "data.productStoreId");
				if (productStoreId) {
					const r = storeOriginList.value.find(item => item.id == productStoreId);
					if (r) formStore.value = r;
				}

				if (formData.value.forPeople) {
					forPeopleIndex.value = formData.value.forPeople - 1;
					formData.value.forPeople = formData.value.forPeople - 1;
				}
				if (formData.value.size) {
					sizeIndex.value = formData.value.size - 1;
					formData.value.size = formData.value.size - 1;
				}
				if (formData.value.arrivalTime) arrivalTimeIndex.value = moment(formData.value.arrivalTime)
					.format('YYYY-MM-DD');
				if (formData.value.inTime) inTimeIndex.value = moment(formData.value.inTime).format(
					'YYYY-MM-DD');

				const productMaterial = _.get(res, "data.productMaterial");
				if (productMaterial) {
					formMaterial.value = productMaterial;
				}

				const buyer = _.get(res, "data.buyer");
				if (buyer) {
					const r = userOriginList.value.find(item => item.id == buyer);
					if (r) formUser.value = r;
				}

				const productTag = _.get(res, "data.productTag");
				if (productTag) {
					formTag.value = productTag;
				}

				const productAttach = _.get(res, "data.productAttach");
				if (productAttach) {
					formAttach.value = productAttach;
				}


			} else {
				errorToast(_.get(res, "message", "获取产品信息出错"));
			}
		}).catch(res => {
			errorToast(_.get(res, "message", "获取产品信息出错"));
		})
	}

	const add = function() {

		const title = _.get(formData, "value.title");
		if (_.isEmpty(title) || _.size(title) < 2 || _.size(title) > 50) {
			errorToast(`名称长度必须超过2位且不超过50位`);
			return;
		}

		const productTypeId = _.get(formData, "value.productTypeId");
		if (!_.isNumber(productTypeId) || productTypeId < 1) {
			errorToast(`请选择品牌`);
			return;
		}

		const productQualityId = _.get(formData, "value.productQualityId");
		if (!_.isNumber(productQualityId) || productQualityId < 1) {
			errorToast(`请选择成色`);
			return;
		}

		const productCategoryId = _.get(formData, "value.productCategoryId");
		if (!_.isNumber(productCategoryId) || productCategoryId < 1) {
			errorToast(`请选择品类`);
			return;
		}

		const productOriginId = _.get(formData, "value.productOriginId");
		if (!_.isNumber(productOriginId) || productOriginId < 1) {
			errorToast(`请选择来源`);
			return;
		}

		const originName = _.get(formData, "value.originName");
		if (_.isEmpty(originName)) {
			errorToast(`请填写来源方`);
			return;
		}

		const productStoreId = _.get(formData, "value.productStoreId");
		if (!_.isNumber(productStoreId) || productStoreId < 1) {
			errorToast(`请选择仓库`);
			return;
		}

		const no = _.get(formData, "value.no");
		if (_.isEmpty(no)) {
			errorToast(`请填写店铺编号`);
			return;
		}

		const buyer = _.get(formData, "value.buyer");
		if (!_.isNumber(buyer) || buyer < 1) {
			errorToast(`请选择买手`);
			return;
		}


		let staticList = formIcon.value && formIcon.value.length > 0 && formIcon.value.join(',');
		if (_.isEmpty(staticList)) staticList = "";

		const params = {
			title,
			productTypeId,
			productQualityId,
			productCategoryId,
			productOriginId,
			originName,
			productStoreId,
			staticList,
			no,
			costPrice: _.get(formData, "value.costPrice"),
			sellingPrice: _.get(formData, "value.sellingPrice"),
			peerPrice: _.get(formData, "value.peerPrice"),
			liveBroadcastPrice: _.get(formData, "value.liveBroadcastPrice"),
			counterPrice: _.get(formData, "value.counterPrice"),
			type: _.get(formData, "value.type"),
			laserMarking: _.get(formData, "value.laserMarking"),
			forPeople: _.get(formData, "value.forPeople") + 1,
			size: _.get(formData, "value.size") + 1,
			productMaterial: _.get(formData, "value.productMaterial"),
			color: _.get(formData, "value.color"),
			count: _.get(formData, "value.count"),
			arrivalTime: _.get(formData, "value.arrivalTime", _.get(arrivalTimeIndex, "value")),
			inTime: _.get(formData, "value.inTime", _.get(inTimeIndex, "value")),
			buyer: _.get(formData, "value.buyer"),
			productTag: _.get(formData, "value.productTag"),
			productAttach: _.get(formData, "value.productAttach"),
			description: _.get(formData, "value.description"),
			status: 1,
			workflow: 2,
			staticList,
			sizes: _.get(formData, "value.sizes")
		}

		let req;
		if (_id) {
			req = updateProductInfoApi(_id, params);
		} else {
			req = addProductInfoApi(params);
		}

		req.then(res => {
			if (res.status == 200) {
				successToast("提交产品成功, 正在为您跳转");
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/product/info/index"
					})
				}, 1000)
			} else {
				errorToast(res.message || `提交产品信息出错`)
			}
		}).catch(res => {
			errorToast(res.message || `提交产品信息出错`)
		});

	}
	
	const dialogConfirm = function() {
		
	}

	const deleteItem = function() {
		if (_id) {
			alertDialog.value.open()
		}
	}
</script>

<style>
	.s-add-list-items {
		width: 31.6% !important;
	}
</style>
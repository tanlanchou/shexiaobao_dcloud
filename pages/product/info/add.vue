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
		<sunui-upimg class="smallContent" style="margin-top: 5px !important;" url="http://127.0.0.1:3001/static/upload"
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

		<select-index-single-sync title="品牌" :v="formData.productType" :req="true" name="getProductTypeAllApi"
			v-model="formData.productTypeId">
		</select-index-single-sync>
		<picker-muplt title="品类" :req="true" :v="formData.productCategory" name="getProductCategoryAllApi"
			v-model="formData.productCategoryId"></picker-muplt>
		<select-index-single-sync title="成色" :v="formData.productQuality" :req="true" otherName="desc"
			name="getProductQualityAllApi" v-model="formData.productQualityId"></select-index-single-sync>
		<view class="cu-form-group">
			<view class="title">来源{{formData.productOriginId}} *</view>
			<uni-data-checkbox class="smallCheck" mode="tag" v-model="formData.productOriginId"
				:localdata="originList"></uni-data-checkbox>
		</view>
		<view class="cu-form-group">
			<view class="title">来源方 *</view>
			<input type="text" v-model="formData.originName" placeholder="请输入商品来源方" />
		</view>
		<select-index-single-sync title="仓库" :v="formData.productStore" :req="true" name="getProductStorehouseAllApi"
			v-model="formData.productStoreId"></select-index-single-sync>
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
			<picker-single v-model="formData.forPeople" name="productForPeopleMap"></picker-single>
		</view>
	</view>
	<view class="form_card mt-10">
		<view class="cu-form-group">
			<view class="title">尺码</view>
			<picker-single v-model="formData.size" name="productSizeMap"></picker-single>
		</view>
		<view class="cu-form-group">
			<view class="title">尺寸</view>
			<input type="number" v-model="formData.sizes" placeholder="请输入" />
			<text class='cuIcon-discover text-black'></text>
		</view>
		<select-index-muplt-sync title="材质" :v="formData.productMaterial" :req="false" name="getProductMaterialAllApi"
			v-model="formData.productMaterial"></select-index-muplt-sync>
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
			<picker mode="date" :value="formData.arrivalTime" start="2024-01-01" end="2025-09-01"
				@change="arrivalTimePickerChange">
				<view class="picker">
					{{formData.arrivalTime}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">入库时间</view>
			<picker mode="date" :value="formData.inTime" start="2024-01-01" end="2025-09-01"
				@change="inTimePickerChange">
				<view class="picker">
					{{formData.inTime}}
				</view>
			</picker>
		</view>
		<select-index-single-sync :v="formData.user" title="买手" :req="false" name="getAllUserApi"
			v-model="formData.buyer"></select-index-single-sync>
		<select-index-muplt-sync :v="formData.productTag" title="标签" :req="false" name="getProductTagAllApi"
			v-model="formData.productTag"></select-index-muplt-sync>
		<select-index-muplt-sync :v="formData.productAttach" title="附件" :req="false" name="getProductAttachAllApi"
			v-model="formData.productAttach"></select-index-muplt-sync>

		<view class="cu-form-group  align-start">
			<view class="title">备注</view>
			<textarea maxlength="-1" v-model="formData.description" placeholder="请输入"></textarea>
		</view>
		<view style="height:30rpx">

		</view>
	</view>

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

	import pickerSingle from "@/components/pickerSingle.vue";
	import selectIndexSingleSync from "@/components/selectIndexSingleSync.vue";
	import selectIndexMupltSync from "@/components/selectIndexMupltSync.vue";
	import pickerMuplt from "@/components/pickerMuplt.vue";

	import {
		getProductOriginAllApi,
		addProductInfoApi,
		updateProductInfoApi,
		deleteProductInfoApi
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
		getOriginList();
		if (_id) {
			title.value = "产品编辑";
			getOne(_id);
		} else {
			title.value = "产品添加";
			getMySelf();
		}
	});


	const getMySelf = function() {
		if (!_id) {
			getUserInfoApi().then(res => {
				if (res.status == 200) {
					formData.value.user = res.data
					formData.value.buyer = res.data.id;
				} else {
					errorToast(res.message || `获取用户信息错误`)
				}
			}).catch(res => {
				errorToast(res.message || `获取用户信息错误`)
			});
		}
	}


	const arrivalTimePickerChange = function(e) {
		formData.value.arrivalTime = e.detail.value;
	}

	const inTimePickerChange = function(e) {
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

	//编辑
	import {
		getProductInfoOneApi
	} from '@/api/product.info';

	const formData = ref({
		inTime: moment().format('YYYY-MM-DD'),
		arrivalTime: moment().format('YYYY-MM-DD')
	});
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

				formData.value.inTime = moment(formData.value.inTime).format('YYYY-MM-DD');
				formData.value.arrivalTime = moment(formData.value.arrivalTime).format('YYYY-MM-DD');

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

		const params = JSON.parse(JSON.stringify(formData.value));
		params["staticList"] = staticList;

		// const params = {
		// 	title,
		// 	productTypeId,
		// 	productQualityId,
		// 	productCategoryId,
		// 	productOriginId,
		// 	originName,
		// 	productStoreId,
		// 	staticList,
		// 	no,
		// 	costPrice: _.get(formData, "value.costPrice"),
		// 	sellingPrice: _.get(formData, "value.sellingPrice"),
		// 	peerPrice: _.get(formData, "value.peerPrice"),
		// 	liveBroadcastPrice: _.get(formData, "value.liveBroadcastPrice"),
		// 	counterPrice: _.get(formData, "value.counterPrice"),
		// 	type: _.get(formData, "value.type"),
		// 	laserMarking: _.get(formData, "value.laserMarking"),
		// 	forPeople: _.get(formData, "value.forPeople") + 1,
		// 	size: _.get(formData, "value.size") + 1,
		// 	productMaterial: _.get(formData, "value.productMaterial"),
		// 	color: _.get(formData, "value.color"),
		// 	count: _.get(formData, "value.count"),
		// 	arrivalTime: _.get(formData, "value.arrivalTime", _.get(arrivalTimeIndex, "value")),
		// 	inTime: _.get(formData, "value.inTime", _.get(inTimeIndex, "value")),
		// 	buyer: _.get(formData, "value.buyer"),
		// 	productTag: _.get(formData, "value.productTag"),
		// 	productAttach: _.get(formData, "value.productAttach"),
		// 	description: _.get(formData, "value.description"),
		// 	status: 1,
		// 	workflow: 2,
		// 	staticList,
		// 	sizes: _.get(formData, "value.sizes")
		// }

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
		deleteProductInfoApi(_id).then(res => {
			if (res.status === 200) {
				successToast(`删除成功，正在为您跳转`);
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/product/info/index"
					})
				}, 1000)
			} else {
				errorToast(res.message || `产品删除错误`)
			}
		}).catch(res => {
			errorToast(res.message || `产品删除错误`)
		})
	}

	const alertDialog = ref(null);
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
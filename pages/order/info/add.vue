<template>
	<list-header class="header_fixed" :title="title">
		<button v-if="updatePowerEnable || createEnable" class="cu-btn bg-purple mr-10" style="margin-right: 5px;"
			@click="add" :disabled="disabled">
			<text class="cuIcon-add"></text> 提交
		</button>
		<button v-if="deletePowerEnable && _id" class="cu-btn bg-red" @click="deleteItem">
			<text class="cuIcon-delete"></text> 撤销
		</button>
	</list-header>
	<scroll-view scroll-y="true" class="DrawerPage_NoFixed card_fixed" :class="modalName=='viewModal'?'show':''">
		<uni-card>
			<view class="form_list">
				<view class="cu-form-group">
					<view class="title">产品选择 *</view>
					<view style="text-align: right;"><button @click="showModal" data-target="viewModal">选择</button>
					</view>
				</view>
				<uni-list style="margin: 0 15px; text-align: left;">
					<!-- <view class="cu-list menu sm-border card-menu mt-10"> -->
					<template v-for="(item, index) in products" :key="index">
						<uni-list-item :title="item.title" clickable :note="item.originName" showArrow
							:thumb="item.staticList.split(',')[0]" thumb-size="lg" @click="deleteProduct(item)"
							rightText="删除" />
					</template>
				</uni-list>
			</view>
		</uni-card>

		<view class="form_split"> -------- 基本信息 -------- </view>
		<uni-card>
			<view class="form_list">
				<select-index-single-sync title="客户" :v="formData.customer" :req="true" name="getCustomerAllApi"
					v-model="formData.customerId">
				</select-index-single-sync>
				<picker-muplt title="销售途径" :req="true" :v="formData.salesChannels" name="getSalesChannelsAllInfoApi"
					v-model="formData.salesChannelsId"></picker-muplt>
				<view class="cu-form-group">
					<view class="title">发货状态 *</view>
					<uni-data-checkbox class="smallCheck" mode="tag" v-model="formData.sendStatus"
						:localdata="expressStatusMap"></uni-data-checkbox>
				</view>

				<view class="cu-form-group">
					<view class="title">应收金额</view>
					<input type="number" v-model="formData.amountReceivable" placeholder="请输入" />
				</view>
				<view class="cu-form-group">
					<view class="title">收款账户 *</view>
					<input type="text" v-model="formData.account" placeholder="请输入" />
				</view>
				<view class="cu-form-group">
					<view class="title">收到金额 *</view>
					<input type="number" v-model="formData.money" placeholder="请输入" />
				</view>
				<select-index-single-sync :v="formData.salerUser" title="主要销售" :req="true" name="getAllUserApi"
					v-model="formData.saler"></select-index-single-sync>
				<select-index-single-sync :v="formData.heplerUser" title="辅助销售" :req="false" name="getAllUserApi"
					v-model="formData.hepler"></select-index-single-sync>
				<view class="cu-form-group">
					<view class="title">销售时间 *</view>
					<picker mode="date" :value="formData.saleTime" start="2024-01-01" end="2025-09-01"
						@change="salerTimePickerChange">
						<view class="picker">
							{{formData.saleTime}}
						</view>
					</picker>
				</view>


			</view>
		</uni-card>
		<view class="form_split"> -------- 凭证(可选) -------- </view>
		<uni-card>
			<sunui-upimg class="smallContent" style="margin-top: 5px !important;"
				url="http://192.168.5.46:3001/static/upload" ref="iconRef" title="上传" @upload="handleLoaded"
				:before-upload="handleChange" :number="9">
				<template v-slot:icon>
					<text class="s-add-list-btn-icon">+</text>
				</template>
			</sunui-upimg>
		</uni-card>
		<view class="form_split"> -------- 其他(可选) -------- </view>

		<uni-card>
			<view class="cu-form-group  align-start">
				<view class="title">备注</view>
				<textarea maxlength="-1" v-model="formData.desc" placeholder="请输入"></textarea>
			</view>
		</uni-card>


	</scroll-view>
	<view class="DrawerClose" :class="modalName=='viewModal'?'show':''" @tap="hideModal">
		<text class="cuIcon-pullright"></text>
	</view>
	<scroll-view scroll-y class="DrawerWindow DrawerWindow-top-search default_body"
		:class="modalName=='viewModal'?'show':''">
		<you-scroll @onPullDown="onPullDown" @onLoadMore="onLoadMore" scroll-y="true">
			<uni-list style="margin: 0 15px;">
				<template v-for="(item, index) in list" :key="index">
					<uni-list-item :title="item.title" clickable :note="item.originName" showArrow
						:thumb="item.staticList.split(',')[0]" thumb-size="lg" @click="addProduct(item)"
						rightText="选择" />
				</template>
			</uni-list>
		</you-scroll>
		<view class="search_body form_card">
			<view class="search_action_top">
				<uni-search-bar @confirm="search" :focus="true" v-model="search.keywords" @input="doSearch"
					@cancel="clear" @clear="clear">
				</uni-search-bar>
				<cc-dropDownMenu :titleArr="titleArr" :dropArr="dropArr"
					@finishDropClick="finishClick"></cc-dropDownMenu>
			</view>
		</view>
	</scroll-view>

	<uni-popup ref="alertDialog" type="dialog">
		<uni-popup-dialog type="warn" cancelText="关闭" confirmText="同意" title="通知" content="确定要撤销订单,撤销后不可恢复?"
			@confirm="dialogConfirm"></uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
	import {
		isLogin
	} from '@/common/login';
	import listHeader from "@/components/listHeader.vue"
	import pickerSingle from "@/components/pickerSingle.vue";
	import pickerMuplt from "@/components/pickerMuplt.vue";
	import youScroll from '@/components/you-scroll.vue'
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		errorToast,
		successToast
	} from "@/common/toastHelper";
	import {
		checkPowerCommon
	} from "@/common/power";
	import {
		ref
	} from 'vue';
	import _, {
		get
	} from "lodash";
	import selectIndexSingleSync from "@/components/selectIndexSingleSync.vue";
	import selectIndexMupltSync from "@/components/selectIndexMupltSync.vue";
	import {
		expressStatusMap,
		productOrderSearch
	} from '@/common/enum';
	import moment from "moment";
	import {
		getUserInfoApi
	} from '@/api/user';
	import {
		getProductAllInfoApi,
		getProductStorehouseAllApi
	} from '@/api/product.info';
	import {
		throttle
	} from "@/common/common.js"
	import {
		addOrderApi,
		canncelOrderApi,
		getOrderOneApi
	} from "@/api/order.js"

	isLogin();

	let _id;
	const title = ref("");
	const disabled = ref(false);
	onLoad((options) => {
		if (options.id) _id = options.id;

		if (_id) {
			disabled.value = true;
			title.value = "订单编辑";
			getOne(_id)
		} else {
			disabled.value = false;
			title.value = "订单添加";
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

	//API
	const formData = ref({
		saleTime: moment().format('YYYY-MM-DD')
	});
	const products = ref([]);

	const deleteProduct = function(record) {
		const index = products.value.findIndex((item) => item.id === record.id);
		if (index !== -1) {
			products.value.splice(index, 1);
		}
	}

	const getOne = function(id) {
		getOrderOneApi(id).then(res => {
			if (res.status == 200) {
				const result = JSON.parse(JSON.stringify(res.data));
				formData.value = result;
				products.value = result.products;
				formData.value.saleTime = moment(result.saleTime).format('YYYY-MM-DD');
				const imgString = result.img;
				console.log(imgString)
				if (!!imgString) {
					console.log(imgString)
					const imgs = imgString.split(',');
					console.log(imgs)
					iconRef.value.setItems(imgs);
				}
			} else {
				errorToast(res.message || "获取订单出错");
			}
		}).catch(res => {
			errorToast(res.message || "获取订单出错")
		})
	}

	const dialogConfirm = function() {
		if (_id) {
			canncelOrderApi(_id).then(res => {
				if (res.status == 200) {
					successToast("撤销订单成功");
					setTimeout(() => {
						uni.navigateTo({
							url: "/pages/order/info/list"
						})
					}, 1000)
				} else {
					errorToast(res.message || "获取订单出错");
				}
			}).catch(res => {
				errorToast(res.message || "获取订单出错")
			})
		}
	}

	const alertDialog = ref(null);
	const deleteItem = function() {
		if (_id) {
			alertDialog.value.open()
		}
	}

	const addProduct = function(record) {
		if (!products.value) {
			products.value = [];
		}

		const result = products.value.find(item => {
			return item.id == record.id;
		})

		if (result) {
			errorToast("这个产品已经选中过了");
			return;
		}

		products.value.push(record);
		hideModal();
	}

	const add = function() {
		if (products.value.length == 0) {
			errorToast(`请至少选择一个产品`);
			return;
		}

		if (formData.value.customerId == undefined || formData.value.customerId == null || formData.value.customerId <
			1) {
			errorToast(`请选择客户`);
			return;
		}

		if (formData.value.salesChannelsId == undefined || formData.value.salesChannelsId == null || formData.value
			.salesChannelsId <
			1) {
			errorToast(`请选择销售途径`);
			return;
		}

		if (formData.value.sendStatus == undefined || formData.value.sendStatus == null || formData.value
			.sendStatus <
			1) {
			errorToast(`请选择发货状态`);
			return;
		}

		if (!formData.value.account) {
			errorToast(`请输入收款账户`);
			return;
		}

		if (formData.value.money == undefined || formData.value.money == null || formData.value
			.money <
			1) {
			errorToast(`请输入收到金额`);
			return;
		}

		if (formData.value.saler == undefined || formData.value.saler == null || formData.value
			.saler <
			1) {
			errorToast(`请选择主要销售`);
			return;
		}

		if (!formData.value.saleTime) {
			errorToast(`请选择销售时间`);
			return;
		}

		const params = JSON.parse(JSON.stringify(formData.value));
		params.img = formIcon.value.join(',');
		params.productIds = products.value.map(item => item.id).join(',');

		addOrderApi(params).then(res => {
			if (res.status == 200) {
				successToast("创建订单成功");
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/order/info/list"
					});
				}, 1000);
			} else {
				errorToast(res.message || "创建订单出错");
			}
		}).catch(res => {
			errorToast(res.message || "创建订单出错")
		})
	}

	//////////////////////////// Search API
	const titleArr = ref(["仓库", "排序"]);
	const dropArr = ref([
		[],
		[{
			text: "不限",
			value: null
		}].concat(productOrderSearch.map((item, index) => ({
			text: item,
			value: index
		})))
	])

	let pageNumber = 1;
	let total = 0;
	const search = ref({
		productStoreId: null,
		order: null,
		keywords: null,
		status: 2
	});
	const list = ref([])
	const likeArr = ["name", "no", "intention_type", "customer_tag"]
	const getList = function(isClear) {

		const params = JSON.parse(JSON.stringify(search.value));

		return getProductAllInfoApi(pageNumber, params).then(res => {
			if (_.get(res, "status") == 200) {
				list.value = isClear ? res.data.results : list.value.concat(res.data.results);
				total = res.data.total;
			} else {
				errorToast(_.get(res, "message", "获取产品列表出错"));
			}
		}).catch(res => {
			errorToast(_.get(res, "message", "获取产品列表出错"));
		})
	}

	const onLoadMore = function(done) {
		const pageCount = Math.ceil(total / 20);
		if (pageCount > pageNumber) {
			pageNumber += 1;
			getList().then(() => {
				done();
			})
		}
	}

	const onPullDown = function(done) {
		pageNumber = 1;
		getList(true).then(() => {
			done();
		})
	}

	getList(true);

	const doSearch = throttle(function() {
		pageNumber = 1;
		getList(true);
	}, 1000);

	const finishClick = function(resultData) {
		search.value.productStoreId = resultData[0] ? resultData[0] : null;
		search.value.order = resultData[1] ? resultData[1] : null;
		getList(true);
	}

	const clear = function() {
		search.value = {
			productStoreId: null,
			order: null,
			keywords: null,
			status: 2
		}
	}

	function getStoreHouse() {
		getProductStorehouseAllApi().then(res => {
			if (res.status === 200) {
				const r = res.data.map(item => ({
					text: item.name,
					value: item.id
				}));

				dropArr.value[0] = [{
					text: "不限",
					value: null
				}].concat(r);


			} else {
				errorToast(ex.message || "获取仓库数据出错")
			}
		}).catch(ex => {
			errorToast(ex.message || "获取仓库数据出错")
		})
	}
	getStoreHouse()


	//辅助方法
	const salerTimePickerChange = function(e) {
		formData.value.saleTime = e.detail.value;
	}

	const getMySelf = function() {
		if (!_id) {
			getUserInfoApi().then(res => {
				if (res.status == 200) {
					formData.value.salerUser = res.data
					formData.value.saler = res.data.id;
				} else {
					errorToast(res.message || `获取用户信息错误`)
				}
			}).catch(res => {
				errorToast(res.message || `获取用户信息错误`)
			});
		}
	}


	//抽屉模块
	const modalName = ref(null);

	function hideModal(e) {
		modalName.value = null
	}

	function showModal(e) {
		modalName.value = e.currentTarget.dataset.target
	}
</script>

<style scoped>
	.uni-card {
		padding: 0 !important;
	}
</style>
<template>
	<list-header class="header_fixed" :title="title">
		<button class="cu-btn bg-purple" v-if="updatePowerEnable || createEnable" @click="add">
			<text class="cuIcon-add"></text> 提交
		</button>
		&nbsp;
		<button class="cu-btn bg-red" v-if="deletePowerEnable && id" @click="openDeleteDialog">
			<text class="cuIcon-delete"></text> 删除
		</button>
	</list-header>

	<scroll-view scroll-y="true" class="card_fixed">
		<uni-card>


			<form>
				<view class="cu-form-group">
					<view class="uni-padding-wrap">
						<uni-forms-item class="mt-30">
							<uni-easyinput class="input-border-bottom " type="text" :inputBorder="false"
								v-model="formData.name" placeholder="请输入角色名称" prefix-icon="contact"></uni-easyinput>
						</uni-forms-item>
						<uni-forms-item class="mt-30">
							<view><uni-data-checkbox selectedColor="red" selectedTextColor="red"></uni-data-checkbox>
							</view>
							<text class=''>选择权限</text> &nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" @click="selectAll"
								class="text_no_link">全选</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;"
								@click="cancelAll" class="text_no_link">全不选</a>
							<uni-data-checkbox multiple mode="list" v-model="formData.value" empty-text="正在加载数据"
								:localdata="range"></uni-data-checkbox>
						</uni-forms-item>
					</view>
				</view>
			</form>
		</uni-card>
	</scroll-view>


	<uni-popup ref="alertDialog" type="dialog">
		<uni-popup-dialog type="warn" cancelText="关闭" confirmText="同意" title="通知" content="确定要删除,删除后不可恢复?"
			@confirm="deleteRole"></uni-popup-dialog>
	</uni-popup>
</template>

<script>
	import listHeader from '@/components/listHeader.vue'
	import {
		getAllRoleApi,
		getAllPowerApi,
		addRoleApi,
		getRoleByIdApi,
		editRoleApi,
		deleteRoleApi
	} from '@/api/role.js'
	import {
		errorToast,
		successToast
	} from '@/common/toastHelper'
	import {
		checkPowerCommon
	} from '@/common/power'
	export default {
		components: {
			listHeader
		},
		data() {
			return {
				title: "角色添加",
				id: 0,
				formData: {
					name: "",
					value: ""
				},
				range: [],
				createEnable: false,
				findOnePowerEnable: false,
				updatePowerEnable: false,
				deletePowerEnable: false,
			}
		},
		methods: {
			selectAll() {
				const p = this.range.map(item => item.value)
				this.formData.value = p;
			},
			cancelAll() {
				this.formData.value = ""
			},
			openDeleteDialog() {
				this.$refs.alertDialog.open()
			},
			deleteRole() {
				if (this.id) {
					deleteRoleApi(this.id).then(res => {
						if (res.status == 200) {
							successToast("角色删除成功");
							setTimeout(() => {
								uni.navigateTo({
									url: "/pages/index/role/roleList"
								})
							}, 1000)
						} else {
							errorToast(res.message || `删除角色出错`)
						}
					}).catch(res => {
						errorToast(res.message || `删除角色出错`)
					})
				}
			},
			add() {
				if (this.formData.name.length < 2 || this.formData.name.length > 20) {
					errorToast(`名称长度必须超过1位且不超过20位`)
					return
				}

				if (!Array.isArray(this.formData.value) || this.formData.value.length == 0) {
					errorToast(`请至少选择一个权限`)
					return
				}

				let p;
				if (this.id) {
					p = editRoleApi(this.id, {
						name: this.formData.name,
						powers: this.formData.value
					})
				} else {
					p = addRoleApi({
						name: this.formData.name,
						powers: this.formData.value
					})
				}

				p.then(res => {
					if (res.status == 200) {
						successToast(`角色写入成功，正在为您跳转`);
						setTimeout(() => {
							uni.navigateTo({
								url: "/pages/index/role/roleList"
							})
						}, 1000)
					} else {
						errorToast(res.message || "角色写入失败")
					}
				}).catch(res => {
					errorToast(res.message || "角色写入失败")
				})
			}
		},
		onLoad(option) {
			if (option && option.id) {
				this.title = "角色编辑"
				this.id = option.id;
				getRoleByIdApi(option.id).then(res => {
					if (res.status == 200) {
						const result = res.data;
						this.formData.value = result.rolePowers.map(item => {
							return item.powerName
						});
						this.formData.name = res.data.name
					} else {
						errorToast(res.message || "获取权限列表失败")
					}
				}).catch(res => {
					errorToast(res.message || "获取权限列表失败")
				})
			}
		},
		onReady() {
			getAllPowerApi().then(res => {
				if (res.status == 200) {
					const result = res.data.map(item => {
						return {
							text: item.name,
							value: item.key
						}
					});
					this.range = result;
				} else {
					errorToast(res.message || "获取权限列表失败")
				}
			}).catch(res => {
				errorToast(res.message || "获取权限列表失败")
			})

			//权限
			const {
				createPowerEnable,
				findOnePowerEnable,
				updatePowerEnable,
				deletePowerEnable
			} = checkPowerCommon("RoleController");

			if (!findOnePowerEnable) {
				errorToast(`您没有权限访问这个模块，正在为您跳转`);
				setTimeout(() => {
					uni.navigateTo({
						url: "/pages/index/functions"
					})
				}, 1000);
			}

			this.createEnable = createPowerEnable;
			this.findOnePowerEnable = findOnePowerEnable;
			this.updatePowerEnable = updatePowerEnable;
			this.deletePowerEnable = deletePowerEnable;

		}
	}
</script>

<style scoped>

</style>
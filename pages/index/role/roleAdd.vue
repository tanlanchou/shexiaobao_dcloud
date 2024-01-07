<template>
	<list-header :title="title">
		<button class="cu-btn bg-purple" @click="add">
			<text class="cuIcon-add"></text> 提交
		</button>
		&nbsp;
		<button class="cu-btn bg-red" @click="add">
			<text class="cuIcon-delete"></text> 删除
		</button>
	</list-header>

	<uni-card>
		<form>
			<view class="cu-form-group">
				<view class="uni-padding-wrap">
					<uni-forms-item class="mt-30">
						<uni-easyinput class="input-border-bottom " type="text" :inputBorder="false"
							v-model="formData.name" placeholder="请输入角色名称" prefix-icon="contact"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item class="mt-30">
						<view><uni-data-checkbox selectedColor="red" selectedTextColor="red"></uni-data-checkbox></view>
						<text class=''> 选择权限</text>
						<uni-data-checkbox multiple mode="list" v-model="formData.value" empty-text="正在加载数据"
							:localdata="range"></uni-data-checkbox>
					</uni-forms-item>
				</view>
			</view>
		</form>
	</uni-card>
</template>

<script>
	import listHeader from '@/components/listHeader.vue'
	import {
		getAllRoleApi,
		getAllPowerApi,
		addRoleApi,
		getRoleByIdApi,
		editRoleApi
	} from '@/api/role.js'
	import {
		errorToast,
		successToast
	} from '../../../common/toastHelper'
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
				range: []
			}
		},
		methods: {
			add() {
				if (this.formData.name.length < 2 || this.formData.name.length > 20) {
					errorToast(`名称长度必须超过1位且不超过20位`)
					return
				}
				console.log(this.formData.value)
				if (this.formData.value.lenght > 5) {
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
							uni.navigateBack({
								delta: 1
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
		}
	}
</script>

<style scoped>

</style>
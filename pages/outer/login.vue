<template>
	<view class="outer">
		<div class="main">
			<uni-section class="mt-30" title="欢迎登录" sub-title="奢小墩" type="line">
				<view class="uni-padding-wrap mt-30">
					<uni-segmented-control :current="current" :values="items" :style-type="styleType"
						active-color="#007aff" @clickItem="onClickItem" />
				</view>
				<view>
					<view v-if="current === 0">
						<uni-card class="card_no_border mt-20">
							<uni-forms :modelValue="formData">
								<uni-forms-item name="phone">
									<uni-easyinput class="input-border-bottom " :inputBorder="false" type="number"
										v-model="formData.phone" prefix-icon="phone" placeholder="请输入手机号"
										maxlength="15" />
								</uni-forms-item>
								<uni-forms-item name="password">
									<uni-easyinput style="border-bottom: 1px solid #dddddd;" :inputBorder="false"
										type="password" maxlength="20" prefix-icon="locked" v-model="formData.password"
										placeholder="请输入密码" />
								</uni-forms-item>
							</uni-forms>

							<button size="default" type="default"
								style="color:#ffffff;backgroundColor:#1AAD19;borderColor:#1AAD19" hover-class="is-hover"
								@click='login'>登录</button>

							<view class="mt-20" style="text-align: right;">
								<a href="javascript:;" @click="gotoRegister">注册</a> &nbsp;&nbsp; <a href="javascript;"
									@click="gotoForget">忘记密码？</a>
							</view>
						</uni-card>
					</view>
					<view v-if="current === 1">
						<uni-card class="card_no_border mt-20">
							<uni-forms :modelValue="formData">
								<uni-forms-item name="name">
									<uni-easyinput class="input-border-bottom " :inputBorder="false" type="number"
										v-model="formData.phone" prefix-icon="phone" placeholder="请输入手机号"
										maxlength="15" />
								</uni-forms-item>
								<uni-forms-item label-width="100" label-position="top">
									<c-code v-model:value="formData.code" :phone="formData.phone"></c-code>
								</uni-forms-item>
							</uni-forms>
							<button size="default" type="default"
								style="color:#ffffff;backgroundColor:#1AAD19;borderColor:#1AAD19" hover-class="is-hover"
								@click='loginWithSms'>登录</button>
							<view>
								注册
							</view>
							<view class="mt-20" style="text-align: right;">
								<a href="javascript:;" @click="gotoRegister">注册</a>
								&nbsp;&nbsp;
								<a href="javascript;" @click="gotoForget">忘记密码？</a>
							</view>
						</uni-card>
					</view>

				</view>
			</uni-section>
		</div>
	</view>
</template>

<script>
	import {
		clearSyncStorage,
		isUnLogin,
		setToken
	} from '@/common/login.js'
	import {
		loginApi,
		loginWithSmsApi
	} from '../../api/outer';
	import {
		errorToast,
		successToast
	} from '../../common/toastHelper';
	import {
		phoneValid
	} from '../../common/valid';
	import cCode from "@/components/cCode.vue"
	import * as crypto from 'crypto-js'

	export default {
		components: {
			cCode
		},
		data() {
			return {
				formData: {},
				items: ['密码登录', '验证码登录'],
				current: 0,
				styleType: 'text'
			}
		},
		onReady() {
			if (isUnLogin()) {
				clearSyncStorage();
			}
		},
		onLoad() {

		},
		methods: {
			onClickItem: function(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			gotoForget() {
				uni.redirectTo({
					url: "forget"
				})
			},
			gotoRegister() {
				uni.redirectTo({
					url: "register"
				})
			},
			loginWithSms() {
				if (!phoneValid(this.formData.phone)) {
					errorToast(`请输入正确的手机号`)
					return
				}

				if (this.formData.code.length !== 4) {
					errorToast(`验证码长度必须为4位`)
					return
				}

				loginWithSmsApi({
					phone: this.formData.phone,
					code: this.formData.code
				}).then(res => {
					if (res.status == 200) {
						const token = res.data;
						setToken(token);
						successToast("登录成功，正在为您跳转");
						setTimeout(() => {
							uni.redirectTo({
								url: "/pages/index/index"
							})
						}, 1000);
					} else {
						errorToast(res.message || "登录失败，请稍后再试")
					}
				})
			},
			login() {
				if (!phoneValid(this.formData.phone)) {
					errorToast(`请输入正确的手机号`)
					return
				}

				if (this.formData.password.length < 4 || this.formData.password.length > 20) {
					errorToast(`密码长度必须超过3位且不超过20位`)
					return
				}

				let hash = crypto.MD5(this.formData.password).toString(crypto.enc.Hex)
				loginApi({
					phone: this.formData.phone,
					password: hash
				}).then(res => {
					if (res.status == 200) {
						const token = res.data;
						setToken(token);
						successToast("登录成功，正在为您跳转");
						setTimeout(() => {
							uni.redirectTo({
								url: "/pages/index/index"
							})
						}, 1000);
					} else {
						//提示用户错误
						errorToast(res.message || "登录失败，请稍后再试")
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
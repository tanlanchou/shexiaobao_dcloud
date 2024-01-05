<template>
	<view class="outer">
		<div class="main">
			<uni-section class="mt-30" title="欢迎注册" sub-title="奢小墩" type="line">
				<view class="uni-padding-wrap">
					<uni-forms-item class=" mt-30">
						<uni-easyinput class="input-border-bottom " type="number" :inputBorder="false" v-model="phone"
							placeholder="请输入手机号" prefix-icon="phone" @input="validatePhone"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label-width="100" label-position="top">
						<section style="display: flex;">
							<uni-easyinput maxlength="4" type="number" class="input-border-bottom " :inputBorder="false"
								v-model="code" style="margin-right: 15px;" placeholder="请输入验证码">

							</uni-easyinput>
							<button type="default" class="btn_green" style="max-width: 100px;" size="mini"
								v-text="codeText" @click="sendCode"></button>

						</section>
					</uni-forms-item>
					<uni-forms-item>
						<uni-easyinput class="input-border-bottom " prefix-icon="contact" :inputBorder="false"
							v-model="nickName" type="text" placeholder="请输入昵称"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item>
						<uni-easyinput class="input-border-bottom " prefix-icon="locked" :inputBorder="false"
							v-model="password" type="password" placeholder="请输入密码"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item>
						<uni-easyinput class="input-border-bottom " prefix-icon="locked" :inputBorder="false"
							v-model="repeatPassword" type="password" placeholder="请再次输入密码"></uni-easyinput>
					</uni-forms-item>

					<uni-forms-item>
						<uni-button type="primary" @click="register">注册</uni-button>
						<uni-button class="mt-10" @click="backToLogin">返回登录</uni-button>
					</uni-forms-item>
				</view>
			</uni-section>
		</div>
	</view>
</template>

<script>
	import {
		getSmsCode,
		registerApi
	} from '../../api/outer';
	import {
		phoneValid
	} from '@/common/valid.js'
	import {
		errorToast,
		loadingToast,
		successToast
	} from '../../common/toastHelper';
	import * as crypto from 'crypto-js'



	export default {
		data() {
			return {
				phone: '',
				code: '',
				password: '',
				repeatPassword: '',
				canSendCode: true,
				nickName: '',
				codeText: "发送验证码"
			}
		},
		methods: {
			backToLogin() {
				uni.redirectTo({
					url: "login"
				})
			},
			validatePhone() {
				if (!phoneValid(this.phone)) {
					//errorToast(`请输入正确的手机号`);
				}
			},
			sendCode() {
				if (!this.canSendCode) {
					errorToast(`请等待一分钟后再试`)
					return
				}

				if (!phoneValid(this.phone)) {
					errorToast(`请输入正确的手机号`);
					return
				}

				loadingToast(`正在发送验证码`);

				getSmsCode(this.phone).then(res => {
					uni.hideLoading();
					if (res.status === 200) {
						successToast(`验证码发送成功`);
						this.canSendCode = false;
						let i = 60;
						let t = setInterval(() => {
							if (i < 1) {
								this.canSendCode = true;
								this.codeText = "发送验证码";
								clearInterval(t);
							} else {
								this.codeText = i--
							}
						}, 1000)
					} else {
						errorToast(res.message || "发送验证码失败, 请稍后再试", )
					}
				}).catch(err => {
					uni.hideLoading();
					errorToast("发送验证码失败, 请稍后再试");
				})

			},
			register() {
				if (this.password !== this.repeatPassword) {
					errorToast(`两次输入的密码不一致`)
					return
				}
				if (this.code.length !== 4) {
					errorToast(`验证码长度必须为4位`)
					return
				}
				if (this.password.length < 4 || this.password.length > 20) {
					errorToast(`密码长度必须超过3位且不超过20位`)
					return
				}
				if (this.password.length < 4 || this.password.length > 10) {
					errorToast(`昵称长度必须超过3位且不超过10位`)
					return
				}
				if (!phoneValid(this.phone)) {
					errorToast(`请输入正确的手机号`)
					return
				}

				let hash = crypto.MD5(this.password).toString(crypto.enc.Hex)

				registerApi({
					phone: this.phone,
					password: hash,
					code: this.code,
					nickName: this.nickName
				}).then(res => {
					if (res.status == 200) {
						successToast("注册成功, 为您跳转到登录")
					} else {
						errorToast(res.message || "注册失败, 请稍后再试", )
						console.error(res);
					}
				}).catch(err => {
					uni.hideLoading();
					console.error(err);
					errorToast("注册失败, 请稍后再试");
				})

			}
		}
	}
</script>

<style>
	.container {
		padding: 10px;
	}

	.content {
		margin-top: 20px;
	}
</style>
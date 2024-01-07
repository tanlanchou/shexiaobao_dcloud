<template>
	<view class="outer">
		<div class="main">
			<uni-section class="mt-30" title="忘记密码" sub-title="奢小墩" type="line">
				<view class="uni-padding-wrap">
					<uni-forms-item class=" mt-30">
						<uni-easyinput class="input-border-bottom " type="number" :inputBorder="false" v-model="phone"
							placeholder="请输入手机号" prefix-icon="phone"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label-width="100" label-position="top">
						<c-code :phone="phone" v-model:value="code"></c-code>
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
						<uni-button type="primary" @click="forget">修改密码</uni-button>
						<uni-button class="mt-10" @click="backToLogin">返回登录</uni-button>
					</uni-forms-item>
				</view>
			</uni-section>
		</div>
	</view>
</template>

<script>
	import {
		phoneValid
	} from '@/common/valid.js'
	import {
		errorToast,
		loadingToast,
		successToast
	} from '../../common/toastHelper';
	import * as crypto from 'crypto-js'
	import cCode from "@/components/cCode.vue"
	import {
		forgetPwdApi
	} from '../../api/outer';
	export default {
		components: {
			cCode
		},
		data() {
			return {
				phone: '',
				code: '',
				password: '',
				repeatPassword: '',
			}
		},
		methods: {
			backToLogin() {
				uni.redirectTo({
					url: "login"
				})
			},
			forget() {
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
				if (!phoneValid(this.phone)) {
					errorToast(`请输入正确的手机号`)
					return
				}

				let hash = crypto.MD5(this.password).toString(crypto.enc.Hex)

				forgetPwdApi({
					phone: this.phone,
					code: this.code,
					password: hash
				}).then(res => {
					if (res.status == 200) {
						successToast("修改密码成功, 为您跳转到登录");
						uni.redirectTo({
							url: '/pages/outer/login'
						})
					} else {
						errorToast(res.message || "修改密码失败, 请稍后再试", )
					}
				}).catch(err => {
					errorToast(err.message || "修改密码失败, 请稍后再试");
				})
			}
		}
	}
</script>

<style>
</style>
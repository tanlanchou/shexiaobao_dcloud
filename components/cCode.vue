<template>
	<section style="display: flex;">
		<uni-easyinput maxlength="4" type="number" class="input-border-bottom " :inputBorder="false" v-model="modelValue"
			style="margin-right: 15px;" placeholder="请输入验证码" @input="updateCode">

		</uni-easyinput>
		<button type="default" class="btn_green" style="width: 100px; line-height: 270%;" size="mini" v-text="codeText"
			@click="sendCode"></button>
	</section>
</template>

<script>
import { getSmsCode } from '../api/outer'
import { errorToast, loadingToast, successToast } from '../common/toastHelper'
import { phoneValid } from '../common/valid'
	export default {
		props: ["phone", "value"],
		data() {
			return {
				modelValue: "",
				canSendCode: true,
				codeText: "发送验证码"
			}
		},
		methods: {
			
			updateCode(v) {
				this.$emit('update:value', v)
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
			}
		}
	}
</script>

<style>
</style>
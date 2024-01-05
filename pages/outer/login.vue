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
								<uni-forms-item name="name">
									<uni-easyinput class="input-border-bottom "
										:inputBorder="false" type="number" v-model="formData.phone"
										placeholder="请输入手机号" />
								</uni-forms-item>
								<uni-forms-item name="age">
									<uni-easyinput style="border-bottom: 1px solid #dddddd;" :inputBorder="false"
										type="password" v-model="formData.password" placeholder="请输入密码" />
								</uni-forms-item>
							</uni-forms>
							<view>

							</view>
							<button size="default" type="default"
								style="color:#ffffff;backgroundColor:#1AAD19;borderColor:#1AAD19"
								hover-class="is-hover">登录</button>
							<button size="default" class="mt-10" type="default" plain="true"
								hover-class="is-hover" @click="gotoRegister">注册</button>
						</uni-card>
					</view>
					<view v-if="current === 1"><text class="content-text">选项卡2的内容</text></view>

				</view>
			</uni-section>
		</div>
	</view>
</template>

<script>
	import {
		isUnLogin
	} from '@/common/login.js'
	export default {

		data() {
			return {
				formData: {},
				items: ['密码登录', '验证码登录'],
				current: 0,
				styleType: 'text'
			}
		},
		onReady() {
			isUnLogin();
		},
		onLoad() {

		},
		methods: {
			onClickItem: function(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			gotoRegister() {
				uni.redirectTo({
					url: "register"
				})
			}
			
		}
	}
</script>

<style scoped lang="scss">

</style>
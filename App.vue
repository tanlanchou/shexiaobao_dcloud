<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import url('static/icon.css');
	@import url('static/animation.css');
	@import url('static/main.css');

	body {
		background-color: #f1f1f1;
	}

	.no-line {
		text-decoration: none;
		color: inherit;
	}

	.uni-toast {
		width: auto;
		height: auto;
	}

	// 内部样式重载
	.uni-toast__content {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		/* 设置最多显示的行数，根据需要可以适当调整 */
		overflow: hidden;
		word-break: break-all;
		margin: 15px 15px;
	}

	.t-drawer .uni-drawer__content {
		width: 100% !important;
	}


	.mb-10 {
		margin-bottom: 10px;
	}

	.mb-30 {
		margin-bottom: 30px;
	}

	.mt-40 {
		margin-top: 40px !important;
	}

	.mt-30 {
		margin-top: 30px !important;
	}

	.mt-20 {
		margin-top: 20px !important;
	}

	.mt-10 {
		margin-top: 10px !important;
	}

	.uni-padding-wrap {
		padding: 0px 30px;
	}

	.input-border-bottom {
		border-bottom: 1px solid #dddddd;
	}

	// card
	.card_no_border {
		border: none !important;
		box-shadow: none !important;
	}

	// button
	.btn_green {
		color: #ffffff;
		backgroundColor: #1AAD19;
		borderColor: #1AAD19
	}

	.outer {
		.main {
			width: 100%;
			height: 100%;

			.content {
				width: 80%;
				position: relative;
				transform: translateY(-100px);
			}
		}

		.uni-section__content-title {
			font-size: 30px !important;
		}

		.uni-section-header__content-sub {
			font-size: 18px !important;
		}

		.uni-section-header__decoration {
			height: 20px !important;
		}
	}








	// 全屏抽屉的css 开始 -------------------------------------------------	
	
	.cu-list.menu>.cu-item .content>uni-image {
		width: 2.6em;
	}

	page {
		width: 100vw;
		overflow: hidden;
	}

	.DrawerPage {
		position: fixed;
		width: 100vw;
		height: 100vh;
		left: 0vw;
		background-color: #f1f1f1;
		transition: all 0.4s;
	}

	.DrawerPage.show {
		transform: scale(0.9, 0.9);
		left: 85vw;
		box-shadow: 0 0 60upx rgba(0, 0, 0, 0.2);
		transform-origin: 0;
	}

	.DrawerWindow {
		position: absolute;
		width: 85vw;
		height: 100vh;
		left: 0;
		top: 0;
		transform: scale(0.9, 0.9) translateX(-100%);
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
		padding: 100upx 0;
	}

	.DrawerWindow.show {
		transform: scale(1, 1) translateX(0%);
		opacity: 1;
		pointer-events: all;
	}

	.DrawerClose {
		position: absolute;
		width: 40vw;
		height: 100vh;
		right: 0;
		top: 0;
		color: transparent;
		padding-bottom: 30upx;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.6));
		letter-spacing: 5px;
		font-size: 50upx;
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
	}

	.DrawerClose.show {
		opacity: 1;
		pointer-events: all;
		width: 15vw;
		color: #fff;
	}

	.DrawerPage .cu-bar.tabbar .action button.cuIcon {
		width: 64upx;
		height: 64upx;
		line-height: 64upx;
		margin: 0;
		display: inline-block;
	}

	.DrawerPage .cu-bar.tabbar .action .cu-avatar {
		margin: 0;
	}

	.DrawerPage .nav {
		flex: 1;
	}

	.DrawerPage .nav .cu-item.cur {
		border-bottom: 0;
		position: relative;
	}

	.DrawerPage .nav .cu-item.cur::after {
		content: "";
		width: 10upx;
		height: 10upx;
		background-color: currentColor;
		position: absolute;
		bottom: 10upx;
		border-radius: 10upx;
		left: 0;
		right: 0;
		margin: auto;
	}

	.DrawerPage .cu-bar.tabbar .action {
		flex: initial;
	}

	// 全屏抽屉的css 结束 -------------------------------------------------
</style>
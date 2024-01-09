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
	
	.t-drawer .uni-drawer__content  {
		width: 100% !important;
	}


	.mb-10 {
		margin-bottom: 10px;
	}

	.mb-30 {
		margin-bottom: 30px;
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
</style>
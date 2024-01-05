import {
	isLogin
} from "@/common/login.js"

const BASE_URL = 'http://localhost:3001'

const common = {
	baseUrl: BASE_URL,
	data: {},
	header: {
		'content-type': 'application/json',
		'content-type': 'application/x-www-form-urlencoded'
	},
	method: 'GET',
	dataType: 'json',
	isShowLoading: true
}
export default (options = {}) => {
	options.url = BASE_URL + options.url
	options.data = options.data || common.baseUrl
	options.header = options.header || common.header
	options.method = options.method || common.method
	options.dataType = options.dataType || common.dataType
	options.isShowLoading = true;
	if (options.isValid) {
		const token = isLogin();
		if (!token) {
			return;
		}

		options.header = {
			authorization: toekn
		};
	}


	if (options.isShowLoading) {
		uni.showLoading({
			title: '正在请求...'
		})
	}
	return new Promise((resolve, reject) => {
		uni.request({
			...options,
			success: res => {
				console.log('res', res)
				if (res.statusCode !== 200) {
					return reject()
				}
				return resolve(res.data)
			},
			fail: rej => {
				uni.showLoading({
					title: '请求发生错误, 请稍后再试'
				})
				return
			},
			complete: () => {
				if (options.isShowLoading) {
					uni.hideLoading()
				}
			}
		})
	})
}
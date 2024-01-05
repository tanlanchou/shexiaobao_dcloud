import {
	tokenKey
} from "@/common/enum.js"


export const isLogin = function() {
	const value = uni.getStorageSync(tokenKey);
	if (!value || value == '') {
		
		setTimeout(() => {
			uni.redirectTo({
				url: "../outer/login"
			})
		}, 1000)

		return;
	}
	return value;
}

export const isUnLogin = function() {
	const value = uni.getStorageSync(tokenKey);
	if (value) {
		
		setTimeout(() => {
			uni.redirectTo({
				url: "../index/index"
			})
		}, 1000)
		return;
	}
}
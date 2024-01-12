import {
	menuKey,
	powerListKey,
	tokenKey,
	userKey
} from "@/common/enum.js"


export const isLogin = function() {
	const value = uni.getStorageSync(tokenKey);
	if (!value || value == '') {

		setTimeout(() => {
			uni.redirectTo({
				url: "/pages/outer/login"
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
		return false;
	}
	return true;
}

export const setToken = function(token) {
	if (!token) return;
	uni.setStorageSync(tokenKey, token);
}

export const getToken = function() {
	return uni.getStorageSync(tokenKey);
}

export const clearSyncStorage = function() {
	uni.removeStorageSync(menuKey);
	uni.removeStorageSync(userKey);
	uni.removeStorageSync(powerListKey);
}

export const setUserStorage = function(user) {
	return uni.setStorageSync(userKey, user);
}

export const getUserStorage = function() {
	return uni.getStorageSync(userKey);
}

export const setMenuStorage = function(menu) {
	return uni.setStorageSync(menuKey, menu)
}

export const getMenuStorage = function() {
	return uni.getStorageSync(menuKey);
}

export const setPowerStorage = function(power) {
	return uni.setStorageSync(powerListKey, power)
}

export const getPowerStorage = function() {
	return uni.getStorageSync(powerListKey);
}
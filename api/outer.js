import request from "@/common/request.js";

export const getSmsCode = function(phone) {
	return request({
		url: `/users/sms/${phone}`,
		method: `get`,
	})
}

export const registerApi = function(data) {
	return request({
		url: `/users/register`,
		method: `post`,
		data
	})
}

export const loginApi = function(data) {
	return request({
		url: `/users/login`,
		method: `post`,
		data
	})
}

export const loginWithSmsApi = function(data) {
	return request({
		url: `/users/loginByCode`,
		method: `post`,
		data
	})
}

export const forgetPwdApi = function(data) {
	return request({
		url: `/users/forget`,
		method: `post`,
		data
	})
}
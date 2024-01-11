import request from "@/common/request.js";

export const getUserInfoApi = function() {
	return request({
		url: `/users/info`,
		method: `get`,
		isValid: true
	})
}

export const getUserInfoByIdApi = function(id) {
	return request({
		url: `/users/other/${id}`,
		method: `get`,
		isValid: true
	})
}

export const getAllUserByPageApi = function(page, data) {
	return request({
		url: `/users/page/${page}`,
		method: `get`,
		isValid: true,
		data
	})
}

export const updateUserInfoByIdApi = function(id, data) {
	return request({
		url: `/users/other/${id}`,
		method: `put`,
		isValid: true,
		data
	})
}

export const updateUserInfoApi = function(data) {
	return request({
		url: `/users/update`,
		method: `put`,
		isValid: true,
		data
	})
}
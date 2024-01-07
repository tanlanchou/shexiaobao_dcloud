import request from "@/common/request.js";

export const getUserInfoApi = function() {
	return request({
		url: `/users/info`,
		method: `get`,
		isValid: true
	})
}

export const getAllUserByPageApi = function(page) {
	return request({
		url: `/users/page/${page}`,
		method: `get`,
		isValid: true
	})
}
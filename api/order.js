import request from "@/common/request.js";

export const addOrderApi = function(data) {
	return request({
		url: `/order`,
		method: `post`,
		isValid: true,
		data
	})
}

export const getOrderAllApi = function(page, data) {
	console.log("data", data);
	return request({
		url: `/order/find/all/${page}`,
		method: `get`,
		isValid: true,
		data
	})
}

export const getOrderOneApi = function(id) {
	return request({
		url: `/order/${id}`,
		method: `get`,
		isValid: true,
	})
}

export const canncelOrderApi = function(id) {
	return request({
		url: `/order/status/cancel/${id}`,
		method: `put`,
		isValid: true,
	})
}




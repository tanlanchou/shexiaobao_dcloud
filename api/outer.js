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
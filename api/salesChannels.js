import request from "@/common/request.js";

export const getSalesChannelsAllInfoApi = function() {
	return request({
		url: `/sales/channels`,
		method: `get`,
		isValid: true
	})
}
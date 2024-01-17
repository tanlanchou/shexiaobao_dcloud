import request from "@/common/request.js";

export const getOriginOneApi = function(id) {
	return request({
		url: `/static/upload`,
		method: `post`,
		isValid: true
	})
}



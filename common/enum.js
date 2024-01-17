export const tokenKey = "token";
export const menuKey = "menu";
export const userKey = "user";
export const powerListKey = "power";
export const maxPage = 20;
export const userStatusForIndexSelect = [{
	letter: "J",
	data: ["禁用"]
}, {
	letter: "W",
	data: ["未通过验证"]
}, {
	letter: "Z",
	data: ["正常"]
}];

export const userStatus = {
	normal: 1,
	wxUser: 2,
	disable: 3,
	noVerification: 4
}

export const userStatusToWords = ["正常", "微信用户", "禁用", "未通过验证"];

export const intentionTypeMap = [{
	text: "消费",
	value: 1
}, {
	text: "回收",
	value: 2,
}, {
	text: "寄卖",
	value: 3
}];

export const sexMap = [{
	text: "女",
	value: 1
}, {
	text: "男",
	value: 2,
}];

export const customerMap = [{
	text: "直客",
	value: 1
}, {
	text: "同行",
	value: 2,
}];
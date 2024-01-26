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

export const productTypeMap = [{
	text: "现代",
	value: 1
}, {
	text: "中古",
	value: 2,
}];

export const productForPeopleMap = ["通用", "女", "男"];
export const productSizeMap = ["超迷你", "迷你", "小号", "中号", "大号", "超大号"];
export const productOrderSearch = ["入库时间降序", "入库时间升序", "到达时间降序", "到达时间升序", "成本价降序", "成本价升序", "销售价降序", "销售价升序", "同行价降序",
	"同行价升序", "直播价降序", "直播价升序", "专柜价降序", "专柜价升序"
];
export const userOrderSearch = ["创建时间降序", "创建时间升序", "登录时间降序", "登录时间降序"];
export const expressStatusMap = [{
	text: "未发货",
	value: 1
}, {
	text: "已发货",
	value: 2,
}];

export const orderStatusMap = [{
	text: "撤回",
	value: 2
}, {
	text: "正常",
	value: 1,
}];

export const prodcutStatusMap = [{
	text: "入库",
	value: 2
}, {
	text: "出库",
	value: 3,
}]
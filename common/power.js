import {
	getMenuStorage,
	getPowerStorage
} from "./login";


let powers, menus;
export const getCommonMenus = function() {
	if (!menus) menus = getMenuStorage();
	const commonMenus = menus.filter(item => item.common == 1 && checkPower(item.power));
	return commonMenus;
}

export const getMenusGroupByType = function() {
	if (!menus) menus = getMenuStorage();
	const m = menus.filter(item => checkPower(item.power));
	let result = m.reduce((acc, cur) => {
		if (!acc[cur.type]) {
			acc[cur.type] = [];
		}
		acc[cur.type].push(cur);
		return acc;
	}, {});

	return result;
}

export const checkPower = function(key) {
	if (!powers) powers = getPowerStorage();
	const result = powers.find(item => item.powerName == key)
	return !!result;
}
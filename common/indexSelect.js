import * as pinyin from "pinyin"

export const getFirstLetter = function(inputStr) {
	// 判断字符串是否为空
	if (!inputStr) {
		return null;
	}

	// 获取字符串的第一个字符
	const firstChar = inputStr[0];

	// 判断字符是否为中文，如果是中文则转换为拼音的首字母
	if (/[\u4e00-\u9fa5]/.test(firstChar)) {
		const pinyinArray = pinyin(firstChar, {
			style: pinyin.STYLE_FIRST_LETTER
		});
		return pinyinArray[0][0].toUpperCase();
	}

	// 如果是英文字符，则直接转换为大写字母
	return firstChar.toUpperCase();
}

export const filterArrayByIndex = function(arr) {
	if (arr.length > 0) {
		const list = {};
		for (let i = 0; i < arr.length; i++) {
			const words = arr[i];
			const firsterLetter = getFirstLetter(words);
			if (!list[firsterLetter]) {
				list[firsterLetter] = [];
			}
			list[firsterLetter].push(words);
		}

		const result = [];
		const keys = Object.keys(list);
		keys.forEach(key => {
			result.push({
				letter: key,
				data: list[key]
			})
		})
		return result;
	}
}
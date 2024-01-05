export const errorToast = function(title) {
	uni.showToast({
		title,
		icon: 'error',
		textStyle: {
			fontSize: '16px',
			lineHeight: '24px'
		}
	})
}

export const successToast = function(title) {
	uni.showToast({
		title,
		textStyle: {
			fontSize: '16px',
			lineHeight: '24px'
		}
	})
}

export const loadingToast = function(title) {
	uni.showLoading({
		title,
		mask: true,
		textStyle: {
			fontSize: '16px',
			lineHeight: '24px'
		}
	})
}
export default {
	data() {
		return {
			modalName: null
		}
	},
	methods: {
		hideModal(e) {
			this.modalName = null
		},
		showModal(e) {
			this.modalName = e.currentTarget.dataset.target
		},
	}
}
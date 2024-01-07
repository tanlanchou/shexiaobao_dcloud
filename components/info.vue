<template>
	<div class="user-info">
		<div class="left">
			<img class="avatar" :src="user.avatar || defaultAvatar" alt="Avatar">
			<div class="nickname">{{ user.nickname }}</div>
			<div class="role">{{ user.roleId }}</div>
		</div>
		<div class="right">
			<!-- 工具栏内容 -->
		</div>
	</div>
</template>

<script>
	export default {
		name: 'UserInfo',
		props: {
			user: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				defaultAvatar: '../static/avatar.jpg'
			}
		}
	}
</script>

<style scoped lang="scss">
	.user-info {
		width: 100%;
		display: flex;
		justify-content: space-between;

		.left {
			flex: 1;
			display: flex;

			.avatar {
				width: 50px;
			}
		}
		
		.right {
			width: 100%;
			flex: 1;
			margin-left: 20px;
		}
	}




</style>
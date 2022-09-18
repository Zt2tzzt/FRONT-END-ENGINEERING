<script setup>
import { computed } from 'vue'

const props = defineProps({
	itemData: {
		type: Object,
		default: () => ({})
	}
})
const titleInfo = computed(() => ({
	text: props.itemData.verify_info.messages.join(' '),
	color: props.itemData.verify_info.text_color
}))
const bottomInfo = computed(() => ({
	content: props.itemData.bottom_info.content,
	style: {
		color: props.itemData.bottom_info.content_color,
		fontSize: props.itemData.bottom_info.font_size + 'px'
	}
}))
</script>

<template>
	<li class="room-item">
		<div class="item-inner">
			<div class="cover">
				<img :src="itemData.picture_url" alt="" />
			</div>
			<div class="info">
				<div class="title" :style="{ color: titleInfo.color }">
					{{ titleInfo.text }}
				</div>
				<div class="name">{{ itemData.name }}</div>
				<div class="price">{{ itemData.price_format + '/晚' }}</div>
				<div class="bottom-info" :style="bottomInfo.style">
					{{ bottomInfo.content }}
				</div>
			</div>
		</div>
	</li>
</template>

<style scoped lang="less">
.room-item {
	width: 33.333333%;

	.item-inner {
		margin: 0 8px 12px;
		color: #484848;
		font-weight: 800;

		img {
			width: 100%;
			border-radius: 3px;
		}

		.info {
			.title {
				margin-top: 8px;
				font-size: 12px;
			}

			.name {
				margin-top: 3px;
				font-size: 16px;

				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.price {
				margin: 3px 0;
				font-size: 14px;
				font-weight: 400;
			}
		}
	}
}
</style>

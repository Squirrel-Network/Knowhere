<template>
	<input
		type="search"
		pattern="^-?[0-9]+$"
		minlength="1"
		placeholder="Enter a telegram id e.g. 233030450"
		:value="value"
		@input.stop="search($event)"
	/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
	props: {
		value: String
	}
})
export default class SearchInput
	extends Vue {

	public isValidSearch(data: string) {
		return /^-?[0-9]+$/.test(data);
	}

	public search(event: InputEvent) {
		this.isValidSearch((event.target as HTMLInputElement).value as string || '')
			&& this.$emit(
				'input',
				(event.target as HTMLInputElement).value
			);
	}
}
</script>

<style lang="scss" scoped>
input[type="search"] {
	border: none;
	border-radius: 30px;
	outline: none;

	background-color: var(--input-color);
	color: var(--secondary-color);

	width: 100%;

	font-size: 1.2em;
	font-weight: 100;

	text-align: center;

	&::v-deep + div.search-status {
		font-size: 2em;

		& span.invalid-text {
			display: block;

			color: var(--invalid-color);
		}

		& span.valid-text {
			display: block;

			color: var(--valid-color);
		}

		& span.loading-text {
			display: block;

			color: var(--accent-color);
		}
	}
}
</style>
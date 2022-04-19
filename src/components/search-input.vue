<template>
<div>
	<input
	type="search"
	pattern="^-?[0-9]+$"
	minlength="1"
	placeholder="Type a telegram id..."
	@input.stop="search($event)"
	:value="value"
	/>
	<button @click="search($event)">
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
</svg>
	</button>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
	props: {
		value: String,
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
	border-radius: 10px;
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
/* clears the 'X' from Internet Explorer */
input[type=search]::-ms-clear {  display: none; width : 0; height: 0; }
input[type=search]::-ms-reveal {  display: none; width : 0; height: 0; }

/* clears the 'X' from Chrome */
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration { display: none; }

div {
	position: relative;
}

button {
	position: absolute;
	right: 0;
	height: 100%;
	width: 2rem;
	border-radius: 10px;
	background-image: var(--button-gradient);
	color: #ffffff;
}
</style>
<template>
	<div :class="[ 'theme-selector', isDarkTheme ? 'dark' : 'light' ]">
		<span class="switch-body">
			<input type="checkbox" v-model="isDarkTheme" />

			<span class="switch-knob" @click="toggleTheme()">
				<span class="knob-image">
					<img :src="knobImage" />
				</span>
			</span>
		</span>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import MoonKnob from '@/assets/moon.svg';
import SunKnob from '@/assets/sun.svg';

@Component({
})
export default class ThemeSelector
	extends Vue {

	public isDarkTheme: boolean = false;

	mounted() {
		const maybeIsDarkTheme =
			this.persistThemeService.currentOptions.isDarkTheme !== undefined;

		if (maybeIsDarkTheme) {
			this.isDarkTheme =
				<boolean>this.persistThemeService.currentOptions.isDarkTheme;
		}
		else {
			this.isDarkTheme =
				window.matchMedia
				&& window.matchMedia('(prefers-color-scheme: dark)').matches;
		}

		this.applyTheme();
	}

	get knobImage() {
		return this.isDarkTheme
			? MoonKnob
			: SunKnob
			;
	}

	public applyTheme() {
		document.body.className = this.isDarkTheme
			? 'dark'
			: 'light'
			;
	}

	public toggleTheme() {
		this.isDarkTheme = !this.isDarkTheme;
		this.persistThemeService.updateOptions({
			isDarkTheme: this.isDarkTheme
		});
		this.applyTheme();
	}
}
</script>

<style lang="scss" scoped>
div.theme-selector {
	transition: var(--transition-speed);

	--knob-size: 1.6rem;
	--control-length: calc(var(--knob-size) * 2);
	--control-height: 2.0rem;
	margin: 10px;
	position: relative;
	border-radius: var(--knob-size);

	width: var(--control-length);
	height: var(--control-height);

	&.light {
		background-color: #D9D9D9;

		& span.switch-knob {
			background-color: #FFF;
		}
	}
	&.dark {
		background-color: #1C1C1C;

		& span.switch-knob {
			background-color: #8C8C8C;
		}
	}

	span.knob-image {
		position: absolute;
		left: 0.2rem;

		& img {
			width: 1.2rem;
			height: 1.2rem;
		}
	}

	span.switch-knob {
		display: inline-block;

		border-radius: var(--knob-size);

		width: var(--knob-size);
		height: var(--knob-size);

		position: absolute;
		bottom: 0.2rem;
		right: 0.5rem;

		cursor: pointer;
	}

	input[type="checkbox"] {
		display: none;

		& + span.switch-knob {
			transition: 1.5s;

			position: absolute;
			left: 0.2rem;

			box-shadow: 0.1em 0.1em 0.1em 0 rgba(0, 0, 0, 40%);

			& span.knob-image {
				color: #8C8C8C;
			}
		}

		&:checked + span.switch-knob {
			transition: 1s;

			position: absolute;
			left: calc(96% - var(--knob-size));

			box-shadow: none;

			& span.knob-image {
				color: #FFF;
			}
		}
	}
}
</style>
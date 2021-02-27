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
		this.isDarkTheme = this.persistThemeService.currentOptions.isDarkTheme ?? false;
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

	--knob-size: 2.8rem;
	--control-length: calc(var(--knob-size) * 2);
	--control-height: 3.2rem;

	position: absolute;
	left: calc(50% - var(--control-length) / 2);
	bottom: 1rem;

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
		top: 0.35rem;
		left: 0.35rem;

		& img {
			width: 2.1rem;
			height: 2.1rem;
		}
	}

	span.switch-knob {
		display: inline-block;

		border-radius: var(--knob-size);

		width: var(--knob-size);
		height: var(--knob-size);

		position: absolute;
		bottom: 0.2rem;

		cursor: pointer;
	}

	input[type="checkbox"] {
		display: none;

		& + span.switch-knob {
			transition: 1s;

			position: absolute;
			left: 3%;

			box-shadow: 0.1em 0.1em 0.1em 0 rgba(0, 0, 0, 40%);

			& span.knob-image {
				color: #8C8C8C;
			}
		}

		&:checked + span.switch-knob {
			transition: 1s;

			position: absolute;
			left: calc(98% - var(--knob-size));

			box-shadow: none;

			& span.knob-image {
				color: #FFF;
			}
		}
	}
}
</style>
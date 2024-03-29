<template>
	<main>
		<div class="bg">
			<div class="main-content">
				<header>
					<h1 class="text-center h1">Knowhere</h1>
				</header>

				<div class="container-fluid search p-4">
					<h2 class="text-center h5 mb-3">
						Nebula's blacklist database
					</h2>
					<search-input
						v-model="searchTerms"
						@input="search()"
						class="mb-3"
					/>

					<div class="search-status mx-5">
						<span v-if="isInvalidText" class="invalid-text h5">
							{{ invalidText }}
						</span>
						<span v-if="isValidText" class="valid-text h5">
							{{ validText }}
						</span>
						<span v-if="isLoadingText" class="loading-text h5">
							{{ loadingText }}
						</span>
						<span v-if="isLoadingErrorText" class="invalid-text h5">
							{{ loadingErrorText }}
						</span>
					</div>

					<div
						v-if="results !== null && searchTerms.length > 0"
						class="container-fluid table">
						<div class="card">
							<div class="card-body">
								<h5 class="card-title">🚷 Blacklisted User:<br>FirstName: {{ results.getUserFirstName() }}<br>Telegram Id: [<code>{{ results.getUserId() }}</code>]</h5>
							</div>
							<ul class="list-group list-group-flush">
								<li class="list-group-item">
									<b>👮‍ By Operator:</b> <br> FirstName: {{ results.getOperatorFirstName() }}<br>Telegram Id: [<code>{{ results.getOperatorId() }}</code>]
									<br>Username: {{ results.getOperatorUserName() }}
								</li>
								<li class="list-group-item">📜 <b>Reason:</b> {{ results.getReason() }}</li>
								<li class="list-group-item">🕐 <b>Date:</b> {{ results.getDateTimeLocaleString() }} (UTC)</li>
							</ul>
							<div class="card-body">
								<a href="https://t.me/nebulabot_support" class="card-link">Wrong Blacklist? Contact Us</a>
							</div>
						</div>
					</div>

					<theme-selector />
				</div>
			</div>

			<div class="copyright fixed-bottom">
				<p class="text-center p-1">
					Copyright &copy; Squirrel Network 2018 - {{ year }} || <a href="https://api.nebula.squirrel-network.online/">API</a>
				</p>
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Subject, Subscription } from 'rxjs';
import { switchMap, tap, throttleTime } from 'rxjs/operators';
import { AxiosError } from 'axios';

import ThemeSelector from '@/components/theme-selector.vue';
import SearchInput from '@/components/search-input.vue';

import { Ban } from '@/model/Ban';
import {
	BanServicePlugin,
	PersistThemePlugin, PersistThemePluginOptions, PersistThemePluginOptionsStoreType
} from '@/service';
import { isAxiosError } from '@/utils';

Vue.use(BanServicePlugin);
Vue.use(PersistThemePlugin, {
	storeType: PersistThemePluginOptionsStoreType.LOCALSTORAGE
} as PersistThemePluginOptions);

/**
 * Describes the query parameter name expected in order to automatically fill
 * the search box and display a result.
 */
const QUERYPARAM_SEARCH_KEY = 'q';

@Component({
	data() {
		return {
			results: null,
			searchTerms: '',
			loadingError: null,
			isLoadingSearch: false,
			show: false,
			year: new Date().getFullYear()
		}
	},
	components: {
		ThemeSelector,
		SearchInput
	}
})
export default class App
	extends Vue {

	private subSearchTermsChange = new Subject();
	private $search!: Subscription;

	/**
	 * Checks whether there is a query param supported for automatic search.
	 * If any is available, it automatically performs the `search` function.
	 */
	private autosearchFromQueryParams(): void {
		const uri = window.location.search.substring(1); 
		const params = new URLSearchParams(uri);
		for (const [key, value] of params.entries()) {
			if (key === QUERYPARAM_SEARCH_KEY && value) {
				this.$data.searchTerms = value;
				this.search();
			}
		}
	}

	public get invalidText() {
		return 'Search term must be a Telegram user id.'
	}
	public get validText() { return '' }
	public get loadingText() { return 'Loading results...' }
	public get loadingErrorText() {
		return 'There was a problem loading search results: '
			+ String(this.$data.loadingError)
	}

	public get isInvalidText() { return !this.isValidSearch(); }
	public get isValidText() { return this.isValidSearch(); }
	public get isLoadingText() { return this.$data.isLoadingSearch; }
	public get isLoadingErrorText() {
		return this.$data.loadingError !== null;
	}

	public search() {
		this.$data.results = null;

		this.subSearchTermsChange.next(void 0);
	}

	public isValidSearch() {
		this.$data.show = true
		return /^-?[0-9]+$/.test(this.$data.searchTerms);
	}

	private showResults(results: Ban) {
		this.$data.show = true
		this.$data.isLoadingSearch = false;
		this.$data.loadingError = null;

		this.$data.results = results;
	}

	private showErrors(error: any) {
		this.$data.show = true
		this.$data.isLoadingSearch = false;

		this.$data.loadingError = error;
	}

	private showFail(fail: Error | AxiosError) {
		this.$data.isLoadingSearch = false;

		console.error(fail);

		let errorText = 'Application error: there was a problem '
			+ 'handling your request. We invite you to reload this page.';
		if (isAxiosError(fail)) {
			// In case it is an axios error, print the error received from the
			// server.
			errorText = (fail.response?.data as any)?.error ?? errorText;
		}

		this.$data.loadingError = errorText;
	}

	public mounted() {
		this.autosearchFromQueryParams();
	}

	public created() {
		this.$search = this.subSearchTermsChange
			.pipe(throttleTime(1000))
			.pipe(tap(() => this.$data.isLoadingSearch = true))
			.pipe(switchMap(
				() => this.banService.fetchBanByTgId(this.$data.searchTerms)))
			.subscribe(
				results => {
					if(results.error !== undefined) {
						this.showErrors(results.error);
					} else {
						this.showResults(Ban.of(results));
					}
				},
				error => this.showFail(error)
			);
	}

	public beforeDestroy() {
		this.$search.unsubscribe();
	}
}
</script>

<style lang="scss" scoped>
@import './style/theme.scss';

.invalid-text {
	color: var(--invalid-color);
}
@mixin background-property {
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
}

@mixin flex {
	display: flex;
	justify-content: center;
	align-items: center;
}

.bg {
	@include background-property();
	background-image: var(--background-image);
	min-height: 100vh;
	width: 100%;
	position: relative;
}
.main-content {
	width: 90%;
	margin: 0 auto;
	position: absolute;
	top: 45%;
	left: 50%;
	transform: translate(-50%,-50%);
}

h1 {
	font-weight: 400;

	font-family: #{$title-font};

	color: #ffffff;
}

td,tr, th {
	color: var(--secondary-color);
	text-align: center;
}
th {
	font-size: 0.8rem;
	width: 25%;
}
th:nth-child(odd) {
	background-color: var(--th-odd);
}

td {
	font-size: 0.8rem;
}

th:nth-child(even) {
	background-color: var(--th-even);
}
div.container-fluid.search {
	background-color: var(--box-background);
	border-radius: 5px;
}

h2 {
	color: var(--secondary-color);
}
div.container-fluid.table {
	& > table {
		font-weight: 300;

		thead {
			tr {
				color: var(--secondary-color);

				th {
					border: none;
				}
			}
		}

		tbody {
			tr {
				color: var(--secondary-color);

				td {
					border: none;
				}
			}
		}

		caption {
			font-family: sans-serif;
			font-style: italic;
		}
	}
}

.copyright {
	background: var(--primary-color);
	width: 100%;
	color: var(--secondary-color);
	height: 2rem;
}

.copyright p{
	font-size: 0.8rem;
}
</style>

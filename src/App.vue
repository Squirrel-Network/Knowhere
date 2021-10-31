<template>
	<main>
		<header>
			<h1>KNOWHERE</h1>
		</header>
		<div class="container-fluid search">
			<search-input
				v-model="searchTerms"
				@input="search()"
			/>
			<div class="search-status">
				<span v-if="isInvalidText" class="invalid-text">
					{{ invalidText }}
				</span>
				<span v-if="isValidText" class="valid-text">
					{{ validText }}
				</span>
				<span v-if="isLoadingText" class="loading-text">
					{{ loadingText }}
				</span>
				<span v-if="isLoadingErrorText" class="invalid-text">
					{{ loadingErrorText }}
				</span>
			</div>
		</div>
		<div
			v-if="results !== null && searchTerms.length > 0"
			class="container-fluid table"
		>
			<table>
				<caption>Search results</caption>

				<thead>
					<tr>
						<th>ID Operator</th>
						<th>ID User</th>
						<th>Reason</th>
						<th>Date</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							{{ results.getOperator() }}
						</td>
						<td>
							{{ results.getTgId() }}
						</td>
						<td>
							{{ results.getReason() }}
						</td>
						<td>
							{{ results.getDateTimeLocaleString() }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<theme-selector />
	</main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Subject, Subscription } from 'rxjs';
import { switchMap, tap, throttleTime } from 'rxjs/operators';
	import { AxiosError } from 'axios';

import ThemeSelector from '@/components/theme-selector.vue';
import SearchInput from '@/components/search-input.vue';

//import { BanServicePlugin/*, PersistThemePlugin, PersistThemePluginOptions, PersistThemePluginOptionsStoreType*/ } from '@/service';
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
			isLoadingSearch: false
		}
	},
	components: {
		ThemeSelector,
		SearchInput
	}
})
export default class App
	extends Vue {

	private subSearchTermsChange = new Subject;
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

		this.subSearchTermsChange.next();
	}

	public isValidSearch() {
		return /^-?[0-9]+$/.test(this.$data.searchTerms);
	}

	private showResults(results: Ban) {
		this.$data.isLoadingSearch = false;
		this.$data.loadingError = null;

		this.$data.results = results;
	}

	private showErrors(error: any) {
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
			errorText = fail.response?.data?.error ?? errorText;
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

main {
	width: 80%;

	margin: 0 auto;
}

h1 {
	text-align: center;

	font-size: 4em;
	font-weight: 600;

	font-family: #{$title-font};
}

div.container-fluid.search {
	padding: 1%;
}

div.container-fluid.table {
	& > table {
		width: 100%;

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
</style>

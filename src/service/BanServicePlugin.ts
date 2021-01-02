import { BanModel } from '@/model/Ban';
import Axios from 'axios-observable';

import { Observable } from "rxjs";
import { pluck } from 'rxjs/operators';

import Vue from 'vue';

declare module 'vue/types/vue' {
	interface Vue {
		banService: BanServicePlugin
	}
}

type BanServicePluginOptions =
	{}

type BanError =
	{ error: String
	}

export default class BanServicePlugin {
	private constructor() {
	}

	private static BASE_URL = 'https://nebula.hersel.it/blacklist';

	public static install(Vue: any, options: BanServicePluginOptions) {
		Vue.prototype.banService = new BanServicePlugin();
	}

	public fetchBanByTgId(tgid: string): Observable<BanModel & BanError> {
		return Axios.get(
				BanServicePlugin.BASE_URL,
				{ method: 'GET'
				, params: { tgid }
				}
			)
			.pipe(pluck('data'));
	}
}
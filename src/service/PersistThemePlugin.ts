import Vue from 'vue';

declare module 'vue/types/vue' {
	interface Vue {
		persistThemeService: PersistThemePlugin
	}
}

export type ThemeOptions = 
  {
    isDarkTheme?: boolean;
  }


export enum PersistThemePluginOptionsStoreType 
{
  LOCALSTORAGE,
  SESSIONSTORAGE
}
  
export type PersistThemePluginOptions =
  {
    storeType: PersistThemePluginOptionsStoreType
  }

export default class PersistThemePlugin {
  private static STORAGE_THEME_OPTIONS_KEY = 'theme-opts';

	private constructor(options: PersistThemePluginOptions) {
    this.options = options;
    this.storage = this.isLocalStorage ?
      window.localStorage :
      window.sessionStorage;

    this.loadOptions();
  }

  /**
   * Holds the instance of the preferred storage.
   *
   * @protected
   * @type {Storage}
   * @memberof PersistThemePlugin
   */
  protected storage: Storage;
  
  /**
   * Holds the instance of the current theme options.
   *
   * @protected
   * @type {ThemeOptions}
   * @memberof PersistThemePlugin
   */
  protected themeOptions: ThemeOptions = {};
  
  /**
   * Holds the options assigned in the install static method.
   *
   * @see install
   * @type {PersistThemePluginOptions}
   * @memberof PersistThemePlugin
   */
  protected options: PersistThemePluginOptions;

  /**
   * Loads the current options from the configured underlying storage.
   *
   * @protected
   * @memberof PersistThemePlugin
   */
  protected loadOptions(): void {
    const opts = this.storage.getItem(PersistThemePlugin.STORAGE_THEME_OPTIONS_KEY);
    if (opts) {
      this.themeOptions = JSON.parse(opts);
    } else {
      this.themeOptions = {};
    }
  }

  /**
   * Establishes whether the plugin was configured to use the local storage as a store.
   *
   * @readonly
   * @memberof PersistThemePlugin
   */
  public get isLocalStorage() {
    return this.options.storeType === PersistThemePluginOptionsStoreType.LOCALSTORAGE;
  }

  /**
   * Establishes whether the plugin was configured to use the session storage as a store.
   *
   * @readonly
   * @memberof PersistThemePlugin
   */
  public get isSessionStorage() {
    return this.options.storeType === PersistThemePluginOptionsStoreType.SESSIONSTORAGE;
  }

  /**
   * Returns a copy of the current theme options.
   *
   * @returns {ThemeOptions}
   * @memberof PersistThemePlugin
   */
  public get currentOptions() : ThemeOptions {
    return this.themeOptions;
  }

  /**
   * Updates and persists the curren options on the configured underlying storage.
   *
   * @param {ThemeOptions} [opts={}]
   * @memberof PersistThemePlugin
   */
  public updateOptions(opts: ThemeOptions = {}) : void {
    this.themeOptions = {
      ...this.themeOptions,
      ...opts
    };
    this.storage.setItem(PersistThemePlugin.STORAGE_THEME_OPTIONS_KEY, JSON.stringify(this.themeOptions));
    this.loadOptions();
  }

	public static install(Vue: any, options: PersistThemePluginOptions) {
    const _instance = new PersistThemePlugin(options);
    _instance.options = options;
    Vue.prototype.persistThemeService = _instance;
  }
}

import { DateTime } from 'luxon';

type BanModel =
	{ operator: string
	, reason: string
	, tg_id: string
	, date: string
	}
	;

class Ban {
	private date: DateTime;

	public constructor(
		private operator: string,
		private reason: string,
		private tg_id: string,
		date: string)
	{
		this.date = DateTime.fromHTTP(date);
	}

	public static of(
		{ date
		, operator
		, tg_id
		, reason }: BanModel) {

		return new Ban(operator, reason, tg_id, date);
	}

	public getOperator() {
		return this.operator;
	}
	public getReason() {
		return this.reason;
	}
	public getTgId() {
		return this.tg_id;
	}
	public getDate() {
		return this.date;
	}

	public getDateTimeLocaleString() {
		return this.date.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
	}
}

export { Ban, BanModel }

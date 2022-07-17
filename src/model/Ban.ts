import { DateTime } from 'luxon';

type BanModel =
	{ operator: string
	, reason: string
	, tg_id: string
	, date: string
	, operatorfirstname: string
	, operatorusername: string
	, tg_firstname: string
	}
	;

class Ban {
	private date: DateTime;

	public constructor(
		private operatorfirstname: string,
		private operator: string,
		private operatorusername: string,
		private reason: string,
		private tg_firstname: string,
		private tg_id: string,
		date: string)
	{
		this.date = DateTime.fromISO(date);
	}

	public static of(
		{ date
		, operatorfirstname
		, operator
		, operatorusername
		, tg_firstname
		, tg_id
		, reason }: BanModel) {

		return new Ban(operatorfirstname,operator,operatorusername,tg_firstname, reason, tg_id, date);
	}

	public getOperatorFirstname() {
		return this.operatorfirstname;
	}
	public getOperator() {
		return this.operator;
	}
	public getOperatorUserName() {
		return this.operatorusername;
	}
	public getReason() {
		return this.reason;
	}
	public getTgFirstname() {
		return this.tg_firstname;
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

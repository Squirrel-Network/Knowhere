import { DateTime } from 'luxon';

type BanModel =
	{ date: string
	, operator_id: string
	, operator_first_name: string
	, operator_username: string
	, reason: string
	, user_tg_first_name: string
	, user_tg_id: string
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
		 , operator_id
		 , operator_first_name
		 , operator_username
		 , reason
		 , user_tg_first_name
		 , user_tg_id
		 }: BanModel) {

		return new Ban(operator_first_name, operator_id, operator_username, reason, user_tg_first_name, user_tg_id, date);
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

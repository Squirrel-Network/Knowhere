import { DateTime } from 'luxon';

type BanModel =
	{ readonly id: number
	, readonly user_id: number
	, readonly user_first_name: string
	, readonly motivation_text: string
	, readonly user_date: string
	, readonly id_operator: number
	, readonly username_operator: string
	, readonly first_name_operator: string
	};

class Ban {
	private date: DateTime;

	public constructor(
		private id: number,
		private userId: number,
		private userFirstName: string,
		private motivationText: string,
		userDate: string,
		private idOperator: number,
		private usernameOperator: string,
		private firstNameOperator: string
	) {
		this.date = DateTime.fromISO(userDate);
	}

	public static of(
		{ id
		, user_id
		, motivation_text
		, user_first_name
		, first_name_operator
		, username_operator
		, user_date
		, id_operator
		}: BanModel) {

		return new Ban(
			id,
			user_id,
			user_first_name,
			motivation_text,
			user_date,
			id_operator,
			username_operator,
			first_name_operator
		);
	}

	public getUserFirstName() {
		return this.userFirstName;
	}

	public getUserId() {
		return this.userId;
	}

	public getOperatorFirstName() {
		return this.firstNameOperator;
	}

	public getOperatorId() {
		return this.idOperator;
	}

	public getOperatorUserName() {
		return this.usernameOperator;
	}

	public getReason() {
		return this.motivationText;
	}

	public getDateTimeLocaleString() {
		return this.date.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
	}
}

export { Ban, BanModel }

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;


	export default VALIDATION_RULES =  {
		USERS: {
			ID: 'required|string',
			FIRST_NAME: 'required|string|min:3',
			LAST_NAME: 'required|string|min:3',
			EMAIL: 'required|string|email',
			PHONE: 'required|string',
			PASSWORD: [
				'required',
				'string',
				'min:8',
				'max:16',
				`regex:${passwordRegex}`,
			],
			FORGOT_PWD_TOKEN: 'required|string',
			PROFILE_PIC: 'required|string',
			COUNTRY_CODE: 'required|string',
			IS_VERIFIED: `string|in:${STATUS.USER.ACCEPTED},${STATUS.USER.PENDING}`,
			INVITE_TOKEN: 'required|string',
			TOKEN_EXPIRY: 'required',
			STATUS: 'required|boolean',
			IS_ACTIVE: 'required|boolean',
		},
	}
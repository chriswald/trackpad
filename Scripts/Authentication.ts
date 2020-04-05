class Authentication {

	private _authToken: string = "";

	public Authenticate(): void {
		this.BeginAuth();
	}

	public GetToken(): string {
		return this._authToken;
	}

	private BeginAuth(): void {
		let requestOptions: RequestInit = {
			method: 'GET',
			redirect: 'follow'
		};

		fetch("api/Auth/BeginAuth", requestOptions)
			.then(this.AuthLoop.bind(this));
	}

	private AuthLoop(): void {
		let code: string = this.PromptForInput();
		this.ValidateCode(code);
	}

	private PromptForInput(): string {
		return window.prompt("Enter the code on screen.");
	}

	private ValidateCode(code: string): void {

		let myHeaders: Headers = new Headers();
		myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

		let urlencoded: URLSearchParams = new URLSearchParams();
		urlencoded.append("Code", code);

		let requestOptions: RequestInit = {
			method: "POST",
			headers: myHeaders,
			body: urlencoded,
			redirect: "follow"
		};

		fetch("api/Auth/Validate", requestOptions)
			.then(response => response.text())
			.then(this.ParseValidateResponse.bind(this))
			.catch(error => console.log("error", error));
	}

	private ParseValidateResponse(result: string) {
		let respObj: ValidationResponse = JSON.parse(result) as ValidationResponse;

		if (respObj.Success === true) {
			this._authToken = respObj.AuthToken;
		}
		else {
			this.AuthLoop();
		}
	}
}

interface ValidationResponse {
	Success: boolean;
	AuthToken: string;
}

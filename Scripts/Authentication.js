class Authentication {
    constructor() {
        this._authToken = "";
    }
    Authenticate() {
        this.BeginAuth();
    }
    GetToken() {
        return this._authToken;
    }
    BeginAuth() {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch("api/Auth/BeginAuth", requestOptions)
            .then(this.AuthLoop.bind(this));
    }
    AuthLoop() {
        let code = this.PromptForInput();
        this.ValidateCode(code);
    }
    PromptForInput() {
        return window.prompt("Enter the code on screen.");
    }
    ValidateCode(code) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        let urlencoded = new URLSearchParams();
        urlencoded.append("Code", code);
        let requestOptions = {
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
    ParseValidateResponse(result) {
        let respObj = JSON.parse(result);
        if (respObj.Success === true) {
            this._authToken = respObj.AuthToken;
        }
        else {
            this.AuthLoop();
        }
    }
}
//# sourceMappingURL=Authentication.js.map
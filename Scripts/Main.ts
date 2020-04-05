/// <reference path="./Trackpad.ts" />
/// <reference path="Authentication.ts" />

document.addEventListener("DOMContentLoaded", Main);

const Auth: Authentication = new Authentication();
let Track: Trackpad;
let BaseUrl: string = location.origin;

function Main(): void {

	setTimeout(Auth.Authenticate.bind(Auth), 1000);

	let body: HTMLBodyElement = document.getElementById("body") as HTMLBodyElement;
	Track = new Trackpad(body, Auth);
}

class Trackpad {
	private _prevTouch?: Touch = null;
	private _auth: Authentication;

	public constructor(element: HTMLElement, auth: Authentication) {
		this._auth = auth;

		element.addEventListener("touchstart", this.processTouchStart.bind(this), false);
		element.addEventListener("touchmove", this.processTouchMove.bind(this), false);
		element.addEventListener("touchend", this.processTouchEnd.bind(this), false);
		element.addEventListener("click", this.processClick.bind(this), false);
	}

	private processTouchStart(event: TouchEvent): void {
		this._prevTouch = event.targetTouches[0];
	}

	private processTouchMove(event: TouchEvent): void {
		if (this._prevTouch === null) { return; }

		let touch: Touch = event.targetTouches[0];

		let diffX: number = touch.clientX - this._prevTouch.clientX;
		let diffY: number = touch.clientY - this._prevTouch.clientY;

		this._prevTouch = touch;

		let myHeaders: Headers = new Headers();
		myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

		let urlencoded: URLSearchParams = new URLSearchParams();
		urlencoded.append("AuthToken", this._auth.GetToken());
		urlencoded.append("DeltaX", Math.round(diffX).toString());
		urlencoded.append("DeltaY", Math.round(diffY).toString());

		let requestOptions: RequestInit = {
			method: 'POST',
			headers: myHeaders,
			body: urlencoded,
			redirect: 'follow'
		};

		fetch("api/Trackpad/Move", requestOptions);
	}

	private processTouchEnd(event: TouchEvent): void {
		this._prevTouch = null;
	}

	private processClick(event: MouseEvent): void {
		let myHeaders: Headers = new Headers();
		myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

		let urlencoded: URLSearchParams = new URLSearchParams();
		urlencoded.append("AuthToken", this._auth.GetToken());

		let requestOptions: RequestInit = {
			method: 'POST',
			headers: myHeaders,
			body: urlencoded,
			redirect: 'follow'
		};

		fetch("api/Trackpad/Click", requestOptions);
	}
}

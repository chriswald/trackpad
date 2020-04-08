interface Point {
	x: number;
	y: number;
}

class Trackpad {
	private _prevTouches?: TouchList = null;
	private _auth: Authentication;

	public constructor(element: HTMLElement, auth: Authentication) {
		this._auth = auth;

		element.addEventListener("touchstart", this.processTouchStart.bind(this), false);
		element.addEventListener("touchmove", this.processTouchMove.bind(this), false);
		element.addEventListener("touchend", this.processTouchEnd.bind(this), false);
		element.addEventListener("click", this.processClick.bind(this), false);
	}

	private processTouchStart(event: TouchEvent): void {
		if (event.touches.length < 3) {
			this.StartNewTouchEvent(event.touches);
		}
	}

	private processTouchMove(event: TouchEvent): void {
		if (this._prevTouches === null || this._prevTouches.length === 0) { return; }

		if (event.touches.length !== this._prevTouches.length) {
			this.StartNewTouchEvent(event.touches);
		}
		else {
			if (event.touches.length == 1) {
				this.MoveCursor(event.touches[0]);
			}
			else if (event.touches.length == 2) {
				this.Scroll(event.touches);
			}

			this._prevTouches = event.touches;
		}
	}

	private processTouchEnd(event: TouchEvent): void {
		this._prevTouches = null;
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

	private StartNewTouchEvent(initialTouches: TouchList): void {
		this._prevTouches = initialTouches;
	}

	private MoveCursor(touch: Touch): void {
		let prevTouch = this._prevTouches[0];
		let diffX: number = touch.clientX - prevTouch.clientX;
		let diffY: number = touch.clientY - prevTouch.clientY;

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

	private Scroll(touches: TouchList): void {
		let prevLoc: Point = this.GetMultiTouchAverageLoc(this._prevTouches);
		let nowLoc: Point = this.GetMultiTouchAverageLoc(touches);

		let diffY: number = nowLoc.y - prevLoc.y;

		let myHeaders: Headers = new Headers();
		myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

		let urlencoded: URLSearchParams = new URLSearchParams();
		urlencoded.append("AuthToken", this._auth.GetToken());
		urlencoded.append("DeltaY", Math.round(diffY).toString());

		let requestOptions: RequestInit = {
			method: 'POST',
			headers: myHeaders,
			body: urlencoded,
			redirect: 'follow'
		};

		fetch("api/Trackpad/Scroll", requestOptions);
	}

	private GetMultiTouchAverageLoc(touches: TouchList): Point {
		let sumx: number = 0;
		let sumy: number = 0;

		for (let touch of touches) {
			sumx += touch.clientX;
			sumy += touch.clientY;
		}

		let avgx = sumx / touches.length;
		let avgy = sumy / touches.length;

		return { x: avgx, y: avgy };
	}
}

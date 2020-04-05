class Trackpad {
    constructor(element, auth) {
        this._prevTouch = null;
        this._auth = auth;
        element.addEventListener("touchstart", this.processTouchStart.bind(this), false);
        element.addEventListener("touchmove", this.processTouchMove.bind(this), false);
        element.addEventListener("touchend", this.processTouchEnd.bind(this), false);
    }
    processTouchStart(event) {
        this._prevTouch = event.targetTouches[0];
    }
    processTouchMove(event) {
        if (this._prevTouch === null) {
            return;
        }
        let touch = event.targetTouches[0];
        let diffX = touch.clientX - this._prevTouch.clientX;
        let diffY = touch.clientY - this._prevTouch.clientY;
        this._prevTouch = touch;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        let urlencoded = new URLSearchParams();
        urlencoded.append("AuthToken", this._auth.GetToken());
        urlencoded.append("DeltaX", Math.round(diffX).toString());
        urlencoded.append("DeltaY", Math.round(diffY).toString());
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };
        fetch("api/Trackpad/Move", requestOptions);
    }
    processTouchEnd(event) {
        this._prevTouch = null;
    }
}
//# sourceMappingURL=Trackpad.js.map
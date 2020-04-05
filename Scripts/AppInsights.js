class AppInsights {
    AppName() {
        return new Promise(resolve => {
            let xhttp = AppInsights.GetXmlHttpRequest("AppName");
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    resolve(JSON.parse(this.responseText));
                }
            };
            xhttp.send();
        });
    }
    static GetXmlHttpRequest(action) {
        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", "api/AppInsights/" + action);
        xhttp.setRequestHeader("Accept", "application/json");
        return xhttp;
    }
}
//# sourceMappingURL=AppInsights.js.map
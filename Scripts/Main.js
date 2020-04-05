/// <reference path="./Trackpad.ts" />
/// <reference path="Authentication.ts" />
/// <reference path="AppInsights.ts" />
document.addEventListener("DOMContentLoaded", Main);
const Auth = new Authentication();
let Track;
let BaseUrl = location.origin;
function Main() {
    let insights = new AppInsights();
    insights.AppName().then((name) => {
        BaseUrl = location.origin + "/" + name;
        setTimeout(Auth.Authenticate.bind(Auth), 1000);
    });
    let body = document.getElementById("body");
    Track = new Trackpad(body, Auth);
}
//# sourceMappingURL=Main.js.map
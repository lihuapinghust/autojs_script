const translate = require('./translate.js');

const GLOBAL_TIMEOUT = 10000;

function waitUntilShopeeLogin(country) {
    requestScreenCapture();
    var maxTimes = 10;
    var count = 0;
    while (count < maxTimes) {
        count += 1;
        sleep(1000);
        var login_img = captureScreen();
        var google_logo_img = images.read("/sdcard/Download/google_logo.png");
        var pos = findImage(login_img, google_logo_img);
        if (pos) {
            click(pos.x, pos.y);
            return true;
        }
    }
    return false;
}

function waitUntilGoogleLogin(country) {
    requestScreenCapture();
    var maxTimes = 10;
    var count = 0;
    while (count < maxTimes) {
        count += 1;
        sleep(1000);
        var login_img = captureScreen();
        var google_logo_img = images.read("/sdcard/Download/google_text.png");
        var pos = findImage(login_img, google_logo_img);
        if (pos) {
            click(pos.x, pos.y);
            return true;
        }
    }
    return false;
}

function waitUntilMainPage(country) {
    requestScreenCapture();
    var maxTimes = 10;
    var count = 0;
    while (count < maxTimes) {
        count += 1;
        sleep(1000);
        var login_img = captureScreen();
        var main_page_img = images.read("/sdcard/Download/main_page_video.png");
        var pos = findImage(login_img, main_page_img);
        if (pos) {
            click(pos.x, pos.y);
            return true;
        }
    }
    return false;
}

function waitUntilWelcomePage(country) {
    requestScreenCapture();
    var maxTimes = 10;
    var count = 0;
    while (count < maxTimes) {
        count += 1;
        sleep(1000);
        var login_img = captureScreen();
        var welcome_page_img = images.read("/sdcard/Download/welcome.png");
        var pos = findImage(login_img, welcome_page_img);
        if (pos) {
            click(pos.x, pos.y);
            return true;
        }
    }
    return false;
}

/**
 * Logs in to Shopee using Google account.
 *
 * @param {string} country - The country code of the Shopee account.
 * @return {boolean} Returns true if login is successful, false otherwise.
 */
function shopeeLogin(country) {
    if (country == null || country == "") {
        return false;
    }

    if (!waitUntilShopeeLogin(country)) {
        toastLog("waitUntilShopeeLogin failed");
        return false;
    }
    
    if (!waitUntilGoogleLogin(country)) {
        toastLog("waitUntilGoogleLogin failed");
        return false;
    }
    
    var ea = require("email_account.js");
    var emailAccount = ea.getEmailAccount(country);
    if (emailAccount == null) {
        toastLog("emailAccount is null");
        return false;
    }

    toastLog("email: " + emailAccount.email);
    toastLog("password: " + emailAccount.password);

    sleep(1000);
    click(540, 748);

    sleep(1000);
    input(emailAccount.email);

    sleep(1000);
    className("android.widget.Button").text(translate("NEXT", country)).findOne(GLOBAL_TIMEOUT).click();

    sleep(3000);
    var emailLabel = className("android.widget.TextView").text(emailAccount.email).findOne(GLOBAL_TIMEOUT);
    if (emailLabel == null) {
        toastLog("emailLabel is null");
        return false;
    }
    toastLog("emailLabel is not null");

    sleep(1000);
    var tryAnotherWayBtn = className("android.widget.Button").text(translate("TRY ANOTHER WAY", country)).findOne(GLOBAL_TIMEOUT);
    if (tryAnotherWayBtn != null) {
        toastLog("robot check exists, now skip it");
        if (!ea.markAsRisked(emailAccount)) {
            toastLog("markAsRisked failed");
        }
        return false;
    }

    click(540, 748);
    sleep(1000);
    input(emailAccount.password);

    sleep(1000);
    className("android.widget.Button").text(translate("NEXT", country)).findOne(GLOBAL_TIMEOUT).click();

    sleep(3000);
    var addPhoneLabel = className("android.widget.TextView").text(translate("Add phone number?")).findOne(GLOBAL_TIMEOUT);
    if (addPhoneLabel == null) {
        toastLog("addPhoneLabel is null");
        return false;
    }
    sleep(1000);
    className("android.widget.Button").text(translate("Skip")).findOne(GLOBAL_TIMEOUT).click();

    sleep(3000);
    var iAgreeBtn = className("android.widget.Button").text(translate("I agree")).findOne(GLOBAL_TIMEOUT);
    if (iAgreeBtn == null) {
        toastLog("iAgreeBtn is null");
        return false;
    }
    toastLog("iAgreeBtn is not null, now click it");
    iAgreeBtn.click();

    sleep(3000);
    var acceptBtn = className("android.widget.Button").text(translate("ACCEPT", country)).findOne(GLOBAL_TIMEOUT);
    if (acceptBtn == null) {
        toastLog("acceptBtn is null");
        return false;
    }
    toastLog("acceptBtn is not null, now click it");
    acceptBtn.click();

    sleep(3000);
    var agreeBtn = className("android.widget.Button").text(translate("AGREE", country)).findOne(GLOBAL_TIMEOUT);
    if (agreeBtn != null) {
        agreeBtn.click();
    } 

    if (!waitUntilWelcomePage(country)) {
        toastLog("waitUntilWelcomePage failed");
        return false;
    }
    toastLog("waitUntilWelcomePage success");

    sleep(1000);
    click(540, 2020);

    if (!waitUntilMainPage(country)) {
        toastLog("waitUntilMainPage failed");
        return false;
    }
    toastLog("waitUntilMainPage success");

    if (ea.markAsRegistered(emailAccount)) { 
        toastLog("Marked as registered");
    }

    return true;
}

// module.exports = {
//     shopeeLogin: shopeeLogin
// };

if (shopeeLogin("US")) {
    toast("Login success");
} else {
    toast("Login failed");
}
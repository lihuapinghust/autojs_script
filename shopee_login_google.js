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
function shopeeLogin() {
    importClass(java.util.Locale);
    var locale = Locale.getDefault();
    var country = locale.getCountry();

    if (!waitUntilShopeeLogin(country)) {
        toastLog("waitUntilShopeeLogin failed");
        return false;
    }
    
    if (!waitUntilGoogleLogin(country)) {
        toastLog("waitUntilGoogleLogin failed");
        return false;
    }
    

    // Get email account
    var ea = require("email_account.js");
    var emailAccount = ea.getEmailAccount(country);
    if (emailAccount == null) {
        toastLog("emailAccount is null");
        return false;
    }
    toastLog("email: " + emailAccount.email);
    toastLog("password: " + emailAccount.password);


    // Input email
    sleep(1000);
    click(540, 748);
    sleep(2000);
    while (!input(emailAccount.email)) {
        toastLog("input email failed, try again");
        sleep(1000);
        click(540, 748);
    }
    sleep(1000);
    className("android.widget.Button").text(translate("NEXT", country)).findOne(GLOBAL_TIMEOUT).click();


    // Wait until next page
    sleep(3000);
    var emailLabel = className("android.widget.TextView").text(emailAccount.email).findOne(GLOBAL_TIMEOUT);
    if (emailLabel == null) {
        toastLog("emailLabel is null");
        return false;
    }


    // Robot check
    sleep(1000);
    var tryAnotherWayBtn = className("android.widget.Button").text(translate("TRY ANOTHER WAY", country)).findOne(GLOBAL_TIMEOUT);
    if (tryAnotherWayBtn != null) {
        toastLog("robot check exists, now skip it");
        if (!ea.markAsRisked(emailAccount)) {
            toastLog("markAsRisked failed");
        }
        return false;
    }


    // Input password
    click(540, 748);
    sleep(1000);
    input(emailAccount.password);
    sleep(1000);
    className("android.widget.Button").text(translate("NEXT", country)).findOne(GLOBAL_TIMEOUT).click();


    // Add phone number
    sleep(3000);
    var skipBtn = className("android.widget.Button").text(translate("Skip")).findOne(GLOBAL_TIMEOUT);
    if (skipBtn != null) {
        skipBtn.click();
    }


    // Welcome page
    sleep(3000);
    var iAgreeBtn = className("android.widget.Button").text(translate("I agree")).findOne(GLOBAL_TIMEOUT);
    if (iAgreeBtn != null) {
        iAgreeBtn.click();
    } else {
        iAgreeBtn = className("android.widget.Button").text(translate("I agree", country)).findOne(GLOBAL_TIMEOUT);
        if (iAgreeBtn != null) {
            iAgreeBtn.click();
        }
    }


    // You're signed in page
    sleep(3000);
    var notNowBtn = className("android.widget.Button").text(translate("Not now", country)).findOne(GLOBAL_TIMEOUT);
    if (notNowBtn != null) {
        toastLog("notNowBtn exists, now click it");
        notNowBtn.click();
    }


    // Google services page
    sleep(3000);
    var moreBtn = className("android.widget.Button").text(translate("MORE", country)).findOne(GLOBAL_TIMEOUT);
    if (moreBtn != null) {
        toastLog("moreBtn exists, now click it");
        moreBtn.click();
    }
    sleep(3000);
    var acceptBtn = className("android.widget.Button").text(translate("ACCEPT", country)).findOne(GLOBAL_TIMEOUT);
    if (acceptBtn != null) {
        toastLog("acceptBtn exists, now click it");
        acceptBtn.click();

        if (ea.markAsRegistered(emailAccount)) {
            toastLog("Marked as registered");
        }
        return true;
    }

    return false;
}

// module.exports = {
//     shopeeLogin: shopeeLogin
// };

if (shopeeLogin()) {
    toast("Login success");
} else {
    toast("Login failed");
}
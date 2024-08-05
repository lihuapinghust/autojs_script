const GLOBAL_TIMEOUT = 10000;

launch("com.lovepi.setting")
sleep(1000)

// Connect wifi
var jsonResp = http.get("http://127.0.0.1:1688/cmd?fun=getNetworkStatus").body.json()
if (jsonResp.data.status = 0) {
    toastLog("Network not connected, connect wifi")
    jsonResp = http.get("http://127.0.0.1:1688/cmd?fun=connectWifi&ssid=Ziroom506_5G&password=4001001111").body.json()
    if (jsonResp.code == 0) {
        toastLog("Connect wifi success")
    } else {
        toastLog("Connect wifi failed")
        exit()
    }
    sleep(5000)
}

// Set locale
var res = http.get(`http://127.0.0.1:1688/cmd?fun=setLocale&country=US&language=en`).body.json()
if (res.code == 0) {
    toastLog("Setlocale success")
} else {
    toastLog("Setlocale failed")
    exit()
}
sleep(2000)

// Set timezone
res = http.get(`http://127.0.0.1:1688/cmd?fun=setTimezone&tz=America/Los_Angeles`).body.json()
if (res.code == 0) {
    toastLog("SetTimezone success")
} else {
    toastLog("SetTimezone failed")
    exit()
}
sleep(2000)

// Refresh ip
jsonResp = http.get("http://97.64.22.36:8000/refresh_ip?country_code=US").body.json()
if (jsonResp.new_ip != null) {
    toastLog("Refresh ip success. new ip: " + jsonResp.new_ip)
} else {
    toastLog("Refresh ip failed, " + JSON.stringify(jsonResp))
    exit()
}

// Google login
http.get("http://127.0.0.1:1688/cmd?fun=execAsRoot&command=am%20force-stop%20com.android.vending")
sleep(3000)
launch("com.android.vending")
sleep(1000)
var signInBtn = id("0_resource_name_obfuscated").className("android.widget.Button").text("Sign in").findOne(GLOBAL_TIMEOUT)
if (signInBtn) {
    toastLog("signInBtn exists, click it")
    signInBtn.click()
}

var emailAccount = googleLogin()
if (!emailAccount) {
    toastLog("Google login fail")
    sleep(1000)
    exit()
}
toastLog("Google login success, email: " + emailAccount.email)

// Install Grindr
http.get("http://127.0.0.1:1688/cmd?fun=execAsRoot&command=am%20force-stop%20com.android.vending")
sleep(3000)
var url = "market://details?id=com.grindrapp.android";
app.startActivity({
    action: "android.intent.action.VIEW",
    data: url
});
sleep(2000)
var playAcceptBtn = id("0_resource_name_obfuscated").className("android.widget.Button").text("Accept").findOne(GLOBAL_TIMEOUT)
if (playAcceptBtn) {
    toastLog("playAcceptBtn exists, click it")
    playAcceptBtn.click()
}
sleep(2000)
var installBtn = className("android.widget.TextView").text("Install").findOne(GLOBAL_TIMEOUT)
if (installBtn) {
    toastLog("installBtn exists, click it")
    var b = installBtn.bounds()
    click(b.centerX(), b.centerY())
}
sleep(3000)
var continueBtn = id("0_resource_name_obfuscated").className("android.widget.Button").text("Continue").findOne(GLOBAL_TIMEOUT)
if (continueBtn) {
    continueBtn.click()
    sleep(3000)

    var skipBtn = id("0_resource_name_obfuscated").className("android.widget.Button").text("Skip").findOne(GLOBAL_TIMEOUT)
    if (skipBtn) {
        skipBtn.click()
        sleep(3000)
    }
}
var installCheckCount = 0
while (installCheckCount < 40) {
    if (isAppInstalled("com.grindrapp.android")) {
        break
    }
    sleep(3000)
    toastLog("install check count: " + installCheckCount)
    installCheckCount += 1
}
sleep(3000)

// Create new virtual phone
launch("com.lovepi.setting")
sleep(1000)
jsonResp = http.get("http://127.0.0.1:1688/cmd?fun=newRecord&targets=com.grindrapp.android&fake_self=0&phone_model_id=2&fake_android_id=1&fake_cache_id=1&update_sdcard_ts=1&random_drm_device_id=1&random_gsf_id=1&random_ipv6=1&random_mac=1").body.json()
if (jsonResp.code == 0) {
    toastLog("new phone success")
} else {
    toastLog("new phone failed")
    exit()
}

// Launch Grindr and Register
launch("com.grindrapp.android")
sleep(3000)
var signUpBtn = id("fragment_login_create_account_button").findOne(GLOBAL_TIMEOUT)
if (signUpBtn) {
    toastLog("signUpBtn exists, click it")
    signUpBtn.click()
}
sleep(1000)
nextBtn = id("proceed_button").findOne(GLOBAL_TIMEOUT)
if (nextBtn) {
    toastLog("nextBtn exists, click it")
    nextBtn.click()
}
sleep(1000)
var acceptBtn = className("android.widget.Button").text("ACCEPT").findOne(GLOBAL_TIMEOUT)
if (acceptBtn) {
    toastLog("acceptBtn exists, click it")
    acceptBtn.click()
}
sleep(1000)
nextBtn = id("proceed_button").findOne(GLOBAL_TIMEOUT)
if (nextBtn) {
    toastLog("nextBtn exists, click it")
    nextBtn.click()
}
sleep(1000)
acceptBtn = className("android.widget.Button").text("ACCEPT").findOne(GLOBAL_TIMEOUT)
if (acceptBtn) {
    toastLog("acceptBtn exists, click it")
    acceptBtn.click()
}
sleep(1000)

var dob = getRandomBirthday()
toastLog("dob. mm: " + dob.month + ", dd: " + dob.day + ", yy: " + dob.year)
var monthTv = id("hint_text_view1").className("android.widget.TextView").text("MM").findOne(GLOBAL_TIMEOUT)
if (monthTv) {
    toastLog("monthTv exists, click it")
    var b = monthTv.bounds()
    click(b.centerX(), b.centerY())
}
input(dob.month)
sleep(2000)
input(dob.day)
sleep(2000)
input(dob.year)
sleep(1000)
var nextBtn = id("next_button").findOne(GLOBAL_TIMEOUT)
if (nextBtn) {
    toastLog("nextBtn exists, click it")
    nextBtn.click()
}
sleep(1000)
var googleLoginBtn = id("google_login_button").findOne(GLOBAL_TIMEOUT)
if (googleLoginBtn) {
    toastLog("googleLoginBtn exists, click it")
    googleLoginBtn.click()
}
sleep(5000)
click(540, 1250)
sleep(5000)
continueBtn = className("android.widget.Button").text("Continue").findOne(GLOBAL_TIMEOUT)
if (continueBtn) {
    toastLog("continueBtn exists, click it")
    continueBtn.click()
}
sleep(6000)
swipe(540, 1800, 540, 400, 1000)
sleep(5000)
click(750, 2100)
sleep(5000)
// var allowBtn = id("submit_approve_access").findOne(GLOBAL_TIMEOUT)
// if (allowBtn) {
//     toastLog("allowBtn exists, click it")
//     allowBtn.click()
// }

uploadGrindrAccount(emailAccount)

var saveBtn = id("toolbar_next").findOne(GLOBAL_TIMEOUT)
if (saveBtn) {
    toastLog("saveBtn exists, click it")
    saveBtn.click()
}
sleep(3000)

var dontAllowLocBtn = className("android.widget.Button").text("Don’t allow").findOne(GLOBAL_TIMEOUT)
if (dontAllowLocBtn) {
    toastLog("dontAllowLocBtn exists, click it")
    markGrindrAccountAsOk(emailAccount)
    dontAllowLocBtn.click()
}
toastLog("Grindr register success")
sleep(3000)

function isAppInstalled(packageName) {
    return app.getAppName(packageName) != null
}

function waitUntilGoogleLogin(country) {
    var maxTimes = 10;
    var count = 0;
    while (count < maxTimes) {
        count += 1;
        sleep(1000);

        if (className("android.widget.TextView").text("with your Google Account.").findOne(GLOBAL_TIMEOUT)) {
            return true;
        }
    }
    return false;
}

/**
 * Logs in using Google account.
 * 
 */
function googleLogin() {
    importClass(java.util.Locale);
    var locale = Locale.getDefault();
    var country = locale.getCountry();

    if (!waitUntilGoogleLogin(country)) {
        toastLog("waitUntilGoogleLogin failed");
        return false;
    }
    sleep(3000)

    // Get email account
    var emailAccount = getEmailAccount(country);
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
    sleep(2000);
    var closeBtn = className("android.widget.Button").text("Close").findOne(GLOBAL_TIMEOUT)
    if (closeBtn) {
        toastLog("closeBtn exists, now click it");
        closeBtn.click();
    }
    sleep(1000);
    var nextBtn = className("android.widget.Button").text("NEXT").findOne(GLOBAL_TIMEOUT)
    if (nextBtn != null) {
        toastLog("nextBtn exists, now click it");
        nextBtn.click();
    }

    // Wait until next page
    sleep(3000);
    var emailLabel = className("android.widget.TextView").text(emailAccount.email).findOne(GLOBAL_TIMEOUT);
    if (emailLabel == null) {
        toastLog("emailLabel is null");
        return false;
    }


    // Robot check
    sleep(1000);
    var tryAnotherWayBtn = className("android.widget.Button").text("TRY ANOTHER WAY").findOne(GLOBAL_TIMEOUT);
    if (tryAnotherWayBtn != null) {
        toastLog("robot check exists, now skip it");
        if (!markAsRisked(emailAccount)) {
            toastLog("markAsRisked failed");
        }
        return false;
    }


    // Input password
    click(540, 748);
    sleep(1000);
    input(emailAccount.password);
    sleep(1000);
    className("android.widget.Button").text("NEXT").findOne(GLOBAL_TIMEOUT).click();

    // Robot check
    sleep(1000);
    tryAnotherWayBtn = className("android.widget.Button").text("TRY ANOTHER WAY").findOne(GLOBAL_TIMEOUT);
    if (tryAnotherWayBtn != null) {
        toastLog("robot check exists, now skip it");
        if (!markAsRisked(emailAccount)) {
            toastLog("markAsRisked failed");
        }
        return false;
    }

    // Add phone number
    sleep(3000);
    var skipBtn = className("android.widget.Button").text("Skip").findOne(GLOBAL_TIMEOUT);
    if (skipBtn != null) {
        toastLog("Skip button exists, now click it");
        skipBtn.click();
    }

    // Turn on backup
    var notTurnonBtn = className("android.widget.Button").text("DON’T TURN ON").findOne(GLOBAL_TIMEOUT)
    if (notTurnonBtn != null) {
        toastLog("notTurnonBtn exists, now click it");
        notTurnonBtn.click();
        var b = notTurnonBtn.bounds()
        click(b.centerX(), b.centerY())
    }

    // Welcome page
    sleep(3000);
    var iAgreeBtn = className("android.widget.Button").text("I agree").findOne(GLOBAL_TIMEOUT);
    if (iAgreeBtn != null) {
        toastLog("iAgreeBtn exists, now click it");
        iAgreeBtn.click();
    } else {
        iAgreeBtn = className("android.widget.Button").text("I agree").findOne(GLOBAL_TIMEOUT);
        if (iAgreeBtn != null) {
            toastLog("iAgreeBtn2 exists, now click it");
            iAgreeBtn.click();
        }
    }

    // Turn on backup
    sleep(3000);
    notTurnonBtn = className("android.widget.Button").text("Don't turn on").findOne(GLOBAL_TIMEOUT)
    if (notTurnonBtn != null) {
        toastLog("notTurnonBtn exists, now click it");
        notTurnonBtn.click();
        sleep(3000);
        var b = notTurnonBtn.bounds()
        toastLog("b.centerX: " + b.centerX() + ", b.centerY: " + b.centerY())
        click(b.centerX(), b.centerY())
    }

    // You're signed in page
    sleep(3000);
    var notNowBtn = className("android.widget.Button").text("Not now").findOne(GLOBAL_TIMEOUT);
    if (notNowBtn != null) {
        toastLog("notNowBtn exists, now click it");
        notNowBtn.click();
    }

    // Google services page
    sleep(3000);
    var moreBtn = className("android.widget.Button").text("MORE").findOne(GLOBAL_TIMEOUT);
    if (moreBtn != null) {
        toastLog("moreBtn exists, now click it");
        moreBtn.click();
    }
    sleep(3000);
    var acceptBtn = className("android.widget.Button").text("ACCEPT").findOne(GLOBAL_TIMEOUT);
    if (acceptBtn != null) {
        toastLog("acceptBtn exists, now click it");
        acceptBtn.click();

        return emailAccount;
    }

    return false;
}

/**
 * Retrieves an unused email account from the API based on the provided country.
 *
 * @param {string} country - The country code for the email account.
 * @return {Object|null} An object containing the email and password of the retrieved email account, or null if no account is found.
 */
function getEmailAccount(country) {
    function getFormattedDate(date) {
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从 0 开始，需要加 1 并补零
        var day = ('0' + date.getDate()).slice(-2); // 补零
        var hours = ('0' + date.getHours()).slice(-2); // 补零
        var minutes = ('0' + date.getMinutes()).slice(-2); // 补零
        var seconds = ('0' + date.getSeconds()).slice(-2); // 补零

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    if (country == null || country == "") {
        return null;
    }

    // Get last email registered
    var jsonResp = http.get("https://aadmin.focuslife.today/api/appnames?limit=1").body.json()
    toastLog("jsonResp: " + JSON.stringify(jsonResp))
    var lastEmail = ""
    if (jsonResp.length > 0) {
        lastEmail = jsonResp[0].app_name
    }
    toastLog("lastEmail: " + lastEmail)

    // Get last ID of email
    var lastId = 0
    if (lastEmail != "") {
        var url = "https://aadmin.focuslife.today/api/email-accounts?email=" + lastEmail;
        var jsonResp = http.get(url).body.json();
        if (jsonResp.length > 0) {
            lastId = jsonResp[0].id
        }
    }
    toastLog("lastId: " + lastId)

    var date = new Date();
    date.setDate(date.getDate() - 7);
    var oneWeekAgo = getFormattedDate(date);
    var url = "https://aadmin.focuslife.today/api/email-accounts?id>" + lastId + "&limit=1&last_click_id!=risked&last_click_id!=disabled&order_by=created_at,asc&created_at<=" + oneWeekAgo;
    var resp = http.get(url);
    if (resp.statusCode == 200) {
        var emailAccounts = resp.body.json();
        for (let index = 0; index < emailAccounts.length; index++) {
            const element = emailAccounts[index];
            return {
                email: element.email,
                password: element.password
            };
        }
    } else {
        toastLog("Error: " + resp.statusCode);
    }

    return null;
}

function uploadGrindrAccount(emailAccount) {
    var jsonResp = http.post("https://aadmin.focuslife.today/api/appnames", {
        app_name: emailAccount.email,
        app_number: emailAccount.password,
        publisher_id: "-1",
        package: "0",
        country: "0",
        device_type: "0"
    }).body.json();

    if (jsonResp.app_name == emailAccount.email) {
        toastLog("createGrindrAccount success")
        return true;
    }
    return false;
}

function markGrindrAccountAsOk(emailAccount) {
    if (emailAccount == null) {
        return false;
    }

    var url = "https://aadmin.focuslife.today/api/appnames?app_name=" + emailAccount.email;
    var data = {
        publisher_id: '0'
    };

    var jsonData = JSON.stringify(data);

    var res = http.request(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonData,
        contentType: "application/json"
    });

    if (res.statusCode == 200) {
        toastLog("markGrindrAccountAsOk success")
        return true;
    }
    return false;
}

function markAsRisked(emailAccount) {
    if (emailAccount == null) {
        return false;
    }

    var url = "https://aadmin.focuslife.today/api/email-accounts?email=" + emailAccount.email;
    var data = {
        last_click_id: 'risked'
    };

    var jsonData = JSON.stringify(data);

    var resp = http.request(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"  // 指定内容类型为 JSON
        },
        body: jsonData,
        contentType: "application/json"  // 指定请求内容类型
    });

    if (resp.statusCode == 200) {
        return true;
    }
    return false;
}

/**
 * Returns a random date between January 1, 1900 and the current date.
 *
 * @return {Date} A random date.
 */
function getRandomBirthday() {
    var min = new Date(1950, 0, 1);
    var max = new Date(2004, 11, 31); // 2004年的最后一天
    var randomDate = new Date(min.getTime() + Math.random() * (max.getTime() - min.getTime()));

    var year = randomDate.getFullYear().toString().padStart(4, '0');
    var month = (randomDate.getMonth() + 1).toString().padStart(2, '0'); // getMonth()返回0-11，需+1
    var day = randomDate.getDate().toString().padStart(2, '0');

    return {
        year: year,
        month: month,
        day: day
    };
}
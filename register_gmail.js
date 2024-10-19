const GLOBAL_TIMEOUT = 10000;

function getRandomUser() {
    var count = 0
    while (count < 3) {
        count++;
        try {
            var userData = http.get('https://randomuser.me/api').body.json();
            var firstName = userData.results[0].name.first;
            var lastName = userData.results[0].name.last;
            var dob = userData.results[0].dob.date;
            var gender = userData.results[0].gender;
            return {
                firstName: firstName,
                lastName: lastName,
                dob: dob,
                gender: gender
            };
        } catch (e) {
            console.log("get random user failed, try again");
            sleep(3000); // 等待3秒再重试
        }
    }
    return {
        firstName: null,
        lastName: null,
        dob: null,
        gender: null
    };
}

function parseDob(dob) {
    var datePart = dob.split('T')[0];
    var dobParts = datePart.split('-');
    var dobYear = dobParts[0];
    var dobMonth = dobParts[1];
    var dobDay = dobParts[2];
    return {
        year: dobYear,
        month: dobMonth,
        day: dobDay
    };
}

function generateUsername(firstName, lastName) {
    var fullName = firstName + lastName;
    var lowerName = fullName.toLowerCase();
    var username = lowerName.replace(/\s+/g, ".").replace(/-+/g, ".");
    var randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return username + randomNumber;
}

function generate_password() {
    const digits = "0123456789";
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const allChars = digits + upperCase + lowerCase;

    const password = [
        digits.charAt(Math.floor(Math.random() * digits.length)),
        upperCase.charAt(Math.floor(Math.random() * upperCase.length)),
        lowerCase.charAt(Math.floor(Math.random() * lowerCase.length))
    ];

    for (let i = 0; i < 5; i++) {
        password.push(allChars.charAt(Math.floor(Math.random() * allChars.length)));
    }

    password.sort(() => Math.random() - 0.5);

    return password.join('');
}

// Refresh ip
var jsonResp = http.get("http://97.64.30.72:8000/refresh_ip?country_code=US").body.json()
if (jsonResp.new_ip != null) {
    toastLog("Refresh ip success. new ip: " + jsonResp.new_ip)
} else {
    toastLog("Refresh ip failed, " + JSON.stringify(jsonResp))
    exit()
}
sleep(1000)

launch("com.android.vending")
sleep(1000)
var signInBtn = id("0_resource_name_obfuscated").className("android.widget.Button").text("Sign in").findOne(GLOBAL_TIMEOUT)
if (signInBtn) {
    toastLog("signInBtn exists, click it")
    signInBtn.click()
}
sleep(5000)

className("android.widget.Button").text("Create account").findOne(GLOBAL_TIMEOUT).click()
click(350, 1380)
sleep(10000)

var user = getRandomUser()
setText(0, user.firstName)
sleep(1000)
setText(1, user.lastName)
sleep(1000)
className("android.widget.Button").findOne(GLOBAL_TIMEOUT).click()
sleep(3000)

click(220, 770)
sleep(1000)

click(540, Math.floor(Math.random() * (2200 - 150 + 1)) + 150)
sleep(1000)

birthDay = parseDob(user.dob)
setText(0, birthDay.day)
setText(1, birthDay.year)
click(540, 990)
sleep(1000)
click(540, Math.random() * (1300 - 900 + 1) + 900)
sleep(1000)
className("android.widget.Button").findOne(GLOBAL_TIMEOUT).click()
sleep(3000)

if (text("Choose your Gmail address").findOne(GLOBAL_TIMEOUT) != null) {
    click(107, 740)
    var suggested_item = id("selectionc8").findOne(GLOBAL_TIMEOUT)
    if (suggested_item) {
        var email = suggested_item.text()
        toastLog("email: " + email)
    }
    className("android.widget.Button").findOne(GLOBAL_TIMEOUT).click()
    sleep(5000)
} else {
    var username = generateUsername(user.firstName, user.lastName)
    toastLog("username: " + username)
    setText(0, username)
    className("android.widget.Button").findOne(GLOBAL_TIMEOUT).click()
    sleep(5000)
}

var password = generate_password()
toastLog("password: " + password)
setText(0, password)
sleep(1000)
className("android.widget.Button").findOne(GLOBAL_TIMEOUT).click()
sleep(3000)
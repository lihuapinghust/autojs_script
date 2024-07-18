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

    var date = new Date();
    date.setDate(date.getDate() - 7);
    var oneWeekAgo = getFormattedDate(date);
    var url = "https://aadmin.focuslife.today/api/email-accounts?used=0&registered=0&limit=1&order_by=created_at,asc&created_at<=" + oneWeekAgo;
    var resp = http.get(url);
    if (resp.statusCode == 200) {
        var emailAccounts = resp.body.json();
        for (let index = 0; index < emailAccounts.length; index++) {
            const element = emailAccounts[index];

            result = {
                email: element.email,
                password: element.password
            }
            markAsUsed(result);
            return result;
        }
    } else {
        toastLog("Error: " + resp.statusCode);
    }

    return null;
}

/**
 * Marks the given email account as used by sending a PUT request to the API.
 *
 * @param {Object} emailAccount - The email account object containing the email and password.
 * @return {boolean} Returns true if the email account was marked as used successfully, false otherwise.
 */
function markAsUsed(emailAccount) {
    if (emailAccount == null) {
        return false;
    }

    var url = "https://aadmin.focuslife.today/api/email-accounts?email=" + emailAccount.email;
    var data = {
        used: 1
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
 * Marks the given email account as registered by sending a PUT request to the API.
 *
 * @param {Object} emailAccount - The email account object containing the email.
 * @return {boolean} Returns true if the email account was marked as registered successfully, false otherwise.
 */
function markAsRegistered(emailAccount) {
    if (emailAccount == null) {
        return false;
    }

    var url = "https://aadmin.focuslife.today/api/email-accounts?email=" + emailAccount.email;
    var data = {
        registered: 1
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
 * Marks the given email account as risked by sending a PUT request to the API with last_click_id as 'risked'.
 *
 * @param {Object} emailAccount - The email account object containing the email.
 * @return {boolean} Returns true if the email account was marked as risked successfully, false otherwise.
 */
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

module.exports = {
    getEmailAccount: getEmailAccount,
    markAsUsed: markAsUsed,
    markAsRegistered: markAsRegistered,
    markAsRisked: markAsRisked
};
// var emailAccount = getEmailAccount("ID");
// if (emailAccount != null) {
//     console.log(emailAccount.email);
//     console.log(emailAccount.password);

//     if (markAsUsed(emailAccount)) {
//         console.log("Marked as used");
//     }
// }


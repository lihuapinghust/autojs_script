launch("com.lovepi.setting")
sleep(3000)
http.get("http://127.0.0.1:1688/cmd?fun=newRecord&targets=com.shopee.id")

launch("com.shopee.id")
sleep(10000)

var shopeeLogin = require("/sdcard/Download/autojs_script/shopee_login_google.js");
shopeeLogin.shopeeLogin()
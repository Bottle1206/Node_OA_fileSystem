function getUserName(){
	var UserName;
	if(document.cookie) {
		if(document.cookie.includes(';')) {
			var cookieArray = document.cookie.split(';');
			for(var i = 0; i < cookieArray.length; i++) {
				if(cookieArray[i].split("=")[0] == "islogin_name") {
					var UserName = cookieArray[i].split("=")[1];
					break;
				};
			}
			if(i != cookieArray.length) {
				sessionStorage.setItem("islogin_name", UserName);
			} else {
				UserName = sessionStorage.getItem("islogin_name");
			}
		} else {
			UserName = sessionStorage.getItem("islogin_name");
		}
	} else {
		UserName = sessionStorage.getItem("islogin_name");
	}
	return UserName;
}
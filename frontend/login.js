var user = {
    name: ""
}

var id_token = ""

function onSignIn(googleUser) {
    alert(googleUser)
    var profile = googleUser.getBasicProfile();
    user.name = profile.getName();
    id_token = googleUser.getAuthResponse().id_token;
}

function onFailure() {
    alert("ERROR")
}

function getAccessToken() {
    return id_token;
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
    })
}
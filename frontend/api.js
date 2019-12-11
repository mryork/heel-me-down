var user = {
    name: ""
}

var id_token = ""

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    user.name = profile.getName();
    id_token = googleUser.getAuthResponse().id_token;
}

function onFailure() {
    alert("Your Google account is not compatible with Heel Me Down. This shouldn't happen.");
}

function getAccessToken() {
    return id_token;
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();

    auth2.signOut().then(() => {
        window.location.assign("http://heel-me-down-mryork.cloudapps.unc.edu/")
    })
}

function isSignedIn() {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
}
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

// API Information
const API_URL = "http://heel-me-down-mryork.cloudapps.unc.edu/api/"

function getUser() {
    return user;
}

async function getPosts(department, number) {
    const data = { department: department, number: number };

    fetch(API_URL + "search", { method: "POST", body: data }).then(ret => {
        return ret;
    })
}

async function getUserPosts() {
    const data = { token: id_token };

    fetch(API_URL + "userPosts", { method: "POST", body: data }).then(ret => {
        return ret;
    })
}

async function getInquiries() {
    const data = { token: id_token };

    fetch(API_URL + "getInquiries", { method: "POST", body: data }).then(ret => {
        return ret;
    })
}

async function createPost(name, description, price, department, number) {
    const data = { name: name, description: description, token: id_token, price: price, department: department, number: number, userName: getUser().name };

    fetch(API_URL + "createPost", { method: "POST", body: data }).then(ret => {
        return ret;
    })
}

async function createInquiry(postID, message, phone, email) {
    const data = { postID: postID, message: message, phone: phone, email: email, token: id_token };

    fetch(API_URL + "createInquiry", { method: "POST", body: data }).then(ret => {
        return ret;
    })
}

async function deletePost(postID) {
    const data = { postID: postID, token: id_token };

    fetch(API_URL + "deletePost", { method: "POST", body: data }).then(ret => {
        return ret;
    })
}

async function markAsSold(postID) {
    const data = { postID: postID, token: id_token };

    fetch(API_URL + "sold", { method: "POST", body: data }).then(ret => {
        return ret;
    })
}

async function markAsUnsold(postID) {
    const data = { postID: postID, token: id_token };

    fetch(API_URL + "unsold", { method: "POST", body: data }).then(ret => {
        return ret;
    })
}
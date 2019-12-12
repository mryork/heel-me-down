var user = {
}

var id_token = ""

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    user.name = profile.getName();
    id_token = googleUser.getAuthResponse().id_token;

    document.getElementById("signinarea").innerHTML = `<button class="button is-primary" onclick="signOut">Sign Out</button>`
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
    user.name = "John Doe";
    return user;
}

function getPosts(department, number) {
    return new Promise((resolve, rej) => {
        const data = { department: department, number: number };

        fetch(API_URL + "search", { method: "POST", headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then((res) => {
            return res.json();
        }).then((res) => {
            resolve(res);
        });
    })
}

function getUserPosts() {
    if (!id_token) {
        setTimeout(() => { getUserPosts() }, 500)
    }
    return new Promise((resolve, rej) => {
        const data = { token: id_token };

        fetch(API_URL + "userPosts", { method: "POST", headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then((res) => {
            return res.json();
        }).then((res) => {
            resolve(res);
        });
    })
}

function getInquiries() {
    return new Promise((resolve, rej) => {
        const data = { token: id_token };

        fetch(API_URL + "getInquiries", { method: "POST", headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then((res) => {
            return res.json();
        }).then((res) => {
            resolve(res);
        });
    })
}

function createPost(name, description, price, department, number) {
    return new Promise((resolve, rej) => {
        const data = { name: name, description: description, token: id_token, price: price, department: department, number: number, userName: getUser().name };

        fetch(API_URL + "createPost", { method: "POST", headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then((res) => {
            return res.json();
        }).then((res) => {
            resolve(res);
        });
    })
}

function createInquiry(postID, message, phone, email) {
    return new Promise((resolve,rej) => {
        const data = { postID: postID, message: message, phone: phone, email: email, token: id_token };

        fetch(API_URL + "createInquiry", { method: "POST", headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then((res) => {
            return res.json();
        }).then((res) => {
            resolve(res);
        });
    })
}

function deletePost(postID) {
    return new Promise((resolve, rej) => {
        const data = { postID: postID, token: id_token };

        fetch(API_URL + "deletePost", { method: "POST", headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then((res) => {
            return res.json();
        }).then((res) => {
            resolve(res);
        });
    })
}

function markAsSold(postID) {
    return new Promise((resolve, rej) => {
        const data = { postID: postID, token: id_token };

        fetch(API_URL + "sold", { method: "POST", headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then((res) => {
            return res.json();
        }).then((res) => {
            resolve(res);
        });
    })
}

function markAsUnsold(postID) {
    return new Promise((res, rej) => {
        const data = { postID: postID, token: id_token };

        fetch(API_URL + "unsold", { method: "POST", headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then((resp) => {
            return resp.json();
        }).then((resp) => {
            res(resp);
        });
    })
}
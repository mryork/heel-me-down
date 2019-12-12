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

function getPosts(department, number) {
    return new Promise((res, rej) => {
        const data = { department: department, number: number };

        fetch(API_URL + "search", { method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then(ret => {
            res(ret.body)
        }).catch(() => {
            rej("err")
        })
    })
}

function getUserPosts() {
    return new Promise((res, rej) => {
        const data = { token: id_token };

        fetch(API_URL + "userPosts", { method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then(ret => {
            res(ret.body)
        }).catch(() => {
            rej("err")
        })
    })
}

function getInquiries() {
    return new Promise((res, rej) => {
        const data = { token: id_token };

        fetch(API_URL + "getInquiries", { method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then(ret => {
            res(ret.body);
        }).catch(() => {
            rej("err")
        })
    })
}

function createPost(name, description, price, department, number) {
    return new Promise((res, rej) => {
        const data = { name: name, description: description, token: id_token, price: price, department: department, number: number, userName: getUser().name };

        fetch(API_URL + "createPost", { method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then(ret => {
            res(ret.body);
        }).catch(() => {
            rej("err")
        })
    })
}

function createInquiry(postID, message, phone, email) {
    return new Promise((res,rej) => {
        const data = { postID: postID, message: message, phone: phone, email: email, token: id_token };

        fetch(API_URL + "createInquiry", { method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then(ret => {
            res(ret.body);
        }).catch(() => {
            rej("err")
        })
    })
}

function deletePost(postID) {
    return new Promise((res, rej) => {
        const data = { postID: postID, token: id_token };

        fetch(API_URL + "deletePost", { method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then(ret => {
            res(ret.body);
        }).catch(() => {
            rej('err')
        })
    })
}

function markAsSold(postID) {
    return new Promise((res, rej) => {
        const data = { postID: postID, token: id_token };

        fetch(API_URL + "sold", { method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then(ret => {
            res(ret.body);
        }).catch(() => {
            rej("err");
        })
    })
}

function markAsUnsold(postID) {
    return new Promise((res, rej) => {
        const data = { postID: postID, token: id_token };

        fetch(API_URL + "unsold", { method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }, body: JSON.stringify(data) }).then(ret => {
            res(ret.body);
        }).catch(() => {
            rej("err")
        })
    })
}
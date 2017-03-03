import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Facebook } from "ng2-cordova-oauth/core";
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
export var User = (function () {
    function User(name, email) {
        this.name = name;
        this.email = email;
    }
    return User;
}());
export var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        this.parseConfig = {
            appName: "schild-besafe",
            serverURL: "https://besafe-parse.herokuapp.com/parse",
            masterKey: "schild#besafe"
        };
        this.oauth = new OauthCordova();
        this.providerFB = new Facebook({
            clientId: "1256418511116987",
            appScope: ["email", "public_profile"]
        });
        console.log('constructor AuthService Provider');
    }
    AuthService.prototype.login = function () {
        var _this = this;
        console.log("login with facebook");
        // if (credentials.email === null || credentials.password === null)
        // {
        //   return Observable.throw("Please insert credentials");
        // }
        // else
        // {
        return Observable.create(function (observer) {
            console.log("Observable create");
            var windowa = {
                location: 'yes',
                toolbarposition: 'top',
                clearcache: 'no',
                clearsessioncache: 'no'
            };
            //original
            // this.oauth.logInVia(this.providerFB,windowa).then((success) =>
            // {
            //
            //     console.log((success));
            //     console.log("Login FB Success" + JSON.stringify(success));
            //
            //     let data: any = JSON.parse(JSON.stringify(success));
            //     console.log((data));
            //
            //     let array = [];
            //     for (let key in data) {
            //        console.log("key "+ key + " d " + data[key]);
            //        array.push(data[key]);
            //      }
            //
            //     var accessToken = array[0];
            //     var expiresIn   = array[1];
            // //debugger
            var accessToken = "EAAR2tLsLWrsBAG98gKgi8vYXuCLO6WwHFXenwCaAWhPV9fnD8IMZCq01IAKWsVxtvTdoN0SObA06C9OHqkhO2C61iS7uGe5ZBbj8ZBSEyreOuZAdRxsC80LJPenWGWZCcxItZCisOV0csqXSlm45Ox9OHZBr0RmuDQZD";
            var expiresIn = 5105964;
            console.log("accessToken " + (accessToken));
            console.log("expiresIn " + (expiresIn));
            var authData = { facebook: {
                    id: 0,
                    access_token: accessToken,
                    expiration_date: expiresIn
                }
            };
            _this.getFacebookMe(authData).then(function (facebookMe) {
                console.log("facebookMe");
                console.log(facebookMe);
                return _this.doParseFetch(facebookMe);
            }).then(function (currentParseUser) {
                console.log("currentUser");
                console.log(currentParseUser);
                var access = false;
                if (currentParseUser.authenticated()) {
                    access = true;
                }
                observer.next(access);
                observer.complete();
            }); //end then
            //debugger
            // });//ENSE oauth window
        }); //ENSE Observable
        // }//END ELSE
    }; //END LOGIN FUNCTION //return current Parse.user
    AuthService.prototype.getFacebookMe = function (authData) {
        var _this = this;
        var access_token = authData.facebook.access_token;
        var version = 'v2.8';
        var fields = 'id,name,gender,birthday,email';
        var url = 'https://graph.facebook.com/' + version + '/me?fields=' + fields + '&access_token=' + access_token;
        console.log(url);
        return new Promise(function (resolve, reject) {
            _this.http.get(url).map(function (res) { return res.json(); }).subscribe(function (json) {
                console.log(json);
                var jsonCopy = json;
                authData.facebook.id = jsonCopy.id;
                var out = { authData: authData, facebookUserData: json };
                console.log("out");
                console.log(out);
                resolve(out);
            });
        });
    };
    AuthService.prototype.doParseFetch = function (facebookMe) {
        console.log("doParseFetch");
        console.log(facebookMe);
        //check if user exist
        //if exist retunr login
        //else create new
        var Parse = require('parse');
        Parse.initialize(this.parseConfig.appName, 'unused'); //,,'unused'
        Parse.masterKey = this.parseConfig.masterKey;
        Parse.serverURL = this.parseConfig.serverURL;
        var password = Math.random().toString(36).substring(7);
        console.log("global password " + password);
        var query = new Parse.Query(Parse.User);
        query.equalTo('facebookId', facebookMe.facebookUserData.id);
        return query.first({ useMasterKey: true }).then(function (parseUser) {
            console.log("doParseFetch query.first");
            console.log(parseUser);
            // If not, create a new user.
            if (!parseUser) {
                console.log("doParseFetch new user");
                console.log("createUser");
                console.log(facebookMe);
                var facebookUserData = facebookMe.facebookUserData;
                var authData = facebookMe.authData;
                var user = new Parse.User();
                // Generate a random username and password.
                var username = Math.random().toString(36).substring(7);
                user.set("username", username);
                user.set("password", password);
                user.set('facebookId', facebookUserData.id);
                user.set('email', facebookUserData.email);
                user.set('name', facebookUserData.name);
                user.set('gender', facebookUserData.gender);
                user.set('age', facebookUserData.birthday);
                user.set('authData', authData);
                var acl = new Parse.ACL();
                acl.setPublicReadAccess(true);
                acl.getPublicWriteAccess(true);
                user.setACL(acl);
                return user.signUp(null, { useMasterKey: true });
            }
            else {
                //set a new password to login
                parseUser.set('authData', facebookMe.authData);
                parseUser.set('password', password);
                return parseUser.save(null, { useMasterKey: true });
            }
        }).then(function (user) {
            console.log("doParseFetch save or create");
            console.log(user);
            if (user.getSessionToken()) {
                return Parse.User.become(user.getSessionToken());
            }
            else {
                return Parse.User.logIn(user.get("username"), password);
            }
        }).then(function (user) {
            // Return the user object.
            console.log("doParseFetch done login");
            console.log(user);
            return Parse.Promise.as(user);
        });
    };
    AuthService.prototype.register = function (credentials) {
        if (credentials.email === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        }
        else {
            // At this point store the credentials to your backend!
            return Observable.create(function (observer) {
                observer.next(true);
                observer.complete();
            });
        }
    };
    AuthService.prototype.getUserInfo = function () {
        return this.currentUser;
    };
    AuthService.prototype.logout = function () {
        var _this = this;
        return Observable.create(function (observer) {
            var Parse = require('parse');
            Parse.initialize(_this.parseConfig.appName, 'unused');
            Parse.masterKey = _this.parseConfig.masterKey;
            Parse.serverURL = _this.parseConfig.serverURL;
            Parse.User.logOut().then(function () {
                var currentUser = Parse.User.current(); // this will now be null
                _this.currentUser = null;
                observer.next(true);
                observer.complete();
            });
        });
    };
    AuthService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AuthService.ctorParameters = [
        { type: Http, },
    ];
    return AuthService;
}()); //end AuthService
//# sourceMappingURL=auth-service.js.map
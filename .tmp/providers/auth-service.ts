import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Facebook } from "ng2-cordova-oauth/core";
import {OauthCordova} from 'ng2-cordova-oauth/platform/cordova'


declare var jsonCopy;

export class User {
  name: string;
  email: string;
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}


@Injectable()
export class AuthService
{

   currentUser: User;
   parseConfig: any;
   public oauth: OauthCordova;
   private providerFB: Facebook;

  constructor(public http: Http)
  {

    this.parseConfig = {
       appName: "schild-besafe",
       serverURL: "https://besafe-parse.herokuapp.com/parse",
       masterKey: "schild#besafe"
    };

     this.oauth = new OauthCordova();

     this.providerFB = new Facebook({
         clientId: "1256418511116987",
         appScope: ["email","public_profile"]
     });

    console.log('constructor AuthService Provider');
  }


  public login()
  {
      console.log("login with facebook");

      // if (credentials.email === null || credentials.password === null)
      // {
      //   return Observable.throw("Please insert credentials");
      // }
      // else
      // {

        return Observable.create(observer =>
        {

            console.log("Observable create");
            var windowa = {
              location: 'yes',
              toolbarposition: 'top',
              clearcache : 'no',
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
                var  expiresIn = 5105964;


                console.log("accessToken "+ (accessToken));
                console.log("expiresIn "+(expiresIn));

                var authData = {facebook: {
                                      id:0,
                                      access_token: accessToken,
                                      expiration_date: expiresIn
                                    }
                  };


                this.getFacebookMe(authData).then((facebookMe) =>
                {

                    console.log("facebookMe");
                    console.log(facebookMe);
                    return this.doParseFetch(facebookMe);
                }).then(function (currentParseUser) {

                    console.log("currentUser");
                    console.log(currentParseUser);
                     let access = false;
                     if(currentParseUser.authenticated())
                     {
                        access = true;
                     }
                     observer.next(access);
                     observer.complete();
                 });//end then

          //debugger
          // });//ENSE oauth window

      });//ENSE Observable
    // }//END ELSE
  }//END LOGIN FUNCTION //return current Parse.user


  getFacebookMe(authData)
  {
        var access_token = authData.facebook.access_token;
        var version = 'v2.8';
        var fields = 'id,name,gender,birthday,email';
        var url = 'https://graph.facebook.com/'+ version +'/me?fields='+fields +'&access_token=' + access_token;
        console.log(url);

        return  new Promise<any>((resolve, reject) =>
        {
          this.http.get(url).map(res => res.json()).subscribe((json: Object) =>
          {
              console.log(json);
              var jsonCopy:any = json;
              authData.facebook.id = jsonCopy.id;
              var out = {authData: authData, facebookUserData: json};
              console.log("out");
              console.log(out);
              resolve(out);

            });
        });
    }


    doParseFetch(facebookMe)
    {
      console.log("doParseFetch");
      console.log(facebookMe);
      //check if user exist
      //if exist retunr login
      //else create new
      var Parse = require('parse');
      Parse.initialize(this.parseConfig.appName, 'unused');  //,,'unused'
      Parse.masterKey =  this.parseConfig.masterKey;
      Parse.serverURL = this.parseConfig.serverURL;

      var password = Math.random().toString(36).substring(7);
      console.log("global password " + password);

      var query = new Parse.Query(Parse.User);
      query.equalTo('facebookId', facebookMe.facebookUserData.id);
      return query.first({ useMasterKey: true }).then(function(parseUser)
      {
          console.log("doParseFetch query.first");
          console.log(parseUser);
          // If not, create a new user.
          if (!parseUser)
          {

              console.log("doParseFetch new user");
              console.log("createUser");
              console.log(facebookMe);

              var facebookUserData = facebookMe.facebookUserData;
              var authData = facebookMe.authData;
              var user = new Parse.User();
              // Generate a random username and password.
              var username =Math.random().toString(36).substring(7);
              user.set("username", username);
              user.set("password", password);

              user.set('facebookId', facebookUserData.id);
              user.set('email', facebookUserData.email);
              user.set('name', facebookUserData.name);
              user.set('gender', facebookUserData.gender);
              user.set('age', facebookUserData.birthday);

              user.set('authData', authData);

              let acl = new Parse.ACL();
              acl.setPublicReadAccess(true);
              acl.getPublicWriteAccess(true);
              user.setACL(acl);

            return user.signUp(null,{ useMasterKey: true });

          }
          else
          {
             //set a new password to login
              parseUser.set('authData', facebookMe.authData);
              parseUser.set('password', password);
              return parseUser.save(null,{ useMasterKey: true });
            }

        }).then(function(user) {

           console.log("doParseFetch save or create");
           console.log(user);
            if(user.getSessionToken())
            {
              return  Parse.User.become(user.getSessionToken());
            }
            else {
              return Parse.User.logIn(user.get("username"), password);
            }

        }).then(function(user) {
         // Return the user object.
          console.log("doParseFetch done login");
          console.log(user);
          return Parse.Promise.as(user);
        });

      }



    public register(credentials) {
      if (credentials.email === null || credentials.password === null) {
        return Observable.throw("Please insert credentials");
      } else {
        // At this point store the credentials to your backend!
        return Observable.create(observer => {
          observer.next(true);
          observer.complete();
        });
      }
    }


    public getUserInfo() : User
    {
      return this.currentUser;
    }

    public logout()
    {

      return Observable.create(observer => {

        var Parse = require('parse');
        Parse.initialize(this.parseConfig.appName, 'unused');
        Parse.masterKey =  this.parseConfig.masterKey;
        Parse.serverURL = this.parseConfig.serverURL;

          Parse.User.logOut().then(() => {
            var currentUser = Parse.User.current();  // this will now be null
            this.currentUser = null;
            observer.next(true);
            observer.complete();
          });

      });
    }

}//end AuthService

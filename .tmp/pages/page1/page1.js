import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
export var Page1 = (function () {
    function Page1(nav, auth) {
        this.nav = nav;
        this.auth = auth;
        var info = this.auth.getUserInfo();
        // this.username = info.name;
        // this.email = info.email;
    }
    Page1.prototype.ionViewDidLoad = function () {
        console.log('Hello logout Page');
        this.logout();
    };
    Page1.prototype.logout = function () {
        var _this = this;
        console.log("logout");
        this.auth.logout().subscribe(function (succ) {
            _this.nav.setRoot(LoginPage);
        });
    };
    Page1.decorators = [
        { type: Component, args: [{
                    selector: 'page-page1',
                    templateUrl: 'page1.html'
                },] },
    ];
    /** @nocollapse */
    Page1.ctorParameters = [
        { type: NavController, },
        { type: AuthService, },
    ];
    return Page1;
}());
//# sourceMappingURL=page1.js.map
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { GoogleMapView } from '../pages/map/map';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth-service';
import { CrimeService } from '../providers/crime-service';
import { RegisterPage } from '../pages/register/register';
import { ReportPage } from '../pages/report/report';
import { ReportTwoPage } from '../pages/report-two/report-two';
import { LocationTracker } from '../providers/location-tracker';
import { DataService } from '../providers/data-service';
import { AngularFireModule } from 'angularfire2';
// AF2 Settings
export var firebaseConfig = {
    apiKey: "AIzaSyC9A2I-2l0sncsDHU5c1c-HLx2iikhb8TI",
    authDomain: "schild-app.firebaseapp.com",
    databaseURL: "https://schild-app.firebaseio.com",
    storageBucket: "schild-app.appspot.com",
    messagingSenderId: "696981345646"
};
export function createTranslateLoader(http) {
    return new TranslateStaticLoader(http, './assets/i18n', '.json');
}
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        MyApp,
                        Page1,
                        Page2,
                        GoogleMapView,
                        LoginPage,
                        RegisterPage,
                        ReportPage,
                        ReportTwoPage
                    ],
                    imports: [
                        IonicModule.forRoot(MyApp),
                        // TranslateModule.forRoot({
                        //     provide: TranslateLoader,
                        //     useFactory: (createTranslateLoader),
                        //     deps: [Http]
                        //   }),
                        // TranslateModule.forRoot()
                        AngularFireModule.initializeApp(firebaseConfig)
                    ],
                    bootstrap: [IonicApp],
                    entryComponents: [
                        MyApp,
                        Page1,
                        Page2,
                        GoogleMapView,
                        LoginPage,
                        RegisterPage,
                        ReportPage,
                        ReportTwoPage
                    ],
                    providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, AuthService, CrimeService, LocationTracker, DataService]
                },] },
    ];
    /** @nocollapse */
    AppModule.ctorParameters = [];
    return AppModule;
}());
//# sourceMappingURL=app.module.js.map
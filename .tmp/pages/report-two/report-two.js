import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { CrimeService } from '../../providers/crime-service';
export var ReportTwoPage = (function () {
    function ReportTwoPage(navCtrl, formBuilder, crimeService, loadingCtrl, alertCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.formBuilder = formBuilder;
        this.crimeService = crimeService;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.navParams = navParams;
        // slideTwoForm: FormGroup;
        this.submitAttempt = false;
        this.timeNow = new Date().toISOString();
        this.location = navParams.get("location");
        // this.reportFormBuilder = formBuilder.group({
        //     address: ['', Validators.compose([Validators.minLength(5), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        //     damage: ['', AgeValidator.isValid]
        // });
        this.reportForm = formBuilder.group({
            reportDate: [this.timeNow],
            reportTime: [this.timeNow],
            damage: [],
            type: ['', Validators.required],
            description: ['']
        });
    }
    ReportTwoPage.prototype.ionViewDidLoad = function () {
        console.log('Hello ReportTwoPage Page');
    };
    ReportTwoPage.prototype.prev = function () {
        this.navCtrl.pop();
    };
    ReportTwoPage.prototype.save = function () {
        var _this = this;
        this.submitAttempt = true;
        if (this.reportForm.valid) {
            this.showLoading();
            console.log("success!");
            console.log(this.reportForm.value);
            this.crimeService.save(Object.assign(this.reportForm.value, this.location)).then(function (allowed) {
                if (allowed) {
                    setTimeout(function () {
                        _this.showAlert("Thank you!");
                        _this.navCtrl.popToRoot(); //this.appCtrl.getRootNav()
                    });
                }
                else {
                    _this.showError("Access Denied");
                }
            });
        }
    };
    ReportTwoPage.prototype.showLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
    };
    ReportTwoPage.prototype.showError = function (text) {
        var _this = this;
        setTimeout(function () {
            _this.loading.dismiss();
        });
        var alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present(prompt);
    };
    ReportTwoPage.prototype.showAlert = function (text) {
        var _this = this;
        setTimeout(function () {
            _this.loading.dismiss();
        });
        var alert = this.alertCtrl.create({
            title: 'Success',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present(prompt);
    };
    ReportTwoPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-report-two',
                    templateUrl: 'report-two.html'
                },] },
    ];
    /** @nocollapse */
    ReportTwoPage.ctorParameters = [
        { type: NavController, },
        { type: FormBuilder, },
        { type: CrimeService, },
        { type: LoadingController, },
        { type: AlertController, },
        { type: NavParams, },
    ];
    ReportTwoPage.propDecorators = {
        'reportFormList': [{ type: ViewChild, args: ['reportSlider',] },],
    };
    return ReportTwoPage;
}());
//# sourceMappingURL=report-two.js.map
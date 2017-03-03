import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController,NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-report-two',
  templateUrl: 'report-two.html'
})
export class ReportTwoPage {

      @ViewChild('reportSlider') reportFormList: any;
      loading: Loading;
      reportForm: FormGroup;
      // slideTwoForm: FormGroup;
      submitAttempt: boolean = false;
      timeNow: String = new Date().toISOString();
      location : any;

      constructor(public navCtrl: NavController,
        public formBuilder: FormBuilder,
        public loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private navParams: NavParams)
        {

          this.location = navParams.get("location");

        // this.reportFormBuilder = formBuilder.group({
        //     address: ['', Validators.compose([Validators.minLength(5), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        //     damage: ['', AgeValidator.isValid]
        // });


          this.reportForm = formBuilder.group({
              reportDate: [this.timeNow],
              reportTime: [this.timeNow],
              damage: [],
              type: ['',  Validators.required],
              description: ['']
            });



      }

  ionViewDidLoad() {
    console.log('Hello ReportTwoPage Page');
  }


  prev(){
      this.navCtrl.pop();
  }

  save()
  {

      this.submitAttempt = true;

      if(this.reportForm.valid)
      {

          this.showLoading();
          console.log("success!")
          console.log(this.reportForm.value);

          // this.crimeService.save( Object.assign(this.reportForm.value, this.location) ).then( (allowed) =>
          // {
          //    if (allowed) {
          //      setTimeout(() => {
          //      this.showAlert();
          //      this.navCtrl.popToRoot(); //this.appCtrl.getRootNav()
          //      });
          //    } else {
          //      this.showError();
          //    }
          //  });

      }

    }


      showLoading()
      {
            this.loading = this.loadingCtrl.create({
                content: "wait"
              });
              this.loading.present();


      }

    showError()
    {
      setTimeout(() => {
        this.loading.dismiss();
      });



          let alert = this.alertCtrl.create({
            title: 'fail',
            subTitle: 'denied',
            buttons: ['OK']
          });
          alert.present();


    }

    showAlert()
    {
        setTimeout(() => {
          this.loading.dismiss();
        });


        let alert = this.alertCtrl.create({
          title: 'success',
          subTitle: 'thank',
          buttons: ['OK']
        });
        alert.present();

    }

}

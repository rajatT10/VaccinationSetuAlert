import { Component } from '@angular/core';
import { ConfigService } from './config.service';
import { formatDate } from '@angular/common';

export class Model {
  address: any;
  slotDate: any;
  available_capacity: any;
  available_capacity_dose1: any;
  available_capacity_dose2: any;
  fee_type: any;
  from: any;
  available_slots: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  myDate: any;
  centers: any;
  result: any = [{}];
  lastUpdateOn: any;
  filterType: any;
  inputPincode: any;
  districtCode: any;
  inputDate: any;
  url: any;
  interval: any;
  sound = document.getElementById("audio");

  constructor(private rest: ConfigService, private model: Model) {

  }

  playAudio(){
    let audio = new Audio();
    audio.src = "http://www.soundjay.com/button/beep-07.wav";
    audio.load();
    audio.play();
  }

  onSubmit(): void {
    if (this.filterType === 'pincode') {
      this.url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=" + this.inputPincode + "&date=";
    } else {
      this.url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=" + this.districtCode + "&date=";
    }

    this.interval = setInterval(() => {
      this.result = [];

      this.myDate = formatDate(this.inputDate, 'dd-MM-yyyy', 'en');
      this.lastUpdateOn = formatDate(new Date(), 'dd-MM-yyy hh:mm:ss', 'en');
      this.rest
        .getAPI(this.url + this.myDate).subscribe((res: any) => {
          this.centers = res.centers;
          this.centers.forEach((center: any) => {
            center.sessions.forEach((daySlots: any) => {
              this.model = new Model();
              if (daySlots.available_capacity >= 1 && daySlots.min_age_limit === 45) {
                this.model.slotDate = daySlots.date;
                this.model.address = center.address;
                this.model.available_capacity = daySlots.available_capacity;
                this.model.available_capacity_dose1 = daySlots.available_capacity_dose1;
                this.model.available_capacity_dose2 = daySlots.available_capacity_dose2;
                this.model.fee_type = center.fee_type;
                this.model.from = center.from;
                this.model.available_slots = daySlots.slots.length;
                this.result.push(this.model);
                console.log("Vaccine available at: " + this.model.address + " on " + this.model.slotDate);
              }
            });
          });
          if (this.result.length <= 1) {
            this.model.address = "NA";
            this.model.slotDate = "NA";
            this.result.push(this.model);
          } else {
            this.playAudio();
          }
        });
    }, 10 * 1000);
  }
}

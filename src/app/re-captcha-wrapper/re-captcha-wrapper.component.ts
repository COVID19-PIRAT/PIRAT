import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ConfigurationService } from '../configuration.service';


@Component({
  selector: 'app-re-captcha-wrapper',
  templateUrl: './re-captcha-wrapper.component.html',
  styleUrls: ['./re-captcha-wrapper.component.scss']
})
export class ReCaptchaWrapperComponent implements OnInit {

  @Output() resolved: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(RecaptchaComponent) reCaptchaElement: RecaptchaComponent;

  siteKey: string;


  constructor(
    private configurationService: ConfigurationService,
  ) {
    this.siteKey = configurationService.env.reCaptchaSiteKey;
  }


  ngOnInit(): void {
  }


  onResolved(reCaptchaResponse: string) {
    this.resolved.emit(reCaptchaResponse);
  }


  reset() {
    this.reCaptchaElement.reset();
  }
}

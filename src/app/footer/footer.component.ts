import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    public configurationService: ConfigurationService
  ) {
  }


  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent implements OnInit {

  constructor(private titleService: Title) {
    titleService.setTitle("Register - Bosshalls")
  }

  ngOnInit(): void {
  }

}

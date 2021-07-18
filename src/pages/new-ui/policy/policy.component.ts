import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {

  constructor(private titleService: Title) {
    titleService.setTitle("Privacy Policy - Bosshalls")
  }

  ngOnInit(): void {
  }

}

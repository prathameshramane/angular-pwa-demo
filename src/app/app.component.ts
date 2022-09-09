import { Component, OnInit, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AngularPWA';
  posts: any;

  constructor(private http: HttpClient, private update: SwUpdate, private appRef: ApplicationRef) {
  }

  ngOnInit() {
    this.http
      .get('https://jsonplaceholder.typicode.com/posts')
      .subscribe((res) => {
        this.posts = res;
      })
    this.updateClient();
    this.checkForUpdate();
  }

  updateClient() {

    // Ask for update on 1 refresh after new update deployed
    this.update.versionUpdates.subscribe(event => {
      if (event.type === 'VERSION_READY') {
        if (confirm("New update available. Do you want to update?")) {
          this.update.activateUpdate().then(() => location.reload());
        }
      }
    });

  }

  // Automatically checks for updates after every 20 seconds
  checkForUpdate() {
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        const timeInterval = interval(20 * 1000);
        timeInterval.subscribe(() => {
          this.update
            .checkForUpdate()
            .then((isAvailable) => {
              console.log(isAvailable);
              if (isAvailable && confirm("New update available. Do you want to update?")) {
                this.update.activateUpdate().then(() => location.reload());
              }
            })
        })
      }
    })
  }
}

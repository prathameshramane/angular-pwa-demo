import { Component, OnInit, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AngularPWA';
  posts: any;
  private readonly publicKey: string = 'BJtTvQanxWFWSWHiA_M3La8ZqjIAaC7u3FCuRiGD6-m60hJbInlf7oVZ-xu1x3AKJSlnM5pcKRl4WjK6TkhO7T4';

  constructor(
    private http: HttpClient,
    private update: SwUpdate,
    private appRef: ApplicationRef,
    private push: SwPush) {
  }

  ngOnInit() {
    this.http
      .get('https://jsonplaceholder.typicode.com/posts')
      .subscribe((res) => {
        this.posts = res;
      })
    this.updateClient();
    // this.checkForUpdate();
    this.pushNotification();
  }

  updateClient() {
    if (!this.update.isEnabled) {
      console.log('Not Enabled');
      return;
    }

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
  // checkForUpdate() {
  //   this.appRef.isStable.subscribe((isStable) => {
  //     if (isStable) {
  //       const timeInterval = interval(20 * 1000);
  //       timeInterval.subscribe(() => {
  //         this.update
  //           .checkForUpdate()
  //           .then((isAvailable) => {
  //             console.log(isAvailable);
  //             if (isAvailable && confirm("New update available. Do you want to update?")) {
  //               this.update.activateUpdate().then(() => location.reload());
  //             }
  //           })
  //       })
  //     }
  //   })
  // }

  pushNotification() {
    if (!this.push.isEnabled) {
      console.log("Notifications is disabled");
      return;
    }

    this.push
      .requestSubscription({
        serverPublicKey: this.publicKey
      }).then((sub) => {
        // Make a post call to server
        console.log(JSON.stringify(sub));
      }).catch((err) => {
        console.log(err);
      })
  }
}

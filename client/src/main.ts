import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config'; 
// Import the new config

// Bootstrap the app using the config
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

/** Start in Production Mode **/
// import { enableProdMode } from '@angular/core';
// enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);

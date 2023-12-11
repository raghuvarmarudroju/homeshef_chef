import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { defineCustomElements as pwaElements } from '@ionic/pwa-elements/loader';
// import { defineCustomElements as stripeElements } from '@stripe-elements/stripe-elements/loader';
import { defineCustomElements as stripeElements } from 'stripe-pwa-elements/loader';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { provideAnimations } from '@angular/platform-browser/animations';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LocationAccuracy,
    provideHttpClient(
    // withInterceptors([TokenInterceptor])
    ),
    importProvidersFrom(IonicModule.forRoot({})),
    provideRouter(routes),
    provideAnimations()
],
});

// Call the element loader after the platform has been bootstrapped
pwaElements(window);
stripeElements(window);

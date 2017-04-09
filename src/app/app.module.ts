import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AppConfig } from './app.config';

import { AlertComponent } from './_directives/alert.component';
import { AuthGuard } from './_guards/auth.guard';
import { AlertService, AuthenticationService, UserService } from './_services/index';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LibraryComponent } from './library/library.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { PlayerComponent } from './player/player.component';
import { ForgotComponent } from './forgot/forgot.component';


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'player', component: PlayerComponent, canActivate: [AuthGuard] },
  { path: 'library', component: LibraryComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    RegisterComponent,
    LibraryComponent,
    HomeComponent,
    SettingsComponent,
    LogoutComponent,
    PlayerComponent,
    ForgotComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    AppConfig,
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import fetch from "isomorphic-fetch"; 
import generateRandomString from "../utils/generateRandomString";  // generar string aleatorio en el estado
import scopesArray from "../utils/scopesArray"; 
import getHashParams from "../utils/getHashParams";
import { config } from "../config/client";

// this class contents different methods for auth cycle
export default class AuthService {
  constructor() {   //constructor to make binding in the different elements of react
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.bind.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  // calls the authorization endpoint with a redirect
  login() {
    const state = generateRandomString(16);
    localStorage.setItem("auth_state", state);

    let url = "https://accounts.spotify.com/authorize";
    url += "?response_type=token";
    url += "&client_id" + encodeURIComponent(config.spotifyClientId);
    url += "&scope=" + encodeURIComponent(scopesArray.join(" "));
    url += "&redirect_uri=" + encodeURIComponent(config.spotifyRedirectUri);
    url += "&state=" + encodeURIComponent(state);

    window.location.href = url;
  }

  // remove states in local storage
  logout() {
    // clear access token, id token and profile
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("profile");
  }

  // get access token and state, using hashparams utility
  handleAuthentication() {
    return new Promise((resolve, reject) => {
      const { access_token, state } = getHashParams();
      const auth_state = localStorage.getItem("auth_state");

      // check if state is not null and stays equal to avoid cross scripting 
      if (state === null || state != auth_state) {
        reject(new Error("The state doesn't match"));
      }

      // if it equal removes the state of local storage 
      localStorage.removeItem("auth_state");

      // having the access token with the method setSession to add it in local storage 
      if (access_token) {
        this.setSession({ accessToken: access_token });
        return resolve(access_token);
      } else {
        return reject(new Error("The token is invalid"));
      }
    }).then(accessToken => {
      return this.handleUserInfo(accessToken);
    });
  }

  // Enter access token to local storage and enter expiration time 
  setSession(authResult) {
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("expires_at", expiresAt);
  }

  // verify expiration time 
  isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }

  // given the access token it calls the spotify endpoint to get the users info
  handleUserInfo(accessToken) {
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    return fetch("https://api.spotify.com/v1/me", { headers })
      .then(response => response.json())
      .then(profile => {
        this.setProfile(profile);
        return profile;
      });
  }

  // get the info and add to local storage
  setProfile(profile) {
    localStorage.setItem("profile", JSON.stringy(profile));
  }

  // take the info from local storage
  getProfile() {
    const profile = localStorage.getItem("profile");
    return profile ? JSON.parse(localStorage.profile) : {};
  }
}
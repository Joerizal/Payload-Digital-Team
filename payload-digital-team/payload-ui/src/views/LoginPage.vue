<template>
    <v-container class="px-8 align-left fill-height bg-white">
      <v-card class="shadow-none border-none w-100 bg-white" variant="outlined">
        <v-card-title>
          <img src="/src/assets/icon/logo-nav-home.svg" alt="logo" class="logo" />
          <p class="font-34-800 pt-1">Welcome to JRMS</p>
          <div class="font-16-400 font-7E7E7E">Please login to get started</div>
        </v-card-title>
  
        <v-card-text elevation="8">
          <v-form ref="form" v-model="valid" @submit.prevent="initiateLogin">
            <div class="font-14-400 font-535353 pb-2">Email</div>
  
            <v-text-field
              v-model="email"
              density="compact"
              placeholder="Enter your email"
              variant="outlined"
              :rules="[rules.required]"
              class="input-height"
              @keyup.enter="initiateLogin"
            ></v-text-field>
  
            <div
              class="font-14-400 font-535353 d-flex align-center justify-space-between pb-2"
            >
              Password
  
              <router-link class="font-14-400 font-0075FF" to="forgot-password">
                Forgot Password?
              </router-link>
            </div>
  
            <v-text-field
              v-model="password"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              density="compact"
              placeholder="············"
              variant="outlined"
              :rules="[rules.required1]"
              @click:append-inner="visible = !visible"
              class="input-height"
              @keyup.enter="initiateLogin"
            ></v-text-field>
  
            <!-- <v-row class="inline-block justify-content-end">
              <v-col cols="auto">
                <v-switch
                  v-model="secureLogin"
                  label="Secure Login"
                  color="#0075ff"
                  hide-details
                ></v-switch>
              </v-col>
            </v-row> -->
            <v-btn
              class="btn-login font-16-400 p-0"
              block
              @click="initiateLogin"
              type="submit"
              :loading="loading"
            >
              Login
            </v-btn>
          </v-form>
  
          <v-card-text class="text-center">
            <div class="font-16-400 font-7E7E7E">Need Help?</div>
  
            <div
              class="font-16-400 font-535353 d-flex align-center justify-space-between pt-2"
            >
              <a
                class="font-16-400 font-0075FF"
                href="#"
                rel="noopener noreferrer"
              >
                <img
                  src="/src/assets/icon/mail-help.svg"
                  alt="mail"
                  class="ml-1"
                />
                helpdesk@jrms.com
              </a>
  
              <a
                class="font-16-400 font-0075FF"
                href="#"
                rel="noopener noreferrer"
              >
                <img
                  src="/src/assets/icon/phone-help.svg"
                  alt="phone"
                  class="ml-1"
                />
                03-123456789
              </a>
            </div>
          </v-card-text>
        </v-card-text>
      </v-card>
    </v-container>
  
    <v-dialog v-model="isOTPOpen" max-width="600">
      <OTP @close-dialog="isOTPOpen = false" @otp-verified="completeLogin" />
    </v-dialog>
    
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackBarText }}
    </v-snackbar>
  </template>
  
  <script>
  import axios from 'axios';
  import "../styles/style.scss";
  
  export default {
    data: () => ({
      snackBarText: null,
      snackbarColor: null,
      snackbar: false,
      isOTPOpen: false,
      loading: false,
      email: "",
      password: "",
      secureLogin: false,
      visible: false,
      errorMessage: "",
      valid: false,
      isLoggingIn: false,
      rules: {
        required: (value) => !!value || "Please enter a valid email",
        required1: (value) => !!value || "Please enter a valid password",
      },
    }),
    methods: {
      async initiateLogin() {
        if (this.isLoggingIn) return;
        this.loading = true;
        this.isLoggingIn = true;
        this.errorMessage = "";
        
        if (this.$refs.form.validate()) {
          if (this.secureLogin) {
            this.isOTPOpen = true;
          } else {
            await this.login();
          }
        }
        
        this.isLoggingIn = false;
      },
      
      async login() {
        try {
          if (this.email && this.password) {
            // Replace with your Payload CMS login endpoint
            const response = await axios.post('/api/users/login', {
              email: this.email, // Payload typically uses email for login
              password: this.password,
            //   otp: otp
            });
  
            // Store the authentication token
            localStorage.setItem('authToken', response.data.token);
  
            // Redirect to homepage
            this.redirectToHomepage();
          }
        } catch (error) {
          this.loading = false;
          this.isOTPOpen = false;
  
          // Handle login error
          this.snackBarText = error.response?.data?.message || 'Login failed';
          this.snackbarColor = 'error';
          this.snackbar = true;
        }
      },
  
      completeLogin(otp) {
        this.login(otp);
      },
  
      redirectToHomepage() {
        this.$router.push("/dashboard");
      },
    },
    
    // Optional: Check for existing token on component mount
    mounted() {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Optionally verify token with backend
        this.redirectToHomepage();
      }
    }
  };
  </script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  .bg-white {
    background-color: white !important; /* Force the background color to white */
  }
  
  .btn-login {
    border-radius: 6px !important;
    border: 1px solid #002680 !important;
    background: #002680 !important;
    box-shadow: 0px 2px 4px 0px rgba(165, 163, 174, 0.15) !important;
    color: #ffffff !important;
    text-transform: capitalize !important;
  }
  
  .error-message {
    color: #b00020;
    margin-top: -10px;
    margin-bottom: 10px;
  }
  
  .logo {
    width: 90px;
    height: 100px;
  }
  </style>
# Portfolio manager

Traditional asset portfolios consist mostly of stocks and bonds. But times have changed and new asset classes like crypto currencies have come up. Modern portfolios should include cryptos and commodities, so I created an app that pulls stock, crypto and commodities (like gold and silver) data to show and analyse the value of your total assets.

## Tech stack

- [Firebase](https://firebase.google.com/) - (https://stackshare.io/firebase) - A cloud-hosted NoSQL database that lets you store and sync data between your users in real-time.
- [React]](https://facebook.github.io/create-react-app/) - Bootstrapped with Create React App
- [Redux](https://redux.js.org/introduction/getting-started/)
- [Material UI](https://material-ui.com/) - (https://stackshare.io/material-ui) - (https://github.com/mui-org/material-ui) - React components that implement Google's Material Design.
- [Rechart] (http://recharts.org/) - For asset perfomance and asset allocation charts

## Installation

### Clone repo and install packages:

`npm install`

### Create firebase project and set config

You can create a free firebase project at (https://firebase.google.com/)

Copy the config variable into /portfoliomanager-frontend/src/config/fbConfig.js

### Start react app

`npm start`

Then open http://localhost:3000/ to see the app.

## Update quotes

The background job for updating quotes of the stocks, cryptos and commodities runs on a separate instance:

https://github.com/hochbruj/portfolio-manager-backend

## Deployed app

You can visit the deployed app here: https://sandbox-328be.firebaseapp.com







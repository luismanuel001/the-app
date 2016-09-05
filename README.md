# angular-fullstack

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.7.5.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.4.7, npm ^2.15.8
- [Bower](bower.io) (`npm install --global bower`)
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)

### Developing

1. Run `npm install` to install server dependencies.

2. Run `bower install` to install front-end dependencies.

3. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `grunt build` for building and `grunt serve` for preview.

## Deploy to heroku

1. Fork the [the-app](https://github.com/distributev/the-app) repo.
2. Clone the new fork into your local machine. `git clone https://github.com/<USERNAME>/the-app.git`
3. Login into the heroku dashboard, and create a new app.
4. Go to the **_Settings_** tab of your newly created app, click on **_Reveal Config Vars_** on the **_Config Variables_** section and add a new variable with a KEY of ``NPM_CONFIG_PRODUCTION`` and VALUE of ``false``.
5. Go to the **_Deploy_** tab, select **_Github_** under **_Deployment method_**, connect your github account, search for the newly forked repo (ie. ``<USERNAME>/the-app`` by default), and click **_Connect_**.
6. On the **_Automatic Deploys_** section, select ``master`` as the branch to deploy and click **_Enable Automatic deploy_**.
7. Now on the **_Manual Deploy_** section, select the branch and click on **_Deploy Branch_** so the app gets deployed for the first time.
8. (Optional) To set up you **_custom domain_** to point to Heroku please refer to [Heroku custom domains](https://devcenter.heroku.com/articles/custom-domains) and to add **_SSL_** to your custom domain refer to [SSL Endpoint](https://devcenter.heroku.com/articles/ssl-endpoint).
9. Now you can make changes commit your changes and the application will be automatically deployed when you push to the connected branch.
10. (Optional) To deploy other testing/staging environments (ie. a ``new-feature`` branch to test a new feature), just create a new branch from master and repeat steps 3-9 but choosing the new branch (ie. ``new-feature``) instead of ``master`` to automatically deploy from that branch.

## Testing

Running `npm test` will run the unit tests with karma.

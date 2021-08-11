# Shopify Plugin FE

NOTE: the following description is accurate to the state of the repo at the time of writing. This
is anticipated to change...

# quick start

This is meant to be used in conjunction with the shopify_plugin_backend repo. by updating the value
used for `API_URL` you can point this any environment, although you may run into CORS issues.

Add [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for auto
code formatting

# run locally

1. install certs

```
mkdir certs
cd certs
brew install mkcert
mkcert -install
mkcert localhost
cd ..
```

2. run backend locally per
   [backend instructions](https://github.com/getbread/shopify_plugin_backend)

3. start the local development server:

```
npm install
npm run local # expects backend to be running on `localhost:8000`
```

verify succesful set up by running smoke test procedure described below

## run in Slice

```
# if necessary uninstall local chart

slice chart uninstall shopify-plugin-frontend --local

# Install the chart cleanly:
slice chart sync --local

# start slice telepresence
slice start

# Install node modules inside of container's volume:
./slice-npm-install

# run server within container
slice run dev

# navigate to site:
open https://shopify-plugin.<your-slice-env>.slice.ue2.breadgateway.net/
```

# configurations (OUT OF DATE)

can only be used in conjunction with shopify_plugin_backend repo. when running the front end
locally, specify the backend host with the `API_URL` env variable (see `npm run dev` command) by
default, this is `localhost:7801`

web pack development server defaults to `localhost:7802`

shopify_plugin_backend also has configuration of the expected frontend host. this is required for
CORS request. configuration is in `deploy/chart/local/config.yaml` of shopify_plugin_backend as
`feHost`.

# smoke test:

this is a quick smoke test to verify nothing is broken.

1. navigate to `localhost:8001/gateway` (if running locally)
2. verify no 5xx or 4xx errors are in console logs
3. create a new account (arbitrary but unique username needed)
4. verify you can then log in and see the page load
5. log out

keep your eye on the console logs for troubleshooting.

# robust testing

note: this is time intensive, and not well documented! WIP (TODO: automate this via selenium +
CI/CD pipeline) As it stands, there are a set of manual tests (location TBD, ask Sam J or Kip)

# Troubleshooting

## ERR_CERT_AUTHORITY_INVALID

slice uses a self-signed cert, which most browsers flag as a security risk. This can cause the
backend calls to be automatically blocked with the above message. there are a few ways around this.

1. in Chrome, copy and navigate to the url that caused the error. select `Advanced options` then
   `allow anyways`
2. Use Firefox to view and download the certificate (it made downloading the cert really easy -
   chrome and safari were impossible). You can just view details and scroll down and there’s a
   download link. Then you can drag the cert to Keychain Access (app), and then view/modify it to
   Always Trust, and exit. Adding and modifying will both require password. After that’s done,
   revisiting shopify site in the browser seems to work as expected
3. follow instructions here: https://superuser.com/a/1235250

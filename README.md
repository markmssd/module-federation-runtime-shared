This is a demo app based on https://github.com/module-federation/module-federation-examples/tree/master/advanced-api/dynamic-remotes, to reproduce the issue https://github.com/module-federation/core/issues/2541.

I wanted to try loading the apps when:
- Remotes use Module Federation v1 (from Webpack)
- Host also uses Module Federation v1 (from Webpack) at build time to defined `shared` (but not `remotes`)
- Host loads Remotes at runtime (using `@module-federation/runtime` package)

I have created the minimum required to reproduce it at https://github.com/markmssd/module-federation-runtime-shared. You can try it with `pnpm start:legacy`. The only difference between this reproducible and the official example is that in the Webpack configs, I am using the Webpack MF plugin from `require('webpack').container.ModuleFederationPlugin`, and uninstalled `@module-federation/enhanced` completely.

It seems like it doesn't load the shared dependencies properly. First, when we start the app, and log `__FEDERATION__` in the developer console, it shows no shared dependencies.

<img width="846" alt="Screenshot 2024-05-25 at 6 23 54 PM" src="https://github.com/module-federation/core/assets/5899024/0eccfa90-b1a3-4f23-ba22-2b3f2a2c4912">

Then, if we load App3, it crashes with

<img width="1001" alt="Screenshot 2024-05-25 at 5 54 17 PM" src="https://github.com/module-federation/core/assets/5899024/51b46a7c-acf7-454a-8ae8-22dfd9925010">

which is usually an error when multiple instances of React are used.

Note what loading App2 works just fine, not sure why. The only difference with it is that it also shares `moment`, so not sure, I would have expected it to crash too 🤔

I've also noticed that if I define the shared dependencies on runtime too in App1 (and I can then remove MF plugin completely from its Webpack), then it works properly. I guess this is expected, obviously.

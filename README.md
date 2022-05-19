# CosmJS beginner sandbox

To reproduce issue on Cosmos SDK v0.46

## Local chain
Make sure to nuke your .simapp folder or set a different home directory and checkout `v0.46.0-beta2` in your SDK folder

```sh
simd config chain-id demo
simd config keyring-backend test
simd keys add alice
simd keys add bob
simd init test --chain-id demo
simd add-genesis-account alice 5000000000stake --keyring-backend test
simd gentx alice 1000000stake --chain-id demo
simd collect-gentxs
simd start --mode validator
```

## Install packages

```sh
$ npm install
```

## Run it

```sh
$ npm run experiment-local
```
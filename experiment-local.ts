import { SigningStargateClient, StargateClient } from "@cosmjs/stargate"
import { DirectSecp256k1Wallet, OfflineDirectSigner } from "@cosmjs/proto-signing"
import { fromHex } from "@cosmjs/encoding"
import { readFile } from "fs/promises"

const rpc = "http://127.0.0.1:26657"

const getAliceSignerFromPriKey = async(): Promise<OfflineDirectSigner> => {
    return DirectSecp256k1Wallet.fromKey(
        fromHex((await readFile("./simd.alice.private.key")).toString()),
        "cosmos",
    )
}

const runAll = async(): Promise<void> => {
    const client = await StargateClient.connect(rpc)
    const bob: string = "cosmos1khljzagdncfs03x5g6rf9qp5p93z9qgc3w5dwt"

    const aliceSigner: OfflineDirectSigner = await getAliceSignerFromPriKey()
    const alice = (await aliceSigner.getAccounts())[0].address
    const signingClient = await SigningStargateClient.connectWithSigner(rpc, aliceSigner)

    console.log("Alice balance before:", await client.getAllBalances(alice))
    console.log("Faucet balance before:", await client.getAllBalances(bob))
    const result = await signingClient.sendTokens(
        alice,
        bob,
        [{ denom: "stake", amount: "100000" }],
        {
            amount: [{ denom: "stake", amount: "500" }],
            gas: "200000",
        },
    )
    console.log("Transfer result:", result)
    console.log("Alice balance after:", await client.getAllBalances(alice))
    console.log("Faucet balance after:", await client.getAllBalances(bob))
    
}

runAll()
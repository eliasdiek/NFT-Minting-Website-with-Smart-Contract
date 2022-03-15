const FathomyachtClub = artifacts.require("FathomyachtClub");

contract("FathomyachtClub", (accounts) => {
    let [alice, bob, server, tiktok] = accounts;
    let contractInstance;

    beforeEach(async () => {
        contractInstance = await FathomyachtClub.new();
    })

    it("Get TokenURI", async () => {
        const tmp1 = await contractInstance.getTokenURI(1);
        console.log('[getTokenURI]', tmp1);
    })

    it("getLocalPrice", async () => {
        const tmp1 = await contractInstance.getLocalPrice();
        console.log('[getLocalPrice]', tmp1.toString());
    })

    // it("mint batch", async () => {
    //     await contractInstance.mintBatch(1, 0, {from: alice, value: 1_9500_0000_0000_0000});
    //     await contractInstance.mintBatch(1, 0, {from: alice, value: 1_9500_0000_0000_0000});
    //     await contractInstance.mintBatch(1, 0, {from: alice, value: 1_9500_0000_0000_0000});

    //     await contractInstance.mintBatch(1, 1, {from: alice, value: 4_9500_0000_0000_0000});
    //     await contractInstance.mintBatch(1, 1, {from: alice, value: 4_9500_0000_0000_0000});
    //     await contractInstance.mintBatch(1, 1, {from: alice, value: 4_9500_0000_0000_0000});

    //     await contractInstance.mintBatch(1, 2, {from: alice, value: 6_9500_0000_0000_0000});
    //     await contractInstance.mintBatch(1, 2, {from: alice, value: 6_9500_0000_0000_0000});
    //     await contractInstance.mintBatch(1, 2, {from: alice, value: 6_9500_0000_0000_0000});

    //     await contractInstance.mintBatch(2, 0, {from: tiktok, value: 2 * 1_9500_0000_0000_0000});
    //     await contractInstance.mintBatch(2, 1, {from: tiktok, value: 2 * 4_9500_0000_0000_0000});
    //     await contractInstance.mintBatch(2, 2, {from: tiktok, value: 2 * 6_9500_0000_0000_0000});

    //     console.log('-------------------------------------');

    //     const tmp2 = await contractInstance.getTokensOfHolder(alice);

    //     tmp2.forEach(token => {
    //         console.log('[token]', token.toString());
    //     })

    //     console.log('-------------------------------------');

    //     const tmp4 = await contractInstance.getTokensOfHolder(tiktok);

    //     tmp4.forEach(token => {
    //         console.log('[token]', token.toString());
    //     })

    //     console.log('-------------------------------------');

    //     const tmp3 = await contractInstance.totalSupply();
    //     console.log('[totalSupply]', tmp3.toString());
    // })
})
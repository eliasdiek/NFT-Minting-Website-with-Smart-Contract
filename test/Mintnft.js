const FathomyachtClub = artifacts.require("FathomyachtClub");

contract("FathomyachtClub", (accounts) => {
    let [alice, bob, server] = accounts;
    let contractInstance;

    beforeEach(async () => {
        contractInstance = await FathomyachtClub.new();
    })

    it("Get TokenURI", async () => {
        const tmp1 = await contractInstance.getTokenURI(9999);
        console.log('[getTokenURI]', tmp1);
    })

    it("getLocalPrice", async () => {
        const tmp1 = await contractInstance.getLocalPrice();
        console.log('[getLocalPrice]', tmp1.toString());
    })

    it("mint batch", async () => {
        const tmp1 = await contractInstance.mintBatch(1, 0, {from: alice, value: 1_9500_0000_0000_0000});

        console.log('[mintBatch]', tmp1);
        console.log('-------------------------------------');

        const tmp3 = await contractInstance.totalSupply();
        console.log('[totalSupply]', tmp3.toString());
    })
})
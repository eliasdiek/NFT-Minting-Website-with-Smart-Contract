const Leasing = artifacts.require("Leasing");

contract("Leasing", (accounts) => {
    let [alice, bob, server, tiktok] = accounts;
    let contractInstance;

    return false;

    beforeEach(async () => {
        contractInstance = await Leasing.new();
    })

    it("Get NFT Address", async () => {
        await contractInstance.setNFTAddress('0xF16EB26739C290e83B7311C16596F3209890e5Fd');
        const tmp1 = await contractInstance.getNFTAddress();
        console.log('[getNFTAddress]', tmp1);
    })

    it("Get LeasableToken", async () => {
        await contractInstance.setTokenLeasable(1, '50000000000000000', 45);
        const tmp1 = await contractInstance.getLeasableTokens();
        console.log('[getLeasableToken]', tmp1);

        await contractInstance.updateLeasableToken(1, '60000000000000000', 30);
        const tmp2 = await contractInstance.getLeasableTokens();
        console.log('[getLeasableToken]', tmp2);
    })
})
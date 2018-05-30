const PublicArticle = artifacts.require('PublicArticle');

const timeTravel = function(time) {
    return new Promise((resolve, reject) => {
        return web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [time],
            id: new Date().getTime()
        }, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

contract("PublicArticle", function(accounts) { 
    it("should set the article name and text correctly", async function() {
        let pubart = await PublicArticle.deployed();
        await pubart.setArticleText("article text")
        await pubart.setArticleName("article name");
        await pubart.setDuration(60 * 60);

        let name = await pubart.getArticleName();
        let text = await pubart.getArticleText();
        assert.equal(name, "article name");
        assert.equal(text, "article text");
    });

    it("should work before it expires", async function() {
        let pubart = await PublicArticle.deployed();

        await pubart.setArticleName("Test Article");
        await pubart.setDuration(60 * 60);
        await timeTravel(60 * 30);
        
        let gotName = await pubart.getArticleName();

        assert.equal(gotName.toString(), 'Test Article', "didn't set name correctly");
    });

    it("should stop working after it expires", async function() {
        let pubart = await PublicArticle.deployed();
        await pubart.setArticleName("test article");
        await pubart.setDuration(60 * 60);

        await timeTravel(60 * 60 * 2);

        try {
            await pubart.getArticleName();
        } catch (e) {
            return true;
        }

        throw new Error("Article failed to expire");
    });
});
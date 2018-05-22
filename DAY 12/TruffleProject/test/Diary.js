const Diary = artifacts.require("./Diary.sol");

const runCommand = async function() {
    const diary = await Diary.deployed();

    diary.NewEntry(function(error, result) {
        if (!error)
            console.log(result);
    });

    const today = new Date().getTime();
    await diary.addFact(today, "Hello, this is an entry. Lorem ipsum dolor sit amet.");
    const firstEntry = await diary.getFact(0);
    console.log(firstEntry);
    const count = await diary.count();
    console.log("ENTRY COUNT: " + count.toNumber());
}

module.exports = runCommand;
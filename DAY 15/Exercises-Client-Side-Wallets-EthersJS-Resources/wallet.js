$(document).ready(function () {
    const derivationPath = "m/44'/60'/0'/0/";
    const provider = ethers.providers.getDefaultProvider('ropsten');

    let wallets = {};
    let contract;

    showView("viewHome");

    $('#linkHome').click(function () {
        showView("viewHome");
    });

    $('#linkCreateNewWallet').click(function () {
        $('#passwordCreateWallet').val('');
        $('#textareaCreateWalletResult').val('');
        showView("viewCreateNewWallet");
    });

    $('#linkImportWalletFromMnemonic').click(function () {
        $('#textareaOpenWallet').val('');
        $('#passwordOpenWallet').val('');
        $('#textareaOpenWalletResult').val('');
        $('#textareaOpenWallet').val('toddler online monitor oblige solid enrich cycle animal mad prevent hockey motor');
        showView("viewOpenWalletFromMnemonic");
    });

    $('#linkImportWalletFromFile').click(function () {
        $('#walletForUpload').val('');
        $('#passwordUploadWallet').val('');
        showView("viewOpenWalletFromFile");
    });

    $('#linkShowMnemonic').click(function () {
        $('#passwordShowMnemonic').val('');
        showView("viewShowMnemonic");
    });

    $('#linkShowAddressesAndBalances').click(function () {
        $('#passwordShowAddresses').val('');
        $('#divAddressesAndBalances').empty();
        showView("viewShowAddressesAndBalances");
    });

    $('#linkSendTransaction').click(function () {
        $('#divSignAndSendTransaction').hide();

        $('#passwordSendTransaction').val('');
        $('#transferValue').val('');
        $('#senderAddress').empty();

        $('#textareaSignedTransaction').val('');
        $('#textareaSendTransactionResult').val('');

        showView("viewSendTransaction");
    });

    $('#linkExport').click(function() {
        showView("viewExportWallet");
        $('#currentWalletToExport').val(window.localStorage.JSON);
    });

    $('#linkContract').click(function() {
        showView('viewContract');
        $('#contractAddress').val('0x77236e828e5bd7302e0a4218372950fed7a0008a');
        $('#textareaContractABI').val('[{"constant":false,"inputs":[],"name":"decrease","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"increase","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]');
    });

    $('#buttonGenerateNewWallet').click(generateNewWallet);
    $('#buttonOpenExistingWallet').click(openWalletFromMnemonic);
    $('#buttonUploadWallet').click(openWalletFromFile);
    $('#buttonShowMnemonic').click(showMnemonic);
    $('#buttonShowAddresses').click(showAddressesAndBalances);
    $('#buttonSendAddresses').click(unlockWalletAndDeriveAddresses);
    $('#buttonSignTransaction').click(signTransaction);
    $('#buttonSendSignedTransaction').click(sendSignedTransaction);
    $('#exportWalletForReal').click(exportWalletToJSONFile);
    $('#contractAddressInitialize').click(initializeContract);
    $('#contractExecute').click(executeContract);

    $('#linkDelete').click(deleteWallet);

    function showView(viewName) {
        // Hide all views and show the selected view only
        $('main > section').hide();
        $('#' + viewName).show();

        if (localStorage.JSON) {
            $('#linkCreateNewWallet').hide();
            $('#linkImportWalletFromMnemonic').hide();
            $('#linkImportWalletFromFile').hide();

            $('#linkShowMnemonic').show();
            $('#linkShowAddressesAndBalances').show();
            $('#linkSendTransaction').show();
            $('#linkDelete').show();
        } else {
            $('#linkShowMnemonic').hide();
            $('#linkShowAddressesAndBalances').hide();
            $('#linkSendTransaction').hide();
            $('#linkDelete').hide();

            $('#linkCreateNewWallet').show();
            $('#linkImportWalletFromMnemonic').show();
            $('#linkImportWalletFromFile').show();
        }
    }

    function showInfo(message) {
        $('#infoBox>p').html(message);
        $('#infoBox').show();
        $('#infoBox>header').click(function () {
            $('#infoBox').hide();
        })
    }

    function showError(errorMsg) {
        $('#errorBox>p').html('Error: ' + errorMsg);
        $('#errorBox').show();
        $('#errorBox>header').click(function () {
            $('#errorBox').hide();
        })
    }

    function showLoadingProgress(percent) {
        $('#loadingBox').html("Loading... " + parseInt(percent * 100) + "% complete");
        $('#loadingBox').show();
        $('#loadingBox>header').click(function () {
            $('#errorBox').hide();
        })
    }

    function hideLoadingBar() {
        $('#loadingBox').hide();
    }

    function showLoggedInButtons() {
        $('#linkCreateNewWallet').hide();
        $('#linkImportWalletFromMnemonic').hide();
        $('#linkImportWalletFromFile').hide();

        $('#linkShowMnemonic').show();
        $('#linkShowAddressesAndBalances').show();
        $('#linkSendTransaction').show();
        $('#linkDelete').show();
    }

    async function encryptAndSaveJSON(wallet, password) {
        let encryptedWallet;

        try {
            encryptedWallet = await wallet.encrypt('password', {}, showLoadingProgress);
        } catch (e) {
            showError(e);
            return;
        } finally {
            hideLoadingBar();
        }

        window.localStorage['JSON'] = encryptedWallet;
        showLoggedInButtons();
    }

    async function decryptWallet(json, password) {
        return await ethers.Wallet.fromEncryptedWallet(json, password, showLoadingProgress);
    }

    async function generateNewWallet() {
        // TODO;
        const password = $('#passwordCreateWallet').val();
        const randomNumber = Math.random();
        const wallet = ethers.Wallet.createRandom([password, randomNumber]);
        const encryptedWallet = await encryptAndSaveJSON(wallet, password);
        showInfo('Please save your mnemonic: ' + wallet.mnemonic);
        $('#textareaCreateWalletResult').val(window.localStorage.JSON);
    }

    async function openWalletFromMnemonic() {
        const mnemonic = $('#textareaOpenWallet').val();

        if (!ethers.HDNode.isValidMnemonic(mnemonic)) {
            showError('Invalid Mnemonic');
        } else {
            const wallet = ethers.Wallet.fromMnemonic(mnemonic);
            const password = $('#passwordOpenWallet').val();

            await encryptAndSaveJSON(wallet, password);
            showInfo('Wallet successfully loaded!');
            $('#textareaOpenWalletResult').val(window.localStorage.JSON);
        }
    }

    async function openWalletFromFile() {
        if ($('#walletForUpload')[0].files.length <= 0) {
            showError('Please select a file to upload');
            return;
        }

        let password = $('#passwordUploadWallet').val();
        let fileReader = new FileReader();

        fileReader.onload = async function () {
            let json = fileReader.result;

            let wallet;

            try {
                wallet = await decryptWallet(json, password);
            } catch (e) {
                showError(e);
                return;
            } finally {
                hideLoadingBar();
            }

            if (!wallet.mnemonic) {
                showError('Invalid JSON file');
                return;
            }

            window.localStorage['JSON'] = json;
            showInfo('Wallet successfully loaded!');
            showLoggedInButtons();
        }

        fileReader.readAsText($('#walletForUpload')[0].files[0]);
    }

    async function showMnemonic() {
        const password = $('#passwordShowMnemonic').val();
        const json = window.localStorage.JSON;

        let wallet;

        try {
            wallet = await decryptWallet(json, password);
        } catch (e) {
            showError(e);
            return;
        } finally {
            hideLoadingBar();
        }

        showInfo('Your mnemonic is: ' + wallet.mnemonic);
    }

    async function showAddressesAndBalances() {
        let password = $('#passwordShowAddresses').val();
        let json = localStorage.JSON;

        let wallet;

        try {
            wallet = await decryptWallet(json, password);
            await renderAddressAndBalances(wallet);
        } catch (e) {
            $('#divRenderAddressesAndBalances').empty();
            showError(e);
            return;
        } finally {
            hideLoadingBar();
        }
    }


    async function renderAddressAndBalances(wallet) {
        $('#divRenderAddressesAndBalances').empty();

        const masterNode = ethers.HDNode.fromMnemonic(wallet.mnemonic);
        const balancePromises = [];

        for (let index = 0; index < 5; index++) {
            let wallet = new ethers.Wallet(masterNode.derivePath(derivationPath + index).privateKey, provider);
            const promise = wallet.getBalance();
            balancePromises.push(promise);
        }

        let balances;

        try {
            balances = await Promise.all(balancePromises);
        } catch (e) {
            showError(e);
            return;
        }

        for (let index = 0; index < 5; index++) {
            let div = $('<div id="qrcode"></div>');

            let wallet = new ethers.Wallet(masterNode.derivePath(derivationPath + index).privateKey, provider);

            div.qrcode(wallet.address);
            div.append($(`<p>${wallet.address}: ${ethers.utils.formatEther(balances[index])} ETH</p>`));
            $('#divAddressesAndBalances').append(div);
        }
    }

    async function unlockWalletAndDeriveAddresses() {
        let password = $('#passwordSendTransaction').val();
        let json = localStorage.JSON;
        let wallet;

        try {
            wallet = await decryptWallet(json, password);
        } catch (e) {
            showError(e);
            return;
        } finally {
            $('#passwordSendTransaction').val();
            hideLoadingBar();
        }

        showInfo('Wallet successfully unlocked!');
        renderAddresses(wallet);
        $('#divSignAndSendTransaction').show();
    }

    async function renderAddresses(wallet) {
        $('#senderAddress').empty();

        let masterNode = ethers.HDNode.fromMnemonic(wallet.mnemonic);

        for (let index = 0; index < 5; index++) {
            let wallet = new ethers.Wallet(masterNode.derivePath(derivationPath + index).privateKey, provider);
            let address = wallet.address;

            wallets[address] = wallet;
            let option = $(`<option id="${wallet.address}"></option>`).text(address);
            $('#senderAddress').append(option);
        }
    }

    async function signTransaction() {
        let senderAddress = $('#senderAddress option:selected').attr('id');
        let wallet = wallets[senderAddress];

        if (!wallet) {
            showError('Invalid address!');
            return;
        }

        const recipient = $('#recipientAddress').val();
        if (!recipient) {
            showError('Invalid recipient!');
            return;
        }

        const value = $('#transferValue').val();
        if (!value || value < 0) {
            showError('Invalid transfer value!');
            return;
        }

        let nonce;
        try {
            nonce = await wallet.getTransactionCount();
        } catch (e) {
            showError(e);
            return;
        }

        // Actual transaction signing =================

        const transaction = {
            nonce,
            gasLimit: 21000,
            gasPrice: ethers.utils.bigNumberify(20000000000),
            to: recipient,
            value: ethers.utils.parseEther(value.toString()),
            data: '0x',
            chainId: provider.chainId
        };

        let signedTransaction = wallet.sign(transaction);
        $('#textareaSignedTransaction').val(signedTransaction);
    }

    async function sendSignedTransaction() {
        const signedTransaction = $('#textareaSignedTransaction').val();
        let hash;

        try {
            hash = await provider.sendTransaction(signedTransaction);
        } catch (e) {
            showError(e);
            return;
        }

        let etherscanUrl = 'https://ropsten.etherscan.io/tx/' + hash;
        $('#textareaSendTransactionResult').val(etherscanUrl);
    }

    function deleteWallet() {
        window.localStorage.clear();
        showView("viewHome");
    }

    function exportWalletToJSONFile() {
        const wallet = JSON.parse(window.localStorage.JSON);

        const blob = new Blob([window.localStorage.JSON], {
            "type": "application/json"
        });

        const fileDownloader = document.createElement("a");

        fileDownloader.download = `UTC--${new Date().toUTCString()}--${wallet.address}`;
        fileDownloader.href = URL.createObjectURL(blob);
        document.body.appendChild(fileDownloader);

        fileDownloader.click();

        document.body.removeChild(fileDownloader);
    }

    function initializeContract() {
        const contractAddress = $('#contractAddress').val();
        const contractABI = $('#textareaContractABI').val();

        connectContract(contractAddress, contractABI);
    }

    function connectContract(contractAddress, contractABI) {
        const abiJson = JSON.parse(contractABI);
        const rawContract = new ethers.Contract(contractAddress, abiJson, provider);
        contract = rawContract;

        $('#contractMethods').empty();
        
        for (let index = 0; index < abiJson.length; index++) {
            $('#contractMethods').append(`<option id=${abiJson[index].name}>${abiJson[index].name}()</option>`);
        }
    }

    async function executeContract() {
        const methodName = $('#contractMethods option:selected').attr('id');
        const response = await contract[methodName]();
        console.log(response);
    }
});

// empower lounge alpha spatial work front anxiety pledge awful cause letter paper
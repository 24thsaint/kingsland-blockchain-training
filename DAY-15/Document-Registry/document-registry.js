$(document).ready(function () {
    const documentRegistryContractAddress = "0xa16eaa5393defbf8fcbe7a6b9e4ade2702ef91a3";
    const documentRegistryContractABI = [{
            "constant": false,
            "inputs": [{
                "name": "hash",
                "type": "string"
            }],
            "name": "add",
            "outputs": [{
                "name": "dateAdded",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "constant": true,
            "inputs": [{
                "name": "index",
                "type": "uint256"
            }],
            "name": "getDocument",
            "outputs": [{
                    "name": "",
                    "type": "string"
                },
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getDocumentsCount",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];

    const IPFS = window.IpfsApi('localhost', '5001');
    const Buffer = IPFS.Buffer;

    $('#linkHome').click(function () {
        showView("viewHome")
    });
    $('#linkSubmitDocument').click(function () {
        showView("viewSubmitDocument")
    });
    $('#linkGetDocuments').click(function () {
        $('#viewGetDocuments div').remove();
        showView("viewGetDocuments");
        viewGetDocuments();
    });
    $('#documentUploadButton').click(uploadDocument);

    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function () {
            $("#loadingBox").show()
        },
        ajaxStop: function () {
            $("#loadingBox").hide()
        }
    });

    function showView(viewName) {
        // Hide all views and show the selected view only
        $('main > section').hide();
        $('#' + viewName).show();
    }

    function showInfo(message) {
        $('#infoBox>p').html(message);
        $('#infoBox').show();
        $('#infoBox>header').click(function () {
            $('#infoBox').hide();
        });
    }

    function showError(errorMsg) {
        $('#errorBox>p').html("Error: " + errorMsg);
        $('#errorBox').show();
        $('#errorBox>header').click(function () {
            $('#errorBox').hide();
        });
    }

    function uploadDocument() {
        if ($('#documentForUpload')[0].files.length === 0) {
            showError("Please select file to upload!");
            return;
        }

        let fileReader = new FileReader();
        fileReader.onload = async function () {
            if (typeof web3 === 'undefined') {
                showError('Please install Metamask to access the Ethereum Web3 API from your browser.');
                return;
            }
            let fileBuffer = Buffer.from(fileReader.result);
            let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);

            IPFS.files.add(fileBuffer, (err, result) => {
                if (err) {
                    showError(err);
                    return;
                }

                if (result) {
                    let ipfsHash = result[0].hash;
                    console.log(ipfsHash);
                    contract.add(ipfsHash, (error, txHash) => {
                        if (error) {
                            showError('Smart contract call failed: ' + error);
                            return;
                        }

                        if (txHash) {
                            showInfo(`Document ${ipfsHash} successfully added to the registry! Transaction hash: ${txHash}`);
                            return;
                        }
                    });
                }

                showError('Internal Error!');
            });
        };

        fileReader.readAsArrayBuffer($('#documentForUpload')[0].files[0]);
    }

    function viewGetDocuments() {
        if (typeof web3 === 'undefined') {
            showError('Please install Metamask to access the Ethereum Web3 API from your web browser.');
            return;
        }

        let contract = web3.eth.contract(documentRegistryContractABI).at(documentRegistryContractAddress);
        contract.getDocumentsCount((err, res) => {
            if (err) {
                showError('Smart contract failed: ' + err);
                return;
            }

            let documentsCount = res.toNumber();

            if (documentsCount > 0) {
                let html = $('<div>');
                for (let index = 0; index < documentsCount; index++) {
                    contract.getDocument(index, (error, result) => {
                        if (error) {
                            showError('Smart contract failed: ' + error);
                            return;
                        }
                        let ipfsHash = result[0];
                        let contractPublishDate = result[1];
                        let div = $('<div>');
                        let url = 'https://ipfs.io/ipfs/' + ipfsHash;

                        let displayDate = new Date(contractPublishDate * 1000).toLocaleString();
                        div.append($(`<p>Document published on: ${displayDate}</p>`));
                        div.append(`<img src="${url}" />`);
                        html.append(div);
                    });
                }
                html.append('</div>');
                $('#viewGetDocuments').append(html);
            } else {
                $('#viewGetDocuments').append('<div>No documents in the document registry!</div>');
            }
        })
    }

});
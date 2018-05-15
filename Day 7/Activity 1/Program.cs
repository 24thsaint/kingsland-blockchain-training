using System;
using static System.Console;
using System.Collections;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Nethereum.HdWallet;
using Nethereum.Web3;
using Nethereum.Web3.Accounts;
using Newtonsoft.Json;
using NBitcoin;
using Rijndael256;

namespace EthereumWallet
{
    class EthereumWalletNetCore
    {
        const string network = "https://ropsten.infura.io";
        const string workingDirectory = @"Wallets\";

        static void Main(string[] args)
        {
            MainAsync(args).GetAwaiter().GetResult();
        }

        static async Task MainAsync(string[] args) {
            Web3 web3 = new Web3(network);
            Directory.CreateDirectory(workingDirectory);
            string[] valiableOperations = {
                "create", "load", "recover", "exit"
            };

            string input = string.Empty;
            bool isWalletReady = false;
            Wallet wallet = new Wallet(Wordlist.English, WordCount.Twelve);

            while(!input.ToLower().Equals("exit")) {
                WriteLine(isWalletReady);
                if (!isWalletReady) {
                    do {
                        input = ReceiveCommandCreateLoadOrRecover();
                    } while(!((IList)valiableOperations).Contains(input));

                    switch(input) {
                        case "create":
                            wallet = CreateWalletDialog();
                            isWalletReady = true;
                            break;
                        case "load":
                            wallet = LoadWalletDialog();
                            isWalletReady = true;
                            break;
                        case "recover":
                            wallet = RecoverWalletDialog();
                            isWalletReady = true;
                            break;
                        case "exit":
                            return;
                    }
                } else {
                    string[] availableCommands = {
                        "balance", "receive", "send", "exit"
                    };
                    string walletInput = string.Empty;
                    while (!walletInput.ToLower().Equals("exit")) {
                        
                        do {
                            walletInput = ReceiveCommandForEthersOperations();
                        } while(!((IList)availableCommands).Contains(walletInput));

                        switch(walletInput) {
                            case "send": 
                                await SendTransactionDialog(wallet);
                                break;
                            case "balance":
                                await GetWalletBalanceDialog(web3, wallet);
                                break;
                            case "receive":
                                Receive(wallet);
                                break;
                            case "exit":
                                return;
                        }
                    }
                }
            }
        }

        private static string ReceiveCommandCreateLoadOrRecover() {
            WriteLine("Choose working wallet.");
            WriteLine("Choose [create] to Create New Wakket");
            WriteLine("Choose [load] to load existing Wallet from file.");
            WriteLine("Choose [recover] to recover Wallet with Mnemonic Phrase.");
            Write("Enter operation [Create, Load, Recover, Exit]: ");
            string input = ReadLine().ToLower().Trim();
            return input;
        }

        private static Wallet CreateWalletDialog() {
            try {
                string password;
                string passwordConfirmed;

                do {
                    Write("Enter password for encryption: ");
                    password = ReadLine();
                    Write("Confirm your password: ");
                    passwordConfirmed = ReadLine();

                    if (password != passwordConfirmed) {
                        WriteLine("Passwords did not match!");
                        WriteLine("Try again"); 
                    }
                } while (password != passwordConfirmed);

                Wallet wallet = CreateWallet(password, workingDirectory);
                return wallet;
            } catch (Exception) {
                WriteLine($"ERROR! Wallet in path {workingDirectory} can't be created");
                throw;
            }
        }

        private static Wallet LoadWalletDialog() {
            Write("Enter name of file containing wallet: ");
            string nameOfWallet = ReadLine();
            Write("Enter the password of the wallet: ");
            string pass = ReadLine();

            try {
                Wallet wallet = LoadWalletFromJsonFile(nameOfWallet, workingDirectory, pass);
                return (wallet);
            } catch (Exception e) {
                WriteLine($"ERROR! Wallet {nameOfWallet} in path {workingDirectory} can't be loaded!");
                throw e;
            }
        }

        private static Wallet RecoverWalletDialog() {
            try {
                Write("Enter mnemonic words with single space separator: ");
                string mnemonicPhrase = ReadLine();
                Write("Enter password for encryption: ");
                string passForEncryptionInJsonFile = ReadLine();
                Wallet wallet = RecoverFromMnemonicPhraseAndSaveToJson(mnemonicPhrase, passForEncryptionInJsonFile, workingDirectory);
                return (wallet);
            } catch(Exception e) {
                WriteLine($"ERROR! Wallet can't be recovered! Check your mnemonic phrase.");
                throw e;
            }
        }

        private static string ReceiveCommandForEthersOperations() {
            Write("Enter operation [Balance, Receive, Send, Exit]: ");
            string inputCommand = ReadLine().ToLower().Trim();
            return inputCommand;
        }

        private static async Task SendTransactionDialog(Wallet wallet) {
            WriteLine("Enter address for sending ethers: ");
            string sender = ReadLine();
            WriteLine("Enter address for receiving ethers: ");
            string receiver = ReadLine();
            WriteLine("Enter eth amount: ");
            double amountOfCoins = 0d;

            try {
                amountOfCoins = double.Parse(ReadLine());
            } catch (Exception) {
                WriteLine("You have entered an unacceptable amount of coins");
            }

            if (amountOfCoins > 0.0d) {
                WriteLine($"You will send {amountOfCoins} from {sender} to {receiver}");
                Write("Do you wish to proceed [yes/no]? ");
                string response = ReadLine();

                if (response.ToLower().Trim() == "yes") {
                    await Send(wallet, sender, receiver, amountOfCoins);
                }
            } else {
                WriteLine("ERROR! Amount of coins must be a positive number!");
            }
        }

        private static async Task GetWalletBalanceDialog(Web3 web3, Wallet wallet) {
            WriteLine("Balance: ");
            try {
                await Balance(web3, wallet);
            } catch(Exception) {
                WriteLine("An error occurred, please check your wallet!");
            }
        }

        public static Wallet CreateWallet(string password, string pathfile) {
            Wallet wallet = new Wallet(Wordlist.English, WordCount.Twelve);
            string words = string.Join(" ", wallet.Words);
            string fileName = string.Empty;

            try {
                fileName = SaveWalletToJsonFile(wallet, password, pathfile);
            } catch(Exception e) {
                WriteLine($"ERROR! The file {fileName} could not be saved! {e}");
                throw e;
            }

            WriteLine("New wallet has been created successfully!");
            WriteLine("Here are your mnemonic words, keep them in a safe place:");
            WriteLine(words);
            WriteLine("Seed: ");
            WriteLine(wallet.Seed);
            WriteLine();
            PrintAddressesAndKeys(wallet);
            return wallet;
        }

        private static void PrintAddressesAndKeys(Wallet wallet) {
            WriteLine("Addresses: ");
            for (int i = 0; i < 20; i++) {
                WriteLine(wallet.GetAccount(i).Address);
            }
            WriteLine("Private keys: ");
            for(int i = 0; i < 20; i++) {
                WriteLine(wallet.GetAccount(i).PrivateKey);
            }
            WriteLine("===================================");
        }

        public static string SaveWalletToJsonFile(Wallet wallet, string password, string pathFile) {
            string words = string.Join(" ", wallet.Words);
            var encryptedWords = Rijndael.Encrypt(words, password, KeySize.Aes256);
            string date = DateTime.Now.ToString();
            var walletJsonData = new { encryptedWords = encryptedWords, date = date };
            string json = JsonConvert.SerializeObject(walletJsonData);
            Random random = new Random();
            // year month day hour minute second random
            var fileName = 
                "EthereumWallet_"
                + DateTime.Now.Year + "-"
                + DateTime.Now.Month + "-"
                + DateTime.Now.Day + "_"
                + DateTime.Now.Hour + "_"
                + DateTime.Now.Minute + "_"
                + DateTime.Now.Second + "_"
                + random.Next(0, 10000) + ".json";
            File.WriteAllText(Path.Combine(pathFile, fileName), json);
            WriteLine($"Wallet saved in file: {fileName}");
            return fileName;
        }

        static Wallet LoadWalletFromJsonFile(string nameOfWalletFile, string path, string password) {
            string pathToFile = Path.Combine(path, nameOfWalletFile);
            string words = string.Empty;
            WriteLine($"Read from {pathToFile}");
            try {
                string line = File.ReadAllText(pathToFile);
                dynamic results = JsonConvert.DeserializeObject<dynamic>(line);
                string encryptedWords = results.encryptedWords;
                words = Rijndael.Decrypt(encryptedWords, password, KeySize.Aes256);
                string dateAndTime = results.date;
            } catch (Exception e) {
                WriteLine("ERROR! " + e);
            }

            return Recover(words);
        }

        public static Wallet Recover(string words) {
            Wallet wallet = new Wallet(words, null);
            WriteLine("Wallet was successfully recovered!");
            WriteLine($"Mnemonic: {string.Join(" ", wallet.Words)}");
            WriteLine($"Seeds: {string.Join(" ", wallet.Seed)}");
            WriteLine();
            PrintAddressesAndKeys(wallet);
            return wallet;
        }

        public static Wallet RecoverFromMnemonicPhraseAndSaveToJson(string words, string password, string pathFile) {
            Wallet wallet = Recover(words);
            string fileName = string.Empty;
            try {
                fileName = SaveWalletToJsonFile(wallet, password, pathFile);
            } catch(Exception) {
                WriteLine($"ERROR! The file with recovered wallet {fileName} cannot be saved!");
                throw;
            }

            return wallet;
        }

        public static void Receive(Wallet wallet) {
            if (wallet.GetAddresses().Count() > 0) {
                for (int i = 0; i < 20; i++) {
                    WriteLine(wallet.GetAccount(i).Address);
                }
                WriteLine();
            } else {
                WriteLine("No addresses found!");
            }
        }

        private static async Task Send(Wallet wallet, string fromAddress, string toAddress, double amountOfCoins) {
            Account accountFrom = wallet.GetAccount(fromAddress);
            string privateKeyFrom = accountFrom.PrivateKey;

            if (privateKeyFrom == string.Empty) {
                throw new Exception("Address sending coins is not from current wallet!");
            }

            var web3 = new Web3(accountFrom, network);
            var wei = Web3.Convert.ToWei(amountOfCoins);
            try {
                var transaction = await web3.TransactionManager.SendTransactionAsync(
                    accountFrom.Address,
                    toAddress,
                    new Nethereum.Hex.HexTypes.HexBigInteger(wei)
                );
                WriteLine("The transaction has been sent successfully!");
            } catch (Exception e) {
                WriteLine($"ERROR! The transaction cannot be completed! {e}");
                throw e;
            }
        }

        private static async Task Balance(Web3 web3, Wallet wallet) {
            decimal totalBalance = 0.0m;

            for (int i = 0; i < 20; i++) {
                var balance = await web3.Eth.GetBalance.SendRequestAsync(wallet.GetAccount(i).Address);
                var etherAmount = Web3.Convert.FromWei(balance.Value);
                totalBalance += etherAmount;
                WriteLine(wallet.GetAccount(i).Address + " " + etherAmount + " ETH");
            }

            WriteLine($"TOTAL BALANCE: {totalBalance}");
        }
    }
}

using System;
using System.Collections;
using System.Globalization;
using System.Text;
using HBitcoin.FullBlockSpv;
using HBitcoin.KeyManagement;
using HBitcoin.Models;
using NBitcoin;
using QBitNinja.Client;
using QBitNinja.Client.Models;
using static System.Console;

namespace Activity_2
{
    class Program
    {
        static void Main(string[] args)
        {
            string[] viableOperations = {
                "create", "recover", "balance", "history", "receive", "send", "exit"
            };
            string input = string.Empty;

            while (!input.ToLower().Trim().Equals("exit"))
            {
                do
                {
                    Write($"Enter operation [{string.Join(", ", viableOperations)}]: ");
                    input = ReadLine();
                } while (!((IList)viableOperations).Contains(input));

                switch (input)
                {
                    case "create":
                        CreateWallet();
                        break;
                    case "recover":
                        Recover();
                        break;
                    case "balance":
                        Balance();
                        break;
                    case "history":
                        History();
                        break;
                    case "receive":
                        Receive();
                        break;
                    case "send":
                        Spend();
                        break;
                    case "exit": return;
                }
            }
        }

        private static void Spend()
        {
            Write("Enter wallet name: ");
            string walletName = ReadLine();
            Write("Enter wallet password: ");
            string walletPassword = ReadLine();
            Write("Enter wallet address: ");
            string walletAddress = ReadLine();
            Write("Select outpoint (transaction ID): ");
            string outPoint = ReadLine();
            Send(walletPassword, walletName, walletAddress, outPoint);
        }

        private static void Send(string walletPassword, string walletName, string walletAddress, string outPoint)
        {
            string walletFilePath = @"Wallets\";
            NBitcoin.BitcoinExtKey privateKey = null;
            try
            {
                Safe loadedSafe = Safe.Load(walletPassword, walletFilePath + walletName + ".json");
                for (int i = 0; i < 10; i++)
                {
                    if (loadedSafe.GetAddress(i).ToString() == walletAddress)
                    {
                        Write("Enter private key: ");
                        privateKey = new BitcoinExtKey(ReadLine());
                        if (!privateKey.Equals(loadedSafe.FindPrivateKey(loadedSafe.GetAddress(i))))
                        {
                            WriteLine("ERROR: Wrong private key!");
                            return;
                        }
                        break;
                    }
                }
            }
            catch (Exception)
            {
                WriteLine("ERROR: Wrong wallet or password!");
            }

            QBitNinjaClient client = new QBitNinjaClient(Network.TestNet);
            var balance = client.GetBalance(BitcoinAddress.Create(walletAddress), false).Result;
            OutPoint outPointToSpend = null;

            foreach (var entry in balance.Operations)
            {
                foreach (var coin in entry.ReceivedCoins)
                {
                    if (coin.Outpoint.ToString().Substring(0, coin.Outpoint.ToString().Length - 2) == outPoint)
                    {
                        outPointToSpend = coin.Outpoint;
                        break;
                    }
                }
            }

            var transaction = new Transaction();
            transaction.Inputs.Add(new TxIn()
            {
                PrevOut = outPointToSpend
            });

            Write("Enter address to send to: ");
            string addressToSendTo = ReadLine();
            var hallOfTheMakersAddress = BitcoinAddress.Create(addressToSendTo);

            Write("Enter amount to send: ");
            decimal amountToSend = decimal.Parse(ReadLine());
            TxOut hallOfTheMakersTxOut = new TxOut()
            {
                Value = new Money(amountToSend, MoneyUnit.BTC),
                ScriptPubKey = hallOfTheMakersAddress.ScriptPubKey
            };

            Write("Enter amount to get back: ");
            decimal amountToGetBack = decimal.Parse(ReadLine());
            TxOut changeBackTxOut = new TxOut()
            {
                Value = new Money(amountToGetBack, MoneyUnit.BTC),
                ScriptPubKey = privateKey.ScriptPubKey
            };

            transaction.Outputs.Add(hallOfTheMakersTxOut);
            transaction.Outputs.Add(changeBackTxOut);

            Write("Enter message: ");
            var message = ReadLine();
            var bytes = Encoding.UTF8.GetBytes(message);
            transaction.Outputs.Add(new TxOut()
            {
                Value = Money.Zero,
                ScriptPubKey = TxNullDataTemplate.Instance.GenerateScriptPubKey(bytes)
            });

            transaction.Inputs[0].ScriptSig = privateKey.ScriptPubKey;
            transaction.Sign(privateKey, false);
            BroadcastResponse broadcast = client.Broadcast(transaction).Result;

            WriteLine(transaction);

            if (broadcast.Success)
            {
                WriteLine("TRANSACTION SUCCESSFULLY SENT!");
            }
            else
            {
                WriteLine("INTERNAL ERROR: Something went wrong!");
            }
        }

        private static void History()
        {
            Write("Enter wallet's name: ");
            string walletName = ReadLine();
            Write("Enter password: ");
            string password = ReadLine();
            Write("Enter wallet address: ");
            string walletAddress = ReadLine();
            ShowHistory(password, walletName, walletAddress);
        }

        private static void ShowHistory(string password, string walletName, string walletAddress)
        {
            string walletFilePath = @"Wallets\";
            try
            {
                Safe loadedSafe = Safe.Load(password, walletFilePath + walletName + ".json");
            }
            catch (Exception)
            {
                WriteLine("Wrong wallet or password!");
            }
            QBitNinjaClient client = new QBitNinjaClient(Network.TestNet);
            var coinsReceived = client.GetBalance(BitcoinAddress.Create(walletAddress), true).Result;
            string header = "----- Coins Received -----";
            WriteLine(header);
            foreach (var entry in coinsReceived.Operations)
            {
                foreach (var coin in entry.ReceivedCoins)
                {
                    Money amount = (Money)coin.Amount;
                    WriteLine($"Transaction ID: {coin.Outpoint}; Received coins: {amount.ToDecimal(MoneyUnit.BTC)}");
                }
            }
            WriteLine(new string('-', header.Length));

            var coinsSpent = client.GetBalance(BitcoinAddress.Create(walletAddress), false).Result;
            string footer = "----- Coins Spent -----";
            WriteLine(footer);
            foreach (var entry in coinsSpent.Operations)
            {
                foreach (var coin in entry.SpentCoins)
                {
                    Money amount = (Money)coin.Amount;
                    WriteLine($"Transaction ID: {coin.Outpoint}; Spent coins: {amount.ToDecimal(MoneyUnit.BTC)}");
                }
            }
            WriteLine(new string('-', footer.Length));
        }
        private static void Balance()
        {
            Write("Enter wallet's name: ");
            string walletName = ReadLine();
            Write("Enter password for wallet: ");
            string password = ReadLine();
            Write("Enter wallet address: ");
            string walletAddress = ReadLine();
            ShowBalance(password, walletName, walletAddress);
        }

        private static void ShowBalance(string password, string walletName, string walletAddress)
        {
            string walletFilePath = @"Wallets\";
            try
            {
                Safe loadedSafe = Safe.Load(password, walletFilePath + walletName + ".json");
            }
            catch (Exception)
            {
                WriteLine("ERROR! Wrong wallet password!");
                return;
            }
            QBitNinjaClient client = new QBitNinjaClient(Network.TestNet);
            decimal totalBalance = 0;
            var balance = client.GetBalance(BitcoinAddress.Create(walletAddress), true).Result;

            foreach (var entry in balance.Operations)
            {
                foreach (var coin in entry.ReceivedCoins)
                {
                    Money amount = (Money)coin.Amount;
                    decimal currentAmount = amount.ToDecimal(MoneyUnit.BTC);
                    totalBalance += currentAmount;
                }
            }

            WriteLine($"Balance of wallet: {totalBalance}");
        }

        private static void Receive()
        {
            Write("Enter wallet's name: ");
            string walletName = ReadLine();
            Write("Enter password: ");
            string password = ReadLine();
            ReceiveBitcoins(walletName, password);
        }

        private static void ReceiveBitcoins(string walletName, string password)
        {
            string walletFilePath = @"Wallets\";
            try
            {
                Safe loadedSafe = Safe.Load(password, walletFilePath + walletName + ".json");
                for (int i = 0; i < 10; i++)
                {
                    WriteLine(loadedSafe.GetAddress(i));
                }
            }
            catch (Exception)
            {
                WriteLine($"Wallet with name {walletName} does not exist.");
            }
        }
        private static void Recover()
        {
            WriteLine("Please note that the wallet cannot check if your password is correct or not. A wallet will be recovered using your provided mnemonic and password.");
            Write("Enter password: ");
            string password = ReadLine();
            Write("Enter mnemonic phrase: ");
            string mnemonic = ReadLine();
            Write("Enter date(yyyy-MM-dd): ");
            string date = ReadLine();
            Mnemonic mnem = new Mnemonic(mnemonic);
            RecoverWallet(password, mnem, date);
        }

        private static void RecoverWallet(string password, Mnemonic mnemonic, string date)
        {
            Network network = Network.TestNet;
            string walletFilePath = @"Wallets\";
            Random random = new Random();
            Safe safe = Safe.Recover(mnemonic, password, walletFilePath + "RecoverWalletNum" + random.Next() + ".json", network, creationTime: DateTimeOffset.ParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture));
            WriteLine("Wallet successfully recovered!");
        }
        private static void CreateWallet()
        {
            Network currentNetwork = Network.TestNet;
            string walletFilePath = @"Wallets\";
            string pw;
            string pwConfirmed;

            do
            {
                Write("Enter password: ");
                pw = ReadLine();
                Write("Confirm your password: ");
                pwConfirmed = ReadLine();

                if (pw != pwConfirmed)
                {
                    WriteLine("ERROR: Passwords did not match, please try again.");
                }
            } while (pw != pwConfirmed);

            bool isProcessing = true;

            while (isProcessing)
            {
                try
                {
                    Write("Enter wallet name: ");
                    string walletName = ReadLine();
                    Mnemonic mnemonic;
                    Safe safe = Safe.Create(out mnemonic, pw, walletFilePath + walletName + ".json", currentNetwork);
                    WriteLine("Wallet created successfully");
                    WriteLine("Write down the following mnemonic words to recover this wallet: ");
                    WriteLine();
                    WriteLine("==================================");
                    WriteLine(mnemonic);
                    WriteLine("==================================");
                    WriteLine();
                    WriteLine("Write down and keep your private keys in a secure place:");
                    for (int i = 0; i < 20; i++)
                    {
                        WriteLine($"Address: {safe.GetAddress(i)} -> Private Key: {safe.FindPrivateKey(safe.GetAddress(i))}");
                    }
                    isProcessing = false;
                }
                catch (Exception)
                {
                    WriteLine("Wallet already exists!");
                }
            }
        }
    }
}

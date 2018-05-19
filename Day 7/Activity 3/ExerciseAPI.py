import time, json, requests

data = ["high", "last", "timestamp", "bid", "vwap", "volume", "low", "ask", "open"]
bitFinexData = [
  "BID", 
  "BID_SIZE", 
  "ASK", 
  "ASK_SIZE", 
  "DAILY_CHANGE", 
  "DAILY_CHANGE_PERC", 
  "LAST_PRICE", 
  "VOLUME", 
  "HIGH", 
  "LOW"
]

def separator():
    print("================================================")

def bitstamp(requestedData):
    bitStampTick = requests.get('https://www.bitstamp.net/api/ticker')
    jsonReply = bitStampTick.json()
    if requestedData not in jsonReply:
        return None
    return bitStampTick.json()[requestedData]

def cex(stock1, stock2, requestedData):
    cexTick = requests.get('https://cex.io/api/ticker/%s/%s' % (stock1, stock2))
    jsonReply = cexTick.json()
    if requestedData not in jsonReply:
        return None
    return cexTick.json()[requestedData]

def bitfinex(stock, requestedData):
    bitFinexTick = requests.get('https://api.bitfinex.com/v2/ticker/%s' % (stock))
    jsonReply = bitFinexTick.json()
    if requestedData not in bitFinexData:
        return None
    index = bitFinexData.index(requestedData)
    return jsonReply[index]

separator()
print("<<<<< Host: BITSTAMP >>>>>")
for datum in data:
    print("%s => %s" % (datum, bitstamp(datum)))
separator()

separator()
print("<<<<< Host: CEX.IO >>>>>")
for datum in data:
    print("%s => %s" % (datum, cex('BTC', 'USD', datum)))
separator()

separator()
print("<<<<< Host: BITFINEX.IO >>>>>")
for datum in bitFinexData:
    print("%s => %s" % (datum, bitfinex('tBTCUSD', datum)))
separator()

#########################################################################

def getRequest(url, requestData):
    tick = requests.get(url)
    return tick.json()[requestData]

def kraken():
    krakenTick = requests.post('https://api.kraken.com/0/public/Ticker',data=json.dumps({"pair":"XXBTZUSD"}),
        headers={"content-type":"application/json"})
    return krakenTick.json()['result']['XXBTZUSD']['c'][0]

def btstampOrderBookLastBidPrice():
    bitStampOrderBookLastBidPrice = requests.get('https://www.bitstamp.net/api/v2/order_book/btcusd/')
    return bitStampOrderBookLastBidPrice.json()['bids'][0][0]

def btstampOrderBookLastBidQuantity():
    bitStampOrderBookLastBidQuantity = requests.get('https://www.bitstamp.net/api/v2/order_book/btcusd/')
    return bitStampOrderBookLastBidQuantity.json()['bids'][0][1]
#ask
def btstampOrderBookLastAskPrice():
    bitStampOrderBookLastAskPrice = requests.get('https://www.bitstamp.net/api/v2/order_book/btcusd/')
    return bitStampOrderBookLastAskPrice.json()['asks'][1][0]

def btstampOrderBookLastAskQuantity():
    bitStampOrderBookLastAskQuantity = requests.get('https://www.bitstamp.net/api/v2/order_book/btcusd/')
    return bitStampOrderBookLastAskQuantity.json()['asks'][1][1]

while True:
    btstampUSDLive = float(getRequest('https://www.bitstamp.net/api/ticker/', 'last'))
    coinbUSDLive = float(getRequest('https://coinbase.com/api/v1/prices/buy', 'amount'))
    krakenUSDLive = float(kraken())
    bitfinexUSDLive = float(getRequest('https://api.bitfinex.com/v1/ticker/btcusd', 'last_price'))

    print (" --- ticker ---")
    print ("Bitstamp Price in USD =", btstampUSDLive)
    print ("Coinbase Price in USD =", coinbUSDLive)
    print ("Kraken Price in USD =", krakenUSDLive)
    print ("Bitfinex Price in USD =", bitfinexUSDLive)
    print (" ")    

    btstampOrderBookLastBidP = float(btstampOrderBookLastBidPrice())
    btstampOrderBookLastBidQ = float(btstampOrderBookLastBidQuantity())
    btstampOrderBookLastAskP = float(btstampOrderBookLastAskPrice())
    btstampOrderBookLastAskQ = float(btstampOrderBookLastAskQuantity())
    
    print (" --- bitstamp BTCUSD orders ---")
    print ("last bid:")
    print ("         price =", btstampOrderBookLastBidP)
    print ("         quantity =", btstampOrderBookLastBidQ)
    print ("last ask:")
    print ("         price =", btstampOrderBookLastAskP)
    print ("         quantity =", btstampOrderBookLastAskQ)
    print (" ------------------------------")
    print (" ")
    time.sleep(3)

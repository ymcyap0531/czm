/*
const callback = (mutationList, observer) => {
  if(!checkIsUS()) {
    const userIpInfo = JSON.parse(sessionStorage.getItem('userIpInfo'))
    convertCurrency(userIpInfo.currency)
  }
};

const observer = new MutationObserver(callback);
const config = { attributes: true, childList: true, subtree: true, characterData: true, characterDataOldValue: true };
observer.observe(document.querySelector("html"), config);
*/

const checkIsIpFetch = () => {
  if(sessionStorage.getItem('userIpInfo')) return true
  else return false
}

const checkIsCurrenciesFetch = () => {
  if(sessionStorage.getItem('currencies')) return true
  else return false
}

const getGeoLocation = async() => {
  const resp = await fetch(`http://pro.ip-api.com/json/?key=Ym4whN4dt5GYkfV&fields=status,message,country,countryCode,region,regionName,city,currency,query`)
  const data = await resp.json()
  await sessionStorage.setItem('userIpInfo', JSON.stringify(data))
}

const getCurrencies = async() => {
  const resp = await fetch(`https://init.grizzlyapps.com/9e32c84f0db4f7b1eb40c32bdb0bdea9`)
  const tmpdata = await resp.text()
  let data = tmpdata.replace(`var Currency = `, ``).replace(`rates`, `"rates"`).replace(`;`, ``)
  data = `${data.substr(0, data.indexOf('}'))}}}`
  data = await JSON.parse(data)
  await sessionStorage.setItem('currencies', JSON.stringify(data))
}

const checkIsUS = () => {
  const userIpInfo = JSON.parse(sessionStorage.getItem('userIpInfo'))
  if(userIpInfo) {
    return userIpInfo.countryCode=='US'?true:false
  }
}

const convertCurrency = async(code) => {
  const currencies = await JSON.parse(sessionStorage.getItem('currencies'))
  const allPriceTag = document.getElementsByClassName('money')
  const allPriceTag2 = document.getElementsByClassName('price-box')
  if(!currencies) return
  let tmpPrice
  for(let i=0;i<allPriceTag.length;i++) {
    tmpPrice = allPriceTag[i].innerText
    if(tmpPrice.includes(code)) continue
    if(!tmpPrice || tmpPrice=='') continue
    if(tmpPrice) tmpPrice = tmpPrice.replace(/[^0-9.]/g, '')
    try{
      let price = (parseFloat(tmpPrice)/parseFloat(currencies.rates[code])).toFixed(2)
      console.log(price)
      if(price && !isNaN(price))
        allPriceTag[i].innerText = `${price} ${code}`
    }catch(e) {
      throw(e)
    }
  }

  for(let i=0;i<allPriceTag2.length;i++) {
    tmpPrice = allPriceTag2[i].innerText
    if(tmpPrice.includes(code)) continue
    if(!tmpPrice || tmpPrice=='') continue
    if(tmpPrice) tmpPrice = tmpPrice.replace(/[^0-9.]/g, '')
    try{
      let price = (parseFloat(tmpPrice)/parseFloat(currencies.rates[code])).toFixed(2)
      console.log(price)
      if(price && !isNaN(price))
        allPriceTag2[i].innerHTML = `<span>${price} ${code}</span>`
    }catch(e) {
      throw(e)
    }
  }
}

const initObserver = () => {
  const config = { attributes: true, childList: true, subtree: true, characterData: true, characterDataOldValue: true };
  const allPriceTag = document.getElementsByClassName('money')
  const allPriceTag2 = document.getElementsByClassName('price-box')
  
  for(let i=0;i<allPriceTag.length;i++) {
    observer.observe(allPriceTag[i], config);
  }

  for(let i=0;i<allPriceTag2.length;i++) {
    observer.observe(allPriceTag2[i], config);
  }
}

const main = async() => {
  !checkIsIpFetch()?await getGeoLocation():null
  !checkIsCurrenciesFetch()?await getCurrencies():null
  if(!checkIsUS()) {
    const userIpInfo = JSON.parse(sessionStorage.getItem('userIpInfo'))
    setTimeout(() => {convertCurrency(userIpInfo.currency)}, 1000)
  }  
}

//initObserver()
document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    main()
  }
};


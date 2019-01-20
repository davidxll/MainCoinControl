import React from 'react';
import MarketService from '../services/market.service.js';
import PurchaseService from '../services/purchase.service.js';
import FullMarket from './presentational/FullMarket';
import PurchasesSummary from './presentational/PurchasesSummary';
import Portfolio from './presentational/Portfolio';
import Report from './presentational/Report';

function transformCoinInfo(coin) {
  coin.price_btc = +coin.price_btc
  coin.price_usd = +coin.price_usd
  coin.total_supply = +coin.total_supply
  coin.rank = +coin.rank
  coin.percent_change_24h = +coin.percent_change_24h
  coin.percent_change_7d = +coin.percent_change_7d
  coin.percent_change_1h = +coin.percent_change_1h
  return coin;
}

function calculatePurchasesData(purchases, market) {
  let hasSells = false;
  purchases.map(p => {
    const purchasedCoinInfo = market.find(m => {
      return m.symbol === p.currencyCode
    })
    p.coinInfo = transformCoinInfo(purchasedCoinInfo);
    p.price = purchasedCoinInfo.price_btc;
    p.isBtcPurchase = true;
    
    if(p.sold) {
      hasSells = true;
    }
    if (p.rateCurrency === 'USD') {
      p.price = purchasedCoinInfo.price_usd;
      p.isBtcPurchase = false;
    }
    if(p.sold && p.btcPriceAtPurchase && !p.isBtcPurchase) {
      p.price = +p.btcPriceAtPurchase;
      p.rateCurrency = 'USD';
    }
    let value = p.amount * p.price;
    if(p.sold) {
      p.value = +p.sellPrice;
      p.rateCurrency = 'USD';
    }
    const cost = p.amount * p.rate;
    const profit = value - cost;
    p.value   = value
    p.cost    = cost
    p.profit  = profit
  })
  return {purchases, ableToReport: hasSells};
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      market: [],
      purchases: [],
      user: {
        name: '',
        tax: 1,
      },
      showReport: true,
    };
    this.addPurchase = this.addPurchase.bind(this);
    this.editPurchase = this.editPurchase.bind(this);
    this.deletePurchase = this.deletePurchase.bind(this);
    this.onReportClick = this.onReportClick.bind(this);
    this.logout = this.logout.bind(this);
    this.loadAndFormatPurchases = this.loadAndFormatPurchases.bind(this);
    this.marketInstance = new MarketService();
    this.purchaseInstance = new PurchaseService(props.auth);
    this.currencyCodes = [];
  }

  componentDidMount() {
    this.loadMarketAndPurchaseData();
    this.loadUserData();
  }

  onReportClick() {
    this.setState({showReport: true});
  }

  logout() {
    this.props.auth.logout();
    setTimeout(()=>{
      window.location.reload();
    }, 500);
  }

  editPurchase(purchaseData, index) {
    const purchasedCoinInfo = {...this.state.purchases[index], ...purchaseData};
    console.log("purchasedCoinInfo in editPurchase: ", purchasedCoinInfo)
    this.purchaseInstance.updatePurchase(purchasedCoinInfo).then(res => {
      const rawPurchases = res.purchases;
      const { purchases, ableToReport } = calculatePurchasesData(rawPurchases, this.state.market);
      this.setState({purchases, ableToReport});
    })
  }

  addPurchase(newPurchase) {
    const purchasedCoinInfo = this.state.market.find(c => {
      return c.symbol === newPurchase.currencyCode
    })
    newPurchase.coinInfo = purchasedCoinInfo;
    newPurchase.purchasedCoinInfo = purchasedCoinInfo;
    this.purchaseInstance.createPurchase(newPurchase).then(res => {
      newPurchase.id = res.id;
      let rawPurchases = this.state.purchases;
      rawPurchases.push(newPurchase)
      const { purchases, ableToReport } = calculatePurchasesData(rawPurchases, this.state.market);
      this.setState({purchases, ableToReport});
    })
  }
  
  deletePurchase(index) {
    const purchaseToDelete = this.state.purchases[index];
    this.purchaseInstance.deletePurchase(purchaseToDelete).then(res => {
      const rawPurchases = res.purchases;
      const { purchases, ableToReport } = calculatePurchasesData(rawPurchases, this.state.market);
      this.setState({purchases, ableToReport});
    })
  }

  loadAndFormatPurchases(market) {
    this.purchaseInstance.getAllPurchases().then(res => {
      const rawPurchases = res.purchases;
      const { purchases, ableToReport } = calculatePurchasesData(rawPurchases, market);
      this.setState({purchases, ableToReport});
    })
  }
  
  loadUserData() {
    this.props.auth.getUserData().then(userData => {
      console.log("userData ", userData);
      this.setState({user: userData});
    })
    .catch(err => alert(err));
  }

  loadMarketAndPurchaseData() {
    this.marketInstance.loadData(10).then(res => {
      const market = res.market.map(transformCoinInfo);
      this.setState({market}, () => this.loadAllMarkets().then(this.loadAndFormatPurchases));
    });
  }
  
  loadAllMarkets() {
    return new Promise((resolve, reject) => {
      this.marketInstance.loadData().then(res => {
        const market = res.market.map(transformCoinInfo);
        this.currencyCodes = market.map(m => { return {code: m.symbol, name: m.name} })
        this.btcInfo = market[0];
        this.setState({market});
        resolve(market);
      });
    });
  }

  render() {
    return (
      <div className="Dashboard">
        <nav className="navbar navbar-dark bg-dark">
          <a className="navbar-brand">Welcome <strong>{this.state.user.name}</strong></a>
          <a className="navbar-brand pull-right" onClick={this.logout}><i className="icon ion-log-out"></i></a>
        </nav>
        { this.state.showReport && this.state.ableToReport &&
          <Report purchases={this.state.purchases} user={this.state.user} />
        }
        <PurchasesSummary
          btcInfo={this.btcInfo}
          purchases={this.state.purchases}
          deletePurchase={this.deletePurchase}
          editPurchase={this.editPurchase}
          addPurchase={this.addPurchase}
          currencyCodes={this.currencyCodes}
          showReport={this.state.showReport}
          ableToReport={this.state.ableToReport}
          onReportClick={this.onReportClick}
        />
        { this.state.purchases.length > 0 &&
          <Portfolio purchases={this.state.purchases} />
        }
        <FullMarket market={this.state.market} />
      </div>
    );
  }
}

export default Dashboard;

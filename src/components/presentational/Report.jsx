import React from 'react';
import moment from 'moment';

const longFormat = 'ddd, MMM D YYYY';
const shortFormat = 'MM/DD/YYYY';

function formatNumber(number) {
  if(isNaN(Number(number))) {
    return '----';
  }
  var [entero, decimals] = Number(number).toFixed(2).toString().split('.');
  return (entero.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + decimals);
};

function getReport(sells) {
  const report = {oldestSale: moment(), newestSale: moment(), sales: []};
  sells.forEach(s => {
    const momentPurchased = moment(s.purchasedDate)
    const momentSold = moment(s.soldDate)
    const sell = {
      ...s,
      formattedPurchasedDate: momentPurchased.format(shortFormat),
      formattedSoldDate: momentSold.format(shortFormat),
      shortTerm: true,
    } 
    if(report.oldestSale.isBefore(momentSold)) {
      report.oldestSale = momentSold;
    }
    if(report.newestSale.isAfter(momentSold)) {
      report.newestSale = momentSold;
    }
    if(momentSold.diff(momentPurchased, 'year') > 1) {
      sell.shortTerm = false;
    }
    report.sales.push(sell);
  })
  return report;
}

class Report extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    const report = getReport(props.purchases);
    return (
      <div className="container printable">
        <a onClick={() => {window.print()}} style={{'cursor': 'pointer'}}><i className="icon ion-print" /> print report</a>
        <h3>{props.user.name ? `${props.user.name}'s ` : ''}Crypto Statement as <strong>{moment().format('ddd, MMM D YYYY')}</strong></h3>
        <h5><strong>Begin Date:</strong> {report.newestSale.format(longFormat)}</h5>
        <h5><strong>End Date:</strong> {report.oldestSale.format(longFormat)}</h5>
        <table className="table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Purchased Date</th>
              <th>Sold Date</th> 
              <th>Purchased Price</th>
              <th>Sold Price</th>
              <th>Profit</th> 
              <th>Tax %</th>
              <th>Tax USD</th>
            </tr>
          </thead>
          <tbody>
            {report.sales.map(sell => {
              let tax = sell.shortTerm ? 10 : 20;
              tax += +props.user.tax;
              tax = sell.profit > 0 ? tax : 0;
              return(
                <tr>
                  <td>{sell.currencyCode}</td>
                  <td>{sell.formattedPurchasedDate}</td>
                  <td>{sell.formattedSoldDate}</td> 
                  <td>{formatNumber(sell.cost)}</td>
                  <td>{formatNumber(sell.value)}</td>
                  <td>{formatNumber(sell.profit)}</td> 
                  <td>{tax}%</td>
                  <td>{tax > 0 ? formatNumber(((+sell.profit) / (+tax)) * 100) : 0.00}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <hr/>
      </div>
    )
  }
} 

export default Report;
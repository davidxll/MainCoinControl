import React from 'react';
import { PieChart } from 'react-d3-components';

class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPurchasePopup: false,
    }
  }

  render() {
    // values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
    const coins = {};
    this.props.purchases.forEach(p => {
      if(typeof coins[p.currencyCode] !== 'number') {
        coins[p.currencyCode] = 0;
      }
      coins[p.currencyCode] += p.amount;
    })
    var data = {
      values: Object.entries(coins).map(([coin, amount]) => { return {x: `${amount} ${coin}`, y: amount}})
    };
    return (
      <div className="container" style={{textAlign:'center'}}>
        <hr/>
        <PieChart
          data={data}
          width={600}
          height={400}
        />
      </div>
    )
  }
} 

export default Portfolio;
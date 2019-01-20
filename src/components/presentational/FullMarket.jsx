import React from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

function priceFormatter(cell, row) {
  var price = +cell;
  if (isNaN(price)) {
    return null;
  }
  return (<span><i className='ion-social-usd'></i> {price.toFixed(6).toLocaleString()}</span>);
}

function bitcoinFormatter(cell, row) {
  var price = +cell;
  if (isNaN(price)) {
    return null;
  }
  return (<span><i className='ion-social-bitcoin'></i> {price.toFixed(8).toLocaleString()}</span>);
}

// https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/svg/icon/btc.svg
function iconFormatter(cell, row) {
  const baseUrl = 'https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/svg/icon/'
  const code = row.symbol.toLowerCase();
  const iconUrl = `${baseUrl}${code}.svg?sanitize=true`;
  return (
    <span>
      <img src={iconUrl}></img>
    </span>
  );
}


function numberFormatter(cell, row) {
  var number = +cell;
  if (isNaN(number)) {
    return null;
  }
  return (<span>{number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>);
}

function percentFormatter(cell, row) {
  return (<span>{cell}%</span>);
}

function rowClassNameFormat(row, rowIdx) {
  return (row.percent_change_24h > 0 && row.percent_change_1h > 0) ? 'win' : (row.percent_change_24h < 0 && row.percent_change_1h < 0) ? 'loss' : '';
}

class FullMarket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onlyProfitable: false,
    }
    this.goToCoin = this.goToCoin.bind(this);
    this.toggleProfitable = this.toggleProfitable.bind(this);
  }
  goToCoin(row) {
    window.open(`https://coinmarketcap.com/currencies/${row.id}`, '_blank')
  }
  toggleProfitable(evt) {
    console.log(evt.target.checked);
    this.setState({onlyProfitable: evt.target.checked});
  }
  render() {
    let market = this.props.market;
    if (this.state.onlyProfitable) {
      market = market.filter(m => {
        return m.percent_change_24h > 0 && m.percent_change_1h > 0;
      })
    }
    return (
      <div className="container market-container">
        <hr/>
        <div style={{position:'absolute', zIndex:'1'}}>
          <div className="checkbox profitable-only-checkbox win">
            <label>
              <input type="checkbox" onChange={this.toggleProfitable} /> See only profitable
            </label>
          </div>
        </div>
        <BootstrapTable
          data={ market }
          trClassName={rowClassNameFormat}
          options={{onRowClick: this.goToCoin, sizePerPageList: [ 25, 50, 100 ], sizePerPage: 25}}
          pagination
          search
        >
          <TableHeaderColumn dataField='id' width='32px' dataFormat={ iconFormatter } columnClassName='td-icon' >Icn</TableHeaderColumn>
          <TableHeaderColumn dataField='rank' width='5%' isKey dataSort>rank</TableHeaderColumn>
          <TableHeaderColumn dataField='symbol' width='7%' dataSort>code</TableHeaderColumn>
          <TableHeaderColumn dataField='name' width='10%' dataSort>name</TableHeaderColumn>
          <TableHeaderColumn dataField='price_btc' width='13%' dataSort dataFormat={ bitcoinFormatter }>price <i className='ion-social-bitcoin'></i></TableHeaderColumn>
          <TableHeaderColumn dataField='price_usd' width='13%' dataSort dataFormat={ priceFormatter }>price <i className='ion-social-usd'></i></TableHeaderColumn>
          <TableHeaderColumn dataField='total_supply' width='15%' dataSort dataFormat={ numberFormatter }>actual supply</TableHeaderColumn>
          <TableHeaderColumn dataField='percent_change_24h' width='8%' dataSort dataFormat={ percentFormatter }>last 24h</TableHeaderColumn>
          <TableHeaderColumn dataField='percent_change_1h' width='8%' dataSort dataFormat={ percentFormatter }>last 1h</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

export default FullMarket;

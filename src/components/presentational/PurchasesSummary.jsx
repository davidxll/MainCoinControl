import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import PurchaseFormPopup from './PurchaseFormPopup';
import { isNumber } from 'util';

function priceFormatter(cell, row) {
  var price = +cell;
  if (isNaN(price)) {
    return null;
  }
  return (<span><i className={row.isBtcPurchase ? 'ion-social-bitcoin' : 'ion-social-usd'}></i> {price.toFixed(6).toLocaleString()}</span>);
}

function nameFormatter(cell, row) {
  return (<span> {row.coinInfo.name} (<strong>{cell}</strong>)</span>);
}

function rowClassNameFormat(col, row) {
  let baseClass = 'profit-col';
  if (col > 0) {
    baseClass += ' win'
  } else {
    baseClass += ' loss'
  }
  if(row.sold) {
    baseClass += ' sold'
  }
  return baseClass;
}

class PurchasesSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPurchasePopup: false,
      editingPurchase: {}
    }
    this.editPurchase = this.editPurchase.bind(this);
  }

  editPurchase(row, cell, index) {
    this.setState({
      showPurchasePopup: true,
      editingPurchase: {...row, index},
    })
  }

  render() {
    return (
      <div className="container">
        { this.props.ableToReport && !this.props.showReport &&
          <a onClick={this.props.onReportClick} style={{ position: 'absolute', zIndex: '1', cursor: 'pointer' }}>See Statement</a>
        }
        { this.props.purchases.length > 0 &&
        <BootstrapTable data={ this.props.purchases } options={{onRowClick: this.editPurchase}} search>
          <TableHeaderColumn dataField='id' width='0' isKey hidden>id</TableHeaderColumn>
          <TableHeaderColumn dataField='broker' width='10%' dataSort>broker</TableHeaderColumn>
          <TableHeaderColumn dataField='currencyCode' width='14%' dataSort dataFormat={ nameFormatter }>name</TableHeaderColumn>
          <TableHeaderColumn dataField='price' width='12%' dataSort dataFormat={ priceFormatter }>Actual Price</TableHeaderColumn>
          <TableHeaderColumn dataField='rate' width='12%' dataSort dataFormat={ priceFormatter }>Purchased Price</TableHeaderColumn>
          <TableHeaderColumn dataField='amount' width='12%' dataSort>Amount</TableHeaderColumn>
          <TableHeaderColumn dataField='value' width='13%' dataSort dataFormat={ priceFormatter }>value</TableHeaderColumn>
          <TableHeaderColumn dataField='cost' width='13%' dataSort dataFormat={ priceFormatter }>cost</TableHeaderColumn>
          <TableHeaderColumn dataField='profit' width='14%' dataSort dataFormat={ priceFormatter } columnClassName={rowClassNameFormat}>profit</TableHeaderColumn>
        </BootstrapTable>
        }
        <button
          className="btn btn-primary btn-block"
          onClick={() => {this.setState({showPurchasePopup: true})}}
        >
          add purchase <i className='icon ion-plus'></i>
        </button>
        {this.state.showPurchasePopup &&
          <PurchaseFormPopup
            isOpen={this.state.showPurchasePopup}
            purchase={this.state.editingPurchase}
            btcInfo={this.props.btcInfo}
            addPurchase={(purchaseData) => {
              console.log('purchaseData in PurchasesSummary: ', purchaseData);
              if (isNumber(this.state.editingPurchase.index)) {
                this.props.editPurchase(purchaseData, this.state.editingPurchase.index);
              }
              else {
                this.props.addPurchase(purchaseData);
              }
              this.setState({ showPurchasePopup: false, editingPurchase: {} });
            }}
            deletePurchase={() => {
              if (isNumber(this.state.editingPurchase.index)) {
                this.props.deletePurchase(this.state.editingPurchase.index);
              }
              this.setState({ showPurchasePopup: false, editingPurchase: {} });
            }}
            onCloseModal={() => {
              this.setState({ showPurchasePopup:false, editingPurchase: {} });
            }}
            currencyCodes={this.props.currencyCodes}
          />
        }
    </div>
    )
  }
} 

export default PurchasesSummary;
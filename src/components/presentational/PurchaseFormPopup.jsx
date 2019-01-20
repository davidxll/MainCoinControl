import React from 'react';
import Modal from 'react-responsive-modal';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { isNumber } from 'util';

class PurchaseFormPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      broker: props.purchase.broker || '',
      currencyCode: props.purchase.currencyCode || '',
      amount: props.purchase.amount || '',
      rate: props.purchase.rate || '',
      rateCurrency: props.purchase.rateCurrency || 'USD',
      sold: props.purchase.sold || false,
      soldDate: moment(props.purchase.soldDate) || moment(),
      purchasedDate: moment(props.purchase.purchasedDate) || moment(),
      usdPriceAtPurchase: props.purchase.usdPriceAtPurchase || '',
      sellPrice: props.purchase.sellPrice || '',
      purchasedNow: !props.purchase.purchasedDate,
      isEditing: isNumber(props.purchase.index),
    }
    this.brokers = [
      'Bittrex', 'Coinexchange', 'Coinbase', 'Gdax', 'Gemini', 'Binance'
    ];
    this.commitPurchase = this.commitPurchase.bind(this);
    this.switchRateCurrency = this.switchRateCurrency.bind(this);
  }

  switchRateCurrency(evt) {
    evt.preventDefault();
    if (this.state.rateCurrency === 'BTC') {
      this.setState({rateCurrency: 'USD'});
    }
    else {
      this.setState({rateCurrency: 'BTC'});
    }
  }

  commitPurchase(evt) {
    evt.preventDefault();
    // Gather data
    const purchaseInfo = {
      broker: this.state.broker,
      currencyCode: this.state.currencyCode,
      amount: +this.state.amount,
      rate: +this.state.rate,
      rateCurrency: this.state.rateCurrency,
      sold: this.state.sold,
      usdPriceAtPurchase: this.state.usdPriceAtPurchase,
      sellPrice: this.state.sellPrice,
      purchasedDate: moment(this.state.purchasedDate).format('MM/DD/YYYY'),
    }

    if(!this.state.isEditing && this.state.purchasedNow) {
      purchaseInfo.usdPriceAtPurchase = this.props.btcInfo.price_usd;
    }
    if(purchaseInfo.sold) {
      purchaseInfo.soldDate = moment(this.state.soldDate).format('MM/DD/YYYY');
    }
    // Validate
    if(!purchaseInfo.broker || !purchaseInfo.currencyCode || !purchaseInfo.amount || !purchaseInfo.rate) {
      window.alert('Invalid Data');
      return false;
    }
    // Fire cb
    this.props.addPurchase(purchaseInfo);
  }

  render() {
    const props = this.props;
    return (
      <Modal
        open={props.isOpen}
        onClose={props.onCloseModal}
        closeOnOverlayClick={false}
        styles={ { modal: { padding: '50px' } } }
        center
      >
        <form className="form-horizontal add-purchase-form" onSubmit={this.commitPurchase}>

          {this.state.isEditing && 
            <button
              className="btn btn-default btn-danger delete-purchase-button"
              onClick={(evt) => {evt.preventDefault(); this.props.deletePurchase()}}
            >
              <i className={'icon ion-trash-a'}></i>
            </button>
          }

          {this.state.purchasedNow &&
          <div className="form-group">
            <label style={{ paddingTop:'8px' }} className="col-sm-4 control-label">Purchased now?</label>
            <div className="col-sm-8">
              <div className="checkbox">
                <input type="checkbox" checked={this.state.purchasedNow} onChange={(evt) => {
                  this.setState({purchasedNow: evt.target.checked});
                }} />
              </div>
            </div>
          </div>
          }

          {!this.state.sold &&
          <div className="form-group">
            <label style={{ paddingTop:'8px' }} className="col-sm-4 control-label">Sold?</label>
            <div className="col-sm-8">
              <div className="checkbox">
                <input type="checkbox" checked={this.state.sold} onChange={(evt) => {
                  this.setState({sold: evt.target.checked});
                }} />
              </div>
            </div>
          </div>
          }

          {this.state.sold &&
            <div className="form-group">
              <label className="col-sm-4 control-label">Sold Date</label>
              <div className="col-sm-8">
                <div>
                  <DatePicker
                    dateFormatInput='ddd, MMM D'
                    dateFormatInputOnEdit='MM/DD/YYYY'
                    dateFormatCalendar='MMMM YYYY'
                    selected={this.state.soldDate.toDate()}
                    title="Sold date"
                    className='form-control input-lg full-width'
                    minDate={this.state.purchasedDate.toDate()}
                    onChange={(value) => {
                      this.setState({soldDate: moment(value)});
                    }}
                  />
                </div>
              </div>
            </div>
          }

          <div className="form-group">
            <label className="col-sm-4 control-label">Broker</label>
            <div className="col-sm-8">
              <select
                required
                className="form-control input-lg full-width"
                value={this.state.broker}
                onChange={evt => this.setState({broker: evt.target.value})}
              >
                <option disabled hidden value="">- Broker -</option>
                {this.brokers.map((brokerName, i) => {return (
                  <option value={brokerName} key={i}>{brokerName}</option>
                )})}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-4 control-label">Currency</label>
            <div className="col-sm-8">
              <select
                required
                className="form-control input-lg full-width"
                value={this.state.currencyCode}
                onChange={evt => this.setState({currencyCode: evt.target.value})}
              >
                <option disabled hidden value="">- Currency -</option>
                {props.currencyCodes.map((currencyCode, i) => {return (
                  <option value={currencyCode.code} key={i}>{currencyCode.code} - {currencyCode.name}</option>
                )})}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-4 control-label">Price Paid</label>
            <div className="col-sm-2" style={{paddingRight: 0}}>
              <button className="btn btn-default btn-info full-width" style={{borderRight: 0}} onClick={this.switchRateCurrency}>
                <i className={this.state.rateCurrency === 'BTC' ? 'ion-social-bitcoin' : 'ion-social-usd'}></i>
              </button>
            </div>
            <div className="col-sm-6" style={{paddingLeft: 0}}>
              <input
                required
                type="number"
                step="any"
                className="form-control input-lg"
                value={this.state.rate}
                placeholder="price"
                onChange={evt => this.setState({rate: evt.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-4 control-label">Amount Purchased</label>
            <div className="col-sm-8">
              <input
                required
                type="number"
                step="any"
                min="0"
                className="form-control input-lg full-width"
                value={this.state.amount}
                placeholder="amount"
                onChange={evt => this.setState({amount: evt.target.value})}
              />
            </div>
          </div>

          {!this.state.purchasedNow &&
            <div className="form-group">
              <label className="col-sm-4 control-label">purchased date</label>
              <div className="col-sm-8">
                <DatePicker
                  dateFormatInput='ddd, MMM D'
                  dateFormatInputOnEdit='MM/DD/YYYY'
                  dateFormatCalendar='MMMM YYYY'
                  selected={this.state.purchasedDate.toDate()}
                  title="Purchased date"
                  className='form-control input-lg full-width'
                  maxDate={new Date()}
                  onChange={(value) => {
                    this.setState({purchasedDate: moment(value)});
                  }}
                />
              </div>
            </div>
          }

          {this.state.sold &&
            <div className="form-group">
              <label className="col-sm-4 control-label">Sold total price <small>(in USD)</small></label>
              <div className="col-sm-8">
                <input
                  type="number"
                  step="any"
                  className="form-control input-lg"
                  value={this.state.sellPrice}
                  placeholder="sold for"
                  onChange={evt => this.setState({sellPrice: evt.target.value})}
                />
              </div>
            </div>
          }

          <div style={{marginTop: '35px'}}>
            <button className="btn btn-primary input-lg full-width" type="submit">{this.state.isEditing ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    )
  }
}

export default PurchaseFormPopup;

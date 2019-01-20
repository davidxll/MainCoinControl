import React from 'react';

const BtcPurchase = (props) => {
  const value = props.amount * props.coinInfo.price_btc;
  const cost = props.amount * props.rate;
  const profit = value - cost;
  return (
  <tr className={profit > 0 ? 'win' : 'loss'}>
    <td>{props.broker}</td>
    <td>{props.currencyCode}</td>
    <td>{props.coinInfo.name}</td>
    <td>{props.coinInfo.price_btc}</td>
    <td>{props.coinInfo.price_usd}</td>
    <td>{props.rate} <strong>{props.rateCurrency}</strong></td>
    <td>{props.amount}</td>
    <td>{value}</td>
    <td>{cost}</td>
    <td>{profit}</td>
  </tr>
  );
};

export default BtcPurchase;

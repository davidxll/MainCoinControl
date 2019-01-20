import React from 'react';

const CoinMarket = (props) => {
  return (
    <tr>
      <td>{props.rank}</td>
      <td>{props.symbol}</td>
      <td>{props.name}</td>
      <td>{props.price_btc}</td>
      <td>{props.price_usd}</td>
      <td>{props.total_supply}</td>
      <td>{props.max_supply}</td>
    </tr>
  )
};

export default CoinMarket;

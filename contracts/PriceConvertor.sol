// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// https://github.com/PatrickAlphaC/hardhat-fund-me-fcc/blob/main/contracts/PriceConverter.sol
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
  function getPrice(AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    (, int256 answer, , , ) = priceFeed.latestRoundData();
    // ETH/USD rate in 18 digit
    return uint256(answer * 10000000000);
  }

  // 1000000000
  // call it get fiatConversionRate, since it assumes something about decimals
  // It wouldn't work for every aggregator
  function ethToUsd(uint256 ethAmount, AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    uint256 ethPrice = getPrice(priceFeed);
    uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1000000000000000000;
    // the actual ETH/USD conversation rate, after adjusting the extra 0s.
    return ethAmountInUsd;
  }


  function usdToEth(uint256 ethAmountInUsd, AggregatorV3Interface priceFeed)
      internal
      view
      returns (uint256)
    {
      uint256 ethPrice = getPrice(priceFeed);
      uint256 ethAmount = (ethAmountInUsd * 1000000000000000000) / ethPrice;

      // the actual ETH/USD conversation rate, after adjusting the extra 0s.
      return ethAmount;
    }
  }
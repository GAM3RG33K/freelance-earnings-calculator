import React, { useState } from 'react';

const FreelanceEarningsCalculator: React.FC = () => {
  const [totalEarningsUSD, setTotalEarningsUSD] = useState<number>(750);
  const [exchangeRateINR, setExchangeRateINR] = useState<number>(81);
  const [netEarningsINR, setNetEarningsINR] = useState<number | null>(null);

  const calculateEarnings = () => {
    const serviceFeePercentage = 10 / 100;
    const gstPercentage = 18 / 100;
    const withholdingTaxPercentage = 1 / 100;
    const withdrawalFeeUSD = 1;

    const serviceFee = totalEarningsUSD * serviceFeePercentage;
    const gstOnServiceFee = serviceFee * gstPercentage;
    const withholdingTax = totalEarningsUSD * withholdingTaxPercentage;

    const totalDeductions = serviceFee + gstOnServiceFee + withholdingTax;
    const netEarningsUSD = totalEarningsUSD - totalDeductions;
    const netEarningsAfterWithdrawalFeeUSD = netEarningsUSD - withdrawalFeeUSD;

    const netEarningsINR = netEarningsAfterWithdrawalFeeUSD * exchangeRateINR;
    setNetEarningsINR(netEarningsINR);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Freelance Earnings Calculator</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Total Earnings (USD):
          <input
            type="number"
            value={totalEarningsUSD}
            onChange={(e) => setTotalEarningsUSD(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Exchange Rate (INR):
          <input
            type="number"
            value={exchangeRateINR}
            onChange={(e) => setExchangeRateINR(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
      </div>
      <button
        onClick={calculateEarnings}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Calculate
      </button>
      {netEarningsINR !== null && (
        <div className="mt-4 text-lg">
          Net amount deposited in your bank account: ₹{netEarningsINR.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default FreelanceEarningsCalculator;
import React, { useState } from 'react';

// Define the InputField component outside of the main component
const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}> = ({ label, value, onChange, placeholder }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
            {label}:
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
        </label>
    </div>
);

const FreelanceEarningsCalculator: React.FC = () => {
    const [fields, setFields] = useState({
        totalEarningsUSD: '750',
        serviceFeePercentage: '10',
        gstPercentage: '18',
        withholdingTaxPercentage: '1',
        withdrawalFeeUSD: '1',
        exchangeRateINR: '81',
    });
    const [netEarningsINR, setNetEarningsINR] = useState<number | null>(null);

    const handleInputChange = (field: keyof typeof fields, value: string) => {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setFields(prev => ({ ...prev, [field]: value }));
        }
    };

    const calculateEarnings = () => {
        const {
            totalEarningsUSD,
            serviceFeePercentage,
            gstPercentage,
            withholdingTaxPercentage,
            withdrawalFeeUSD,
            exchangeRateINR,
        } = fields;

        const totalEarnings = parseFloat(totalEarningsUSD);
        const serviceFee = totalEarnings * (parseFloat(serviceFeePercentage) / 100);
        const gstOnServiceFee = serviceFee * (parseFloat(gstPercentage) / 100);
        const withholdingTax = totalEarnings * (parseFloat(withholdingTaxPercentage) / 100);

        const totalDeductions = serviceFee + gstOnServiceFee + withholdingTax;
        const netEarningsUSD = totalEarnings - totalDeductions;
        const netEarningsAfterWithdrawalFeeUSD = netEarningsUSD - parseFloat(withdrawalFeeUSD);

        const netEarningsINR = netEarningsAfterWithdrawalFeeUSD * parseFloat(exchangeRateINR);
        setNetEarningsINR(netEarningsINR);
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-4">Freelance Earnings Calculator</h1>
            <InputField
                label="Total Earnings (USD)"
                value={fields.totalEarningsUSD}
                onChange={(value) => handleInputChange('totalEarningsUSD', value)}
                placeholder="e.g., 750"
            />
            <InputField
                label="Service Fee (%)"
                value={fields.serviceFeePercentage}
                onChange={(value) => handleInputChange('serviceFeePercentage', value)}
                placeholder="e.g., 10"
            />
            <InputField
                label="GST (%)"
                value={fields.gstPercentage}
                onChange={(value) => handleInputChange('gstPercentage', value)}
                placeholder="e.g., 18"
            />
            <InputField
                label="Withholding Tax (%)"
                value={fields.withholdingTaxPercentage}
                onChange={(value) => handleInputChange('withholdingTaxPercentage', value)}
                placeholder="e.g., 1"
            />
            <InputField
                label="Withdrawal Fee (USD)"
                value={fields.withdrawalFeeUSD}
                onChange={(value) => handleInputChange('withdrawalFeeUSD', value)}
                placeholder="e.g., 1"
            />
            <InputField
                label="Exchange Rate (INR)"
                value={fields.exchangeRateINR}
                onChange={(value) => handleInputChange('exchangeRateINR', value)}
                placeholder="e.g., 81"
            />
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
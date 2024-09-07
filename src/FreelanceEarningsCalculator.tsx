import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Coins, HelpCircle } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/ui/collapsible';

const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    helpLink?: string;
}> = ({ label, value, onChange, placeholder, helpLink }) => (
    <div className="grid w-full items-center gap-1.5">
        <Label htmlFor={label} className="flex items-center">
            {label}
            {helpLink && (
                <a href={helpLink} target="_blank" rel="noopener noreferrer" className="ml-1">
                    <HelpCircle className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                </a>
            )}
        </Label>
        <Input
            type="text"
            id={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    </div>
);

const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'BRL', name: 'Brazilian Real' },
];

const FreelanceEarningsCalculator: React.FC = () => {
    const [fields, setFields] = useState({
        totalEarnings: '750',
        serviceFeePercentage: '10',
        gstPercentage: '18',
        withholdingTaxPercentage: '1',
        withdrawalFee: '1',
        exchangeRate: '',
    });
    const [earningCurrency, setEarningCurrency] = useState('USD');
    const [depositCurrency, setDepositCurrency] = useState('INR');
    const [calculationResult, setCalculationResult] = useState<{
        netEarnings: number;
        serviceFee: number;
        gstOnServiceFee: number;
        withholdingTax: number;
        withdrawalFeeCharge: number;
        totalDeductions: number;
    } | null>(null);
    const [isResultExpanded, setIsResultExpanded] = useState(false);

    useEffect(() => {
        // Reset exchange rate when currencies change
        setFields(prev => ({ ...prev, exchangeRate: '' }));
    }, [earningCurrency, depositCurrency]);

    const handleInputChange = (field: keyof typeof fields, value: string) => {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setFields(prev => ({ ...prev, [field]: value }));
        }
    };

    const calculateEarnings = () => {
        const {
            totalEarnings,
            serviceFeePercentage,
            gstPercentage,
            withholdingTaxPercentage,
            withdrawalFee,
            exchangeRate,
        } = fields;

        if (exchangeRate === '') {
            alert('Please enter an exchange rate.');
            return;
        }

        const total = parseFloat(totalEarnings);
        const serviceFee = total * (parseFloat(serviceFeePercentage) / 100);
        const gstOnServiceFee = serviceFee * (parseFloat(gstPercentage) / 100);
        const withholdingTax = total * (parseFloat(withholdingTaxPercentage) / 100);
        const withdrawalFeeCharge = parseFloat(withdrawalFee);

        const totalDeductions = serviceFee + gstOnServiceFee + withholdingTax + withdrawalFeeCharge;
        const netEarningsBeforeExchange = total - totalDeductions;
        const netEarningsAfterExchange = netEarningsBeforeExchange * parseFloat(exchangeRate);

        setCalculationResult({
            netEarnings: netEarningsAfterExchange,
            serviceFee,
            gstOnServiceFee,
            withholdingTax,
            withdrawalFeeCharge,
            totalDeductions,
        });
    };

    const resetFields = () => {
        setFields({
            totalEarnings: '750',
            serviceFeePercentage: '10',
            gstPercentage: '18',
            withholdingTaxPercentage: '1',
            withdrawalFee: '1',
            exchangeRate: '',
        });
        setEarningCurrency('USD');
        setDepositCurrency('INR');
        setCalculationResult(null);
        setIsResultExpanded(false);
    };

    const exchangeRateHelpLink = `https://currencyapi.com/currency-conversion/${earningCurrency.toLowerCase()}-${depositCurrency.toLowerCase()}-1`;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4 flex flex-col min-h-screen">
            <div className="flex-grow space-y-4">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Freelance Earnings Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="earningCurrency">Earning Currency</Label>
                                <Select value={earningCurrency} onValueChange={setEarningCurrency}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem key={currency.code} value={currency.code}>
                                                {currency.name} ({currency.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="depositCurrency">Deposit Currency</Label>
                                <Select value={depositCurrency} onValueChange={setDepositCurrency}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem key={currency.code} value={currency.code}>
                                                {currency.name} ({currency.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label={`Total Earnings (${earningCurrency})`}
                                value={fields.totalEarnings}
                                onChange={(value) => handleInputChange('totalEarnings', value)}
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
                                label={`Withdrawal Fee (${earningCurrency})`}
                                value={fields.withdrawalFee}
                                onChange={(value) => handleInputChange('withdrawalFee', value)}
                                placeholder="e.g., 1"
                            />
                            <InputField
                                label={`Exchange Rate (1 ${earningCurrency} to ${depositCurrency})`}
                                value={fields.exchangeRate}
                                onChange={(value) => handleInputChange('exchangeRate', value)}
                                placeholder="Enter exchange rate"
                                helpLink={exchangeRateHelpLink}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                        <Button onClick={resetFields} variant="outline">
                            Reset
                        </Button>
                        <Button onClick={calculateEarnings}>
                            Calculate
                        </Button>
                    </CardFooter>
                </Card>

                {calculationResult && (
                    <Card className="w-full bg-primary text-primary-foreground">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center">
                                <Coins className="mr-2 h-6 w-6" />
                                Calculation Result
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">
                                {depositCurrency} {calculationResult.netEarnings.toFixed(2)}
                            </div>
                            <div className="text-xl mt-2">
                                Net amount deposited in your bank account
                            </div>
                            <Collapsible
                                open={isResultExpanded}
                                onOpenChange={setIsResultExpanded}
                                className="mt-4"
                            >
                                <CollapsibleTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        {isResultExpanded ? "Hide Details" : "Show Details"}
                                        {isResultExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2">
                                    <div className="space-y-2">
                                        <p>Service Fee: {earningCurrency} {calculationResult.serviceFee.toFixed(2)}</p>
                                        <p>GST on Service Fee: {earningCurrency} {calculationResult.gstOnServiceFee.toFixed(2)}</p>
                                        <p>Withholding Tax: {earningCurrency} {calculationResult.withholdingTax.toFixed(2)}</p>
                                        <p>Withdrawal Fee: {earningCurrency} {calculationResult.withdrawalFeeCharge.toFixed(2)}</p>
                                        <p className="font-semibold">Total Deductions: {earningCurrency} {calculationResult.totalDeductions.toFixed(2)}</p>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </CardContent>
                    </Card>
                )}
            </div>

            <footer className="text-center text-sm text-gray-500 mt-8">
                <p>Made with ❤️ in React + Vite</p>
                <p>©Harshvardhan Joshi - 2024</p>
            </footer>
        </div>
    );
};

export default FreelanceEarningsCalculator;
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}> = ({ label, value, onChange, placeholder }) => (
    <div className="grid w-full items-center gap-1.5">
        <Label htmlFor={label}>{label}</Label>
        <Input
            type="text"
            id={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
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

    const resetFields = () => {
        setFields({
            totalEarningsUSD: '750',
            serviceFeePercentage: '10',
            gstPercentage: '18',
            withholdingTaxPercentage: '1',
            withdrawalFeeUSD: '1',
            exchangeRateINR: '81',
        });
        setNetEarningsINR(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Freelance Earnings Calculator</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {netEarningsINR !== null && (
                <Card className="w-full bg-primary text-primary-foreground">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center">
                            <Coins className="mr-2 h-6 w-6" />
                            Calculation Result
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">
                            ₹{netEarningsINR.toFixed(2)}
                        </div>
                        <div className="text-xl mt-2">
                            Approx. Net amount deposited in your bank account
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default FreelanceEarningsCalculator;
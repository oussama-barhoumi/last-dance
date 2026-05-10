import { Apple, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const InvestmentItem = ({ icon: Icon, name, sector, value, returnValue, isNegative, color }) => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-50 hover:border-purple-100 transition-all group">
            <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{name}</h4>
                    <p className="text-xs text-gray-400 font-medium">{sector}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-16">
                <div className="text-right">
                    <p className="font-black text-gray-900">${value.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{t('dashboard.investment_value')}</p>
                </div>
                <div className="text-right min-w-[80px]">
                    <p className={`font-black ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
                        {isNegative ? '-' : '+'}{Math.abs(returnValue)}%
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{t('dashboard.return_value')}</p>
                </div>
            </div>
        </div>
    );
};

export default function InvestmentList() {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-black text-gray-900">{t('dashboard.my_investment')}</h3>
            </div>
            
            <div className="space-y-4">
                <InvestmentItem 
                    icon={Apple} 
                    name="Apple Store" 
                    sector="E-commerce, Marketplace" 
                    value={54000} 
                    returnValue={16} 
                    color="bg-black"
                />
                <InvestmentItem 
                    icon={Smartphone} 
                    name="Samsung Mobile" 
                    sector="E-commerce, Marketplace" 
                    value={25300} 
                    returnValue={4} 
                    isNegative 
                    color="bg-blue-600"
                />
            </div>
        </div>
    );
}

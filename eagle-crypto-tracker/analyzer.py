# 🦅 EAGLE CRYPTO TRACKER - Advanced Cryptocurrency Analysis System
# Automated price monitoring, alerts, portfolio tracking, and trading signals

import requests
import json
import os
from datetime import datetime, timedelta
from collections import defaultdict
import statistics

class AdvancedAnalyzer:
    """
    Advanced cryptocurrency analysis and profit calculation
    """
    
    def __init__(self):
        self.api_url = "https://api.coingecko.com/api/v3"
        self.analysis_history = defaultdict(list)
    
    def get_price_history(self, crypto_id: str, days: int = 30) -> list:
        """
        Get historical price data for technical analysis
        """
        try:
            response = requests.get(
                f"{self.api_url}/coins/{crypto_id}/market_chart",
                params={
                    'vs_currency': 'usd',
                    'days': days,
                    'interval': 'daily'
                }
            )
            response.raise_for_status()
            data = response.json()
            return data['prices']  # Returns [[timestamp, price], ...]
        except Exception as e:
            print(f"❌ Error fetching history: {e}")
            return []
    
    def calculate_moving_average(self, prices: list, period: int = 7) -> list:
        """
        Calculate Simple Moving Average (SMA)
        Used to identify trends
        """
        if len(prices) < period:
            return []
        
        moving_avgs = []
        for i in range(len(prices) - period + 1):
            avg = sum(prices[i:i+period]) / period
            moving_avgs.append(avg)
        
        return moving_avgs
    
    def calculate_rsi(self, prices: list, period: int = 14) -> float:
        """
        Calculate Relative Strength Index (RSI)
        RSI > 70: Overbought (SELL signal)
        RSI < 30: Oversold (BUY signal)
        """
        if len(prices) < period + 1:
            return None
        
        deltas = [prices[i] - prices[i-1] for i in range(1, len(prices))]
        seed = deltas[:period]
        
        up = sum([x for x in seed if x > 0]) / period
        down = -sum([x for x in seed if x < 0]) / period
        
        rs = up / down if down != 0 else 0
        rsi = 100 - (100 / (1 + rs))
        
        return round(rsi, 2)
    
    def identify_support_resistance(self, prices: list) -> dict:
        """
        Identify support (floor) and resistance (ceiling) levels
        """
        if not prices:
            return {}
        
        high = max(prices[-20:]) if len(prices) >= 20 else max(prices)
        low = min(prices[-20:]) if len(prices) >= 20 else min(prices)
        
        return {
            'support': round(low, 2),
            'resistance': round(high, 2),
            'range': round(high - low, 2)
        }
    
    def calculate_profit_targets(self, current_price: float, target_roi: float = 10) -> dict:
        """
        Calculate profit targets based on desired ROI
        """
        targets = {}
        for roi in [5, 10, 20, 50]:
            target_price = current_price * (1 + roi/100)
            targets[f'{roi}%_target'] = round(target_price, 2)
        
        return targets
    
    def generate_comprehensive_signal(self, crypto_id: str) -> dict:
        """
        Generate comprehensive trading signal using multiple indicators
        """
        try:
            # Get price history
            price_history = self.get_price_history(crypto_id, 30)
            if not price_history:
                return {}
            
            prices = [p[1] for p in price_history]
            current_price = prices[-1]
            
            # Calculate indicators
            rsi = self.calculate_rsi(prices)
            support_resist = self.identify_support_resistance(prices)
            profit_targets = self.calculate_profit_targets(current_price)
            
            # Determine signal
            if rsi and rsi < 30:
                signal = "STRONG BUY 🟢"
                strength = "VERY HIGH"
            elif rsi and rsi < 40:
                signal = "BUY 🟢"
                strength = "HIGH"
            elif rsi and rsi > 70:
                signal = "STRONG SELL 🔴"
                strength = "VERY HIGH"
            elif rsi and rsi > 60:
                signal = "SELL 🔴"
                strength = "HIGH"
            else:
                signal = "HOLD 🟡"
                strength = "MEDIUM"
            
            return {
                'crypto': crypto_id,
                'current_price': round(current_price, 2),
                'signal': signal,
                'signal_strength': strength,
                'rsi': rsi,
                'support_resistance': support_resist,
                'profit_targets': profit_targets,
                'price_high_30d': round(max(prices), 2),
                'price_low_30d': round(min(prices), 2),
                'price_change_30d': round(((prices[-1] - prices[0]) / prices[0] * 100), 2)
            }
        except Exception as e:
            print(f"❌ Error generating signal: {e}")
            return {}


class MoneyMaker:
    """
    Calculate money-making opportunities and arbitrage
    """
    
    def __init__(self):
        self.api_url = "https://api.coingecko.com/api/v3"
    
    def find_pump_dump_opportunities(self, cryptos: list) -> list:
        """
        Find cryptocurrencies with unusual price movements
        These could be trading opportunities
        """
        opportunities = []
        
        for crypto_id in cryptos:
            try:
                response = requests.get(
                    f"{self.api_url}/simple/price",
                    params={
                        'ids': crypto_id,
                        'vs_currencies': 'usd',
                        'include_24h_change': 'true',
                        'include_7d_change': 'true'
                    }
                )
                
                data = response.json()[crypto_id]
                change_24h = data.get('usd_24h_change', 0)
                change_7d = data.get('usd_7d_change', 0)
                
                # Look for unusual movements
                if abs(change_24h) > 5:  # Price moved >5% in 24h
                    opportunities.append({
                        'crypto': crypto_id,
                        'change_24h': change_24h,
                        'change_7d': change_7d,
                        'opportunity_type': 'BUY' if change_24h < 0 else 'SELL',
                        'strength': abs(change_24h)
                    })
            except:
                pass
        
        return sorted(opportunities, key=lambda x: x['strength'], reverse=True)
    
    def calculate_dollar_cost_averaging(self, initial_investment: float, months: int = 12) -> dict:
        """
        Calculate DCA (Dollar Cost Averaging) strategy results
        Invest fixed amount monthly to reduce risk
        """
        monthly_investment = initial_investment / months
        
        return {
            'total_investment': initial_investment,
            'monthly_investment': round(monthly_investment, 2),
            'duration_months': months,
            'strategy': 'DCA',
            'description': 'Invest same amount monthly to average out price fluctuations',
            'risk_level': 'LOW',
            'potential_return': 'MEDIUM to HIGH'
        }
    
    def calculate_risk_reward_ratio(self, entry_price: float, stop_loss: float, take_profit: float) -> dict:
        """
        Calculate Risk/Reward ratio for trading
        Good ratio is 1:2 or higher
        """
        risk = entry_price - stop_loss
        reward = take_profit - entry_price
        
        ratio = reward / risk if risk != 0 else 0
        
        return {
            'entry_price': entry_price,
            'stop_loss': stop_loss,
            'take_profit': take_profit,
            'risk_usd': round(risk, 2),
            'reward_usd': round(reward, 2),
            'risk_reward_ratio': round(ratio, 2),
            'is_good_trade': ratio >= 2.0
        }


if __name__ == "__main__":
    # Example usage
    analyzer = AdvancedAnalyzer()
    money_maker = MoneyMaker()
    
    print("🦅 EAGLE CRYPTO ANALYZER")
    print("\nGenerating comprehensive analysis...\n")
    
    # Analyze Bitcoin
    signal = analyzer.generate_comprehensive_signal('bitcoin')
    if signal:
        print(json.dumps(signal, indent=2))
    
    # Find opportunities
    cryptos_to_check = ['bitcoin', 'ethereum', 'cardano', 'ripple']
    opportunities = money_maker.find_pump_dump_opportunities(cryptos_to_check)
    
    print("\n🚀 TRADING OPPORTUNITIES:")
    for opp in opportunities[:5]:
        print(json.dumps(opp, indent=2))

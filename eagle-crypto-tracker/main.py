# 🦅 EAGLE CRYPTO TRACKER - Make Money with Cryptocurrency
# Monitor prices, get alerts, track portfolio, earn passive income

import os
import json
import time
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import statistics

# Create data directory if it doesn't exist
if not os.path.exists('eagle_data'):
    os.makedirs('eagle_data')

class EagleCryptoTracker:
    """
    🦅 EAGLE CRYPTO TRACKER - Professional Cryptocurrency Monitoring System
    Make passive income by tracking crypto prices and making smart decisions
    """
    
    def __init__(self):
        self.api_url = "https://api.coingecko.com/api/v3"
        self.portfolio_file = 'eagle_data/portfolio.json'
        self.alerts_file = 'eagle_data/alerts.json'
        self.prices_history_file = 'eagle_data/price_history.json'
        self.settings_file = 'eagle_data/settings.json'
        
        self.portfolio = self.load_json(self.portfolio_file, {})
        self.alerts = self.load_json(self.alerts_file, [])
        self.price_history = self.load_json(self.prices_history_file, {})
        self.settings = self.load_json(self.settings_file, {
            'notification_email': 'your@email.com',
            'check_interval': 300,  # 5 minutes
            'target_profit_percentage': 10
        })
    
    @staticmethod
    def load_json(filename: str, default=None):
        """Load JSON data from file"""
        try:
            if os.path.exists(filename):
                with open(filename, 'r') as f:
                    return json.load(f)
        except Exception as e:
            print(f"⚠️  Error loading {filename}: {e}")
        return default if default is not None else {}
    
    def save_json(self, filename: str, data):
        """Save JSON data to file"""
        try:
            with open(filename, 'w') as f:
                json.dump(data, f, indent=2)
            return True
        except Exception as e:
            print(f"❌ Error saving {filename}: {e}")
            return False
    
    def get_crypto_price(self, crypto_id: str) -> Optional[Dict]:
        """
        Get current crypto price from CoinGecko API (FREE - No API key needed!)
        """
        try:
            response = requests.get(
                f"{self.api_url}/simple/price",
                params={
                    'ids': crypto_id,
                    'vs_currencies': 'usd',
                    'include_market_cap': 'true',
                    'include_24h_change': 'true'
                }
            )
            response.raise_for_status()
            data = response.json()
            
            if crypto_id in data:
                return {
                    'id': crypto_id,
                    'price': data[crypto_id]['usd'],
                    'market_cap': data[crypto_id].get('usd_market_cap', 0),
                    'change_24h': data[crypto_id].get('usd_24h_change', 0),
                    'timestamp': datetime.now().isoformat()
                }
        except Exception as e:
            print(f"❌ Error fetching price for {crypto_id}: {e}")
        return None
    
    def add_portfolio_item(self, crypto_id: str, amount: float, purchase_price: float):
        """
        Add cryptocurrency to your portfolio
        """
        if crypto_id not in self.portfolio:
            self.portfolio[crypto_id] = []
        
        self.portfolio[crypto_id].append({
            'amount': amount,
            'purchase_price': purchase_price,
            'purchase_date': datetime.now().isoformat(),
            'purchase_cost': amount * purchase_price
        })
        
        self.save_json(self.portfolio_file, self.portfolio)
        print(f"✅ Added {amount} {crypto_id.upper()} at ${purchase_price}")
    
    def get_portfolio_value(self) -> Dict:
        """
        Calculate current portfolio value and profit
        """
        total_invested = 0
        total_current_value = 0
        portfolio_summary = {}
        
        for crypto_id, holdings in self.portfolio.items():
            price_data = self.get_crypto_price(crypto_id)
            if not price_data:
                continue
            
            current_price = price_data['price']
            total_amount = sum(h['amount'] for h in holdings)
            invested = sum(h['purchase_cost'] for h in holdings)
            current_value = total_amount * current_price
            profit = current_value - invested
            profit_percentage = (profit / invested * 100) if invested > 0 else 0
            
            total_invested += invested
            total_current_value += current_value
            
            portfolio_summary[crypto_id] = {
                'amount': total_amount,
                'current_price': current_price,
                'current_value': round(current_value, 2),
                'invested': round(invested, 2),
                'profit': round(profit, 2),
                'profit_percentage': round(profit_percentage, 2),
                'change_24h': price_data['change_24h']
            }
        
        total_profit = total_current_value - total_invested
        total_profit_percentage = (total_profit / total_invested * 100) if total_invested > 0 else 0
        
        return {
            'portfolio': portfolio_summary,
            'total_invested': round(total_invested, 2),
            'total_current_value': round(total_current_value, 2),
            'total_profit': round(total_profit, 2),
            'total_profit_percentage': round(total_profit_percentage, 2),
            'timestamp': datetime.now().isoformat()
        }
    
    def set_price_alert(self, crypto_id: str, target_price: float, alert_type: str = 'above'):
        """
        Set up price alerts to notify you when price hits target
        alert_type: 'above' or 'below'
        """
        alert = {
            'id': int(time.time()),
            'crypto_id': crypto_id,
            'target_price': target_price,
            'alert_type': alert_type,
            'created_at': datetime.now().isoformat(),
            'triggered': False
        }
        
        self.alerts.append(alert)
        self.save_json(self.alerts_file, self.alerts)
        print(f"✅ Alert set: {crypto_id.upper()} {alert_type} ${target_price}")
        return alert['id']
    
    def check_alerts(self) -> List[Dict]:
        """
        Check all alerts and return triggered ones
        """
        triggered_alerts = []
        
        for alert in self.alerts:
            if alert['triggered']:
                continue
            
            price_data = self.get_crypto_price(alert['crypto_id'])
            if not price_data:
                continue
            
            current_price = price_data['price']
            target = alert['target_price']
            
            # Check if alert condition is met
            if (alert['alert_type'] == 'above' and current_price >= target) or \
               (alert['alert_type'] == 'below' and current_price <= target):
                
                alert['triggered'] = True
                alert['triggered_at'] = datetime.now().isoformat()
                alert['trigger_price'] = current_price
                triggered_alerts.append(alert)
        
        if triggered_alerts:
            self.save_json(self.alerts_file, self.alerts)
        
        return triggered_alerts
    
    def get_trading_signals(self) -> Dict:
        """
        Generate AI trading signals based on price trends
        BUY: Price is down, good opportunity
        SELL: Price is up significantly, take profit
        HOLD: Price is stable
        """
        signals = {}
        
        for crypto_id in self.portfolio.keys():
            price_data = self.get_crypto_price(crypto_id)
            if not price_data:
                continue
            
            change_24h = price_data['change_24h']
            
            if change_24h < -5:
                signal = 'BUY 🟢'  # Price dropped, buying opportunity
                confidence = 'HIGH' if change_24h < -10 else 'MEDIUM'
            elif change_24h > 10:
                signal = 'SELL 🔴'  # Price surged, take profits
                confidence = 'HIGH' if change_24h > 20 else 'MEDIUM'
            else:
                signal = 'HOLD 🟡'  # Price stable
                confidence = 'MEDIUM'
            
            signals[crypto_id] = {
                'signal': signal,
                'confidence': confidence,
                'change_24h': change_24h,
                'current_price': price_data['price']
            }
        
        return signals
    
    def calculate_roi(self, crypto_id: str = None) -> Dict:
        """
        Calculate Return On Investment (ROI)
        """
        portfolio_value = self.get_portfolio_value()
        
        if crypto_id:
            if crypto_id in portfolio_value['portfolio']:
                item = portfolio_value['portfolio'][crypto_id]
                return {
                    'crypto': crypto_id,
                    'roi_percentage': item['profit_percentage'],
                    'profit_usd': item['profit'],
                    'invested': item['invested'],
                    'current_value': item['current_value']
                }
        
        return {
            'total_roi_percentage': portfolio_value['total_profit_percentage'],
            'total_profit_usd': portfolio_value['total_profit'],
            'total_invested': portfolio_value['total_invested'],
            'total_current_value': portfolio_value['total_current_value']
        }
    
    def get_market_overview(self, top_n: int = 5) -> List[Dict]:
        """
        Get top cryptocurrencies by market cap
        """
        try:
            response = requests.get(
                f"{self.api_url}/markets",
                params={
                    'vs_currency': 'usd',
                    'order': 'market_cap_desc',
                    'per_page': top_n,
                    'sparkline': False
                }
            )
            response.raise_for_status()
            
            markets = response.json()
            overview = []
            
            for market in markets:
                overview.append({
                    'rank': market['market_cap_rank'],
                    'name': market['name'],
                    'symbol': market['symbol'].upper(),
                    'price': market['current_price'],
                    'market_cap': market['market_cap'],
                    'change_24h': market['price_change_percentage_24h']
                })
            
            return overview
        except Exception as e:
            print(f"❌ Error fetching market overview: {e}")
            return []
    
    def export_report(self, filename: str = None) -> str:
        """
        Export comprehensive portfolio report
        """
        if not filename:
            filename = f"eagle_data/report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        portfolio_value = self.get_portfolio_value()
        signals = self.get_trading_signals()
        market = self.get_market_overview()
        
        report = {
            'generated_at': datetime.now().isoformat(),
            'portfolio_summary': portfolio_value,
            'trading_signals': signals,
            'market_overview': market,
            'alerts': self.alerts
        }
        
        self.save_json(filename, report)
        print(f"✅ Report exported to {filename}")
        return filename
    
    def display_dashboard(self):
        """
        Display beautiful dashboard with all information
        """
        print("\n" + "="*60)
        print("🦅 EAGLE CRYPTO TRACKER - DASHBOARD")
        print("="*60)
        
        portfolio_value = self.get_portfolio_value()
        
        print(f"\n💰 PORTFOLIO SUMMARY")
        print(f"Total Invested:     ${portfolio_value['total_invested']:,.2f}")
        print(f"Current Value:      ${portfolio_value['total_current_value']:,.2f}")
        print(f"Total Profit:       ${portfolio_value['total_profit']:,.2f}")
        print(f"ROI:                {portfolio_value['total_profit_percentage']:.2f}%")
        
        if portfolio_value['portfolio']:
            print(f"\n📊 HOLDINGS")
            for crypto_id, data in portfolio_value['portfolio'].items():
                print(f"\n{crypto_id.upper()}:")
                print(f"  Amount:         {data['amount']} coins")
                print(f"  Current Price:  ${data['current_price']:,.2f}")
                print(f"  Holding Value:  ${data['current_value']:,.2f}")
                print(f"  Profit/Loss:    ${data['profit']:,.2f} ({data['profit_percentage']:.2f}%)")
                print(f"  24h Change:     {data['change_24h']:.2f}%")
        
        signals = self.get_trading_signals()
        if signals:
            print(f"\n🎯 TRADING SIGNALS")
            for crypto_id, signal in signals.items():
                print(f"{crypto_id.upper()}: {signal['signal']} (Confidence: {signal['confidence']})")
        
        # Check for triggered alerts
        triggered = self.check_alerts()
        if triggered:
            print(f"\n🚨 TRIGGERED ALERTS ({len(triggered)})")
            for alert in triggered:
                print(f"{alert['crypto_id'].upper()}: Hit ${alert['trigger_price']:.2f}")
        
        market = self.get_market_overview(3)
        if market:
            print(f"\n📈 TOP CRYPTOCURRENCIES")
            for m in market:
                print(f"#{m['rank']} {m['name']} ({m['symbol']}): ${m['price']:,.2f}")
        
        print("\n" + "="*60 + "\n")


def main():
    """
    Main program - Interactive menu
    """
    tracker = EagleCryptoTracker()
    
    print("\n" + "="*60)
    print("🦅 WELCOME TO EAGLE CRYPTO TRACKER")
    print("Make Money with Cryptocurrency Monitoring")
    print("="*60)
    
    while True:
        print("\n📋 MAIN MENU:")
        print("1. View Dashboard")
        print("2. Add Cryptocurrency to Portfolio")
        print("3. Check Current Prices")
        print("4. Set Price Alert")
        print("5. View Trading Signals")
        print("6. View Portfolio ROI")
        print("7. View Market Overview")
        print("8. Export Report")
        print("9. Exit")
        
        choice = input("\nEnter your choice (1-9): ").strip()
        
        if choice == '1':
            tracker.display_dashboard()
        
        elif choice == '2':
            crypto = input("Enter cryptocurrency ID (e.g., bitcoin): ").strip().lower()
            amount = float(input(f"How many {crypto} do you own? "))
            price = float(input(f"What price did you buy at? $"))
            tracker.add_portfolio_item(crypto, amount, price)
        
        elif choice == '3':
            crypto = input("Enter cryptocurrency ID (e.g., bitcoin): ").strip().lower()
            price_data = tracker.get_crypto_price(crypto)
            if price_data:
                print(f"\n💵 {crypto.upper()}")
                print(f"Current Price:  ${price_data['price']:,.2f}")
                print(f"Market Cap:     ${price_data['market_cap']:,.0f}")
                print(f"24h Change:     {price_data['change_24h']:.2f}%")
        
        elif choice == '4':
            crypto = input("Enter cryptocurrency ID (e.g., bitcoin): ").strip().lower()
            target = float(input(f"Target price for {crypto}: $"))
            alert_type = input("Alert when price goes (above/below)? ").strip().lower()
            if alert_type in ['above', 'below']:
                tracker.set_price_alert(crypto, target, alert_type)
        
        elif choice == '5':
            signals = tracker.get_trading_signals()
            if signals:
                print("\n🎯 TRADING SIGNALS:")
                for crypto, signal in signals.items():
                    print(f"\n{crypto.upper()}:")
                    print(f"  Signal:      {signal['signal']}")
                    print(f"  Confidence:  {signal['confidence']}")
                    print(f"  24h Change:  {signal['change_24h']:.2f}%")
                    print(f"  Price:       ${signal['current_price']:,.2f}")
            else:
                print("❌ No cryptos in portfolio")
        
        elif choice == '6':
            roi = tracker.calculate_roi()
            print(f"\n📈 RETURN ON INVESTMENT:")
            for key, value in roi.items():
                print(f"{key}: {value}")
        
        elif choice == '7':
            market = tracker.get_market_overview(10)
            print("\n📊 TOP 10 CRYPTOCURRENCIES:")
            for m in market:
                print(f"#{m['rank']} {m['name']} ({m['symbol']}): ${m['price']:,.2f} ({m['change_24h']:.2f}%)")
        
        elif choice == '8':
            filename = tracker.export_report()
            print(f"✅ Report saved to {filename}")
        
        elif choice == '9':
            print("\n👋 Thank you for using Eagle Crypto Tracker!")
            print("🦅 Remember: Invest wisely, manage risks, and HODL! 💰\n")
            break
        
        else:
            print("❌ Invalid choice. Please try again.")


if __name__ == "__main__":
    main()

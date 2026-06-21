# 🦅 EAGLE CRYPTO TRACKER - Automated Monitoring System
# Run this script to monitor prices 24/7 and get alerts

import time
import json
import os
from datetime import datetime
from main import EagleCryptoTracker

class AutoMonitor:
    """
    Automated cryptocurrency monitoring system
    Runs continuously and checks for alerts
    """
    
    def __init__(self):
        self.tracker = EagleCryptoTracker()
        self.check_count = 0
    
    def start_monitoring(self, interval_seconds: int = 300):
        """
        Start continuous monitoring
        interval_seconds: How often to check prices (default: 5 minutes)
        """
        print("\n" + "="*60)
        print("🦅 EAGLE CRYPTO TRACKER - AUTOMATED MONITORING")
        print("="*60)
        print(f"Starting automated monitoring (check every {interval_seconds} seconds)")
        print("Press Ctrl+C to stop\n")
        
        try:
            while True:
                self.check_count += 1
                current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                
                print(f"\n[Check #{self.check_count}] {current_time}")
                print("-" * 60)
                
                # Check all alerts
                triggered = self.tracker.check_alerts()
                
                if triggered:
                    print(f"\n🚨 ALERT! {len(triggered)} price alert(s) triggered:")
                    for alert in triggered:
                        print(f"  • {alert['crypto_id'].upper()}: Hit ${alert['trigger_price']:.2f}")
                        print(f"    Target was: ${alert['target_price']:.2f}")
                        self.send_notification(alert)
                else:
                    print("✅ All alerts quiet. Monitoring...")
                
                # Display portfolio status
                portfolio = self.tracker.get_portfolio_value()
                if portfolio['portfolio']:
                    print(f"\nPortfolio Status:")
                    print(f"  Value: ${portfolio['total_current_value']:,.2f}")
                    print(f"  Profit: ${portfolio['total_profit']:,.2f} ({portfolio['total_profit_percentage']:.2f}%)")
                
                # Wait for next check
                print(f"\nNext check in {interval_seconds} seconds...")
                time.sleep(interval_seconds)
        
        except KeyboardInterrupt:
            print("\n\n" + "="*60)
            print("🦅 Monitoring stopped")
            print(f"Total checks performed: {self.check_count}")
            print("="*60 + "\n")
    
    def send_notification(self, alert: dict):
        """
        Send notification (could be email, SMS, etc.)
        For now, just save to file
        """
        notification = {
            'timestamp': datetime.now().isoformat(),
            'type': 'PRICE_ALERT',
            'crypto': alert['crypto_id'],
            'message': f"{alert['crypto_id'].upper()} hit ${alert['trigger_price']:.2f}!"
        }
        
        # Save notification
        notifications_file = 'eagle_data/notifications.json'
        notifications = []
        
        if os.path.exists(notifications_file):
            with open(notifications_file, 'r') as f:
                notifications = json.load(f)
        
        notifications.append(notification)
        
        with open(notifications_file, 'w') as f:
            json.dump(notifications, f, indent=2)
        
        print(f"  📩 Notification saved to {notifications_file}")


if __name__ == "__main__":
    monitor = AutoMonitor()
    
    # Start monitoring with 5-minute intervals
    monitor.start_monitoring(interval_seconds=300)

#!/usr/bin/env python3
import time
from zapv2 import ZAPv2

# Configuration
target = 'http://localhost:3000'
apikey = 'change-me-to-your-api-key'  # Change this to your ZAP API key

# Initialize ZAP
zap = ZAPv2(apikey=apikey, proxies={'http': 'http://127.0.0.1:8080', 'https': 'http://127.0.0.1:8080'})

print(f'Accessing target {target}')
zap.urlopen(target)
time.sleep(2)

print('Spidering target {}'.format(target))
scanid = zap.spider.scan(target)
while int(zap.spider.status(scanid)) < 100:
    print('Spider progress %: {}'.format(zap.spider.status(scanid)))
    time.sleep(2)

print('Spider completed')

print('Scanning target {}'.format(target))
scanid = zap.ascan.scan(target)
while int(zap.ascan.status(scanid)) < 100:
    print('Scan progress %: {}'.format(zap.ascan.status(scanid)))
    time.sleep(5)

print('Scan completed')

# Report the results
print('Hosts: {}'.format(', '.join(zap.core.hosts)))
print('Alerts: ')
for alert in zap.core.alerts():
    print(f"- {alert['alert']} (Risk: {alert['risk']})")

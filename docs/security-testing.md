# Security Testing Guide

## OWASP ZAP Integration

We have provided a basic script to integrate with OWASP ZAP (Zed Attack Proxy) for automated security scanning.

### Prerequisites
1.  **OWASP ZAP**: Installed and running (default port 8080).
2.  **Python 3**: Installed.
3.  **python-owasp-zap-v2.4**: Install via pip: `pip install python-owasp-zap-v2.4`

### Running the Scan
1.  Start OWASP ZAP.
2.  Get your API Key from ZAP Options -> API.
3.  Edit `scripts/zap-scan.py` and update the `apikey` variable.
4.  Run the script:
    ```bash
    python scripts/zap-scan.py
    ```

### What it does
1.  **Spider**: Crawls the application to find all accessible URLs.
2.  **Active Scan**: Performs an active attack simulation to find vulnerabilities.
3.  **Report**: Prints a list of found alerts and their risk levels.

## Built-in Security Checker
The Tool Hub also includes a built-in Security Checker tool (`/dashboard/tools/url-tester`) that performs basic checks:
- HTTPS validity
- Security Headers (HSTS, CSP, X-Frame-Options, etc.)
- Server information disclosure

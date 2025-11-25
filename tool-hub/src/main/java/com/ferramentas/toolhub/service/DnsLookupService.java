package com.ferramentas.toolhub.service;

import org.springframework.stereotype.Service;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.naming.directory.Attributes;
import javax.naming.directory.InitialDirContext;
import javax.naming.NamingEnumeration;
import javax.naming.directory.Attribute;

@Service
public class DnsLookupService {

    public Map<String, Object> lookup(String domain) {
        Map<String, Object> results = new HashMap<>();
        results.put("domain", domain);

        try {
            // A Records (IP Addresses)
            InetAddress[] addresses = InetAddress.getAllByName(domain);
            List<String> aRecords = new ArrayList<>();
            for (InetAddress addr : addresses) {
                aRecords.add(addr.getHostAddress());
            }
            results.put("A", aRecords);

            // MX Records
            results.put("MX", getMxRecords(domain));

            // CNAME Records (Basic check, might not always work depending on DNS config)
            // Java's InetAddress doesn't directly expose CNAME easily without external libs
            // or JNDI
            // We can try to use JNDI for more detailed records

        } catch (UnknownHostException e) {
            results.put("error", "Domain not found: " + e.getMessage());
        } catch (Exception e) {
            results.put("error", "Lookup failed: " + e.getMessage());
        }

        return results;
    }

    private List<String> getMxRecords(String domain) {
        List<String> mxRecords = new ArrayList<>();
        try {
            InitialDirContext iDirC = new InitialDirContext();
            Attributes attributes = iDirC.getAttributes("dns:/" + domain, new String[] { "MX" });
            Attribute attribute = attributes.get("MX");
            if (attribute != null) {
                NamingEnumeration<?> attributeValues = attribute.getAll();
                while (attributeValues.hasMore()) {
                    mxRecords.add(attributeValues.next().toString());
                }
            }
        } catch (Exception e) {
            // Log or ignore if no MX records found
        }
        return mxRecords;
    }
}

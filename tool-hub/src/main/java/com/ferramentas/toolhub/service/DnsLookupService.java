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

            // Other Records using JNDI
            results.put("MX", getRecords(domain, "MX"));
            results.put("TXT", getRecords(domain, "TXT"));
            results.put("NS", getRecords(domain, "NS"));
            results.put("CNAME", getRecords(domain, "CNAME"));

        } catch (UnknownHostException e) {
            results.put("error", "Domain not found: " + e.getMessage());
        } catch (Exception e) {
            results.put("error", "Lookup failed: " + e.getMessage());
        }

        return results;
    }

    private List<String> getRecords(String domain, String type) {
        List<String> records = new ArrayList<>();
        try {
            InitialDirContext iDirC = new InitialDirContext();
            Attributes attributes = iDirC.getAttributes("dns:/" + domain, new String[] { type });
            Attribute attribute = attributes.get(type);
            if (attribute != null) {
                NamingEnumeration<?> attributeValues = attribute.getAll();
                while (attributeValues.hasMore()) {
                    records.add(attributeValues.next().toString());
                }
            }
        } catch (Exception e) {
            // Log or ignore if no records found
        }
        return records;
    }
}

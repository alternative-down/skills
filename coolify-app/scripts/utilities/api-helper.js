#!/usr/bin/env node

/**
 * Centralized API helper for Coolify requests
 * Handles token and URL from environment variables
 */

const https = require('https');

function getApiConfig() {
  const token = process.env.COOLIFY_API_TOKEN;
  const baseUrl = process.env.COOLIFY_BASE_URL;

  if (!token) {
    throw new Error('COOLIFY_API_TOKEN environment variable not set');
  }

  if (!baseUrl) {
    throw new Error('COOLIFY_BASE_URL environment variable not set');
  }

  const url = new URL(baseUrl);

  return {
    token,
    hostname: url.hostname,
    port: url.port || 443,
    protocol: url.protocol
  };
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    try {
      const config = getApiConfig();

      const options = {
        hostname: config.hostname,
        port: config.port,
        path: `/api/v1${path}`,
        method,
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      });

      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { makeRequest, getApiConfig };

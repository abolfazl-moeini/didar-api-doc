<?php
declare(strict_types=1);

namespace Didar\Sdk;

use RuntimeException;

/**
 * Modern PHP Client for Didar CRM (دیدار)
 * Works standalone via cURL or seamlessly inside WordPress plugins.
 */
class DidarClient
{
    private string $apiKey;
    private string $baseUrl;

    public function __construct(string $apiKey, string $baseUrl = 'https://app.didar.me')
    {
        $this->apiKey = $apiKey;
        $this->baseUrl = rtrim($baseUrl, '/');
    }

    /**
     * Sends an HTTP request to Didar CRM.
     *
     * @param string $path
     * @param string $method
     * @param array<string, mixed> $body
     * @param array<string, string> $query
     * @return mixed
     * @throws RuntimeException
     */
    public function request(string $path, string $method = 'POST', array $body = [], array $query = []): mixed
    {
        $query['apikey'] = $this->apiKey;
        $queryString = http_build_query($query);
        $url = $this->baseUrl . '/api/' . ltrim($path, '/') . '?' . $queryString;

        // If running inside WordPress, use wp_remote_post
        if (function_exists('wp_remote_post')) {
            $args = [
                'method'    => $method,
                'headers'   => ['Content-Type' => 'application/json', 'Accept' => 'application/json'],
                'sslverify' => false,
                'timeout'   => 30,
            ];
            if ($method !== 'GET' && !empty($body)) {
                $args['body'] = json_encode($body, JSON_UNESCAPED_UNICODE);
            }
            $response = wp_remote_request($url, $args);
            if (is_wp_error($response)) {
                throw new RuntimeException($response->get_error_message());
            }
            $raw = wp_remote_retrieve_body($response);
        } else {
            // Standalone cURL
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Accept: application/json'
            ]);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            if ($method !== 'GET' && !empty($body)) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_UNICODE));
            }
            $raw = curl_exec($ch);
            $err = curl_error($ch);
            curl_close($ch);
            if ($err) {
                throw new RuntimeException("cURL Error: " . $err);
            }
        }

        $decoded = json_decode((string)$raw, true);
        if (!is_array($decoded)) {
            throw new RuntimeException("Invalid JSON response from Didar: " . substr((string)$raw, 0, 150));
        }

        if (!empty($decoded['Error'])) {
            throw new RuntimeException("Didar API Error: " . $decoded['Error']);
        }

        return $decoded['Response'] ?? $decoded;
    }

    // --- Contacts ---
    public function saveContact(array $contact, array $segmentIds = []): mixed
    {
        return $this->request('contact/save', 'POST', [
            'Contact' => $contact,
            'SegmentIds' => $segmentIds,
        ]);
    }

    public function getContactByPhone(string $phone): array
    {
        return (array)$this->request('contact/getbyphonenumber', 'POST', [
            'MobilePhone' => $phone,
        ]);
    }

    // --- Deals ---
    public function getPipelines(int $type = 0): array
    {
        return (array)$this->request("pipeline/list/{$type}", 'POST', []);
    }

    public function saveDeal(array $deal, array $dealItems = []): mixed
    {
        return $this->request('deal/save_v2', 'POST', [
            'Deal' => $deal,
            'DealItems' => $dealItems,
        ]);
    }

    // --- Products ---
    public function getProductsByCodes(array $codes): array
    {
        return (array)$this->request('product/getproductbycodes', 'POST', [
            'Code' => $codes,
        ]);
    }

    // --- CallerID VoIP Popup ---
    public function popupCallerId(string $number, string $internalNumber): mixed
    {
        return $this->request('calllog/insert', 'GET', [], [
            'number' => $number,
            'internalnumber' => $internalNumber,
        ]);
    }
}

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Account Statement</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            text-transform: uppercase;
            font-size: 24px;
        }
        .info-section {
            margin-bottom: 30px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 5px 0;
        }
        .transactions-table {
            width: 100%;
            border-collapse: collapse;
        }
        .transactions-table th {
            background-color: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            padding: 10px;
            text-align: left;
            text-transform: uppercase;
            font-size: 10px;
        }
        .transactions-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        .amount-credit {
            color: #10b981;
            font-weight: bold;
        }
        .amount-debit {
            color: #ef4444;
            font-weight: bold;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10px;
            color: #999;
        }
        .status-badge {
            font-size: 9px;
            text-transform: uppercase;
            padding: 2px 5px;
            border-radius: 3px;
            background: #eee;
        }
    </style>
</head>
<body>
    <div className="header">
        <h1>Account Statement</h1>
        <p>{{ $startDate }} - {{ $endDate }}</p>
    </div>

    <div className="info-section">
        <table className="info-table">
            <tr>
                <td><strong>Account Holder:</strong> {{ $user->name }}</td>
                <td><strong>Generated Date:</strong> {{ $generatedDate }}</td>
            </tr>
            <tr>
                <td><strong>Email:</strong> {{ $user->email }}</td>
                <td><strong>Total Transactions:</strong> {{ $transactions->count() }}</td>
            </tr>
        </table>
    </div>

    <table className="transactions-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Description</th>
                <th>Type</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $tx)
                <tr>
                    <td>{{ $tx->transaction_date->format('Y-m-d') }}</td>
                    <td>{{ $tx->transaction_id }}</td>
                    <td>{{ $tx->description }}</td>
                    <td>{{ ucfirst($tx->type) }}</td>
                    <td>{{ str_replace('_', ' ', ucfirst($tx->payment_method)) }}</td>
                    <td className="{{ in_array($tx->type, ['credit', 'receive']) ? 'amount-credit' : 'amount-debit' }}">
                        {{ in_array($tx->type, ['credit', 'receive']) ? '+' : '-' }}${{ number_format($tx->amount, 2) }}
                    </td>
                    <td><span className="status-badge">{{ $tx->status }}</span></td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div className="footer">
        <p>This statement was generated automatically by HarborBank Financial Systems.</p>
    </div>
</body>
</html>

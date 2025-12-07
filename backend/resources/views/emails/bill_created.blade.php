<!DOCTYPE html>
<html>
<head>
    <title>New Bill Created</title>
</head>
<body>
    <h1>New Bill Created</h1>
    <p>Dear Tenant,</p>
    <p>A new bill of ${{ $bill->amount }} has been created for your flat.</p>
    <p>Due Date: {{ $bill->due_date }}</p>
    <p>Please pay comfortably.</p>
</body>
</html>

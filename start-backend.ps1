$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
$env:PATH = "E:\BusyBrains Assignment\apache-maven-3.9.14\bin;$env:JAVA_HOME\bin;$env:PATH"
Set-Location "E:\BusyBrains Assignment\backend"

$process = Start-Process -FilePath "mvn.cmd" -ArgumentList "spring-boot:run" -NoNewWindow -PassThru -RedirectStandardOutput "E:\BusyBrains Assignment\backend.log" -RedirectStandardError "E:\BusyBrains Assignment\backend-error.log"

Write-Host "Backend starting... PID: $($process.Id)"
Write-Host "Check http://localhost:8080 after 10-15 seconds"
Write-Host "Logs: E:\BusyBrains Assignment\backend.log"

Start-Sleep -Seconds 15

if ($process.HasExited) {
    Write-Host "Process exited with code: $($process.ExitCode)"
} else {
    Write-Host "Backend is running!"
    Write-Host "Test: curl http://localhost:8080/api/products"
}

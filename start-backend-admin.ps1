$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
$env:PATH = "E:\BusyBrains Assignment\apache-maven-3.9.14\bin;$env:JAVA_HOME\bin;$env:PATH"
Set-Location "E:\BusyBrains Assignment\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd E:\BusyBrains Assignment\backend; mvn spring-boot:run" -Verb RunAs
Write-Host "Backend starting in new window..."
Write-Host "Wait 15-20 seconds then test: curl http://localhost:8080/api/products"

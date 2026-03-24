$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
$env:PATH = "E:\BusyBrains Assignment\apache-maven-3.9.14\bin;$env:JAVA_HOME\bin;$env:PATH"
Set-Location "E:\BusyBrains Assignment\backend"
& mvn spring-boot:run

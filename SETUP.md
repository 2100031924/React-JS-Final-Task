# Build Script for ProductHub

This script will help you set up Java 17 and Maven to run the application.

## Option 1: Manual Download

### Java 17
1. Download JDK 17 from: https://adoptium.net/temurin/releases/?version=17
2. Install it
3. Set JAVA_HOME to the installation path (e.g., `C:\Program Files\Eclipse Adoptium\jdk-17.0.13.12-hotspot`)
4. Add `%JAVA_HOME%\bin` to your PATH

### Maven 3.9.14
1. Download: https://downloads.apache.org/maven/maven-3/3.9.14/binaries/apache-maven-3.9.14-bin.zip
2. Extract to `C:\maven`
3. Add `C:\maven\apache-maven-3.9.14\bin` to your PATH

## Option 2: Using Winget (if available)
```powershell
winget install EclipseAdoptium.Temurin.17.JDK
winget install Apache.Maven
```

## Option 3: Using Chocolatey
```powershell
choco install openjdk17 -y
choco install maven -y
```

## After Installation

### Verify Installation
Open a new terminal and run:
```powershell
java -version
mvn -version
```

### Run Backend
```powershell
cd backend
mvn spring-boot:run
```

### Run Frontend (in another terminal)
```powershell
cd frontend
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **H2 Console**: http://localhost:8080/h2-console

### Test Credentials
- **Admin**: username: `admin`, password: `admin123` (can add/edit/delete products)
- **User**: username: `user`, password: `user123` (view only)

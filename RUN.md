# ProductHub - Running the Application

## Step 1: Start the Backend

Open a **new** PowerShell window as Administrator and run:

```powershell
cd E:\BusyBrains Assignment\backend
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
$env:PATH = "E:\BusyBrains Assignment\apache-maven-3.9.14\bin;$env:JAVA_HOME\bin;$env:PATH"
mvn spring-boot:run
```

Wait about 15-20 seconds until you see "Started ProductHubApplication"

## Step 2: Start the Frontend

Open a **new** command prompt and run:

```powershell
cd E:\BusyBrains Assignment\frontend
npm run dev
```

## Step 3: Access the Application

Open your browser and go to: **http://localhost:5173**

## Login Credentials

- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `user`, password: `user123`

## Troubleshooting

If you get "Network Error":
1. Make sure backend is running (check PowerShell window for backend)
2. Try: `curl http://localhost:8080/api/products` in a new command prompt
3. If curl fails, the backend is not running properly

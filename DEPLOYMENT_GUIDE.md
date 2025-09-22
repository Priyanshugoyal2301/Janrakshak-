# JalRakshak xView2 Flood Damage Detection - Deployment Guide

## 🚀 Complete Deployment Guide

This guide will help you deploy the xView2 flood damage detection system to Google Cloud Run and integrate it with your JalRakshak Firebase app.

## 📋 Prerequisites

- Google Cloud Platform account with billing enabled
- Firebase project with Firestore and Storage enabled
- Docker installed locally
- Google Cloud SDK (gcloud) installed
- Node.js 18+ installed

## 🔧 Step 1: Deploy xView2 Model to Cloud Run

### 1.1 Set up Google Cloud Project

```bash
# Set your project ID
export PROJECT_ID="your-jalrakshak-project"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 1.2 Build and Deploy Docker Image

```bash
# Navigate to xView2 model directory
cd xview2-model

# Build and push image
gcloud builds submit --tag gcr.io/$PROJECT_ID/xview2-damage-detection

# Deploy to Cloud Run
gcloud run deploy xview2-damage-detection \
  --image gcr.io/$PROJECT_ID/xview2-damage-detection \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --min-instances 0 \
  --timeout 300
```

### 1.3 Get Service URL

```bash
# Get the service URL
gcloud run services describe xview2-damage-detection --region=asia-south1 --format="value(status.url)"
```

**Save this URL** - you'll need it for Firebase configuration.

## 🔥 Step 2: Deploy Firebase Cloud Functions

### 2.1 Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 2.2 Initialize Firebase Functions

```bash
# In your project root
firebase init functions

# Select:
# - Use existing project
# - JavaScript
# - Install dependencies
```

### 2.3 Configure Functions

```bash
# Copy the damage assessment function
cp functions/damageAssessment.js functions/index.js

# Install dependencies
cd functions
npm install axios
cd ..
```

### 2.4 Set Environment Variables

```bash
# Set xView2 API URL
firebase functions:config:set xview2.api_url="https://xview2-damage-detection-xxxxx-uc.a.run.app"
firebase functions:config:set xview2.api_key=""

# Deploy functions
firebase deploy --only functions
```

## 🗄️ Step 3: Set up Firestore

### 3.1 Create Collections

```bash
# Use Firebase Console or run this script
node scripts/setupFirestore.js
```

### 3.2 Set Security Rules

```javascript
// Copy the rules from firestore-schema.md to Firebase Console
// Go to Firestore > Rules and paste the security rules
```

## 📱 Step 4: Update Frontend

### 4.1 Update Firebase Configuration

```bash
# Add to your .env file
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_XVIEW2_API_URL=https://xview2-damage-detection-xxxxx-uc.a.run.app
```

### 4.2 Test the Integration

```bash
# Start your development server
npm run dev

# Navigate to Assessment page
# Upload a flood damage image
# Verify the analysis works
```

## 🧪 Step 5: Testing

### 5.1 Test xView2 API Directly

```bash
# Test the API endpoint
curl -X POST "https://xview2-damage-detection-xxxxx-uc.a.run.app/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://example.com/flood-image.jpg",
    "state": "punjab",
    "latitude": 30.7333,
    "longitude": 76.7794
  }'
```

### 5.2 Test Firebase Integration

1. Upload an image through the Assessment page
2. Check Firestore for the damage report
3. Verify notifications are sent
4. Test emergency contact buttons

## 📊 Step 6: Monitoring and Analytics

### 6.1 Set up Cloud Monitoring

```bash
# Enable monitoring
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
```

### 6.2 Monitor Cloud Run

- Go to Cloud Run console
- Check logs and metrics
- Set up alerts for errors

### 6.3 Monitor Firebase Functions

- Go to Firebase Functions console
- Check execution logs
- Monitor performance

## 🔒 Step 7: Security and Optimization

### 7.1 API Security

```bash
# Add API key authentication (optional)
gcloud run services update xview2-damage-detection \
  --region asia-south1 \
  --no-allow-unauthenticated
```

### 7.2 CORS Configuration

Update the FastAPI service to restrict CORS origins:

```python
# In api.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.com"],  # Your app domain
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)
```

### 7.3 Cost Optimization

```bash
# Set minimum instances to 0 to reduce costs
gcloud run services update xview2-damage-detection \
  --region asia-south1 \
  --min-instances 0 \
  --max-instances 5
```

## 🚨 Step 8: Emergency Contacts Setup

### 8.1 Add State-wise Emergency Contacts

```javascript
// Add to Firestore emergency_contacts collection
{
  punjab: {
    disaster_control: "+91-172-2740000",
    relief_commissioner: "+91-172-2740001",
    district_collector: "+91-172-2740002"
  },
  haryana: {
    disaster_control: "+91-172-2741000",
    relief_commissioner: "+91-172-2741001",
    district_collector: "+91-172-2741002"
  }
}
```

## 📱 Step 9: Mobile App Integration

### 9.1 Add FCM Support

```bash
# Install Firebase messaging
npm install firebase
```

### 9.2 Update Service Worker

```javascript
// Add to public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  // Your Firebase config
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## 🎯 Step 10: Production Checklist

- [ ] xView2 model deployed to Cloud Run
- [ ] Firebase Functions deployed
- [ ] Firestore collections created
- [ ] Security rules configured
- [ ] Frontend updated with new component
- [ ] Emergency contacts configured
- [ ] Monitoring set up
- [ ] CORS configured
- [ ] API keys secured
- [ ] Cost optimization applied
- [ ] Mobile notifications working
- [ ] Hindi/English translation working
- [ ] NDMA relief categories mapped
- [ ] State-wise cost mapping configured

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Update CORS settings in FastAPI
2. **Authentication Errors**: Check Firebase configuration
3. **Image Upload Fails**: Verify Firebase Storage rules
4. **Analysis Fails**: Check Cloud Run logs
5. **Notifications Not Working**: Verify FCM setup

### Debug Commands

```bash
# Check Cloud Run logs
gcloud logs read --service=xview2-damage-detection --region=asia-south1

# Check Firebase Functions logs
firebase functions:log

# Test API locally
python xview2-model/api.py
```

## 📞 Support

For issues or questions:
- Check Cloud Run logs
- Check Firebase Functions logs
- Verify Firestore security rules
- Test API endpoints directly

## 🎉 Success!

Your JalRakshak Flood Damage Detection system is now fully deployed and integrated! Users can:

- Upload flood damage images
- Get AI-powered damage assessment
- Receive NDMA relief recommendations
- Contact emergency services
- Download damage reports
- Use in Hindi or English

The system is production-ready and optimized for Indian disaster management workflows.

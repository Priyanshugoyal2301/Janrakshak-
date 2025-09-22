# Firestore Schema for JalRakshak Flood Damage Detection

## Collections

### 1. damage_reports
Stores flood damage assessment reports from xView2 analysis.

```javascript
{
  // Document ID: auto-generated
  filePath: string,                    // Firebase Storage path
  downloadURL: string,                 // Public download URL
  userId: string,                      // User who uploaded the image
  state: string,                       // Indian state (punjab, haryana, etc.)
  coordinates: {
    latitude: number,
    longitude: number
  },
  timestamp: Timestamp,                // When report was created
  createdAt: string,                   // ISO string timestamp
  damageAssessment: {
    damage_level: string,              // "No Damage", "Minor Damage", etc.
    hindi_damage_level: string,        // Hindi translation
    confidence: number,                // 0.0 to 1.0
    estimated_cost_display: string,    // "₹50K - ₹100K"
    ndma_category: string,             // "Category A", "Category B", etc.
    relief_amount_display: string,     // "₹2L"
    color: string,                     // Hex color code
    description: string,               // English description
    hindi_description: string,         // Hindi description
    recommendations: {
      immediate_actions: string[],     // Array of action items
      relief_application: {
        required: boolean,
        category: string,
        amount: string,
        form: string,
        deadline: string
      },
      documentation_required: string[], // Required documents
      timeline: string                 // Processing timeline
    },
    emergency_contacts: {
      disaster_control: string,        // Phone number
      relief_commissioner: string,     // Phone number
      district_collector: string       // Phone number
    },
    state: string,                     // State name
    model_info: {
      model_name: string,
      version: string,
      confidence_threshold: number
    }
  },
  status: string,                      // "completed", "failed", "processing"
  processedAt: Timestamp               // When processing completed
}
```

### 2. users
User profiles with FCM tokens for notifications.

```javascript
{
  // Document ID: user UID
  email: string,
  name: string,
  phone: string,
  state: string,                       // User's state
  fcmToken: string,                    // For push notifications
  preferences: {
    language: string,                  // "en" or "hi"
    notifications: boolean,
    locationSharing: boolean
  },
  createdAt: Timestamp,
  lastActiveAt: Timestamp
}
```

### 3. emergency_contacts
State-wise emergency contact information.

```javascript
{
  // Document ID: state name
  state: string,
  disaster_control: string,
  relief_commissioner: string,
  district_collector: string,
  helpline: string,
  email: string,
  lastUpdated: Timestamp
}
```

### 4. relief_applications
NDMA relief applications submitted by users.

```javascript
{
  // Document ID: auto-generated
  userId: string,
  reportId: string,                    // Reference to damage_reports
  category: string,                    // "Category A", "B", or "C"
  status: string,                      // "pending", "approved", "rejected"
  amount: number,                      // Relief amount in rupees
  formData: {
    applicantName: string,
    address: string,
    phone: string,
    bankAccount: string,
    ifscCode: string,
    documents: string[]                // Array of document URLs
  },
  submittedAt: Timestamp,
  reviewedAt: Timestamp,
  reviewedBy: string,                  // Admin user ID
  comments: string
}
```

## Indexes

### Composite Indexes for damage_reports
```javascript
// For user's damage reports
{
  collectionGroup: "damage_reports",
  queryScope: "COLLECTION",
  fields: [
    { fieldPath: "userId", order: "ASCENDING" },
    { fieldPath: "timestamp", order: "DESCENDING" }
  ]
}

// For state-wise statistics
{
  collectionGroup: "damage_reports",
  queryScope: "COLLECTION", 
  fields: [
    { fieldPath: "state", order: "ASCENDING" },
    { fieldPath: "status", order: "ASCENDING" },
    { fieldPath: "timestamp", order: "DESCENDING" }
  ]
}

// For damage level filtering
{
  collectionGroup: "damage_reports",
  queryScope: "COLLECTION",
  fields: [
    { fieldPath: "damageAssessment.damage_level", order: "ASCENDING" },
    { fieldPath: "timestamp", order: "DESCENDING" }
  ]
}
```

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Damage reports - users can read their own, admins can read all
    match /damage_reports/{reportId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Emergency contacts - read only for authenticated users
    match /emergency_contacts/{state} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Relief applications - users can read/write their own
    match /relief_applications/{applicationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Damage assessment images
    match /damage_assessments/{allPaths=**} {
      allow read: if true; // Public read for analysis
      allow write: if request.auth != null;
    }
    
    // User documents for relief applications
    match /user_documents/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Usage Examples

### Query user's damage reports
```javascript
const userReports = await db.collection('damage_reports')
  .where('userId', '==', userId)
  .orderBy('timestamp', 'desc')
  .limit(10)
  .get();
```

### Get damage statistics by state
```javascript
const stateStats = await db.collection('damage_reports')
  .where('state', '==', 'punjab')
  .where('status', '==', 'completed')
  .get();
```

### Query by damage level
```javascript
const majorDamageReports = await db.collection('damage_reports')
  .where('damageAssessment.damage_level', '==', 'Major Damage')
  .orderBy('timestamp', 'desc')
  .get();
```

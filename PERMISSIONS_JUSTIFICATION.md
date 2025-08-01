# Permissions Justification - Email Checker

## Overview
This document provides detailed justification for each permission requested by the Email Checker Chrome extension.

## Required Permissions

### 1. `activeTab`
**Purpose**: To scan the current webpage for email addresses
**Justification**: 
- The extension needs to access the content of the currently active tab to find email addresses
- This permission is minimal and only grants access when the user explicitly clicks the extension icon
- No persistent access to web pages is maintained
- Essential for the core functionality of email scanning

**User Benefit**: Enables the extension to find email addresses on any webpage the user visits

### 2. `storage`
**Purpose**: To save email lists locally in the browser
**Justification**:
- Allows users to save and organize their found email addresses
- Data is stored locally on the user's device, ensuring privacy
- No data is transmitted to external servers
- Enables the "Save to List" and "Saved Lists" features

**User Benefit**: Users can maintain organized lists of email addresses for future reference

### 3. `scripting`
**Purpose**: To execute content scripts for email scanning
**Justification**:
- Required to inject scanning functionality into web pages
- Enables comprehensive email detection across different page structures
- Allows for advanced scanning techniques (Shadow DOM, hidden elements, etc.)
- Essential for the extension's core scanning capabilities

**User Benefit**: Provides thorough and accurate email address detection on any website

### 4. `tabs`
**Purpose**: To open mail7.net website when users click the header link
**Justification**:
- The header contains a clickable link to mail7.net (the validation service provider)
- Users need to be able to visit the service website for more information or support
- Opens in a new tab to preserve the user's current browsing session
- Enhances user experience by providing easy access to the service provider

**User Benefit**: Direct access to the email validation service website for additional features and support

### 5. `https://mail7.net/*`
**Purpose**: To validate emails via API
**Justification**:
- The extension uses mail7.net's professional email validation API
- Ensures accurate validation of found email addresses
- Provides real-time validation results to users
- Essential for the "validation" part of the extension's functionality

**User Benefit**: Professional-grade email validation with accurate results

## Privacy & Security

### Data Handling
- **Local Storage**: All user data is stored locally in the browser
- **No Tracking**: The extension does not collect or transmit personal information
- **API Only**: External communication is limited to email validation API calls
- **User Control**: Users can delete saved data at any time

### Security Measures
- **Minimal Permissions**: Only requests permissions necessary for functionality
- **HTTPS Only**: All external communication uses secure HTTPS
- **No Persistent Access**: activeTab permission is temporary and user-initiated
- **Clear Purpose**: Each permission has a specific, documented purpose

## Compliance

### Chrome Web Store Policies
- ✅ **Minimal Permissions**: Only requests necessary permissions
- ✅ **Clear Justification**: Each permission is justified with specific use cases
- ✅ **User Privacy**: No personal data collection or tracking
- ✅ **Transparent Functionality**: Clear explanation of what each permission enables

### User Transparency
- **Clear Description**: Extension description explains what each feature does
- **Privacy Policy**: Comprehensive privacy policy included
- **User Control**: Users can disable features or delete data
- **No Surprises**: All functionality is clearly documented

## Alternative Approaches Considered

### For `tabs` Permission
- **Alternative**: Could use `window.open()` instead of `chrome.tabs.create()`
- **Rejection**: `window.open()` is often blocked by popup blockers
- **Solution**: `chrome.tabs.create()` provides better user experience and reliability

### For `activeTab` Permission
- **Alternative**: Could request broader permissions for all tabs
- **Rejection**: Would be excessive and violate privacy principles
- **Solution**: `activeTab` provides minimal, temporary access only when needed

## Conclusion

All requested permissions are:
- **Necessary**: Required for core functionality
- **Minimal**: No excessive permissions requested
- **Justified**: Clear explanation for each permission
- **Privacy-focused**: Designed to protect user data
- **User-beneficial**: Each permission directly improves user experience

The Email Checker extension follows Chrome Web Store best practices for permission requests and maintains user privacy while providing valuable functionality. 
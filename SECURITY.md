# Security Best Practices - KLH Peer Learning Platform

## Database: MongoDB with Mongoose

You're using **MongoDB** as your database with Mongoose ODM.

## Enhanced Security Features Implemented

### 🔐 Authentication & Authorization
- ✅ **JWT Access Tokens** (15-minute expiry) - Short-lived for security
- ✅ **JWT Refresh Tokens** (7-day expiry) - For seamless re-authentication
- ✅ **Token Blacklisting** - Revoke compromised tokens
- ✅ **Password Changed Detection** - Invalidate tokens on password change
- ✅ **Role-Based Access Control** - Student, Faculty, Admin roles

### 🛡️ Password Security
- ✅ **Strong Password Requirements**:
  - Minimum 8 characters
  - Must contain uppercase, lowercase, number, and special character
  - Bcrypt hashing with cost factor 12
- ✅ **Password Reset** with secure token (10-minute expiry)
- ✅ **Password Change Tracking** - Detects when password was last changed

### 🚨 Account Protection
- ✅ **Account Lockout** - After 5 failed login attempts
- ✅ **Lockout Duration** - 2 hours automatic unlock
- ✅ **Login Attempt Tracking** - Monitor suspicious activity
- ✅ **Security Event Logging** - Track all security-related events

### 📊 Rate Limiting
- ✅ **Login Attempts**: 5 per 15 minutes
- ✅ **Registration**: 3 per hour per IP
- ✅ **Password Reset**: 10 per hour
- ✅ **General API**: 100 requests per 15 minutes

### 🔒 Input Validation & Sanitization
- ✅ **NoSQL Injection Prevention** - Remove MongoDB operators
- ✅ **XSS Protection** - Sanitize user inputs
- ✅ **Email Validation** - Only @klh.edu.in emails allowed
- ✅ **Input Length Validation** - Prevent buffer overflow
- ✅ **Suspicious Pattern Detection** - Block malicious inputs

### 🌐 Security Headers (Helmet.js)
- ✅ **Content Security Policy** - Prevent XSS attacks
- ✅ **X-Frame-Options** - Prevent clickjacking
- ✅ **X-Content-Type-Options** - Prevent MIME sniffing
- ✅ **Strict-Transport-Security** - Enforce HTTPS
- ✅ **Referrer-Policy** - Control referrer information

### 📝 Audit & Monitoring
- ✅ **Security Events Log** - Last 50 events per user
- ✅ **Login History** - Track last login time and IP
- ✅ **Failed Login Attempts** - Monitor brute force attacks
- ✅ **Device Tracking** - Track refresh tokens by device

### 🔑 Token Management
- ✅ **Multiple Refresh Tokens** - Support for multiple devices
- ✅ **Token Rotation** - Keep only last 5 refresh tokens
- ✅ **Selective Logout** - Logout specific devices
- ✅ **Token Expiry Tracking** - Automatic cleanup

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (rate-limited)
- `POST /api/auth/login` - Login (rate-limited, account lockout)
- `POST /api/auth/logout` - Logout & blacklist token
- `POST /api/auth/refresh-token` - Get new access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password with token
- `PUT /api/auth/change-password` - Change password (authenticated)
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/security-events` - Get security event log

## Environment Variables Required

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/klh-peer-learning

# JWT Secrets (MUST CHANGE IN PRODUCTION!)
JWT_SECRET=your-secret-key-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-different-from-jwt

# Server
PORT=5000
NODE_ENV=production
```

## Security Recommendations

### For Production:
1. **Use MongoDB Atlas** with IP whitelisting
2. **Enable SSL/TLS** for MongoDB connections
3. **Use Redis** for token blacklist (instead of in-memory Set)
4. **Enable Email Service** for password reset
5. **Set up HTTPS** with valid SSL certificate
6. **Use environment-specific secrets** - Never commit .env files
7. **Enable MongoDB authentication** with strong credentials
8. **Regular security audits** - Check logs for suspicious activity
9. **Implement 2FA** (framework added, needs implementation)
10. **Set up monitoring** - Datadog, New Relic, or similar

### MongoDB Security:
- Enable authentication
- Use strong passwords
- Restrict network access
- Regular backups
- Encrypt data at rest
- Monitor slow queries

### Password Policy Enforced:
- ❌ `password123` - Too weak
- ❌ `Password1` - Missing special character
- ✅ `P@ssw0rd123` - Valid
- ✅ `MySecure#Pass2024` - Valid

## Testing the Security

### Test Account Lockout:
1. Try logging in with wrong password 5 times
2. Account will be locked for 2 hours
3. Check security events endpoint to see the attempts

### Test Token Refresh:
1. Login to get access & refresh tokens
2. Wait for access token to expire (15 min)
3. Use refresh token to get new access token

### Test Password Reset:
1. Request password reset
2. Use the token within 10 minutes
3. Set a new strong password

## Migration from Old System

All existing passwords will be re-hashed with the new stronger bcrypt settings on next save. Users should be encouraged to update their passwords to meet the new requirements.

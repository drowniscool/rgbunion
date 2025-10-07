# Critical Fix: Global 500 Error Resolution

**Date**: 2025-09-27
**Issue**: Site-wide 500 Internal Server Error after R2 binding fix
**Status**: ✅ RESOLVED

## Critical Error Symptoms

**After R2 binding fix**: All pages across the entire site returning `Status 500: Internal Error`

**Server Error Logs**:
```
TypeError: fetch failed
  [cause]: Error: connect ECONNREFUSED 127.0.0.1:8787
    errno: -111,
    code: 'ECONNREFUSED',
    syscall: 'connect',
    address: '127.0.0.1',
    port: 8787
```

## Root Cause Analysis

### Issue: Proxy Port Mismatch

The development server was configured to connect to Wrangler proxy on the default port **8787**, but my proxy was running on a different port (**34319**), causing all database and R2 operations to fail.

**Error Flow**:
1. SvelteKit dev server starts → connects to `cfw-bindings-wrangler-bridge`
2. Bridge attempts to connect to `localhost:8787` (default Wrangler port)
3. No proxy running on 8787 → `ECONNREFUSED` error
4. All D1 database operations fail → global 500 errors
5. Authentication, session validation, and page rendering all broken

## Immediate Fix Applied

**Action**: Restarted proxy on the expected port 8787

```bash
# Killed proxy running on random port 34319
npx wrangler dev node_modules/cfw-bindings-wrangler-bridge/worker/index.js --port 8787

# Restarted development server to connect to correct proxy
npm run dev
```

## Validation Results

### Before Fix
- ❌ **All pages**: `Status 500: Internal Error`
- ❌ Database connections failing with `ECONNREFUSED`
- ❌ Authentication broken
- ❌ Session validation failing
- ❌ Complete site outage

### After Fix
- ✅ **Homepage**: `HTTP/1.1 200 OK` (working)
- ✅ **Admin page**: `HTTP/1.1 302 Found` → `/login` (authentication working)
- ✅ Database connections established
- ✅ No `ECONNREFUSED` errors
- ✅ Site fully operational

## Lesson Learned

**Critical Infrastructure Dependency**: The `cfw-bindings-wrangler-bridge` requires the Wrangler proxy to be running on the expected port (default 8787). When the proxy runs on a different port, it breaks the entire application.

**Development Workflow**: Always ensure:
1. Proxy starts on port 8787: `npx wrangler dev worker --port 8787`
2. Development server connects to the correct proxy port
3. Both services must be running for the app to function

## Current Working Environment

- **Proxy**: Running on `localhost:8787` ✅
- **Dev Server**: Running on `localhost:5174` ✅
- **Database**: D1 connections working ✅
- **R2 Storage**: SHOP_MEDIA binding accessible ✅
- **Site Status**: Fully operational ✅

## Updated npm Scripts Needed

The `package.json` proxy script should ensure consistent port usage:

```json
{
  "scripts": {
    "proxy": "wrangler dev node_modules/cfw-bindings-wrangler-bridge/worker/index.js --port 8787"
  }
}
```

This ensures the proxy always starts on the expected port, preventing this critical infrastructure failure.

## Summary

**Root Cause**: Proxy port mismatch (8787 expected, 34319 actual)
**Impact**: Global site outage (all pages 500 error)
**Fix**: Restart proxy on correct port 8787
**Result**: Site fully restored and operational
**Prevention**: Standardize proxy port in npm scripts
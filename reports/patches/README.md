# HeyEd Website Audit - Patch Files

This directory contains patch files to fix critical SEO and accessibility issues identified in the website audit.

## Quick Application

To apply all patches at once:

```bash
# From the project root
for patch in reports/patches/*.patch; do
  git apply "$patch" || echo "Failed to apply: $patch"
done
```

## Individual Patches

### 01-update-sitemap.patch
**Priority:** HIGH  
**Impact:** SEO, Search Discovery  
Adds missing pages to sitemap.xml and updates lastmod dates.

**Affected:** `/public/sitemap.xml`
```bash
git apply reports/patches/01-update-sitemap.patch
```

### 02-add-comparison-metadata.patch
**Priority:** HIGH  
**Impact:** SEO, Search Rankings  
Adds page-specific metadata for the comparison page.

**Affected:** `/app/comparison/page.tsx`
```bash
git apply reports/patches/02-add-comparison-metadata.patch
```

### 03-add-download-metadata.patch
**Priority:** HIGH  
**Impact:** SEO, Social Sharing  
Adds comprehensive metadata for the PDF download page.

**Affected:** `/app/download/page.tsx`
```bash
git apply reports/patches/03-add-download-metadata.patch
```

### 04-fix-og-image-consistency.patch
**Priority:** MEDIUM  
**Impact:** Social Media Sharing  
Standardizes Open Graph images across layout files.

**Affected:** `/app/layout.tsx`
```bash
git apply reports/patches/04-fix-og-image-consistency.patch
```

### 05-optimize-images-screenshot-section.patch
**Priority:** MEDIUM  
**Impact:** Core Web Vitals, Performance  
Replaces img tags with Next.js Image components for better optimization.

**Affected:** `/components/screenshot-scroll-section.tsx`
```bash
git apply reports/patches/05-optimize-images-screenshot-section.patch
```

### 06-add-missing-favicon-meta.patch
**Priority:** LOW  
**Impact:** Cross-browser Support  
Adds proper favicon meta tags for different devices and browsers.

**Affected:** `/app/layout.tsx`  
**Note:** You'll need to generate the actual favicon files (favicon-32x32.png, apple-touch-icon.png, etc.)

```bash
git apply reports/patches/06-add-missing-favicon-meta.patch
```

## Post-Application Tasks

After applying patches, you'll need to:

1. **Generate favicon files** (for patch 06):
   - Create favicon-32x32.png, favicon-16x16.png
   - Create apple-touch-icon.png (180x180)
   - Create android-chrome-192x192.png, android-chrome-512x512.png

2. **Test build process**:
   ```bash
   npm run build
   ```

3. **Verify sitemap.xml** renders correctly:
   ```bash
   curl http://localhost:3000/sitemap.xml
   ```

4. **Add remaining page metadata** for:
   - `/app/help/page.tsx`
   - `/app/cookies/page.tsx` 
   - `/app/dpa/page.tsx`
   - `/app/video/page.tsx`

## Additional Recommendations

- Consider adding a web app manifest (/public/manifest.json)
- Replace Google verification placeholder in /app/metadata.ts
- Address build timeout issues for better optimization
- Add structured data (FAQ, HowTo schemas) for enhanced search results

## Testing

After applying patches, verify:
- [ ] All pages load correctly
- [ ] Metadata appears in page source
- [ ] Social media previews work (Facebook Debugger, Twitter Card Validator)
- [ ] Sitemap.xml validates (Google Search Console)
- [ ] Images load properly with Next.js optimization
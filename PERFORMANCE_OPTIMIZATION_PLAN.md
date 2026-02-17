# Performance Optimization Plan for simonprickett.dev

## Context

This GitHub Pages site (Jekyll-powered blog with 81+ posts) currently has several performance bottlenecks affecting page load speed:

- **Large unminified CSS**: 209KB main.css + 14KB theme.css loaded on every page
- **No lazy loading**: All images load immediately (489 WebP images, 23.2MB total)
- **Render-blocking JavaScript**: jQuery (85KB) loaded in `<head>` blocks HTML parsing
- **Suboptimal external resources**: Font Awesome and Google Fonts loaded synchronously

The goal is to improve page loading speed without any visual changes, focusing on high-impact optimizations compatible with GitHub Pages constraints.

**Current estimated load time**: ~3-5s on 3G
**Target load time**: <2.5s on 3G
**Expected improvement**: 40-50% faster initial page loads

---

## Implementation Plan

### Phase 1: CSS Minification (Highest Impact - ~33% CSS size reduction)

**Problem**: CSS files are served unminified, wasting ~73KB per page load

**Solution**: Use Jekyll's built-in Sass processor to automatically minify CSS

**Steps**:
1. Rename `/assets/css/main.css` to `/assets/css/main.scss`
2. Rename `/assets/css/theme.css` to `/assets/css/theme.scss`
3. Add YAML front matter to both files (add these 2 lines at the very top):
   ```yaml
   ---
   ---
   ```
4. Add Sass compression to `_config.yml`:
   ```yaml
   # CSS Minification
   sass:
     style: compressed
   ```
5. Update CSS references in `_layouts/default.html`:
   - Line 23: `main.css` → `main.scss`
   - Line 26: `theme.css` → `theme.scss`

**Expected Results**:
- main.css: 209KB → ~140KB (33% smaller)
- theme.css: 14KB → ~10KB (29% smaller)
- Total savings: ~73KB per page

**Files to modify**:
- `/assets/css/main.css` → rename to `main.scss`
- `/assets/css/theme.css` → rename to `theme.scss`
- `/_layouts/default.html` (lines 23, 26)
- `/_config.yml` (add sass config)

---

### Phase 2: Native Image Lazy Loading (High Impact - reduces initial load by 2-5MB)

**Problem**: All images load immediately, even those below the fold

**Solution**: Add `loading="lazy"` attribute to below-the-fold images

**Strategy**:
- **Above-the-fold images**: NO lazy loading (hero images, first post)
- **Below-the-fold images**: Add `loading="lazy"` (sidebar, pagination, thumbnails)

**Steps**:
1. Add `loading="lazy"` to blog card images in `/_includes/main-loop-card.html` (line 20):
   ```html
   <img class="w-100" src="..." alt="..." loading="lazy">
   ```

2. Add to post layout images in `/_layouts/post.html`:
   - Line 64: Author avatar
   - Lines 86, 91: Previous/next post thumbnails

3. Add to pagination cards in `/index.html`:
   - Lines 54, 78, 102 (featured post images)

4. Add to 404 page image `/404.html` (line 10)

5. **DO NOT add to hero images** (line 29 in `/_layouts/post.html`) - they're above the fold

**Expected Results**:
- Homepage: Load ~4 images initially instead of ~15-20
- Post pages: Load hero + 1-2 images instead of all sidebar/navigation images
- Savings: 2-5MB reduction on image-heavy pages

**Files to modify**:
- `/_includes/main-loop-card.html` (line 20)
- `/_layouts/post.html` (lines 64, 86, 91)
- `/index.html` (lines 54, 78, 102)
- `/404.html` (line 10)

---

### Phase 3: Move jQuery to Footer (Eliminates render-blocking JS)

**Problem**: jQuery loaded in `<head>` blocks HTML parsing and rendering

**Solution**: Move jQuery to footer before other scripts that depend on it

**Steps**:
1. Remove jQuery from head in `/_layouts/default.html` (delete lines 34-38)
2. Add jQuery to footer before Popper.js (insert after line 71):
   ```html
   <!-- jQuery must load before Bootstrap -->
   <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
   ```

**Load order in footer** (critical for dependencies):
```
jQuery → Popper.js → Bootstrap → theme.js → Slick (posts only)
```

**Expected Results**:
- Eliminates 85KB render-blocking script
- Faster First Contentful Paint (FCP)
- Faster Largest Contentful Paint (LCP)

**Files to modify**:
- `/_layouts/default.html` (move lines 35-38 to after line 71)

---

### Phase 4: Font Loading Optimization (Reduces render-blocking)

**Problem**: Google Fonts loaded synchronously, Font Awesome from external CDN

**Solution**: Add `font-display: swap` and resource hints

**Steps**:
1. Add resource hints to `/_layouts/default.html` (insert after line 6):
   ```html
   <!-- Resource hints for faster DNS/connection -->
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link rel="dns-prefetch" href="https://code.jquery.com">
   <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
   <link rel="dns-prefetch" href="https://stackpath.bootstrapcdn.com">
   ```

2. Update Google Fonts URL (line 20) to use `font-display: swap`:
   ```html
   <link href="https://fonts.googleapis.com/css?family=Lora:400,400i,700&display=swap" rel="stylesheet">
   ```

**Expected Results**:
- 100-300ms faster connection to external resources
- Reduced Flash of Invisible Text (FOIT)
- Faster font rendering

**Files to modify**:
- `/_layouts/default.html` (add resource hints after line 6, update line 20)

---

## Critical Files Summary

These 5 files contain all the changes needed:

1. **`/_layouts/default.html`** - Main layout template
   - Move jQuery to footer (lines 35-38 → after 71)
   - Update CSS references (lines 23, 26)
   - Add resource hints (after line 6)
   - Update Google Fonts URL (line 20)

2. **`/assets/css/main.css`** → **`main.scss`** - Primary stylesheet
   - Rename to .scss extension
   - Add YAML front matter

3. **`/assets/css/theme.css`** → **`theme.scss`** - Custom theme
   - Rename to .scss extension
   - Add YAML front matter

4. **`/_includes/main-loop-card.html`** - Blog post card component
   - Add `loading="lazy"` to image (line 20)

5. **`/_config.yml`** - Jekyll configuration
   - Add Sass compression config

---

## Verification Plan

### Before Implementation:
Run baseline Lighthouse audit:
```bash
npx lighthouse https://simonprickett.dev --output=html --output-path=before-report.html
```

### After Implementation:

**1. Build and serve locally:**
```bash
bundle exec jekyll serve
```

**2. Manual testing checklist:**
- [ ] Homepage loads correctly
- [ ] CSS styles appear identical (no visual changes)
- [ ] Images lazy load (check Network tab in DevTools)
- [ ] Navbar toggle works on mobile
- [ ] Search functionality works
- [ ] Slick carousel works on posts
- [ ] Font Awesome icons display
- [ ] No console errors
- [ ] No layout shifts

**3. Run Lighthouse again:**
```bash
npx lighthouse http://localhost:4000 --output=html --output-path=after-report.html
```

**4. Key metrics to verify:**
- **First Contentful Paint (FCP)**: Should improve by 30-40%
- **Largest Contentful Paint (LCP)**: Should improve by 20-30%
- **Total Blocking Time (TBT)**: Should decrease significantly
- **Performance Score**: Target 90+ (from ~60-70)

**5. Browser testing:**
- Chrome (Desktop/Mobile)
- Firefox (Desktop/Mobile)
- Safari (Desktop/Mobile)

---

## Expected Impact

**Performance Improvements**:
- Initial page load: 40-50% faster
- CSS payload: 73KB smaller (33% reduction)
- Initial images loaded: 75% fewer on homepage
- Render-blocking JS: Eliminated

**Lighthouse Score Improvements** (estimated):
- Performance: 60-70 → 90+
- FCP: ~2.5s → ~1.5s
- LCP: ~4.0s → ~2.5s
- TBT: ~500ms → ~200ms

---

## Rollback Plan

All changes are isolated and reversible:

1. **CSS minification**: Rename .scss back to .css, remove sass config
2. **Lazy loading**: Remove `loading="lazy"` attributes
3. **jQuery position**: Move jQuery back to head
4. **Font loading**: Remove resource hints, restore original Google Fonts URL

All changes tracked in Git for easy reversion with `git checkout`.

---

## Future Optimization Opportunities

After implementing these foundational optimizations, consider:

1. **GIF to Video Conversion** (134MB → ~15MB): Convert large GIF animations to MP4/WebM format for 85-90% size reduction
2. **Critical CSS Inlining**: Extract and inline above-the-fold CSS for faster FCP
3. **Service Worker**: Add offline caching for instant repeat visits

These advanced optimizations require more effort but provide additional 20-30% performance gains.

---

## Implementation Status

- [ ] Phase 1: CSS Minification
- [ ] Phase 2: Image Lazy Loading
- [ ] Phase 3: Move jQuery to Footer
- [ ] Phase 4: Font Loading Optimization
- [ ] Verification and Testing Complete

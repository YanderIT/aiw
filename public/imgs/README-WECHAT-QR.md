# WeChat QR Code Setup

## Current Status
The file `wechat-qr-placeholder.svg` is a placeholder SVG image.

## How to Add Your Real WeChat QR Code

### Option 1: Replace the SVG file (Recommended)
1. Generate your WeChat QR code
2. Save it as `wechat-qr-code.png` (200x200px or larger recommended)
3. Place it in `/public/imgs/`
4. Update the image source in the following files:
   - `src/app/[locale]/(default)/study-abroad-consultation/components/modules/PolishingDetailsModule.tsx` (line ~222)
   - `src/app/[locale]/(default)/study-abroad-consultation/result/[uuid]/components/StudyAbroadResultClient.tsx` (line ~190)

   Change from:
   ```tsx
   src="/imgs/wechat-qr-placeholder.svg"
   ```

   To:
   ```tsx
   src="/imgs/wechat-qr-code.png"
   ```

### Option 2: Keep the SVG filename
1. Generate your WeChat QR code
2. Convert it to SVG format (or use PNG)
3. Replace the current `wechat-qr-placeholder.svg` file
4. No code changes needed!

## Files Using This QR Code
- Manual Polish Service form (PolishingDetailsModule)
- Manual Polish Service result page (StudyAbroadResultClient)

## Display Locations
The QR code appears when users select "WeChat" as their return method for polished documents.

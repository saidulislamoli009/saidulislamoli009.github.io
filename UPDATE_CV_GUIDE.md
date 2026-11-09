# CV Update Guide - Saidul Islam

## Current CV Structure (2-page ATS-friendly design)

### Page 1 (cv-page-1):
1. **Header**: Name (SAIDUL ISLAM), Title (IT Officer · Network Admin · ERP Support · Mobile App Dev), Contact (Phone, Email, Portfolio, LinkedIn), Address (272-28/1, Dhaka - 1216), Photo
2. **Professional Summary**: 4.8+ years experience description
3. **Core Competencies**: 2-column list of skills

### Page 2 (cv-page-2):
1. **Header**: "Curriculum Vitae · SAIDUL ISLAM" + "Page 2 of 2"
2. **Technical Skills**: Categories (Networking, ISP, ERP, Mobile/Cloud, Security, Hardware)
3. **Projects**: Examples (FixBD, Zen Movie Hub)
4. **Awards/Accomplishments**
5. **Education & Certifications**

## How to Update

### 1. Edit HTML (index.html lines ~2481-2530)

**Update Address:**
```html
<span id="cv-address" class="text-slate-700">
    Present: <strong>Your Present Address</strong><br>
    Permanent: <strong>Your Permanent Address</strong>
</span>
```

**Update Title:**
```html
<p class="cv-title-subtitle text-orange-600 font-bold text-xs sm:text-[12.5px] tracking-wide mt-0.5">
    IT Analyst &bull; Network Administrator &bull; ERP Support Specialist &bull; Mobile App Developer
</p>
```

### 2. Regenerate PDF
- Open index.html in browser and click "Download CV"
- Or use the website's export feature

### 3. ATS Compatibility Maintenance
- Keep exactly 2 pages (A4 format)
- Use standard fonts (Helvetica)
- Maintain section order: Contact → Summary → Competencies → Skills → Projects → Education
- Avoid large text blocks that cause 3rd page

### 4. Key Design Tokens (from style.css)
- Font: Plus Jakarta Sans (body), Outfit (headings)
- Primary: Brand Cyan (#00f5d4)
- Background: White, dark text (#0f172a)
- Rounded corners, consistent spacing


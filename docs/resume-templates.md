# Resume Template System Documentation

## Overview

The resume template system allows users to generate professional resumes using predefined templates that automatically format their data into beautiful, print-ready documents.

## Architecture

### 1. Field Mapping System (`src/lib/resume-field-mapping.ts`)

Converts the existing Chinese-English mixed data structure to a standardized format that templates can consume:

```typescript
// Your existing data structure
interface ResumeData {
  header: { full_name: string; email: string; ... }
  education: { school_name: string; degree: string; ... }
  // ... other modules
}

// Standardized template format
interface StandardResumeData {
  basics: { name: string; email: string; ... }
  sections: { experience: {...}, education: {...}, ... }
  metadata: { template: string; theme: {...}; ... }
}
```

### 2. Template Components (`src/app/.../templates/`)

- **Shared utilities** (`shared/utils.ts`, `shared/components.tsx`)
- **Template implementations**:
  - `kakuna.tsx` - Clean centered layout
  - `ditto.tsx` - Modern sidebar design
  - More templates can be easily added

### 3. Template Selector (`TemplateSelector.tsx`)

UI component for choosing between available templates with preview descriptions.

### 4. Integration with Result Page

The existing result page now has dual view modes:
- **Template View**: Live preview of the formatted resume
- **Markdown View**: Traditional text-based editing

## Available Templates

### Kakuna Template
- **Style**: Clean, centered layout
- **Best for**: Traditional industries, academic applications
- **Features**: Clear section headers, professional typography

### Ditto Template  
- **Style**: Modern two-column design
- **Best for**: Technical and creative fields
- **Features**: Sidebar with contact info and skills, main content area

### Gengar Template (Coming Soon)
- **Style**: Modern design with accent colors
- **Best for**: Creative industries
- **Features**: Color highlights, modern typography

## Usage

### For Users
1. Fill out resume information in the existing modules
2. Navigate to the result page
3. Click "选择模板" (Select Template) tab
4. Choose desired template
5. Switch to "模板预览" (Template Preview) to see formatted resume
6. Use the print button to generate PDF

### For Developers

#### Adding a New Template

1. **Create template component**:
```typescript
// src/app/.../templates/your-template.tsx
export const YourTemplate = ({ resume }: { resume: StandardResumeData }) => {
  return (
    <div className="p-8 min-h-[297mm] w-[210mm] bg-white">
      {/* Your template JSX */}
    </div>
  );
};
```

2. **Register in template system**:
```typescript
// In getTemplateComponent function
case "your-template":
  return YourTemplate;
```

3. **Add to selector**:
```typescript
// In TemplateSelector component
{ 
  id: "your-template", 
  name: "Your Template", 
  description: "Description here" 
}
```

#### Customizing Field Mapping

Modify `mapToStandardFormat()` in `resume-field-mapping.ts` to adjust how your data maps to template fields.

## Technical Details

### Print Optimization
- A4 page size (210mm x 297mm)
- Print-specific CSS rules
- Color preservation for printing
- Proper scaling for screen vs print

### Responsive Design
- Templates scale to fit preview area (75% scale)
- Full size when printing
- Mobile-friendly template selector

### Performance
- Templates render only when in template view mode
- Efficient data transformation
- Cached field mapping results

## File Structure

```
src/
├── lib/
│   └── resume-field-mapping.ts          # Data transformation
├── app/[locale]/(default)/resume-generator/
│   ├── components/
│   │   ├── TemplateSelector.tsx          # Template chooser UI
│   │   ├── ResumeContext.tsx             # Updated with selectedTemplate
│   │   └── templates/
│   │       ├── shared/
│   │       │   ├── utils.ts              # Common utilities
│   │       │   └── components.tsx        # Reusable components
│   │       ├── kakuna.tsx               # Centered template
│   │       └── ditto.tsx                # Sidebar template
│   └── result/components/
│       └── ResumeResultClient.tsx        # Updated result page
```

## Benefits

1. **No Data Loss**: Existing form fields remain unchanged
2. **Professional Output**: Multiple polished template options
3. **Print Ready**: Optimized for PDF generation and printing
4. **Extensible**: Easy to add new templates
5. **User Friendly**: Simple template selection interface
6. **Dual View**: Both template and text editing modes available

## Future Enhancements

- PDF export functionality
- Custom color themes per template
- Additional templates (Gengar and others)
- Template preview thumbnails
- Advanced typography options
- Multi-page template support
#!/usr/bin/env python3
"""
Apply ATLAS integration modifications to ARQ assessment components.
Handles both ARQAlpha.js and ARQFull.js files.
"""

import re
import sys

def add_atlas_to_component(filepath):
    """Modify a component file to add ATLAS integration."""
    
    print(f"Processing {filepath}...")
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    original_length = len(content)
    
    # Step 1: Add import for ATLAS utilities
    import_statement = "import { generateATLASRecommendation } from '../lib/atlas-utils';"
    if import_statement not in content:
        content = content.replace(
            "import React, { useState, useEffect, useRef } from 'react';",
            f"import React, {{ useState, useEffect, useRef }} from 'react';\n{import_statement}"
        )
        print("  ✓ Added ATLAS import")
    
    # Step 2: Add atlasRecommendation state variable
    if '[atlasRecommendation, setAtlasRecommendation]' not in content:
        # Find the state declarations section and add our state
        state_pattern = r'(const \[isExporting, setIsExporting\] = useState\(false\);)'
        state_addition = '\n  const [atlasRecommendation, setAtlasRecommendation] = useState(null);'
        content = re.sub(state_pattern, r'\1' + state_addition, content, count=1)
        print("  ✓ Added atlasRecommendation state")
    
    # Step 3: Modify completeAssessment to generate ATLAS recommendation
    if 'generateATLASRecommendation(' not in content:
        # Find where results are set and add ATLAS generation
        complete_pattern = r'(const results = calculateResults\(\);)\s*(setResults\(results\);)'
        atlas_code = r'\1\n    const atlasRec = generateATLASRecommendation(results.percentageScore, results.domainScores);\n    setAtlasRecommendation(atlasRec);\n    \2'
        content = re.sub(complete_pattern, atlas_code, content, count=1)
        print("  ✓ Added ATLAS generation in completeAssessment()")
    
    # Step 4: Add privacy policy link to userInfo view
    privacy_link = '<a href="https://www.difc.com/our-policies"'
    if privacy_link not in content:
        # This is complex due to minification - we'll add a marker comment for manual insertion
        print("  ⚠ Privacy link needs manual insertion (see INTEGRATION_GUIDE.md)")
    
    # Step 5: Add ATLAS display to results view
    atlas_display_marker = 'About ATLAS'
    if atlas_display_marker not in content:
        print("  ⚠ ATLAS display section needs manual insertion (see INTEGRATION_GUIDE.md)")
    
    # Save modified file
    with open(filepath, 'w') as f:
        f.write(content)
    
    new_length = len(content)
    print(f"  File size: {original_length} → {new_length} ({new_length - original_length:+d} chars)")
    print(f"✓ {filepath} processed\n")
    
    return True

# Process both component files
try:
    add_atlas_to_component('src/components/ARQAlpha.js')
    add_atlas_to_component('src/components/ARQFull.js')
    print("=" * 60)
    print("ATLAS modifications applied successfully!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Review INTEGRATION_GUIDE.md for UI component insertion points")
    print("2. Test locally: npm install && npm run build && npm run dev")
    print("3. Deploy to GitHub when ready")
    
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)


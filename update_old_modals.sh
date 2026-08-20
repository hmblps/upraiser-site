#!/bin/bash

# CaseDetailModal.tsx
sed -i '' -e '/<div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">/,/<\/div>$/c\
          <AmbientModalBackground />
' src/components/CaseDetailModal.tsx
sed -i '' -e 's/import { NightStars } from "\.\/hero-terrain\/NightStars";/import { AmbientModalBackground } from ".\/AmbientModalBackground";/g' src/components/CaseDetailModal.tsx

# ProgrammaticPreviewModal.tsx
sed -i '' -e '/<div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">/,/<\/div>$/c\
          <AmbientModalBackground />
' src/components/channel-visuals/programmatic/ProgrammaticPreviewModal.tsx
sed -i '' -e 's/import { NightStars } from "\.\.\/\.\.\/hero-terrain\/NightStars";/import { AmbientModalBackground } from "\.\.\/\.\.\/AmbientModalBackground";/g' src/components/channel-visuals/programmatic/ProgrammaticPreviewModal.tsx

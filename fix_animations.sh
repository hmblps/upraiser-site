#!/bin/bash

# CaseDetailModal.tsx
sed -i '' 's/transition={simpleMotion ? { duration: 0.15 } : SPRING}/transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}/g' src/components/CaseDetailModal.tsx
sed -i '' 's/transition={simpleMotion ? { duration: 0.15 } : SPRING_SOFT}/transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}/g' src/components/CaseDetailModal.tsx
sed -i '' 's/y: 36, scale: 0.96/y: 20, scale: 0.98/g' src/components/CaseDetailModal.tsx

# ProgrammaticPreviewModal.tsx
sed -i '' 's/transition={reduced ? { duration: 0.15 } : MODAL_SPRING}/transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}/g' src/components/channel-visuals/programmatic/ProgrammaticPreviewModal.tsx
sed -i '' 's/y: 28, scale: 0.94/y: 20, scale: 0.98/g' src/components/channel-visuals/programmatic/ProgrammaticPreviewModal.tsx

# PartnersCarousel.tsx
sed -i '' 's/y: 20, scale: 0.95/y: 20, scale: 0.98/g' src/components/PartnersCarousel.tsx
sed -i '' 's/initial={{ opacity: 0, scale: 0.95, y: 20 }}/initial={{ opacity: 0, scale: 0.98, y: 20 }}/g' src/components/PartnersCarousel.tsx
sed -i '' 's/exit={{ opacity: 0, scale: 0.95, y: 20 }}/exit={{ opacity: 0, scale: 0.98, y: 20 }}\n              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}/g' src/components/PartnersCarousel.tsx

# AmbientModalBackground.tsx - make it opaque
sed -i '' 's/className="absolute inset-0 pointer-events-none z-0 overflow-hidden"/className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-bg"/g' src/components/AmbientModalBackground.tsx


#!/bin/bash

# Update CaseDetailModal
sed -i '' 's/h-\[60vh\] opacity-40/inset-0 opacity-100/g' src/components/CaseDetailModal.tsx
sed -i '' 's/inset-x-0 bottom-0 //g' src/components/CaseDetailModal.tsx
sed -i '' 's/className="block dark:hidden w-full h-full object-cover object-bottom max-w-\[1200px\]"/className="block dark:hidden w-full h-full object-cover object-center opacity-[0.35] contrast-[0.7] brightness-[1.15] sepia-[0.1] hue-rotate-[200deg] blur-[1px]"/g' src/components/CaseDetailModal.tsx

# Add animate opacity to NightStars wrapper in CaseDetailModal
sed -i '' 's/<div className="hidden dark:block absolute inset-0">/<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 1.5 }} className="hidden dark:block absolute inset-0">/g' src/components/CaseDetailModal.tsx
sed -i '' 's/<\/Canvas>[\n\r\t ]*<\/React.Suspense>[\n\r\t ]*)}[\n\r\t ]*<\/div>/<\/Canvas>\n                <\/React.Suspense>\n              )}\n            <\/motion.div>/g' src/components/CaseDetailModal.tsx

# Update ProgrammaticPreviewModal
sed -i '' 's/h-\[60vh\] opacity-40/inset-0 opacity-100/g' src/components/channel-visuals/programmatic/ProgrammaticPreviewModal.tsx
sed -i '' 's/inset-x-0 bottom-0 //g' src/components/channel-visuals/programmatic/ProgrammaticPreviewModal.tsx
sed -i '' 's/className="block dark:hidden w-full h-full object-cover object-bottom max-w-\[1200px\]"/className="block dark:hidden w-full h-full object-cover object-center opacity-[0.35] contrast-[0.7] brightness-[1.15] sepia-[0.1] hue-rotate-[200deg] blur-[1px]"/g' src/components/channel-visuals/programmatic/ProgrammaticPreviewModal.tsx

# Add animate opacity to NightStars wrapper in ProgrammaticPreviewModal
sed -i '' 's/<div className="hidden dark:block absolute inset-0">/<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 1.5 }} className="hidden dark:block absolute inset-0">/g' src/components/channel-visuals/programmatic/ProgrammaticPreviewModal.tsx
sed -i '' 's/<\/Canvas>[\n\r\t ]*<\/React.Suspense>[\n\r\t ]*)}[\n\r\t ]*<\/div>/<\/Canvas>\n                <\/React.Suspense>\n              )}\n            <\/motion.div>/g' src/components/channel-visuals/programmatic/ProgrammaticPreviewModal.tsx


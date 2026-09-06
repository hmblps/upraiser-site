#!/bin/bash
git log -p -n 1 d3369770 --stat | grep "0 bytes" | awk -F '|' '{print $1}' | sed 's/ //g' > deleted-files.txt
while read file; do
  if [ ! -s "$file" ]; then
    echo "Restoring $file"
    mkdir -p "$(dirname "$file")"
    curl -s "https://upraiser-site-v2-eo4j69oy6-alex-3152s-projects.vercel.app/${file#public/}" -o "$file"
  fi
done < deleted-files.txt

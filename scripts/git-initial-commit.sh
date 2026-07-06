#!/bin/bash
cd /home/batp/projects/mon-potager
git branch -m main
git commit -m "$(cat <<'EOF'
Initial commit: monorepo Mon Potager PWA

Documentation produit/technique, Next.js 15 PWA (Serwist), navigation responsive,
placeholders identifiés, catalogue cultures et migration Supabase initiale.
EOF
)"

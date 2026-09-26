#!/bin/sh
# Monta la web publicable en dist/ (Vercel). Uso: sh web/build.sh
set -e
rm -rf dist
mkdir -p dist
cp -r web/. dist/
cp -r shared dist/shared
rm -f dist/build.sh dist/img/LEEME.md
# Las páginas usan ../shared/ en local; en el servidor la carpeta va dentro
sed -i 's#\.\./shared/#shared/#g' dist/*.html
# Versión de prueba: que no la indexen los buscadores
sed -i 's#<meta charset="utf-8">#<meta charset="utf-8">\n  <meta name="robots" content="noindex, nofollow">#' dist/index.html
printf 'User-agent: *\nDisallow: /\n' > dist/robots.txt

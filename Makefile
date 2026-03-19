# ==================================================================================== #
# VARIABLES
# ==================================================================================== #

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ":" | sed -e 's/^/ /'

# ==================================================================================== #
# USEFUL COMMANDS
# ==================================================================================== #

## htaccess: Create .htaccess
.PHONY: htaccess
htaccess:
	@echo "Création du fichier .htaccess..."
	@echo "<IfModule mod_rewrite.c>" > .htaccess
	@echo "  RewriteEngine On" >> .htaccess
	@echo "  RewriteBase /" >> .htaccess
	@echo "" >> .htaccess
	@echo "  # Si la requête pointe vers un fichier/dossier existant, on le sert" >> .htaccess
	@echo "  RewriteCond %{REQUEST_FILENAME} !-f" >> .htaccess
	@echo "  RewriteCond %{REQUEST_FILENAME} !-d" >> .htaccess
	@echo "" >> .htaccess
	@echo "  # Sinon, on redirige tout vers index.html" >> .htaccess
	@echo "  RewriteRule . /index.html [L]" >> .htaccess
	@echo "</IfModule>" >> .htaccess
	@echo "" >> .htaccess
	@echo "ErrorDocument 404 /index.html" >> .htaccess
	@echo "Fichier .htaccess créé avec succès !"

## mv-htaccess: Move .htaccess to dist folder
.PHONY: mv-htaccess
mv-htaccess:htaccess
	mv .htaccess ./dist/.htaccess

# ==================================================================================== #
# NPM COMMANDS
# ==================================================================================== #

## npm-install: Install dependencies of project
.PHONY: npm-install
npm-install:
	npm install

## npm-run: Launch project for development
.PHONY: npm-run
npm-run:
	npm run dev

## npm-build: Build project to html
.PHONY: npm-build
npm-build:
	npm run build

# ==================================================================================== #
# DEPLOY
# ==================================================================================== #

## deploy: Deploy project to production environment
.PHONY: deploy
deploy:mv-htaccess
	rsync -rz --delete --mkpath dist/ nabia@ssh-nabia.alwaysdata.net:www/niyya/

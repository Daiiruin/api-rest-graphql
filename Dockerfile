# Utiliser l'image officielle de Node.js
FROM node:18-alpine

# Définir le dossier de travail
WORKDIR /app

# Installer pnpm via npm
RUN npm install -g pnpm

# Copier les fichiers package.json et pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Installer les dépendances avec pnpm
RUN pnpm install --frozen-lockfile

# Copier le reste du code source
COPY . .

# Compiler TypeScript
RUN pnpm build

# Exposer le port de l'API
EXPOSE 3000

# Lancer l'application
CMD ["pnpm", "start"]

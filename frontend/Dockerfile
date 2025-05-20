# Imagem base do Node
FROM node:20

# Diretório de trabalho
WORKDIR /app

# Copia o package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Expõe a porta do Vite (3000)
EXPOSE 5173

# Comando para rodar o Vite em modo dev com host liberado
CMD ["npm", "run", "dev", "--", "--host"]

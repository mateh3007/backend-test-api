set -e 

echo "🚀 Iniciando deploy da aplicação..."

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' 

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: package.json não encontrado. Execute este script da raiz do projeto.${NC}"
    exit 1
fi

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Aviso: Arquivo .env não encontrado.${NC}"
    echo -e "${YELLOW}   Criando a partir de .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}   ⚠️  IMPORTANTE: Configure as variáveis de ambiente no arquivo .env antes de continuar!${NC}"
        exit 1
    else
        echo -e "${RED}❌ Erro: .env.example não encontrado.${NC}"
        exit 1
    fi
fi

if [ "$NODE_ENV" != "production" ]; then
    echo -e "${YELLOW}⚠️  Aviso: NODE_ENV não está definido como 'production'.${NC}"
    echo -e "${YELLOW}   Definindo NODE_ENV=production para este deploy...${NC}"
    export NODE_ENV=production
fi

echo -e "${GREEN}📦 Instalando dependências...${NC}"
npm ci --production

echo -e "${GREEN}🔧 Gerando cliente Prisma...${NC}"
npx prisma generate

echo -e "${GREEN}🗄️  Executando migrations...${NC}"
npx prisma migrate deploy

echo -e "${GREEN}🏗️  Fazendo build da aplicação...${NC}"
npm run build

if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}🔄 Reiniciando aplicação com PM2...${NC}"
    
    if pm2 list | grep -q "thera-api"; then
        echo -e "${GREEN}   Aplicação encontrada. Fazendo reload (zero downtime)...${NC}"
        pm2 reload ecosystem.config.js
    else
        echo -e "${GREEN}   Aplicação não encontrada. Iniciando...${NC}"
        pm2 start ecosystem.config.js
        pm2 save
    fi
    
    echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
    echo -e "${YELLOW}📊 Status da aplicação:${NC}"
    pm2 status
else
    echo -e "${YELLOW}⚠️  PM2 não está instalado.${NC}"
    echo -e "${YELLOW}   Instale com: npm install -g pm2${NC}"
    echo -e "${YELLOW}   Ou inicie manualmente com: npm run start:prod${NC}"
fi

echo -e "${GREEN}✨ Deploy finalizado!${NC}"


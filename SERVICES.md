# World of Toilets - Serviços e Portas 🚀

Este documento lista todos os serviços do projeto e suas respectivas portas de acesso.

## 🌐 Acesso Público (via Nginx - Porta 80)

| Rota | Serviço | Descrição |
|------|---------|-----------|
| `/` | Web (Next.js) | Frontend principal da aplicação |
| `/api/` | API (NestJS) | Backend REST API |
| `/ai/` | AI Service (Flask) | Serviço de cálculo de rotas |
| `/files/` | MinIO | Armazenamento de arquivos |
| `/health` | Nginx | Health check do gateway |

### Exemplos de Uso

```bash
# Frontend
curl http://localhost/

# API Backend
curl http://localhost/api/health

# AI Service - Cálculo de rotas
curl http://localhost/ai/health
curl http://localhost/ai/38.7072,-9.1365/38.7139,-9.1334/

# Arquivos
curl http://localhost/files/bucket/image.jpg
```

## 🔧 Portas de Desenvolvimento

### Serviços Principais

| Porta | Serviço | Ambiente | Descrição |
|-------|---------|----------|-----------|
| `80` | Nginx | Todos | Gateway/Load Balancer |
| `3001` | Web-1 | Produção | Frontend Next.js (instância 1) |
| `3002` | Web-2 | Produção | Frontend Next.js (instância 2) |
| `3101` | API-1 | Produção | Backend NestJS (instância 1) |
| `3102` | API-2 | Produção | Backend NestJS (instância 2) |
| `5000` | AI Service | Ambos | Serviço Flask de rotas |

### Infraestrutura

| Porta | Serviço | Descrição |
|-------|---------|-----------|
| `3306` | HAProxy | Load balancer do banco de dados |
| `3307` | DB-1 | MariaDB Galera (nó 1) |
| `3308` | DB-2 | MariaDB Galera (nó 2) |
| `3309` | DB-3 | MariaDB Galera (nó 3) |
| `9000` | MinIO API | API de armazenamento S3 |
| `9001` | MinIO Console | Console web do MinIO |
| `8025` | MailHog UI | Interface de emails (dev) |
| `1025` | MailHog SMTP | Servidor SMTP (dev) |
| `3200` | Old API | API legada Spring Boot (temporária) |

## 📊 Arquitetura de Rede

```
                    ┌─────────────────┐
                    │   Nginx :80     │
                    │  (Load Balancer)│
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐         ┌────▼────┐        ┌────▼────┐
    │ Web 1/2 │         │ API 1/2 │        │   AI    │
    │:3001/:3002│       │:3101/:3102│      │  :5000  │
    └─────────┘         └────┬────┘        └─────────┘
                             │
                        ┌────▼────┐
                        │ HAProxy │
                        │  :3306  │
                        └────┬────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐         ┌────▼────┐        ┌────▼────┐
    │  DB-1   │◄───────►│  DB-2   │◄──────►│  DB-3   │
    │ :3307   │         │ :3308   │        │ :3309   │
    └─────────┘         └─────────┘        └─────────┘
         Galera Cluster (Replicação Síncrona)
```

## 🔐 Variáveis de Ambiente

### Banco de Dados (MariaDB)
```env
MARIADB_ROOT_PASSWORD=***
MARIADB_DATABASE=wot_db
MARIADB_USER=wot_user
MARIADB_PASSWORD=***
```

### Backend (NestJS)
```env
JWT_SECRET=***
JWT_EXPIRATION=5m
JWT_REFRESH_EXPIRATION=30d
FRONTEND_URL=http://localhost
```

### AI Service (Flask/Python)
```env
AI_PORT=5000
AI_WORKERS=4
AI_SERVICE_AREA=Lisbon, Portugal
AI_NETWORK_TYPE=walk
AI_WALKING_SPEED_MPS=1.3
AI_LOG_LEVEL=INFO
```

### Armazenamento (MinIO)
```env
MINIO_ROOT_USER=minio_user
MINIO_ROOT_PASSWORD=***
```

## 🚀 Como Executar

### Produção
```bash
docker-compose up -d
```

**Serviços iniciados:**
- Nginx (80)
- Web 1 e 2 (load balanced)
- API 1 e 2 (load balanced)
- AI Service (único)
- Cluster Galera (3 nós)
- HAProxy (DB load balancer)
- MinIO
- MailHog

### Desenvolvimento
```bash
docker-compose -f docker-compose.dev.yml up
```

**Diferenças do ambiente de desenvolvimento:**
- Hot-reload habilitado (volumes bindados)
- Logs mais verbosos
- Apenas 1 instância de cada serviço web/api
- AI em modo DEBUG

### Apenas AI Service
```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up ai

# Produção
docker-compose up -d ai
```

## 🧪 Health Checks

Todos os serviços possuem health checks configurados:

```bash
# Gateway
curl http://localhost/health

# API
curl http://localhost/api/health

# AI Service
curl http://localhost/ai/health
# ou direto
curl http://localhost:5000/health

# MinIO
curl http://localhost:9000/minio/health/live
```

## 📝 Logs

### Ver logs de todos os serviços
```bash
docker-compose logs -f
```

### Ver logs de um serviço específico
```bash
docker-compose logs -f ai
docker-compose logs -f nginx
docker-compose logs -f api-1
```

## 🛠️ Troubleshooting

### Porta já em uso
```bash
# Verificar processo usando a porta
lsof -i :80
lsof -i :5000

# Parar serviços
docker-compose down
```

### Resetar volumes
```bash
docker-compose down -v
```

### Rebuild de imagens
```bash
docker-compose build --no-cache
docker-compose up -d
```

## 📚 Documentação Adicional

- **API Backend**: Ver `apps/api/README.md`
- **Frontend Web**: Ver `apps/web/README.md`
- **AI Service**: Ver `apps/ai/README.md`
- **Banco de Dados**: Ver `db/README.md`

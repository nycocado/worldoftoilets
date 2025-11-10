.PHONY: help build build-dev up up-dev down logs test clean install lock update format lint

help:
	@echo "Route Calculator Service - Makefile"
	@echo ""
	@echo "📦 Gerenciamento de Dependências:"
	@echo "  make install    - Instala dependências com Poetry"
	@echo "  make lock       - Gera/atualiza poetry.lock"
	@echo "  make update     - Atualiza dependências"
	@echo "  make add PKG=x  - Adiciona nova dependência"
	@echo ""
	@echo "🐳 Docker:"
	@echo "  make build      - Constrói imagem de produção"
	@echo "  make build-dev  - Constrói imagem de desenvolvimento"
	@echo "  make up         - Inicia serviço (produção)"
	@echo "  make up-dev     - Inicia serviço (desenvolvimento)"
	@echo "  make down       - Para serviço"
	@echo "  make logs       - Visualiza logs"
	@echo ""
	@echo "🧪 Testes e Qualidade:"
	@echo "  make test       - Executa testes"
	@echo "  make format     - Formata código com Black"
	@echo "  make lint       - Verifica código com Flake8"
	@echo "  make health     - Verifica saúde do serviço"
	@echo "  make test-route - Testa cálculo de rota"
	@echo ""
	@echo "🧹 Limpeza:"
	@echo "  make clean      - Remove volumes e cache"
	@echo ""

# Dependency management
install:
	poetry install

lock:
	poetry lock

update:
	poetry update

add:
	poetry add $(PKG)

# Docker
build:
	cd ../.. && docker-compose build ai

build-dev:
	cd ../.. && docker-compose -f docker-compose.dev.yml build ai

up:
	cd ../.. && docker-compose up -d ai

up-dev:
	cd ../.. && docker-compose -f docker-compose.dev.yml up ai

down:
	cd ../.. && docker-compose stop ai

logs:
	cd ../.. && docker-compose logs -f ai

# Testing and quality
test:
	poetry run pytest

format:
	poetry run black src/

lint:
	poetry run flake8 src/

health:
	@curl -s http://localhost:5000/health | python3 -m json.tool

test-route:
	@echo "Testando rota em Lisboa..."
	@curl -s "http://localhost:5000/38.7072,-9.1365/38.7139,-9.1334/" | python3 -m json.tool

# Local development
run-local:
	poetry run python -m src.app

shell:
	poetry shell

# Cleanup
clean:
	cd ../.. && docker-compose down -v ai
	rm -rf .pytest_cache .coverage htmlcov/
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

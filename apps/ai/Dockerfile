FROM python:3.11-slim

LABEL maintainer="World of Toilets Team"
LABEL description="Route Calculator Service - Production"

ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONPATH=/app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgeos-dev \
    libspatialindex-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Poetry
RUN pip install --no-cache-dir poetry==1.7.1

# Copy dependency files
COPY pyproject.toml poetry.lock* ./

# Configure poetry to not create virtual env and install dependencies
RUN poetry config virtualenvs.create false && \
    poetry install --only main --no-interaction --no-ansi

COPY . .

RUN mkdir -p /app/cache /app/data

RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

CMD ["sh", "-c", "python3 preload_graph.py && exec gunicorn --bind ${HOST:-0.0.0.0}:${PORT:-5000} --workers ${WORKERS:-1} --timeout ${REQUEST_TIMEOUT:-120} --access-logfile - --error-logfile - --log-level ${LOG_LEVEL:-info} 'src.app:app'"]

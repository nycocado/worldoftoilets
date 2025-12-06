#!/bin/bash
set -e

# Gera o código gRPC se não existir
if [ ! -f "src/grpc_generated/route_pb2.py" ]; then
    echo "Gerando código gRPC..."
    mkdir -p src/grpc_generated
    python -m grpc_tools.protoc \
        -I. \
        --python_out=src/grpc_generated \
        --grpc_python_out=src/grpc_generated \
        --pyi_out=src/grpc_generated \
        route.proto

    # Corrige o import no arquivo gerado para usar import relativo
    sed -i 's/^import route_pb2 as route__pb2$/from . import route_pb2 as route__pb2/' src/grpc_generated/route_pb2_grpc.py

    echo "Código gRPC gerado com sucesso!"
fi

# Executa o comando passado como argumento
exec "$@"

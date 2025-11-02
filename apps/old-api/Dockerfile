FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copiar arquivos de configuração do Maven
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Build da aplicação
RUN mvn clean package -DskipTests

# Estágio final
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar JAR compilado
COPY --from=build /app/target/*.jar app.jar

# Comando para executar
ENTRYPOINT ["java", "-jar", "app.jar"]

# Documentação do Backend - Tool Hub

Este documento detalha o backend da aplicação **Tool Hub**, desenvolvido com **Spring Boot**. Ele fornece a API RESTful segura e robusta consumida pelo frontend, gerenciando autenticação, usuários e lógica de negócios das ferramentas.

## 🚀 Visão Geral

O backend é construído em Java utilizando o framework Spring Boot. Ele utiliza PostgreSQL como banco de dados relacional e implementa segurança via JWT (JSON Web Tokens). A arquitetura segue os padrões de camadas (Controller, Service, Repository).

## 🛠️ Stack Tecnológico

As principais tecnologias e bibliotecas utilizadas são:

-   **Linguagem**: [Java 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
-   **Framework**: [Spring Boot 3.2.5](https://spring.io/projects/spring-boot)
-   **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/)
-   **Persistência**: [Spring Data JPA](https://spring.io/projects/spring-data-jpa) (Hibernate)
-   **Segurança**: [Spring Security](https://spring.io/projects/spring-security) & [JJWT](https://github.com/jwtk/jjwt)
-   **Utilitários**: [Lombok](https://projectlombok.org/) (Redução de boilerplate)
-   **Gerenciamento de Dependências**: [Maven](https://maven.apache.org/)

## 📋 Pré-requisitos

Certifique-se de ter instalado:

-   **Java JDK 17** ou superior.
-   **Maven**: Para build e gerenciamento de dependências.
-   **PostgreSQL**: Instância rodando localmente ou via Docker.

## ⚙️ Configuração e Instalação

1.  **Navegue até o diretório do backend:**

    ```bash
    cd tool-hub
    ```

2.  **Configuração do Banco de Dados:**

    O arquivo `src/main/resources/application.properties` (ou variáveis de ambiente) deve apontar para seu banco de dados. Exemplo de configuração padrão via variáveis de ambiente (compatível com Docker):

    ```properties
    spring.datasource.url=jdbc:postgresql://${POSTGRES_HOST:localhost}:5432/${POSTGRES_DB:tool_hub}
    spring.datasource.username=${POSTGRES_USER:postgres}
    spring.datasource.password=${POSTGRES_PASSWORD:postgres}
    ```

3.  **Compilar o Projeto:**

    ```bash
    ./mvnw clean install
    ```

## ▶️ Executando a Aplicação

Para iniciar o servidor Spring Boot:

```bash
./mvnw spring-boot:run
```

O servidor iniciará por padrão na porta **8080**.

## 📂 Estrutura do Projeto

A estrutura de pacotes segue o padrão Java/Spring:

```
src/main/java/com/ferramentas/toolhub/
├── config/          # Configurações (Security, CORS, Swagger)
├── controllers/     # Controladores REST (Endpoints)
├── dto/             # Data Transfer Objects (Request/Response)
├── models/          # Entidades JPA (Banco de Dados)
├── repositories/    # Interfaces de acesso a dados (JPA Repository)
├── services/        # Regras de negócio
└── utils/           # Classes utilitárias
```

## 🔒 Segurança e Autenticação

-   **JWT**: A autenticação é stateless. O cliente deve enviar o token no header `Authorization: Bearer <token>` em requisições protegidas.
-   **Roles**: O sistema suporta perfis de usuário (ex: ADMIN, USER) para controle de acesso a endpoints específicos.

## 🧪 Testes

Para executar os testes unitários e de integração:

```bash
./mvnw test
```

## 🤝 Contribuição

Para contribuir com o backend:

1.  Certifique-se de seguir as convenções de código do projeto.
2.  Crie testes para novas funcionalidades.
3.  Abra um Pull Request detalhando as alterações na API ou lógica de negócio.

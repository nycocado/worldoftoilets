# Padrão de Documentação JSDoc para o Projeto

## 1. Objetivo

Este documento define o padrão de documentação de código (JSDoc) a ser utilizado neste projeto. O objetivo é manter a documentação **clara, consistente e útil**.

## 2. Regras Gerais

- **Idioma**: A documentação deve ser escrita em português.
- **Tipagem**: **Especifique sempre os tipos** no JSDoc para clareza e consistência, utilizando o formato `{type}`.
- **Clareza**: Use frases curtas e diretas.

## 3. Padrões por Componente

### 3.1. Controllers (`*.controller.ts`)

- **Classe**: Uma linha descrevendo a responsabilidade do controller.

    ```typescript
    /**
     * Gerencia as requisições HTTP para operações relacionadas a [funcionalidade].
     */
    export class FeatureController { /* ... */ }
    ```

- **Métodos (Endpoints)**: Descreve a ação, parâmetros, retorno e exceções de negócio.

    ```typescript
    /**
     * Busca um item específico pelo seu ID.
     *
     * @param {string} id O identificador único do item.
     * @returns {Promise<Item>} O item encontrado.
     * @throws {NotFoundException} Se o item não for encontrado.
     */
    @Get(':id')
    public findOne(@Param('id') id: string): Promise<Item> { /* ... */ }
    ```

### 3.2. Services (`*.service.ts`) e Use-Cases (`*.use-case.ts`)

- **Classe**: Uma linha descrevendo a responsabilidade do serviço ou caso de uso.

    ```typescript
    /**
     * Contém a lógica de negócio para as operações de [funcionalidade].
     */
    ```

- **Métodos Públicos**: Descreve a regra de negócio, parâmetros, retorno e exceções.

    ```typescript
    /**
     * Processa o pagamento de um pedido.
     *
     * @param {string} orderId O ID do pedido a ser processado.
     * @param {PaymentDto} paymentData Os dados do pagamento.
     * @returns {Promise<TransactionStatus>} O status da transação.
     * @throws {InsufficientFundsException} Se o saldo for insuficiente.
     */
    public async processPayment(orderId: string, paymentData: PaymentDto): Promise<TransactionStatus> { /* ... */ }
    ```

### 3.3. Repositories (`*.repository.ts`)

- **Classe**: Descreve a entidade que o repositório gerencia.

    ```typescript
    /**
     * Gerencia o acesso e a persistência de dados para a entidade [NomeDaEntidade].
     */
    ```

- **Métodos**: Descreve a operação de banco de dados.

    ```typescript
    /**
     * Busca um usuário pelo seu endereço de e-mail.
     *
     * @param {string} email O e-mail do usuário.
     * @returns {Promise<User | null>} A entidade do usuário ou `null` se não for encontrado.
     */
    public async findByEmail(email: string): Promise<User | null> { /* ... */ }
    ```

### 3.4. DTOs (`*.dto.ts`)

- **Classe**: Uma linha identificando o propósito do DTO.

    ```typescript
    /**
     * DTO para a operação de criação de um novo usuário.
     */
    ```

- **Propriedades**: **NÃO use JSDoc.** A documentação deve vir exclusivamente do decorador `@ApiProperty()`.

    ```typescript
    // CORRETO
    @IsString()
    @ApiProperty({ description: 'O nome completo do usuário.', example: 'João da Silva' })
    public readonly fullName: string;
    ```

### 3.5. Modules (`*.module.ts`)

- **Classe**: Uma linha descrevendo a responsabilidade do módulo.

    ```typescript
    /**
     * Gerencia a funcionalidade de [nome do módulo], agrupando seus componentes.
     */
    export class FeatureModule { /* ... */ }
    ```

### 3.6. Decoradores Customizados (Swagger)

Estes arquivos centralizam a documentação de um endpoint da API. A padronização vem da **convenção**, não de comentários JSDoc.

#### **1. Nomenclatura**

- **Arquivo**: Deve descrever a operação em `kebab-case`, com o sufixo `.swagger.ts`.
  - `get-comments-by-toilet.swagger.ts`
- **Função**: Deve descrever a operação em `PascalCase`, com o prefixo `ApiSwagger`.
  - `ApiSwaggerGetCommentsByToilet`

#### **2. Estrutura do Arquivo**

Cada arquivo deve exportar uma única função que utiliza `applyDecorators` para agrupar os seguintes decoradores do Swagger:

- `ApiOperation`:
  - `summary`: Um título curto para a operação.
  - `description`: Uma explicação mais detalhada do que o endpoint faz.
- `ApiParam` / `ApiQuery` / `ApiBody`:
  - Use `ApiParam` para parâmetros de rota (e.g., `:id`).
  - A documentação de `Query` e `Body` é feita nos DTOs através do `@ApiProperty`, então `ApiQuery` e `ApiBody` raramente são necessários aqui.
- **Respostas de Sucesso**:
  - Use `ApiOkResponse` (200), `ApiCreatedResponse` (201), etc.
  - Sempre especifique a `description` e o `type` (o DTO de resposta).
- **Respostas de Erro**:
  - Documente todos os erros de negócio e de autenticação possíveis.
  - Use `ApiNotFoundResponse` (404), `ApiBadRequestResponse` (400), `ApiUnauthorizedResponse` (401), `ApiForbiddenResponse` (403), etc.
  - Sempre especifique a `description`.

#### **3. Exemplo Completo**

```typescript
// Arquivo: get-comments-by-toilet.swagger.ts

import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CommentResponseDto } from '@modules/comment/dto';

// SEM JSDoc aqui!
export const ApiSwaggerGetCommentsByToilet = (): MethodDecorator =>
  applyDecorators(
    // 1. Operação
    ApiOperation({
      summary: 'Listar comentários de um sanitário',
      description: 'Lista comentários visíveis de um sanitário específico, com paginação.',
    }),

    // 2. Parâmetros de rota
    ApiParam({
      name: 'publicId',
      description: 'Identificador público do sanitário',
      type: 'string',
      format: 'uuid',
    }),

    // 3. Resposta de sucesso
    ApiOkResponse({
      description: 'Lista de comentários retornada com sucesso.',
      type: [CommentResponseDto],
    }),

    // 4. Respostas de erro
    ApiUnauthorizedResponse({
      description: 'Acesso não autorizado. Requer token JWT.',
    }),
    ApiForbiddenResponse({
      description: 'Acesso negado. Permissão VIEW_COMMENTS necessária.',
    }),
    ApiNotFoundResponse({
      description: 'Sanitário não encontrado.',
    }),
  );
```

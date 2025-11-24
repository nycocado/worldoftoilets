# Padrão de Documentação JSDoc para o Projeto

## 1. Objetivo

Este documento define o padrão de documentação de código (JSDoc) a ser utilizado neste projeto. O objetivo é manter a documentação **clara, consistente e útil**.

## 2. Regras Gerais

- **Idioma**: A documentação deve ser escrita em português.
- **Tipagem**: **Especifique sempre os tipos** no JSDoc para clareza e consistência, utilizando o formato `{type}`.
- **Clareza**: Use frases curtas e diretas. Evite o uso de exemplos (e.g., `ex:`). A descrição deve ser autoexplicativa.

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
- **Função**: Deve descrever a operação em `PascalCase`, com o prefixo `ApiSwagger`.

#### **2. Estrutura do Arquivo**

Cada arquivo deve exportar uma única função que utiliza `applyDecorators` para agrupar os seguintes decoradores do Swagger:

- `ApiOperation`:
  - `summary`: Um título curto para a operação.
  - `description`: Uma explicação mais detalhada do que o endpoint faz.
- `ApiParam` / `ApiQuery` / `ApiBody`: A documentação é feita nos DTOs.
- **Respostas de Sucesso**: `ApiOkResponse`, `ApiCreatedResponse`, etc.
- **Respostas de Erro**: `ApiNotFoundResponse`, `ApiBadRequestResponse`, etc.

### 3.7. Entidades (`*.entity.ts`)

Para manter a legibilidade, a documentação de entidades deve focar em explicar o **propósito de negócio** de cada campo, evitando repetir informações que já estão explícitas nos decoradores ou tipos.

#### **1. Classe da Entidade**

- **Descrição**: Um resumo de uma linha sobre o papel da entidade no sistema. A tag `@table` pode ser usada para mapear a entidade à sua tabela.

    ```typescript
    /**
     * Armazena um comentário de um utilizador sobre uma casa de banho.
     * @table comment
     */
    @Entity({ tableName: 'comment' })
    export class CommentEntity { /* ... */ }
    ```

#### **2. Propriedades (Colunas e Relações)**

- **Descrição**: Use um bloco de comentário simples `/** ... */` que descreva o campo em termos de negócio. **Não use tags JSDoc** (`@type`, `@nullable`, etc.) nem exemplos.

    ```typescript
    /**
     * Identificador público (UUID) para partilha externa através da API.
     */
    @Unique()
    @Property()
    publicId!: string;

    /**
     * A interação que originou este comentário.
     */
    @OneToOne(() => InteractionEntity)
    interaction!: InteractionEntity;
    ```

#### **3. Getters e Enums**

- Descreva o propósito com um comentário curto e direto.

    ```typescript
    /**
     * Estados de visibilidade de um comentário.
     */
    export enum CommentState {
      /** Visível para todos. */
      VISIBLE = 'visible',
      /** Oculto por moderação ou pelo autor. */
      HIDDEN = 'hidden',
    }
    ```

# Sanitary UI - Design System
>
> Design System for World of Toilets (Android & Web)

## 1. Identidade

A identidade visual **"Fresh & Clean"** combina a confiança do azul com a vitalidade do verde. O uso de **gradientes** (Blue-Green) é a assinatura da marca, mas o layout geral prioriza o **minimalismo** e a **clareza da informação**.

## 2. Paleta de Cores (Color Tokens)

As cores estão definidas em `app/src/main/java/com/worldoftoilets/app/ui/theme/Color.kt`.

| Token           | Hex       | Nome          | Uso                                                                            |
| :-------------- | :-------- | :------------ | :----------------------------------------------------------------------------- |
| **Primary**     | `#00A3FF` | Electric Blue | Ações principais, Links, Marca, Distâncias, Estrelas (Rating).                 |
| **Secondary**   | `#00D084` | Fresh Green   | Sucesso, Elementos de natureza, Ações de confirmação.                          |
| **Accent**      | `#FFB020` | Golden Sun    | Alertas.                                                                       |
| **Error**       | `#FF4D4F` | Alert Red     | Erros e Denúncias.                                                             |
| **Background**  | `#F4F7F6` | Crisp White   | Fundo das telas (leve tom frio).                                               |
| **Surface**     | `#FFFFFF` | Pure White    | Cards e Containers padrão.                                                     |
| **Surface Low** | `#F8FAFB` | Soft Gray     | Usado em `BottomSheet` e fundos de listas secundárias (`surfaceContainerLow`). |
| **Outline**     | `#BDBDBD` | Gray Medium   | Bordas de inputs e cards (Light Mode).                                         |
| **Text**        | `#1F1F1F` | Deep Black    | Texto principal.                                                               |

### Gradients

* **Sanitary Gradient**: `Brush.horizontalGradient(colors = listOf(ElectricBlue, FreshGreen))`
  * Uso: `SanitaryButton`, `FloatingActionButton`, Headers de destaque.

## 3. Tipografia (Type Tokens)

**Font Family:** `Montserrat` (Sans-serif).
Definido em `app/src/main/java/com/worldoftoilets/app/ui/theme/Type.kt`.

* **Titles:** Bold / SemiBold.
* **Body:** Medium / Regular.

## 4. Formas e Bordas (Shapes)

Definido em `app/src/main/java/com/worldoftoilets/app/ui/theme/Shape.kt`.

* **Card Shape**: `MaterialTheme.shapes.medium` (16dp).
* **Button Shape**: `MaterialTheme.shapes.medium` (16dp).
* **Input Shape**: `MaterialTheme.shapes.medium` (16dp) e `OutlinedTextField`.
* **Bordas**:
  * Cards: `BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)`.
  * Inputs: `1dp` solid gray.

## 5. Padrões de UI (UI Patterns)

### Cards (Reference: `LocationCard.kt`)

* **Container**: `Card`
* **Colors**:
  * `containerColor`: `MaterialTheme.colorScheme.surfaceContainerLowest` (White).
  * `contentColor`: `MaterialTheme.colorScheme.onSurface`.
* **Border**: `BorderStroke(2.dp, Color.LightGray)`.
* **Elevation**: `CardDefaults.cardElevation(2.dp)`.
* **Padding**: Interno generoso (`20.dp` horizontal, `15.dp` vertical).

### Comentários e Respostas (Reference: `CommentToilet.kt`, `ReplyItem.kt`)

* **Estilo**: Cards limpos com borda sutil (`outlineVariant`).
* **Hierarquia**: Respostas são indentadas e agrupadas dentro do card do comentário pai.
* **Ações**: Dropdown menu para Editar/Deletar (autor) ou Denunciar (outros).
* **Paginação**: Botão "Load More" textual e discreto (`TextButton`).

### Avaliação (Reference: `RatingScreen.kt`)

* **Estilo**: Formulário limpo com `OutlinedTextField` para comentários (opcionais).
* **Items**: Critérios (Limpeza, Estrutura) com Labels (`Medium`) e Estrelas (`32dp`).
* **Feedback**: Uso de `SecondaryContainer` (Verde suave) e `ErrorContainer` (Vermelho suave) para telas de confirmação.

### Telas (Reference: `ToiletDetailScreen.kt`)

* **Background**: `Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)` (que deve mapear para `#F4F7F6`).
* **Spacing**: `Arrangement.spacedBy(16.dp)` para elementos verticais principais.
* **Headers**: Título (`headlineMedium`, Bold) + Rating (`Stars`) + Tipo de Acesso.
* **Actions**: Botões em `Row` com `Arrangement.spacedBy(8.dp)`.
  * Botões secundários (Report, Back) usam `MaterialTheme.colorScheme.tertiaryContainer`.

### Botões

* **Primary**: `SanitaryButton` (Gradient ou Solid Electric Blue).
* **Secondary/Tertiary**: `tertiaryContainer` (Fundo amarelo claro/creme) para ações contextuais (Reportar, Voltar).
* **Ghost/Text**: Apenas texto colorido (Links).

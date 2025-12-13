# World of Toilets - Relatório Intermédio

![IADE LOGO PNG](documents/logo/iade-logo.png)

**Universidade:** [Universidade Europeia](https://www.europeia.pt/)  
**Faculdade:** [IADE - Faculdade de Design, Tecnologia e Comunicação](https://www.iade.europeia.pt/)  
**Repositório:** [worldoftoilets](https://github.com/nycocado/worldoftoilets)  
**Curso:** Engenharia Informática  
**Semestre:** 2025/2026 - Quinto Semestre

## Índice

- [World of Toilets - Relatório Intermédio](#world-of-toilets---relatório-intermédio)
  - [Índice](#índice)
  - [Elementos da Equipa](#elementos-da-equipa)
  - [Versões do Relatório](#versões-do-relatório)
    - [Proposta Inicial](#proposta-inicial)
    - [Relatório Intermédio](#relatório-intermédio)
    - [Relatório Final](#relatório-final)
  - [Palavras-Chave](#palavras-chave)
  - [Descrição](#descrição)
  - [Como Executar o Projeto](#como-executar-o-projeto)
    - [Pré-requisitos](#pré-requisitos)
    - [Instalação](#instalação)
    - [Modos de Execução](#modos-de-execução)
      - [1. Modo Desenvolvimento (Dev)](#1-modo-desenvolvimento-dev)
      - [2. Modo Produção (Prod)](#2-modo-produção-prod)
  - [Motivação](#motivação)
  - [Público-Alvo](#público-alvo)
  - [Pesquisa de Mercado](#pesquisa-de-mercado)
    - [Where is the Toilet](#where-is-the-toilet)
    - [Berlin Toilet](#berlin-toilet)
    - [Flush - Toilet Finder](#flush---toilet-finder)
    - [Where is Public Toilet](#where-is-public-toilet)
  - [Proposta de Valor](#proposta-de-valor)
  - [Personas](#personas)
    - [Matilde Homão](#matilde-homão)
    - [David Barção](#david-barção)
    - [Maria Cunha](#maria-cunha)
    - [André Costa](#andré-costa)
  - [Enquadramento das Unidades Curriculares](#enquadramento-das-unidades-curriculares)
    - [Engenharia de Software](#engenharia-de-software)
    - [Inteligência Artificial](#inteligência-artificial)
      - [Algoritmo Implementado: A\*](#algoritmo-implementado-a)
      - [Justificação da Escolha](#justificação-da-escolha)
      - [Implementação Técnica](#implementação-técnica)
      - [Integração com o Sistema](#integração-com-o-sistema)
      - [Resultados dos Testes](#resultados-dos-testes)
      - [Discussão sobre Eficácia](#discussão-sobre-eficácia)
      - [Visualização de Resultados](#visualização-de-resultados)
    - [Segurança Informática](#segurança-informática)
      - [Autenticação e Autorização](#autenticação-e-autorização)
      - [Proteção de Dados](#proteção-de-dados)
      - [Validação e Sanitização](#validação-e-sanitização)
      - [Funcionalidades de Segurança](#funcionalidades-de-segurança)
      - [Gestão e Boas Práticas](#gestão-e-boas-práticas)
      - [Implementações Necessárias no Futuro](#implementações-necessárias-no-futuro)
    - [Sistemas Distribuídos](#sistemas-distribuídos)
  - [Requisitos Técnicos](#requisitos-técnicos)
    - [Requisitos Funcionais Herdados (Think Toilet)](#requisitos-funcionais-herdados-think-toilet)
    - [Requisitos Funcionais Novos (World of Toilets)](#requisitos-funcionais-novos-world-of-toilets)
    - [Requisitos Não Funcionais Herdados (Think Toilet)](#requisitos-não-funcionais-herdados-think-toilet)
    - [Requisitos Não Funcionais Novos (World of Toilets)](#requisitos-não-funcionais-novos-world-of-toilets)
  - [Arquitetura da Solução](#arquitetura-da-solução)
    - [Camada de Apresentação (Clientes)](#camada-de-apresentação-clientes)
    - [Camada de Load Balancing e Distribuição](#camada-de-load-balancing-e-distribuição)
    - [Camada de Aplicação](#camada-de-aplicação)
    - [Camada de Dados e Serviços Auxiliares](#camada-de-dados-e-serviços-auxiliares)
    - [Fluxos de Comunicação](#fluxos-de-comunicação)
    - [Estratégia de Tolerância a Faltas](#estratégia-de-tolerância-a-faltas)
  - [Tecnologias](#tecnologias)
    - [Infraestrutura e Orquestração](#infraestrutura-e-orquestração)
    - [Camada de Dados](#camada-de-dados)
    - [Desenvolvimento Back-End](#desenvolvimento-back-end)
    - [Desenvolvimento Front-End (Web)](#desenvolvimento-front-end-web)
    - [Desenvolvimento Mobile](#desenvolvimento-mobile)
    - [Serviços Auxiliares](#serviços-auxiliares)
    - [Ferramentas de Desenvolvimento](#ferramentas-de-desenvolvimento)
    - [Monitorização e Health Checks](#monitorização-e-health-checks)
  - [Plano de Trabalho](#plano-de-trabalho)
  - [Conclusão](#conclusão)
  - [Anexos](#anexos)
  - [Bibliografia](#bibliografia)

## Elementos da Equipa

- [Nycolas Souza](https://github.com/nycocado) - 20230989
- [Luan Ribeiro](https://github.com/Ninjaok) - 20230692
- [Lohanne Guedes](https://github.com/Lohannecristina) - 20220085
- [Kira Sousa](https://github.com/Kira-Sousa) - 20231205

## Versões do Relatório

### Proposta Inicial

- [PDF](deliveries/milestone-1/milestone-1-report.pdf)

### Relatório Intermédio

- [PDF](deliveries/milestone-2/milestone-2-report.pdf)

### Relatório Final

- [PDF](deliveries/milestone-3/milestone-3-report.pdf)

## Palavras-Chave

Localizador; Avaliação; Sanitários; Casa de banho; Público; Privada; Busca; Próximas; Aplicação; Mobile; Web; Guia; Navegação; Google Maps; Encontrar; Rotas; Busca; Mapa; Interativo; App; Recomendação; Inteligência Artificial; Sugestão; Crowdsourcing;

## Descrição

O [World of Toilets](https://github.com/nycocado/worldoftoilets) é uma aplicação móvel Android que resolve o problema quotidiano de localizar casas de banho limpas e acessíveis em áreas urbanas. Desenvolvida como projeto multidisciplinar de Engenharia Informática, a solução integra inteligência artificial (algoritmo A\* para rotas otimizadas), arquitetura distribuída tolerante a faltas (cluster MariaDB Galera, load balancers NGINX/HAProxy), e medidas robustas de segurança (autenticação JWT, RBAC, encriptação bcrypt).

A aplicação permite aos utilizadores pesquisar casas de banho próximas através de filtros específicos (fraldário, acessibilidade, preço), avaliar instalações com critérios detalhados, e contribuir com sugestões para a comunidade. A infraestrutura backend garante alta disponibilidade através de replicação de serviços (2 instâncias de API, 2 front-ends, 3 nós de base de dados), enquanto o microsserviço de IA calcula rotas a pé em tempo real com 100% de taxa de sucesso nos testes realizados.

Desenvolvido em Kotlin com Jetpack Compose (mobile), NestJS/TypeScript (backend), Next.js (dashboard web) e Flask (IA), o projeto demonstra a aplicação prática de conceitos de Engenharia de Software, Sistemas Distribuídos, Inteligência Artificial e Segurança Informática numa solução coesa e funcional.

## Como Executar o Projeto

Este projeto foi desenhado para ser agnóstico ao sistema operativo, correndo inteiramente sobre contentores.

### Pré-requisitos

- **[Node.js](https://nodejs.org/)** (npm)
- **[Docker](https://www.docker.com/)** com **Docker Compose V2**

### Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/nycocado/worldoftoilets.git
    cd worldoftoilets
    ```

2. Instale as dependências de desenvolvimento (para os scripts de automação):

    ```bash
    npm install
    ```

### Modos de Execução

Utilizamos scripts npm para simplificar os comandos do Docker Compose. Existem dois ambientes configurados:

#### 1\. Modo Desenvolvimento (Dev)

Sobe apenas as instâncias essenciais (1 API, 1 Frontend, 1 DB) com **Hot Reload** ativo.

- **Iniciar:** `npm run docker:dev:up` (Logs no terminal)
- **Iniciar em Background:** `npm run docker:dev:up:bg`
- **Parar e Limpar:** `npm run docker:dev:down`
- **Rebuildar:** `npm run docker:dev:rebuild`

#### 2\. Modo Produção (Prod)

Simula a infraestrutura real com **Réplicas e Alta Disponibilidade** (2 APIs, 2 Frontends, Cluster Galera 3 nós, Load Balancers).

- **Iniciar:** `npm run docker:prod:up`
- **Iniciar em Background:** `npm run docker:prod:up:bg`
- **Parar e Limpar:** `npm run docker:prod:down`
- **Rebuildar:** `npm run docker:prod:rebuild`

## Motivação

O [World of Toilets](https://github.com/nycocado/worldoftoilets) é uma versão aprimorada de um projeto criado em setembro de 2024, chamado [Think Toilet](https://github.com/nycocado/think-toilet). Essa nova versão expande a proposta inicial, trazendo melhorias focadas no backend, otimizando a infraestrutura, reduzindo custos operacionais e melhorando a relação com a comunidade, além de tornar o sistema mais estável e escalável. A sua conceção foi inspirada por movimentos e tendências que destacaram a importância da higiene e do acesso a casas de banho públicas de qualidade nos últimos anos.

Um desses movimentos foi o ["Spreadshit"](https://exame.com/pop/spreadshit-planilha-avalia-banheiros-empresas), um evento viral em 2022 que popularizou reviews humorísticas de casas de banho. A pandemia de COVID-19, que levou ao fechamento de muitas casas de banho públicas, fez com que encontrar uma casa de banho acessível se tornasse um desafio.

Com o fechamento de estabelecimentos e preocupações sobre a limpeza das casas de banho disponíveis, as pessoas começaram a compartilhar suas experiências online, formando uma comunidade disposta a ajudar na busca por opções mais seguras e limpas.

Além disso, muitos sistemas de busca de casas de banho não são atualizados, complicando a vida dos usuários. Com isso, percebemos a necessidade de uma solução prática e eficaz. Portanto, queremos desenvolver uma aplicação que ajude as pessoas a encontrar casas de banho limpas e acessíveis, permitindo também a avaliação e sugestão de novos locais, criando uma base de dados mais confiável e útil.

**Objetivos:**

- Facilitar a busca de casas de banho limpas e próximas.
- Permitir um ambiente saudável para o desenvolvimento da comunidade.
- Avaliação e feedback contínuos.
- Integração com mapas e navegação.

## Público-Alvo

O público-alvo da aplicação [World of Toilets](https://github.com/nycocado/worldoftoilets) inclui:

- Trabalhadores em trânsito, como motoristas, entregadores e motoristas de camião, que frequentemente necessitam de acesso a casas de banho durante o trabalho.
- Turistas e viajantes estão explorando novas áreas e precisam localizar sanitários próximos.
- Pessoas com necessidades de acessibilidade, que buscam informações sobre instalações adaptadas.
- Profissionais que trabalham em campo, como trabalhadores da construção civil e eletricistas, podem não ter acesso a instalações adequadas durante o dia de trabalho.

## Pesquisa de Mercado

A nossa pesquisa sobre aplicações para busca de casas de banho foi um dos principais motivos para a escolha do tema do projeto. A maioria deles apresenta uma interface deficiente e poucas funções úteis além da localização dos sanitários.

### [Where is the Toilet](https://play.google.com/store/apps/details?id=com.whereisthetoilet)

A aplicação funciona como um localizador de casas de banho, permitindo avaliações e a criação de novas.

- **Pontos Positivos:** Interface limpa, sem informações desnecessárias, facilitando a navegação.
- **Pontos Negativos:** Poucas casas de banho disponíveis. Apesar de parecer italiana, não encontramos opções na Itália. O sistema de busca é pouco intuitivo e o mapa não atualiza automaticamente, sendo necessário clicar para mostrar as casas de banho próximas.
- **Melhorias Implementadas:** Automatização do mapa, mostrando as casas de banho próximas sem a necessidade de clicar.

### [Berlin Toilet](https://play.google.com/store/apps/details?id=com.berlintoilet)

É uma aplicação para localização de casas de banho, utilizando o Google Maps para indicar direções e permitindo avaliações categóricas.

- **Pontos Positivos:** Sistema de localização intuitivo, permite saber se o estabelecimento é pago e oferece acessibilidade.
- **Pontos Negativos:** Interface fraca, não permite comentários sobre as casas de banho e as notas dos utilizadores não aparecem de forma imediata.
- **Melhorias Implementadas:** Exibir a média de notas dos utilizadores no ecrã inicial para facilitar a escolha, permitir comentários e melhorar a interface.

### [Flush - Toilet Finder](https://play.google.com/store/apps/details?id=toilet.samruston.com.toilet)

Aplicação de localização de casas de banho.

- **Pontos Positivos:** Localiza rapidamente casas de banho no mapa, indicando se são pagos, acessíveis ou trancados. Permite criar casas de banho e reportar problemas.
- **Pontos Negativos:** Falta filtragem nas criações, avaliações e comentários não aparecem, não mostra as casas de banho mais próximas e não permite traçar rotas.
- **Melhorias Implementadas:** Exibir avaliações e comentários, mostrar as mais próximas e permitir rotas.

### [Where is Public Toilet](https://play.google.com/store/apps/details?id=com.bfranca.toilets)

Aplicação para localizar casas de banho públicas, com informações úteis como avaliações e acessibilidade.

- **Pontos Positivos:** Lista de casas de banho por distância, com avaliações, horários de funcionamento, favoritos e compartilhamento. Mostra pins no mapa e oferece rotas.
- **Pontos Negativos:** Necessita baixar a base de dados a cada instalação, o que é demorado. Não possui comentários e a interface é confusa e pouco intuitiva.
- **Melhorias Implementadas:** Simplificar a interface, permitir comentários e avaliações, e facilitar a navegação.

## Proposta de Valor

O World of Toilets diferencia-se como a primeira aplicação colaborativa que combina geolocalização inteligente, avaliações detalhadas de utilizadores e filtros específicos (limpeza, acessibilidade, estrutura, fraldário) para encontrar a casa de banho ideal em segundos.

Enquanto as aplicações analisadas na pesquisa de mercado oferecem funcionalidades isoladas, algumas com boa localização mas sem sistema de comentários, outras com avaliações mas interface confusa, o World of Toilets integra:

- Algoritmo A\* para cálculo de rotas otimizadas a pé
- Sistema de avaliação multi-critério (não apenas nota geral)
- Filtros avançados por necessidades específicas
- Moderação ativa da comunidade
- Arquitetura distribuída para alta disponibilidade

Esta combinação única de funcionalidades técnicas e foco na experiência do utilizador posiciona o World of Toilets como a solução mais completa e confiável do mercado para localização de casas de banho.

## Personas

### Matilde Homão

- **Idade:** 21 anos.
- **Sexo:** Feminino.
- **Ocupação:** Motorista de Aplicação e Estudante.
- **Descrição:** Matilde é uma jovem motorista de aplicação que enfrenta diversos desafios no seu dia a dia, como deslocar-se por diferentes locais e gerir a rotina entre o trabalho e os estudos numa universidade de prestígio.
- **Objetivo:** Devido à natureza dinâmica do seu trabalho como motorista de aplicação, Matilde precisa localizar de forma rápida e eficiente casas de banho de qualidade em diferentes regiões.
- **Frustrações:** Dificuldade em encontrar casas de banho em locais desconhecidos ou remotos.

### David Barção

- **Idade:** 20 anos.
- **Sexo:** Masculino.
- **Ocupação:** Turista e Empreendedor.
- **Descrição:** David é um jovem empreendedor em busca de autoconhecimento, decidido a explorar o mundo após desenvolver uma carreira de sucesso. Viajar é a sua forma de se conectar consigo mesmo e com diferentes culturas.
- **Objetivo:** David procura rotas mais eficientes para explorar novos países e, durante as suas viagens, precisa localizar casas de banho confortáveis e acessíveis em diferentes regiões.
- **Frustrações:** Devido às suas constantes viagens, David frequentemente desconhece as características e comodidades das regiões onde irá pernoitar. Por isso, sente a necessidade de uma aplicação que facilite a localização de casas de banho confortáveis e próximas.

### Maria Cunha

- **Idade:** 39 anos.
- **Sexo:** Feminino.
- **Ocupação:** Jornalista, Dentista e Gestante.
- **Descrição:** Maria cuida de um bebé de 8 meses e enfrenta os desafios de uma rotina intensa. Para lidar com as necessidades do seu filho, precisa estar sempre preparada para trocar fraldas e oferecer cuidados adequados, mesmo em locais fora de casa.
- **Objetivo:** Localizar rapidamente casas de banho equipadas com fraldários que atendam a altos padrões de limpeza e conforto.
- **Frustrações:** Devido à sua rotina corrida, Maria encontra dificuldades em encontrar casas de banho adequadas e bem equipadas para cuidar do seu bebé, o que adiciona estresse à sua jornada diária.

### André Costa

- **Idade:** 23 anos.
- **Sexo:** Masculino.
- **Ocupação:** Suporte de Técnico.
- **Descrição:** André Costa, formado em Harvard, destaca-se pela forte base em gestão e inovação. Entusiasmado pelo setor tecnológico, decidiu orientar a carreira para a administração de plataformas digitais. Investiu o seu tempo no desenvolvimento de uma plataforma focada na modernização de casas de banho.
- **Objetivo:** O objetivo de André na plataforma é garantir a sua evolução contínua, implementando soluções inovadoras que otimizem a gestão e utilização das casas de banho.
- **Frustrações:** Enfrenta desafios quando a plataforma não responde como esperado ou quando limitações técnicas atrasam melhorias importantes.

## Enquadramento das Unidades Curriculares

### Engenharia de Software

Aplicamos princípios de Engenharia de Software na estruturação do projeto, desde a definição de requisitos até à implementação. O sistema foi modelado com UML (casos de uso, diagramas de sequência e atividades), seguindo metodologia ágil com sprints semanais, backlog e entregas incrementais. Utilizamos Git com branching strategy e mantemos documentação atualizada para garantir rastreabilidade e manutenção eficiente.

### Inteligência Artificial

A componente de IA implementa o algoritmo A\* para cálculo de rotas otimizadas a pé entre o utilizador e as casas de banho. Utiliza dados do OpenStreetMap processados via OSMnx, construindo um grafo de ruas de Lisboa. O microsserviço comunica com a API principal através de gRPC. Nos testes, optou-se por grafos simplificados que removem nós intermediários, oferecendo melhor desempenho (2s vs 8s de carregamento) mas comprometendo ligeiramente a precisão.

#### Algoritmo Implementado: A*

O algoritmo A\* foi escolhido para o cálculo de rotas por se tratar de um algoritmo de procura informada ideal para problemas de navegação em grafos com custos bem definidos. O A\* combina o custo real acumulado desde o ponto de origem com uma estimativa heurística da distância até ao destino:

*f(n) \= g(n) \+ h(n)*

Onde:

- **g(n):** custo real acumulado desde o nó inicial até o nó atual (distância percorrida)
- **h(n):** estimativa heurística do custo do nó atual até o destino (distância em linha reta)
- **f(n):** custo total estimado do caminho passando pelo nó

#### Justificação da Escolha

A escolha do A\* em detrimento de outras técnicas de IA lecionadas fundamenta-se na natureza do problema:

- O cálculo de rotas é essencialmente um problema de procura em grafos com estados bem definidos, custos conhecidos e informação espacial disponível
- Necessita de solução ótima em tempo real
- Algoritmos como CSP são mais adequados para problemas com restrições complexas (alocação de recursos, horários)
- MDP é mais indicado para ambientes com incerteza e decisões sequenciais
- No nosso caso, o grafo é determinístico e estático, tornando o A* a escolha natural

#### Implementação Técnica

**Heurística:**

- Utiliza distância euclidiana em coordenadas projetadas (UTM)
- Garante admissibilidade: a distância em linha reta nunca superestima a distância real
- Otimizada com cache pré-computado para todos os nós (acesso O(1))

**Custo das Arestas:**

- Baseado na distância física em metros de cada segmento de rua
- Dados extraídos diretamente do OpenStreetMap
- Acesso otimizado via cache O(1)

**Otimizações Implementadas:**

- Persistência do grafo em formato pickle (evita re-download do OSM a cada execução)
- Cache de custos das arestas para acesso instantâneo
- Cache de coordenadas projetadas para cálculo rápido da heurística
- Simplificação do grafo para redução de nós e melhoria de performance

#### Integração com o Sistema

O microsserviço de IA comunica com o backend principal via **gRPC**, um protocolo de comunicação binário mais eficiente que o REST. Ao receber coordenadas de origem e destino, o serviço válida se as coordenadas estão dentro da área de serviço (Lisboa), identifica os nós mais próximos no grafo, executa o algoritmo A\*calcula estatísticas (distância total, tempo estimado, nós explorados) e retorna o resultado ao backend.

![Diagrama de Integração](deliveries/milestone-3/diagrams/ia-integration/ia-integration.png)

#### Resultados dos Testes

Os testes da componente de IA foram executados sobre o microsserviço de rotas para validar o correto funcionamento do algoritmo e medir a performance do sistema. O grafo de Lisboa carregado contém 199.016 nós e 558.024 arestas (versão não simplificada utilizada para referência).

**Validação de Entrada:**

| Teste                   | Entrada                          | Resultado Esperado   | Resultado Obtido                   | Status |
| ----------------------- | -------------------------------- | -------------------- | ---------------------------------- | :----: |
| Formato inválido        | /abc,def/38.7223,-9.1393         | Erro 400             | Erro 400 \- INVALID\_FORMAT        |   ✓    |
| Coordenadas incompletas | /38.7223/38.7169,-9.1333         | Erro 400             | Erro 400 \- INVALID\_FORMAT        |   ✓    |
| Origem fora de Lisboa   | /40.4168,-3.7038/38.7223,-9.1393 | Erro área de serviço | Erro 400 \- OUT\_OF\_SERVICE\_AREA |   ✓    |
| Destino fora de Lisboa  | /38.7223,-9.1393/41.1579,-8.6291 | Erro área de serviço | Erro 400 \- OUT\_OF\_SERVICE\_AREA |   ✓    |

**Casos Extremos:**

| Teste                   | Distância | Nós Explorados | Tempo Resposta | Observação                  |
| ----------------------- | :-------: | :------------: | :------------: | --------------------------- |
| Origem \= Destino       |   0.0m    |       1        |     1.85s      | Comportamento correto       |
| Coordenadas no rio      |    \-     |       \-       |       \-       | Rejeitado como fora da área |
| Rota muito longa (26km) |  26.227m  |     28.898     |     0.59s      | Completou sem timeout       |

**Performance e Escalabilidade:**

| Teste            | Distância | Nós Explorados | Tempo Resposta | Nós/km |
| ---------------- | :-------: | :------------: | :------------: | :----: |
| Rota curta       |  360.76m  |       25       |     1.74s      |   69   |
| Rota média       |  2.097m   |     1.065      |     1.72s      |  508   |
| Rota longa       |  6.874m   |     5.916      |     1.74s      |  861   |
| Rota muito longa |  8.521m   |     11.311     |     1.79s      | 1.328  |

**Métricas Agregadas:**

- Tempo médio de resposta: 1.75 segundos  
- Tempo máximo de resposta: 1.79 segundos  
- Média de nós explorados por km: 691  
- Taxa de sucesso: 100% (12/12 testes)

#### Discussão sobre Eficácia

Os resultados demonstram que o algoritmo A\* é altamente eficaz para o contexto do World of Toilets. O tempo médio de resposta de 1.75 segundos é adequado para aplicações móveis, onde tempos inferiores a 2-3 segundos são considerados aceitáveis. A taxa de sucesso de 100% confirma a robustez da implementação em todos os cenários testados.

A eficiência é evidenciada pelo número reduzido de nós explorados: mesmo em rotas longas de 8.5km, apenas 11.311 nós foram explorados (5.7% do grafo total de 199.016 nós). A escolha por grafos simplificados revelou-se acertada, com carregamento 4x mais rápido em troca de pequenas variações de precisão que não comprometem a navegabilidade para utilizadores a pé.

#### Visualização de Resultados

Para ilustrar o funcionamento do algoritmo A\*, são apresentadas visualizações de rotas calculadas sobre o grafo de Lisboa. Estas visualizações demonstram o caminho encontrado (em destaque) e os nós explorados durante a procura, permitindo observar a eficiência da heurística em guiar o algoritmo até ao destino.

![Exemplo de Rota 1](deliveries/milestone-3/examples/rote-example/rote-example-1.jpg)
![Exemplo de Rota 2](deliveries/milestone-3/examples/rote-example/rote-example-2.jpg)
![Exemplo de Rota 3](deliveries/milestone-3/examples/rote-example/rote-example-3.jpg)

### Segurança Informática

A componente de Segurança Informática inclui autenticação JWT, controlo de acesso baseado em roles (RBAC), proteção de dados com bcrypt, validação de inputs e proteção contra vulnerabilidades comuns. O sistema implementa mecanismos de autenticação e autorização, gestão segura de credenciais e sessões, além de funcionalidades como verificação de email e recuperação de password.

#### Autenticação e Autorização

O sistema utiliza JWT através da biblioteca @nestjs/jwt. Os tokens dividem-se em access tokens (5 minutos de validade, contêm identificador do utilizador e roles) e refresh tokens (30 dias, armazenados na base de dados com possibilidade de invalidação). O fluxo de autenticação suporta login, refresh automático e logout individual ou em todos os dispositivos, com deteção de reutilização suspeita de tokens.

O controle de acesso implementa 82 permissões organizadas hierarquicamente, com roles diferenciados para utilizadores normais e administradores. Guards reutilizáveis aplicados via decoradores protegem endpoints específicos, verificando permissões a nível individual.

#### Proteção de Dados

As passwords são protegidas com bcrypt (12 salt rounds), algoritmo que gera salt único por password e resiste a ataques de rainbow table. A política exige entre 8 e 64 caracteres. O sistema implementa soft deletes para auditoria, mantendo histórico de utilizadores desativados e tokens invalidados sem remoção física imediata.

#### Validação e Sanitização

O ValidationPipe global do NestJS trabalha em conjunto com class-validator para validação declarativa de DTOs. O ORM MikroORM utiliza prepared statements, mitigando SQL injection. A sanitização automática de inputs previne XSS sem armazenamento de HTML.

O sistema implementa sanitização de imagens através de validação de magic bytes, que analisa a estrutura real do ficheiro em vez de confiar na extensão. Todas as imagens são re-codificadas, removendo metadados EXIF e destruindo possíveis payloads maliciosos embebidos. A proteção contra decompression bombs limita dimensões e tamanho de ficheiro, enquanto apenas formatos seguros (JPEG, PNG, WebP) são aceites, rejeitando SVG que poderia conter scripts.

O sistema implementa proteção CSRF através do double token pattern com a biblioteca csrf-csrf (v4.0.3), gerando tokens de uso único.

#### Funcionalidades de Segurança

A verificação de email utiliza tokens UUID com expiração de 24 horas, enquanto a recuperação de password emprega tokens temporários de uso único válidos por 1 hora. Ambos invalidam-se após utilização. Os tokens armazenam-se em cookies httpOnly com flags secure e sameSite=strict.

#### Gestão e Boas Práticas

Variáveis de ambiente armazenam segredos (JWT secret, passwords de BD), excluídos do controle de versões. Transações atômicas via decorador @Transactional() garantem integridade em operações críticas como registo de utilizadores. A limpeza automática remove tokens expirados via cron jobs.

O sistema utiliza conteinerização via Docker, proporcionando isolamento entre serviços e reduzindo a superfície de ataque. Cada componente (APIs, front-ends, base de dados, microsserviço de IA) executa em contêineres isolados com recursos limitados, impedindo que uma potencial vulnerabilidade num serviço comprometa todo o sistema. A orquestração com Docker Compose gere dependências e comunicação entre containers através de redes internas dedicadas.

#### Implementações Necessárias no Futuro

Por operar localmente em desenvolvimento, alguns componentes de segurança não foram implementados. A biblioteca @nestjs/throttler está instalada mas não configurada globalmente para rate limiting. As comunicações ocorrem via HTTP sem TLS/SSL. Headers de segurança como CSP, X-Frame-Options e HSTS estão ausentes pela falta do Helmet.js. A configuração CORS permite todas as origens em desenvolvimento, requerendo whitelist explícita antes de produção.

### Sistemas Distribuídos

O sistema foi desenhado com alta disponibilidade através de replicação de serviços: duas instâncias das APIs (NestJS), duas instâncias dos front-ends (NextJS) e um cluster MariaDB Galera com três nós em replicação síncrona multi-master. O tráfego é distribuído pelo NGINX (load balancer HTTP) e HAProxy (load balancer de base de dados), ambos com health checks automáticos para detecção e remoção de instâncias com problemas, garantindo tolerância a faltas e continuidade do serviço. A comunicação entre as APIs e o microsserviço de IA é realizada através de gRPC, protocolo de comunicação binária de alto desempenho.

## Requisitos Técnicos

### Requisitos Funcionais Herdados (Think Toilet)

- Os utilizadores devem poder pesquisar casas de banho próximas através de um mapa interativo.
- Os utilizadores devem poder visualizar detalhes das casas de banho, incluindo avaliações e média de classificações.
- Os utilizadores devem poder avaliar casas de banho com notas e comentários sobre limpeza, acessibilidade, disponibilidade de papel e estrutura.
- Os utilizadores devem poder consultar o seu histórico de avaliações.
- Os utilizadores devem registar-se e autenticar-se para interagir com a comunidade.
- Os utilizadores devem poder denunciar locais ou comentários inadequados.

### Requisitos Funcionais Novos (World of Toilets)

- Os utilizadores devem poder filtrar casas de banho por necessidades específicas (acessibilidade, fraldário, preço, etc.).
- Os utilizadores devem poder sugerir novas casas de banho para aprovação.
- Os utilizadores devem poder responder a comentários principais (sem respostas em cadeia).
- Os utilizadores devem receber verificação de email no registo e poder recuperar password.
- Os administradores devem poder gerir denúncias, sugestões e utilizadores através de dashboard web.
- O sistema deve calcular e apresentar rotas otimizadas a pé até às casas de banho.
- Os utilizadores devem poder denunciar outros utilizadores por comportamento inadequado.

### Requisitos Não Funcionais Herdados (Think Toilet)

- A interface deve ser intuitiva e responsiva.
- O sistema deve permitir moderação de conteúdo por administradores.
- A aplicação móvel deve ser compatível com Android 9 (API Level 28\) ou superior.
- A aplicação móvel deve ser desenvolvida em Kotlin com Jetpack Compose.
- Dados sensíveis dos utilizadores devem ser encriptados antes do armazenamento.
- Integração com MapLibre para visualização de mapas.

### Requisitos Não Funcionais Novos (World of Toilets)

- O sistema deve suportar múltiplas instâncias de cada serviço para evitar ponto único de falha.
- A base de dados deve ser replicada para garantir disponibilidade e integridade dos dados.
- O sistema deve implementar balanceamento de carga entre as instâncias.
- Os serviços devem ser monitorizados com health checks automáticos.
- A autenticação deve utilizar JWT com tokens de acesso e refresh tokens.
- As APIs devem ser construídas com TypeScript e NestJS seguindo arquitetura RESTful.
- O front-end web deve ser desenvolvido com TypeScript, React e Next.js.
- O armazenamento de ficheiros deve ser feito através de serviço de object storage (MinIO).
- O cálculo de rotas deve ser efetuado por microsserviço dedicado com algoritmo A-.
- Os administradores devem ter diferentes níveis de permissões configuráveis.

## Arquitetura da Solução

A arquitetura do sistema [World of Toilets](https://github.com/nycocado/worldoftoilets) foi desenhada seguindo princípios de alta disponibilidade, escalabilidade horizontal e tolerância a faltas. O diagrama de arquitetura apresenta todos os componentes e as suas interações através de diferentes protocolos de comunicação.

![Diagrama da Arquitetura da Solução](deliveries/milestone-3/diagrams/solution-architecture/solution-architecture.png)

### Camada de Apresentação (Clientes)

No topo direito do diagrama encontram-se os pontos de entrada do sistema:

- **Mobile:** Aplicação Android desenvolvida em Kotlin com Jetpack Compose, que comunica diretamente com o MinIO (bucket) via HTTP para obtenção de imagens, e com o Load Balancer NGINX para acesso às APIs.
- **Cliente Web:** Interface web que acede ao sistema através do Load Balancer NGINX, podendo comunicar tanto com os front-ends (NextJS) como com as APIs e o serviço de armazenamento.

### Camada de Load Balancing e Distribuição

O sistema implementa dois níveis de balanceamento de carga, visíveis no centro do diagrama:

- **NGINX (Load Balancer Principal):** Localizado no lado direito do diagrama, atua como ponto de entrada único para todo o tráfego HTTP. Distribui as requisições entre:
  - Front-End 1 e Front-End 2 (NextJS) \- para conteúdo web
  - API 1 e API 2 (NestJS) \- para operações de dados
- **HAProxy (Load Balancer de Base de Dados):** Representado no centro-esquerda do diagrama, gere as conexões TCP com o Galera Cluster, distribuindo operações de leitura/escrita entre as três instâncias de MariaDB.

### Camada de Aplicação

A camada de aplicação é composta por múltiplas instâncias replicadas:

- **API 1 e API 2 (NestJS):** Duas instâncias idênticas da API REST, visíveis no centro do diagrama. Comunicam via TCP com o HAProxy para operações de base de dados, via HTTP com o MinIO para gestão de ficheiros, e via SMTP com o MailHog para envio de emails. Esta replicação elimina o ponto único de falha na camada de serviços.
- **Front-End 1 e Front-End 2 (NextJS):** Duas instâncias do servidor web, localizadas no canto inferior direito. Servem o dashboard de administração e a landing page, comunicando com as APIs via HTTP através do NGINX.
- **Microsserviço de Rotas (Flask):** Componente dedicado à Inteligência Artificial, posicionado no centro-direita do diagrama. Implementa o algoritmo A\* para cálculo de rotas otimizadas, comunicando via gRPC com as APIs.

### Camada de Dados e Serviços Auxiliares

No lado esquerdo e inferior do diagrama encontram-se os serviços de persistência:

- **Galera Cluster:** Cluster de três nós MariaDB (DB 1, DB 2, DB 3), representado no canto inferior esquerdo. Implementa replicação síncrona multi-master, garantindo consistência e disponibilidade dos dados. Cada nó mantém uma cópia completa da base de dados e pode aceitar operações de leitura e escrita.
- **MinIO (Bucket):** Serviço de armazenamento de objetos compatível com S3, localizado no topo central do diagrama. Armazena imagens e ficheiros estáticos, sendo acedido diretamente pelos clientes mobile e web via HTTP, bem como pelas APIs.
- **MailHog (Serviço de Email):** Servidor SMTP fictício para ambiente de desenvolvimento, posicionado no canto inferior central. Recebe emails das APIs via protocolo SMTP para funcionalidades como verificação de conta e recuperação de password.

### Fluxos de Comunicação

O diagrama ilustra claramente os protocolos utilizados em cada comunicação:

- **HTTP req/res:** Comunicação REST entre clientes, load balancers, APIs e serviços.
- **TCP req/res:** Conexões de base de dados entre APIs e HAProxy.
- **SMTP delivery:** Entrega de emails das APIs para o MailHog.
- **read/write:** Operações de dados entre HAProxy e os nós do Galera Cluster.
- **gRPC:** Comunicação binária de alto desempenho entre APIs e microsserviço de IA (Flask).

### Estratégia de Tolerância a Faltas

A arquitetura garante disponibilidade através de:

1. **Replicação de Serviços:** Duas instâncias de cada componente crítico (APIs e Front-Ends).
2. **Cluster de Base de Dados:** Três nós MariaDB em configuração Galera, tolerando falhas.
3. **Health Checks:** Monitorização contínua de todos os serviços com reinício automático.
4. **Load Balancing Inteligente:** NGINX e HAProxy distribuem carga e removem instâncias com problemas do pool ativo.

## Tecnologias

A escolha das tecnologias foi orientada pelos requisitos de escalabilidade, alta disponibilidade e tolerância a faltas definidos para o projeto. Cada componente da arquitetura utiliza tecnologias específicas que se integram de forma coesa.

### Infraestrutura e Orquestração

- **Docker & Docker Compose:** Toda a infraestrutura é conteinerizada, permitindo isolamento de serviços, portabilidade e facilidade de deployment. O Docker Compose orquestra 15+ containers em ambiente de desenvolvimento e produção.
- **NGINX (Load Balancer Principal):** Servidor web e reverse proxy que atua como ponto de entrada único do sistema, distribuindo tráfego HTTP entre as instâncias replicadas dos front-ends, APIs e MinIO.
- **HAProxy (Load Balancer de Base de Dados):** Balanceador de carga especializado em conexões TCP, responsável por distribuir queries SQL entre os três nós do cluster MariaDB Galera.

### Camada de Dados

- **MariaDB Galera Cluster:** Sistema de base de dados relacional em configuração multi-master com replicação síncrona. O cluster é composto por 3 nós que garantem consistência forte e tolerância à falha de até um nó. Utiliza a imagem bitnamilegacy/mariadb-galera.
- **MinIO:** Servidor de armazenamento de objetos compatível com Amazon S3. Utilizado para persistência de imagens e ficheiros estáticos (fotos de casas de banho, avatares de utilizadores). Oferece API HTTP para acesso direto pelos clientes.

### Desenvolvimento Back-End

- **NestJS (TypeScript):** Framework Node.js para construção das APIs REST. Duas instâncias idênticas (API 1 e API 2\) garantem redundância. Responsável pela lógica de negócio, autenticação JWT, validação de dados e comunicação com a base de dados.
- **Flask (Python):** Microframework utilizado exclusivamente para o microsserviço de Inteligência Artificial. Implementa o algoritmo A\* para cálculo de rotas otimizadas, utilizando a biblioteca OSMnx para dados do OpenStreetMap para manipulação de grafos.

### Desenvolvimento Front-End (Web)

- **Next.js (TypeScript/React):** Framework React com renderização server-side. Duas instâncias replicadas servem o dashboard de administração e a landing page. Oferece otimização automática, roteamento e Server Side Rendering (SSR).
- **Tailwind CSS:** Framework CSS utility-first para estilização rápida e responsiva. Utilizado para criar layouts consistentes nas interfaces web do dashboard e landing page.
- **MapLibre GL JS:** Biblioteca open-source para renderização de mapas interativos, utilizada para visualização de casas de banho e rotas no dashboard web.

### Desenvolvimento Mobile

- **Kotlin:** Linguagem principal para desenvolvimento Android, oferecendo null-safety e interoperabilidade com Java.
- **Jetpack Compose:** Toolkit moderno e declarativo para construção de interfaces nativas Android, permitindo desenvolvimento mais rápido e código mais legível.
- **Android SDK 28+:** Suporte mínimo para Android 9.0 (Pie), garantindo compatibilidade com a maioria dos dispositivos em uso.
- **MapLibre Native:** Biblioteca para renderização de mapas vetoriais nativos em Android, utilizada para exibição interativa de casas de banho e visualização de rotas na aplicação móvel.

### Serviços Auxiliares

- **MailHog:** Servidor SMTP fictício para ambiente de desenvolvimento. Captura emails enviados pelas APIs (verificação de conta, recuperação de password) sem necessidade de configuração de servidor de email real. Interface web disponível na porta 8025\.

### Ferramentas de Desenvolvimento

- **Git & GitHub:** Controlo de versões e colaboração, com branching strategy e code reviews.
- **Figma:** Prototipagem e design de interfaces de utilizador.
- **Discord:** Comunicação interna da equipa de desenvolvimento.

### Monitorização e Health Checks

Todos os serviços implementam endpoints `/health` monitorizados pelo Docker com intervalos configuráveis:

- **NGINX:** verificação a cada 10 segundos.
- **APIs (NestJS):** verificação a cada 10 segundos.
- **Front-ends (NextJS):** verificação a cada 10 segundos.
- **MinIO:** verificação a cada 10 segundos.
- **Base de Dados (MariaDB Galera):** verificação a cada 15 segundos.
- **HAProxy:** verificação a cada 15 segundos.
- **Microsserviço IA (Flask):** verificação a cada 30 segundos com timeout estendido de 60s e período inicial de 120s devido ao tempo de carregamento do grafo OSM.

## Plano de Trabalho

O desenvolvimento do projeto está organizado em 8 sprints, desde a conceptualização inicial até à entrega final. A tabela seguinte detalha o foco principal e os entregáveis chave de cada sprint:

| Sprint |    Período     | Foco Principal             | Entregáveis Chave                            |
| :----: | :------------: | -------------------------- | -------------------------------------------- |
|   0    | 28/09 \- 19/10 | Análise & Conceptualização | Proposta, Requisitos, Arquitetura            |
|   1    | 20/10 \- 26/10 | Setup Infraestrutura       | Docker, Base de Dados, Wireframes            |
|   2    | 27/10 \- 02/11 | Sistemas Distribuídos & BD | NGINX, Replicação, Scripts BD, Auth JWT      |
|   3    | 03/11 \- 09/11 | IA & API Core              | Algoritmo A\*, Endpoints Toilets/Reviews     |
|   4    | 10/11 \- 16/11 | Integração IA & API        | Microsserviço Flask, Testes                  |
|   5    | 17/11 \- 23/11 | Frontend Web & Mobile      | Landing Page, Dashboard, App Kotlin (início) |
|   6    | 24/11 \- 30/11 | Integração Completa        | App Mobile, Rotas IA, Testes E2E             |
|   7    | 01/12 \- 15/12 | Refinamento & Entrega      | Segurança, Documentação, Vídeo               |

## Conclusão

O desenvolvimento do [World of Toilets](https://github.com/nycocado/worldoftoilets) alcançou os seus objetivos centrais ao criar uma aplicação funcional que integra com sucesso componentes de Engenharia de Software, Inteligência Artificial, Sistemas Distribuídos e Segurança Informática. A aplicação móvel Android em Kotlin com Jetpack Compose comunica com uma infraestrutura backend distribuída que garante alta disponibilidade através de replicação de serviços e um cluster MariaDB Galera com três nós.

O algoritmo A\* implementado no microsserviço de rotas consegue calcular percursos otimizados em tempo real com tempos de resposta médios de 1.75 segundos, demonstrando a eficácia das heurísticas escolhidas. A componente de segurança implementa autenticação JWT robusta, controlo de acesso baseado em cargos com 82 permissões hierárquicas, e proteção de dados através de bcrypt e validação rigorosa de inputs.

A arquitetura distribuída com load balancers NGINX e HAProxy, combinada com health checks automáticos, elimina pontos únicos de falha e garante continuidade do serviço mesmo em cenários de falhas parciais.

O processo de desenvolvimento não foi isento de desafios técnicos e organizacionais. A configuração inicial do cluster MariaDB Galera revelou-se mais complexa que o antecipado, exigindo estudo aprofundado sobre sincronização e gestão de split-brain scenarios. Os testes iniciais do algoritmo A\* com o grafo completo de Lisboa resultaram em tempos de carregamento inaceitáveis, forçando a adopção de grafos simplificados que equilibram performance e precisão.

Do ponto de vista organizacional, a ausência de uma ferramenta centralizada de gestão de projeto dificultou o acompanhamento de tarefas e prazos, gerando ocasionais falhas de comunicação entre a equipa. A falta de validação inicial das disponibilidades individuais resultou em desalinhamento nas entregas e sobrecarga pontual de alguns membros, evidenciando a importância de uma matriz de responsabilidades clara e realista desde o início do projeto.

Alguns objetivos secundários não foram atingidos dentro do prazo estabelecido. A funcionalidade de registo e verificação de parceiros empresariais, que permitiria a estabelecimentos obter selos de verificação oficial e gerir directamente os seus perfis, ficou por implementar devido a restrições temporais. Funcionalidades como gamificação, notificações push e dashboards analíticos foram despriorizadas face aos requisitos fundamentais do sistema.

O projeto estabelece uma base sólida para desenvolvimentos futuros, incluindo expansão geográfica automática, algoritmos de Machine Learning para recomendações personalizadas, integração com APIs de transportes públicos e desenvolvimento de uma versão iOS nativa. A componente colaborativa da aplicação cria um efeito de rede onde o valor aumenta com o número de utilizadores ativos, posicionando o World of Toilets como uma plataforma comunitária que pode genuinamente melhorar a qualidade de vida urbana.

A experiência de integrar conhecimentos multidisciplinares numa solução coesa, equilibrando requisitos técnicos com prazos realistas e coordenando trabalho em equipa, proporcionou competências fundamentais que transcendem o âmbito específico deste projecto e nos preparam para os desafios da prática profissional da Engenharia Informática.

## Anexos

- [Relatório de Engenharia de Software (use cases, diagramas UML, testes, gestão)](deliveries/milestone-3/milestone-3-es-report.pdf)
- [Relatório de Design de Interfaces Gráficas (casos de uso, protótipos Figma, wireframes, personas, arquitetura da informação, fluxos de navegação)](deliveries/milestone-3/milestone-3-dig-report.pdf)
- [Manual do Utilizador (guia de utilização da aplicação móvel e dashboard web)](deliveries/milestone-3/milestone-3-guide.pdf)
- [Sprint Reports (0-7)](reports)
- [Relatório da Primeira Milestone (proposta inicial, 3 guiões de teste, personas, mockups/wireframes, requisitos, modelo de domínio, componente IA)](deliveries/milestone-1/milestone-1-report.pdf)
- [Relatório da Segunda Milestone (arquitetura inicial, diagramas UML, estrutura de dados, protótipos Figma, primeiros testes IA)](deliveries/milestone-2/milestone-2-report.pdf)

## Bibliografia

- [World of Toilets Repository. (2025). GitHub.](https://github.com/nycocado/worldoftoilets)
- [Think Toilet Repository. (2024). GitHub.](https://github.com/nycocado/think-toilet)
- [Kotlin Programming Language. (2024). JetBrains.](https://kotlinlang.org/)
- [Jetpack Compose. (2024). Android Developers.](https://developer.android.com/jetpack/compose)
- [MinIO Object Storage. (2024). MinIO Inc.](https://min.io/)
- [NGINX. (2024). F5 Networks.](https://nginx.org/)
- [Next.js. (2024). Vercel.](https://nextjs.org/)
- [NestJS. (2024). NestJS.](https://nestjs.com/)
- [Docker. (2024). Docker Inc.](https://www.docker.com/)
- [Docker Compose. (2024). Docker Documentation.](https://docs.docker.com/compose/)
- [HAProxy. (2024). HAProxy Technologies.](https://www.haproxy.org/)
- [MariaDB Galera Cluster. (2024). Bitnami.](https://hub.docker.com/r/bitnami/mariadb-galera)
- [Amazon S3. (2024). Amazon Web Services.](https://aws.amazon.com/s3/)
- [Flask. (2024). Pallets Projects.](https://flask.palletsprojects.com/)
- [OSMnx. (2024). Geoff Boeing.](https://osmnx.readthedocs.io/)
- [MapLibre. (2024). MapLibre Community.](https://maplibre.org/)
- [Tailwind CSS. (2024). Tailwind Labs.](https://tailwindcss.com/)
- [MailHog. (2024). Ian Kent.](https://github.com/mailhog/MailHog)
- [JSON Web Tokens (JWT). (2024). Auth0.](https://jwt.io/)
- [bcrypt. (2024). OpenBSD.](https://en.wikipedia.org/wiki/Bcrypt)
- [Git. (2024). Git SCM.](https://git-scm.com/)
- [GitHub. (2024). Microsoft.](https://github.com/)
- [Figma. (2024). Figma Inc.](https://www.figma.com/)
- [Discord. (2024). Discord Inc.](https://discord.com/)
- [Where is the Toilet. (2024). Google Play Store.](https://play.google.com/store/apps/details?id=com.iisrl.toilet.star.toilet_star)
- [Berlin Toilet. (2024). Google Play Store.](https://play.google.com/store/apps/details?id=com.futurice.berlintoiletapp)
- [Flush - Toilet Finder. (2024). Google Play Store.](https://play.google.com/store/apps/details?id=toilet.samruston.com.toilet)
- [Where is Public Toilet. (2024). Google Play Store.](https://play.google.com/store/apps/details?id=sfcapital.publictoiletinsouthaustralia)
- [Boeing, G. (2017). OSMnx: New Methods for Acquiring, Constructing, Analyzing, and Visualizing Complex Street Networks. Computers, Environment and Urban Systems, 65, 126-139.](https://doi.org/10.1016/j.compenvurbsys.2017.05.004)
- Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach (4th ed.). Pearson. \[Algoritmo A*\]
- Sommerville, I. (2016). Software Engineering (10th ed.). Pearson Education. \[Metodologias Ágeis e UML\]

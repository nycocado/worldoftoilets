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
  - [Palavras-Chave](#palavras-chave)
  - [Descrição](#descrição)
  - [Motivação](#motivação)
  - [Público-Alvo](#público-alvo)
  - [Pesquisa de Mercado](#pesquisa-de-mercado)
    - [Where is the Toilet](#where-is-the-toilet)
    - [Berlin Toilet](#berlin-toilet)
    - [Flush - Toilet Finder](#flush---toilet-finder)
    - [Where is Public Toilet](#where-is-public-toilet)
  - [Personas](#personas)
    - [Matilde Homão](#matilde-homão)
    - [David Barção](#david-barção)
    - [Maria Cunha](#maria-cunha)
    - [André Costa](#andré-costa)
  - [Casos de Uso](#casos-de-uso)
    - [Localizar a melhor casa de banho próxima](#localizar-a-melhor-casa-de-banho-próxima)
    - [Denunciar comentário da casa de banho](#denunciar-comentário-da-casa-de-banho)
    - [Pesquisar casa de banho específica](#pesquisar-casa-de-banho-específica)
    - [Avaliar e registar denúncia de comentário](#avaliar-e-registar-denúncia-de-comentário)
  - [Diagramas de Sequência](#diagramas-de-sequência)
    - [Diagrama 1 - Visualizar Casas de Banho Próximas](#diagrama-1---visualizar-casas-de-banho-próximas)
    - [Diagrama 2 - Denunciar Comentário e Gestão de Denúncias](#diagrama-2---denunciar-comentário-e-gestão-de-denúncias)
  - [Descrição da Solução](#descrição-da-solução)
  - [Enquadramento das Unidades Curriculares](#enquadramento-das-unidades-curriculares)
    - [Engenharia de Software](#engenharia-de-software)
    - [Inteligência Artificial](#inteligência-artificial)
    - [Segurança Informática](#segurança-informática)
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
  - [Estrutura de Dados](#estrutura-de-dados)
  - [Diagrama de Classes](#diagrama-de-classes)
  - [Tecnologias](#tecnologias)
    - [Infraestrutura e Orquestração](#infraestrutura-e-orquestração)
    - [Camada de Dados](#camada-de-dados)
    - [Desenvolvimento Back-End](#desenvolvimento-back-end)
    - [Desenvolvimento Front-End (Web)](#desenvolvimento-front-end-web)
    - [Desenvolvimento Mobile](#desenvolvimento-mobile)
    - [Serviços Auxiliares](#serviços-auxiliares)
    - [Segurança e Autenticação](#segurança-e-autenticação)
    - [Ferramentas de Desenvolvimento](#ferramentas-de-desenvolvimento)
    - [Monitorização e Health Checks](#monitorização-e-health-checks)
  - [Protótipos de Interface](#protótipos-de-interface)
    - [Aplicação Móvel - Sugestão de Casa de Banho](#aplicação-móvel---sugestão-de-casa-de-banho)
    - [Dashboard de Administração - Gestão de Utilizadores](#dashboard-de-administração---gestão-de-utilizadores)
    - [Dashboard de Administração - Gestão de Denúncias de Comentários](#dashboard-de-administração---gestão-de-denúncias-de-comentários)
    - [Dashboard de Administração - Gestão de Casas de Banho](#dashboard-de-administração---gestão-de-casas-de-banho)
    - [Dashboard de Administração - Gestão de Permissões](#dashboard-de-administração---gestão-de-permissões)
  - [Plano de Trabalho](#plano-de-trabalho)
  - [Plano de Testes](#plano-de-testes)
    - [Testes da Componente de IA](#testes-da-componente-de-ia)
    - [Resultados dos Testes da Componente de IA](#resultados-dos-testes-da-componente-de-ia)
  - [Conclusão](#conclusão)
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

## Palavras-Chave

Localizador; Avaliação; Sanitários; Casa de banho; Público; Privada; Busca; Próximas; Aplicação; Mobile; Web; Guia; Navegação; Google Maps; Encontrar; Rotas; Busca; Mapa; Interativo; App; Recomendação; Inteligência Artificial; Sugestão; Crowdsourcing;

## Descrição

O **[World of Toilets](https://github.com/nycocado/worldoftoilets)** é uma aplicação móvel projetada para resolver um problema comum: localizar casas de banho limpas e acessíveis. Muitas vezes, as pessoas enfrentam dificuldades para encontrar uma casa de banho, especialmente em situações de emergência ou em áreas desconhecidas.

## Motivação

O **[World of Toilets](https://github.com/nycocado/worldoftoilets)** é uma versão aprimorada de um projeto criado em setembro de 2024, chamado **[Think Toilet](https://github.com/nycocado/think-toilet)**. Essa nova versão expande a proposta inicial, trazendo melhorias focadas no backend, otimizando a infraestrutura, reduzindo custos operacionais e melhorando a relação com a comunidade, além de tornar o sistema mais estável e escalável. A sua conceção foi inspirada por movimentos e tendências que destacaram a importância da higiene e do acesso a casas de banho públicas de qualidade nos últimos anos.

Um desses movimentos foi o **["Spreadshit"](https://exame.com/pop/spreadshit-planilha-avalia-banheiros-empresas)**, um evento viral em 2022 que popularizou reviews humorísticas de casas de banho. A pandemia de COVID-19, que levou ao fechamento de muitas casas de banho públicas, fez com que encontrar uma casa de banho acessível se tornasse um desafio. Com o fechamento de estabelecimentos e preocupações sobre a limpeza das casas de banho disponíveis, as pessoas começaram a compartilhar suas experiências online, formando uma comunidade disposta a ajudar na busca por opções mais seguras e limpas.

Além disso, muitos sistemas de busca de casas de banho não são atualizados, complicando a vida dos usuários. Com isso, percebemos a necessidade de uma solução prática e eficaz. Portanto, queremos desenvolver uma aplicação que ajude as pessoas a encontrar casas de banho limpas e acessíveis, permitindo também a avaliação e sugestão de novos locais, criando uma base de dados mais confiável e útil.

**Objetivos:**

- Facilitar a busca de casas de banho limpas e próximas.
- Permitir um ambiente saudável para o desenvolvimento da comunidade.
- Avaliação e feedback contínuos.
- Integração com mapas e navegação.

## Público-Alvo

O público-alvo da aplicação **[World of Toilets](https://github.com/nycocado/worldoftoilets)** inclui:

- Trabalhadores em trânsito, como motoristas, entregadores e motoristas de camião, que frequentemente necessitam de acesso a casas de banho durante o trabalho.
- Turistas e viajantes que estão explorando novas áreas e precisam localizar sanitários próximos.
- Pessoas com necessidades de acessibilidade, que buscam informações sobre instalações adaptadas.
- Profissionais que trabalham em campo, como trabalhadores da construção civil e eletricistas, que podem não ter acesso a instalações adequadas durante o dia de trabalho.

## Pesquisa de Mercado

A nossa pesquisa sobre aplicações para busca de casas de banho foi um dos principais motivos para a escolha do tema do projeto. A maioria deles apresenta uma interface deficiente e poucas funções úteis além da localização dos sanitários.

### [Where is the Toilet](https://play.google.com/store/apps/details?id=com.whereisthetoilet)

A aplicação funciona como um localizador de casas de banho, permitindo avaliações e a criação de novas.

- **Pontos Positivos:** Interface limpa, sem informações desnecessárias, facilitando a navegação.
- **Pontos Negativos:** Poucas casas de banho disponíveis. Apesar de parecer italiana, não encontramos opções na Itália. O sistema de busca é pouco intuitivo e o mapa não atualiza automaticamente, sendo necessário clicar para mostrar as casas de banho próximas.
- **Melhorias Feitas:** Automatização do mapa, mostrando as casas de banho próximas sem a necessidade de clicar.

### [Berlin Toilet](https://play.google.com/store/apps/details?id=com.berlintoilet)

É uma aplicação para localização de casas de banho, utilizando o Google Maps para indicar direções e permitindo avaliações categóricas.

- **Pontos Positivos:** Sistema de localização intuitivo, permite saber se o estabelecimento é pago e oferece acessibilidade.
- **Pontos Negativos:** Interface fraca, não permite comentários sobre as casas de banho e as notas dos utilizadores não aparecem de forma imediata.
- **Melhorias Feitas:** Exibir a média de notas dos utilizadores na ecrã inicial para facilitar a escolha, permitir comentários e melhorar a interface.

### [Flush - Toilet Finder](https://play.google.com/store/apps/details?id=toilet.samruston.com.toilet)

Aplicação de localização de casas de banho.

- **Pontos Positivos:** Localiza rapidamente casas de banho no mapa, indicando se são pagos, acessíveis ou trancados. Permite criar casas de banho e reportar problemas.
- **Pontos Negativos:** Falta filtragem nas criações, avaliações e comentários não aparecem, não mostra as casas de banho mais próximas e não permite traçar rotas.
- **Melhorias Feitas:** Exibir avaliações e comentários, mostrar as mais próximas e permitir rotas.

### [Where is Public Toilet](https://play.google.com/store/apps/details?id=com.bfranca.toilets)

Aplicação para localizar casas de banho públicas, com informações úteis como avaliações e acessibilidade.

- **Pontos Positivos:** Lista de casas de banho por distância, com avaliações, horários de funcionamento, favoritos e compartilhamento. Mostra pins no mapa e oferece rotas.
- **Pontos Negativos:** Necessita baixar a base de dados a cada instalação, o que é demorado. Não possui comentários e a interface é confusa e pouco intuitiva.
- **Melhorias Feitas:** Simplificar a interface, permitir comentários e avaliações, e facilitar a navegação.

## Personas

### Matilde Homão

- **Idade:** 21 anos
- **Sexo:** Feminino
- **Ocupação:** Motorista de aplicação e Estudante
- **Descrição:** Matilde é uma jovem motorista de aplicação que enfrenta diversos desafios no seu dia a dia, como deslocar-se por diferentes locais e gerir a rotina entre o trabalho e os estudos numa universidade de prestígio.
- **Objetivo:** Devido à natureza dinâmica do seu trabalho como motorista de aplicação, Matilde precisa localizar de forma rápida e eficiente casas de banho de qualidade em diferentes regiões.
- **Frustrações:** Dificuldade em encontrar casas de banho em locais desconhecidos ou remotos.

### David Barção

- **Idade:** 20 anos
- **Sexo:** Masculino
- **Ocupação:** Turista e Empreendedor
- **Descrição:** David é um jovem empreendedor em busca de autoconhecimento, decidido a explorar o mundo após desenvolver uma carreira de sucesso. Viajar é a sua forma de se conectar consigo mesmo e com diferentes culturas.
- **Objetivo:** David procura as rotas mais eficientes para explorar novos países e, durante as suas viagens, precisa localizar casas de banho confortáveis e acessíveis em diferentes regiões.
- **Frustrações:** Devido às suas constantes viagens, David frequentemente desconhece as características e comodidades das regiões onde irá pernoitar. Por isso, sente a necessidade de uma aplicação que facilite a localização de casas de banho confortáveis e próximas.

### Maria Cunha

- **Idade:** 39 anos
- **Sexo:** Feminino
- **Ocupação:** Jornalista, Dentista e Gestante
- **Descrição:** Maria cuida de um bebé de 8 meses e enfrenta os desafios de uma rotina intensa. Para lidar com as necessidades do seu filho, precisa estar sempre preparada para trocar fraldas e oferecer cuidados adequados, mesmo em locais fora de casa.
- **Objetivo:** Localizar rapidamente casas de banho equipadas com fraldários que atendam a altos padrões de limpeza e conforto.
- **Frustrações:** Devido à sua rotina corrida, Maria encontra dificuldades em encontrar casas de banho adequadas e bem equipadas para cuidar do seu bebé, o que adiciona estresse à sua jornada diária.

### André Costa

- **Idade:** 23 anos
- **Sexo:** Masculino
- **Ocupação:** Suporte de Técnico
- **Descrição:** André Costa, formado em Harvard, destaca-se pela forte base em gestão e inovação. Entusiasmado pelo setor tecnológico, decidiu orientar a carreira para a administração de plataformas digitais. Investiu o seu tempo no desenvolvimento de uma plataforma focada na modernização de casas de banho.
- **Objetivo:** O objetivo de André na plataforma é garantir a sua evolução contínua, implementando soluções inovadoras que otimizem a gestão e utilização das casas de banho.
- **Frustrações:** Enfrenta desafios quando a plataforma não responde como esperado ou quando limitações técnicas atrasam melhorias importantes.

## Casos de Uso

### Localizar a melhor casa de banho próxima

**Persona:** Matilde Homão

| Campo                   | Descrição                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nome**                | Localizar a melhor casa de banho próxima                                                                                                                                                                                                                                                                                                                                            |
| **Ator Principal**      | Utilizador                                                                                                                                                                                                                                                                                                                                                                          |
| **Objetivo**            | Encontrar uma casa de banho adequada na proximidade e obter indicações de navegação para lá chegar                                                                                                                                                                                                                                                                                  |
| **Pré-condições**       | • O utilizador possui conta ativa e tem a aplicação instalada<br>• O dispositivo tem localização ativada<br>• O utilizador tem acesso à internet                                                                                                                                                                                                                                    |
| **Fluxo principal**     | 1. O utilizador acessa a página inicial da aplicação<br>2. O sistema apresenta uma lista de casas de banho ordenadas por proximidade<br>3. O utilizador seleciona uma casa de banho da lista<br>4. O sistema apresenta o perfil detalhado da casa de banho (localização, horário, avaliações)<br>5. O utilizador clica em "Gerar Rotas"<br>6. O sistema gera ao utilizador uma rota |
| **Fluxos Alternativos** | **2a.** Se o utilizador desejar refinar a busca:<br>• 2a.1 O utilizador aplica filtros (distância, horário, classificação)<br>• 2a.2 O sistema atualiza a lista com base nos critérios selecionados                                                                                                                                                                                 |
| **Pós-condições**       | • O utilizador tem acesso à rota<br>• O utilizador pode visualizar, comentar e avaliar a casa de banho selecionada                                                                                                                                                                                                                                                                  |

![Diagrama de Use Case - Localizar a melhor casa de banho próxima](deliveries/milestone-2/diagrams/use-cases/use-case-1-white.png)

### Denunciar comentário da casa de banho

**Persona:** David Barção

| Campo                   | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Nome**                | Denunciar comentário inadequado                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Ator Principal**      | Utilizador                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Objetivo**            | Denunciar um comentário inadequado numa casa de banho para manutenção da qualidade da comunidade                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Pré-condições**       | • O utilizador possui conta ativa e tem a aplicação instalada<br>• O utilizador está autenticado na aplicação<br>• Existe pelo menos um comentário visível no perfil da casa de banho                                                                                                                                                                                                                                                                                                                                          |
| **Fluxo principal**     | 1. O utilizador acede ao perfil da casa de banho<br>2. O utilizador visualiza a lista de comentários<br>3. O utilizador identifica um comentário inadequado<br>4. O utilizador clica no ícone "Denunciar" associado ao comentário<br>5. O sistema apresenta um formulário com opções de motivo da denúncia (conteúdo ofensivo, spam, informação falsa, etc.)<br>6. O utilizador seleciona o motivo<br>7. O utilizador clica em "Confirmar Denúncia"<br>8. O sistema regista a denúncia e apresenta uma mensagem de confirmação |
| **Fluxos Alternativos** | **4a.** Se o utilizador cancelar a denúncia:<br>• 4a.1 O utilizador clica em "Cancelar"<br>• 4a.2 O sistema fecha o formulário e retorna ao perfil da casa de banho                                                                                                                                                                                                                                                                                                                                                            |
| **Pós-condições**       | • A denúncia é registada no sistema<br>• O utilizador recebe confirmação visual da denúncia submetida<br>• O comentário é ocultado para o utilizador até análise pela equipa de moderação                                                                                                                                                                                                                                                                                                                                      |

![Diagrama de Use Case - Denunciar comentário da casa de banho](deliveries/milestone-2/diagrams/use-cases/use-case-2-4-white.png)

### Pesquisar casa de banho específica

**Persona:** Maria Cunha

| Campo                   | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nome**                | Pesquisar casa de banho específica                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Ator Principal**      | Utilizador                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Objetivo**            | Localizar uma casa de banho equipada com fraldário que cumpra critérios de limpeza e conforto, e obter indicações para lá chegar                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Pré-condições**       | • O utilizador possui conta ativa e tem a aplicação instalada<br>• O utilizador está autenticado na aplicação<br>• O dispositivo tem localização ativada<br>• O utilizador tem acesso à internet                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Fluxo principal**     | 1. O utilizador acede à página inicial da aplicação<br>2. O utilizador clica no campo de filtros<br>3. O sistema apresenta as opções de filtro disponíveis<br>4. O utilizador seleciona o filtro "Fraldário"<br>5. O sistema filtra e apresenta a lista de casas de banho com fraldário, ordenadas por proximidade e classificação<br>6. O utilizador seleciona uma casa de banho da lista<br>7. O sistema apresenta o perfil detalhado (localização, horários, condições de limpeza, avaliações, fotos do fraldário)<br>8. O utilizador clica em "Gerar Rotas"<br>9. O sistema gera ao utilizador uma rota |
| **Fluxos Alternativos** | **5a.** Se o utilizador quiser refinar ainda mais a busca:<br>• 5a.1 O utilizador aplica filtros adicionais (classificação mínima, distância máxima, horário de funcionamento)<br>• 5a.2 O sistema atualiza a lista com base nos critérios combinados                                                                                                                                                                                                                                                                                                                                                       |
| **Pós-condições**       | • A casa de banho com fraldário está selecionada e exibida no mapa<br>• A rota ativa está disponível<br>• O utilizador pode visualizar detalhes completos, avaliações e comentários sobre o fraldário                                                                                                                                                                                                                                                                                                                                                                                                       |

![Diagrama de Use Case - Pesquisar casa de banho específica](deliveries/milestone-2/diagrams/use-cases/use-case-3-white.png)

### Avaliar e registar denúncia de comentário

**Persona:** André Costa

| Campo                   | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nome**                | Avaliar denúncias                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Ator Principal**      | Administrador                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Objetivo**            | Revisar denúncias de comentários inadequados, avaliar a sua validade e aplicar as ações apropriadas                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Pré-condições**       | • O administrador possui conta com privilégios administrativos<br>• O administrador está autenticado na aplicação<br>• Existem denúncias pendentes no sistema                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Fluxo principal**     | 1. O administrador acede ao painel administrativo<br>2. O administrador seleciona a secção "Denúncias Pendentes"<br>3. O sistema apresenta a lista de denúncias ordenadas por data (mais recentes primeiro)<br>4. O administrador seleciona uma denúncia da lista<br>5. O sistema exibe os detalhes completos (comentário denunciado, motivo da denúncia, data, utilizador que denunciou)<br>6. O administrador revê o comentário e a justificação da denúncia<br>7. O administrador toma uma decisão:<br>&nbsp;&nbsp;&nbsp;a. Remover o comentário<br>&nbsp;&nbsp;&nbsp;b. Arquivar a denúncia (sem ação)<br>8. O sistema regista a ação, atualiza o estado da denúncia e notifica o utilizador denunciante (se aplicável)<br>9. O administrador retorna à lista de denúncias pendentes |
| **Fluxos Alternativos** | **3a.** Se o administrador desejar filtrar denúncias:<br>• 3a.1 O administrador clica em "Aplicar Filtros"<br>• 3a.2 O sistema apresenta opções de filtro (por motivo, data, casa de banho, estado)<br>• 3a.3 O administrador seleciona os critérios desejados<br>• 3a.4 O sistema atualiza a lista com base nos filtros                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Pós-condições**       | • A denúncia é processada e muda de estado (arquivada, resolvida)<br>• As ações apropriadas são aplicadas (comentário removido, aviso enviado, etc.)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

![Diagrama de Use Case - Avaliar e registar denúncia de comentário](deliveries/milestone-2/diagrams/use-cases/use-case-2-4-white.png)

## Diagramas de Sequência

### Diagrama 1 - Visualizar Casas de Banho Próximas

Este diagrama representa o fluxo de pesquisa de casas de banho próximas à localização do utilizador.

**Fluxo Principal:**

1. O utilizador solicita ver casas de banho próximas através da aplicação móvel
2. A aplicação envia o pedido ao sistema com as coordenadas de localização
3. O sistema processa o pedido e ordena as casas de banho por proximidade
4. Para cada casa de banho encontrada, o sistema adiciona à lista de resultados
5. A aplicação exibe as casas de banho próximas ao utilizador

**Fluxo Alternativo:**

- Se não existirem casas de banho disponíveis na área, o sistema retorna um erro de indisponibilidade e a aplicação exibe uma mensagem informativa ao utilizador

![Diagrama de Sequência - Visualizar Casas de Banho Próximas](deliveries/milestone-2/diagrams/sequence-diagram/sequence-diagram-1-white.png)

### Diagrama 2 - Denunciar Comentário e Gestão de Denúncias

Este diagrama representa o fluxo completo desde a denúncia de um comentário pelo utilizador até à sua resolução pelo administrador.

**Fluxo do Utilizador:**

1. O utilizador denuncia um comentário inadequado através da aplicação móvel
2. A aplicação regista a denúncia no sistema
3. O sistema confirma o registo e a aplicação exibe mensagem de sucesso

**Fluxo do Administrador:**

1. O administrador autentica-se na aplicação web
2. O sistema valida as credenciais e libera o acesso
3. O administrador acede às denúncias pendentes
4. O sistema carrega e exibe a lista de denúncias (loop para cada denúncia)
5. O administrador seleciona uma denúncia para ver detalhes
6. O sistema retorna informações completas da denúncia

**Decisão do Administrador (alternativa):**

- **Aceitar denúncia:** O sistema apaga o objeto denunciado (comentário) e exibe confirmação de sucesso
- **Recusar denúncia:** O sistema apaga apenas a denúncia e exibe confirmação de sucesso

![Diagrama de Sequência - Denunciar Comentário e Gestão de Denúncias](deliveries/milestone-2/diagrams/sequence-diagram/sequence-diagram-2-white.png)

## Descrição da Solução

O projeto **[World of Toilets](https://github.com/nycocado/worldoftoilets)** é uma aplicação móvel que ajuda os utilizadores a encontrar e avaliar casas de banho próximas. A aplicação exibe um mapa interativo com as casas de banho mais bem avaliadas e fornece informações como preço, acessibilidade e restrições de uso (gratuito, público ou para clientes). Os utilizadores podem avaliar critérios como limpeza, acessibilidade, papel disponível e estrutura, além de deixar comentários. A aplicação também permite sugerir novas casas de banho, denunciar locais ou comentários inadequados e visualizar seu histórico de avaliações. Com integração ao Google Maps, oferece rotas para facilitar o acesso aos locais.

## Enquadramento das Unidades Curriculares

### Engenharia de Software

Aplicamos princípios de Engenharia de Software na estruturação do projeto, desde a definição de requisitos até à implementação. O sistema foi modelado com UML (casos de uso, diagramas de sequência), seguindo metodologia ágil com sprints semanais, backlog e entregas incrementais. Utilizamos Git com branching strategy e mantemos documentação atualizada para garantir rastreabilidade e manutenção eficiente.

### Inteligência Artificial

A componente de IA implementa o algoritmo A*para cálculo de rotas otimizadas entre a localização do utilizador e as casas de banho. O algoritmo utiliza dados do [OpenStreetMap](https://www.openstreetmap.org/) através da biblioteca [OSMnx](https://osmnx.readthedocs.io/) e manipulação de grafos, encontrando o caminho mais eficiente com base na distância e tempo estimado a pé. A escolha do A* justifica-se por se tratar de procura informada em grafos com custos bem definidos, sendo mais adequado que outras abordagens como CSP ou aprendizagem por reforço.

### Segurança Informática

Implementamos autenticação de utilizadores com JWT (access tokens e refresh tokens) e gestão segura de credenciais através de hashing com [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) e salt. O sistema inclui verificação de email no registo, recuperação de password com tokens temporários, e autorização baseada em roles com diferentes níveis de permissões para administradores. Aplicamos validação de entradas nas APIs e tratamento de erros sem exposição de detalhes técnicos sensíveis.

### Sistemas Distribuídos

O sistema foi desenhado com alta disponibilidade através de replicação de serviços: duas instâncias das APIs ([NestJS](https://nestjs.com/)), duas instâncias dos front-ends ([Next.js](https://nextjs.org/)) e um cluster MariaDB Galera com três nós em replicação síncrona multi-master. O tráfego é distribuído pelo [NGINX](https://nginx.org/) (load balancer HTTP) e [HAProxy](https://www.haproxy.org/) (load balancer de base de dados), ambos com health checks automáticos para deteção e remoção de instâncias com problemas, garantindo tolerância a faltas e continuidade do serviço.

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
- As empresas/parceiros devem poder registar-se e obter selo de verificação.
- Os administradores devem poder gerir denúncias, sugestões e utilizadores através de dashboard web.
- O sistema deve calcular e apresentar rotas otimizadas a pé até às casas de banho.
- Os utilizadores devem poder denunciar outros utilizadores por comportamento inadequado.

### Requisitos Não Funcionais Herdados (Think Toilet)

- A interface deve ser intuitiva e responsiva.
- O sistema deve permitir moderação de conteúdo por administradores.
- A aplicação móvel deve ser compatível com [Android 9 (API Level 28)](https://developer.android.com/tools/releases/platforms#9.0) ou superior.
- A aplicação móvel deve ser desenvolvida em [Kotlin](https://kotlinlang.org/) com [Jetpack Compose](https://developer.android.com/compose).
- Dados sensíveis dos utilizadores devem ser encriptados antes do armazenamento.
- Integração com [OpenStreetMap](https://www.openstreetmap.org/) para visualização de mapas.

### Requisitos Não Funcionais Novos (World of Toilets)

- O sistema deve suportar múltiplas instâncias de cada serviço para evitar ponto único de falha.
- A base de dados deve ser replicada para garantir disponibilidade e integridade dos dados.
- O sistema deve implementar balanceamento de carga entre as instâncias.
- Os serviços devem ser monitorizados com health checks automáticos.
- A autenticação deve utilizar JWT com tokens de acesso e refresh tokens.
- As APIs devem ser construídas com [TypeScript](https://www.typescriptlang.org/) e [NestJS](https://nestjs.com/) seguindo arquitetura RESTful.
- O front-end web deve ser desenvolvido com [TypeScript](https://www.typescriptlang.org/), [React](https://react.dev/) e [Next.js](https://nextjs.org/).
- O armazenamento de ficheiros deve ser feito através de serviço de object storage ([MinIO](https://min.io/)).
- O cálculo de rotas deve ser efetuado por microsserviço dedicado com algoritmo A*.
- Os administradores devem ter diferentes níveis de permissões configuráveis.

## Arquitetura da Solução

A arquitetura do sistema **[World of Toilets](https://github.com/nycocado/worldoftoilets)** foi desenhada seguindo princípios de alta disponibilidade, escalabilidade horizontal e tolerância a faltas. O diagrama de arquitetura apresenta todos os componentes e as suas interações através de diferentes protocolos de comunicação.

![Diagrama da Arquitetura da Solução](deliveries/milestone-2/diagrams/solution-architecture/solution-architecture-white.png)

### Camada de Apresentação (Clientes)

No topo direito do diagrama encontram-se os pontos de entrada do sistema:

- **Mobile:** Aplicação Android desenvolvida em [Kotlin](https://kotlinlang.org/) com [Jetpack Compose](https://developer.android.com/compose), que comunica diretamente com o [MinIO](https://min.io/) (bucket) via HTTP para obtenção de imagens, e com o Load Balancer [NGINX](https://nginx.org/) para acesso às APIs.
- **Cliente Web:** Interface web que acede ao sistema através do Load Balancer [NGINX](https://nginx.org/), podendo comunicar tanto com os front-ends ([Next.js](https://nextjs.org/)) como com as APIs e o serviço de armazenamento.

### Camada de Load Balancing e Distribuição

O sistema implementa dois níveis de balanceamento de carga, visíveis no centro do diagrama:

- **[NGINX](https://nginx.org/) (Load Balancer Principal):** Localizado no lado direito do diagrama, atua como ponto de entrada único para todo o tráfego HTTP. Distribui as requisições entre:
  - Front-End 1 e Front-End 2 ([Next.js](https://nextjs.org/)) - para conteúdo web
  - API 1 e API 2 ([NestJS](https://nestjs.com/)) - para operações de dados

- **[HAProxy](https://www.haproxy.org/) (Load Balancer de Base de Dados):** Representado no centro-esquerdo do diagrama, gere as conexões TCP com o Galera Cluster, distribuindo operações de leitura/escrita entre as três instâncias de MariaDB.

### Camada de Aplicação

A camada de aplicação é composta por múltiplas instâncias replicadas:

- **API 1 e API 2 ([NestJS](https://nestjs.com/)):** Duas instâncias idênticas da API REST, visíveis no centro do diagrama. Comunicam via TCP com o HAProxy para operações de base de dados, via HTTP com o MinIO para gestão de ficheiros, e via SMTP com o MailHog para envio de emails. Esta replicação elimina o ponto único de falha na camada de serviços.

- **Front-End 1 e Front-End 2 ([Next.js](https://nextjs.org/)):** Duas instâncias do servidor web, localizadas no canto inferior direito. Servem o dashboard de administração e a landing page, comunicando com as APIs via HTTP através do NGINX.

- **Microsserviço de Rotas ([Flask](https://flask.palletsprojects.com/)):** Componente dedicado à Inteligência Artificial, posicionado no centro-direito do diagrama. Implementa o algoritmo A* para cálculo de rotas otimizadas, comunicando via HTTP com as APIs.

### Camada de Dados e Serviços Auxiliares

No lado esquerdo e inferior do diagrama encontram-se os serviços de persistência:

- **Galera Cluster:** Cluster de três nós MariaDB (DB 1, DB 2, DB 3), representado no canto inferior esquerdo. Implementa replicação síncrona multi-master, garantindo consistência e disponibilidade dos dados. Cada nó mantém uma cópia completa da base de dados e pode aceitar operações de leitura e escrita.

- **[MinIO](https://min.io/) (Bucket):** Serviço de armazenamento de objetos compatível com S3, localizado no topo central do diagrama. Armazena imagens e ficheiros estáticos, sendo acedido diretamente pelos clientes mobile e web via HTTP, bem como pelas APIs.

- **[MailHog](https://github.com/mailhog/MailHog) (Serviço de Email):** Servidor SMTP fictício para ambiente de desenvolvimento, posicionado no canto inferior central. Recebe emails das APIs via protocolo SMTP para funcionalidades como verificação de conta e recuperação de password.

### Fluxos de Comunicação

O diagrama ilustra claramente os protocolos utilizados em cada comunicação:

- **HTTP req/res:** Comunicação REST entre clientes, load balancers, APIs e serviços.
- **TCP req/res:** Conexões de base de dados entre APIs e HAProxy.
- **SMTP delivery:** Entrega de emails das APIs para o MailHog.
- **read/write:** Operações de dados entre HAProxy e os nós do Galera Cluster.

### Estratégia de Tolerância a Faltas

A arquitetura garante disponibilidade através de:

1. **Replicação de Serviços:** Duas instâncias de cada componente crítico (APIs e Front-Ends).
2. **Cluster de Base de Dados:** Três nós MariaDB em configuração Galera, tolerando a falhas.
3. **Health Checks:** Monitorização contínua de todos os serviços com reinício automático.
4. **Load Balancing Inteligente:** NGINX e HAProxy distribuem carga e removem instâncias com problemas do pool ativo.

## Estrutura de Dados

O modelo de dados foi desenhado para suportar todas as funcionalidades da aplicação, garantindo integridade referencial e consultas eficientes. A estrutura implementa auditoria simples através de campos de timestamp (`created_at`, `updated_at`) e soft delete em entidades críticas como comentários e utilizadores, preservando o histórico de dados.

O diagrama seguinte apresenta as principais entidades e os seus relacionamentos:

![Diagrama da Estrutura de Dados](deliveries/milestone-2/diagrams/data-structure/data-structure-snow-flake.png)

## Diagrama de Classes

O diagrama de classes representa a estrutura da base de dados do sistema **[World of Toilets](https://github.com/nycocado/worldoftoilets)**. Devido à utilização do MikroORM e princípios de Clean Architecture, as entidades apresentadas funcionam como modelos de dados puros, responsáveis apenas pelo armazenamento e mapeamento das tabelas da base de dados. A lógica de negócio está encapsulada em use cases separados, mantendo as entidades focadas exclusivamente na persistência de informação.

As entidades principais incluem User, Toilet, Comment, e os diversos tipos de Report (ReportUser, ReportComment, ReportToilet) para o sistema de moderação. O modelo de permissões é implementado através de Role e Permission, permitindo diferentes níveis de acesso administrativo.

![Diagrama de Classes](deliveries/milestone-2/diagrams/class-diagram/class-diagram.png)

## Tecnologias

A escolha das tecnologias foi orientada pelos requisitos de escalabilidade, alta disponibilidade e tolerância a faltas definidos para o projeto. Cada componente da arquitetura utiliza tecnologias específicas que se integram de forma coesa.

### Infraestrutura e Orquestração

- **[Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/):** Toda a infraestrutura é containerizada, permitindo isolamento de serviços, portabilidade e facilidade de deployment. O Docker Compose orquestra 15+ containers em ambiente de desenvolvimento e produção.

- **[NGINX](https://nginx.org/) (Load Balancer Principal):** Servidor web e reverse proxy que atua como ponto de entrada único do sistema, distribuindo tráfego HTTP entre as instâncias replicadas dos front-ends, APIs e microsserviço de IA.

- **[HAProxy](https://www.haproxy.org/) (Load Balancer de Base de Dados):** Balanceador de carga especializado em conexões TCP, responsável por distribuir queries SQL entre os três nós do cluster MariaDB Galera.

### Camada de Dados

- **[MariaDB Galera Cluster](https://hub.docker.com/r/bitnami/mariadb-galera):** Sistema de base de dados relacional em configuração multi-master com replicação síncrona. O cluster é composto por 3 nós que garantem consistência forte e tolerância à falha de até um nó. Utiliza a imagem bitnamilegacy/mariadb-galera.

- **[MinIO](https://min.io/):** Servidor de armazenamento de objetos compatível com [Amazon S3](https://aws.amazon.com/s3/). Utilizado para persistência de imagens e ficheiros estáticos (fotos de casas de banho, avatares de utilizadores). Oferece API HTTP para acesso direto pelos clientes.

### Desenvolvimento Back-End

- **[NestJS](https://nestjs.com/) ([TypeScript](https://www.typescriptlang.org/)):** Framework Node.js para construção das APIs REST. Duas instâncias idênticas (API 1 e API 2) garantem redundância. Responsável pela lógica de negócio, autenticação JWT, validação de dados e comunicação com a base de dados.

- **[Flask](https://flask.palletsprojects.com/) (Python):** Microframework utilizado exclusivamente para o microsserviço de Inteligência Artificial. Implementa o algoritmo A* para cálculo de rotas otimizadas, utilizando a biblioteca [OSMnx](https://osmnx.readthedocs.io/) para dados do [OpenStreetMap](https://www.openstreetmap.org/) para manipulação de grafos.

### Desenvolvimento Front-End (Web)

- **[Next.js](https://nextjs.org/) ([TypeScript](https://www.typescriptlang.org/)/[React](https://react.dev/)):** Framework React com renderização server-side. Duas instâncias replicadas servem o dashboard de administração e a landing page. Oferece otimização automática, roteamento e Server Side Rendering (SSR).

- **[Bootstrap 5](https://getbootstrap.com/):** Framework CSS com componentes pré-construídos e sistema de grid responsivo, utilizado para estilização e layout consistente das interfaces web do dashboard e landing page.

### Desenvolvimento Mobile

- **[Kotlin](https://kotlinlang.org/):** Linguagem principal para desenvolvimento Android, oferecendo null-safety e interoperabilidade com Java.

- **[Jetpack Compose](https://developer.android.com/compose):** Toolkit moderno e declarativo para construção de interfaces nativas Android, permitindo desenvolvimento mais rápido e código mais legível.

- **[Android SDK 28+](https://developer.android.com/tools/releases/platforms#9.0):** Suporte mínimo para Android 9.0 (Pie), garantindo compatibilidade com a maioria dos dispositivos em uso.

- **[OpenStreetMap API](https://www.openstreetmap.org/):** Integração para exibição de mapas e dados geográficos na aplicação móvel.

### Serviços Auxiliares

- **[MailHog](https://github.com/mailhog/MailHog):** Servidor SMTP fictício para ambiente de desenvolvimento. Captura emails enviados pelas APIs (verificação de conta, recuperação de password) sem necessidade de configuração de servidor de email real. Interface web disponível na porta 8025.

### Segurança e Autenticação

- **[JWT (JSON Web Tokens)](https://jwt.io/):** Mecanismo stateless para autenticação e autorização de utilizadores. Implementado nas APIs NestJS com tokens de acesso e refresh tokens.

- **[bcrypt](https://en.wikipedia.org/wiki/Bcrypt):** Algoritmo de hashing para armazenamento seguro de passwords com salt automático.

### Ferramentas de Desenvolvimento

- **[Git](https://git-scm.com/) & [GitHub](https://github.com/):** Controlo de versões e colaboração, com branching strategy e code reviews.

- **[Figma](https://www.figma.com/):** Prototipagem e design de interfaces de utilizador.

- **[Discord](https://discord.com/):** Comunicação interna da equipa de desenvolvimento.

### Monitorização e Health Checks

Todos os serviços implementam endpoints `/health` monitorizados pelo Docker com intervalos configuráveis:

- **APIs:** verificação a cada 10 segundos.
- **Base de dados:** verificação a cada 15 segundos.
- **Microsserviço IA:** verificação a cada 30 segundos (devido ao tempo de carregamento do grafo).

## Protótipos de Interface

Os protótipos seguintes foram desenvolvidos em [Figma](https://www.figma.com/) e representam as principais interfaces do sistema, tanto para a aplicação móvel como para o dashboard de administração web.

### Aplicação Móvel - Sugestão de Casa de Banho

O fluxo de sugestão de nova casa de banho foi desenhado em 5 etapas sequenciais para simplificar o processo. O utilizador começa por selecionar o estabelecimento, insere o endereço completo (morada, código postal, cidade, distrito), define se é público ou privado, indica se é pago e o respetivo preço, recebendo no final uma confirmação de que a sugestão será avaliada pela equipa de moderação antes de ser adicionada à base de dados. Contudo, este protótipo representa uma versão inicial e os parâmetros apresentados não refletem a estrutura atual do modelo de dados, que foi refinado durante a fase de implementação.

![Protótipo - Aplicação Móvel - Sugestão de Casa de Banho](deliveries/milestone-2/prototypes/prototype-toilets-suggestion.png)

### Dashboard de Administração - Gestão de Utilizadores

O painel de administração permite gerir utilizadores reportados através de um sistema de denúncias. A interface apresenta uma lista de utilizadores com múltiplas denúncias, mostrando o número de reportes e a causa mais frequente. Os administradores podem visualizar detalhes de cada denúncia, ordenar por data e tomar ações como advertir ou banir o utilizador.

![Protótipo - Dashboard de Administração - Gestão de Utilizadores](deliveries/milestone-2/prototypes/prototype-administrator-users.png)

### Dashboard de Administração - Gestão de Denúncias de Comentários

A interface de gestão de denúncias organiza os comentários reportados em três estados: novas denúncias, pendentes e passadas. Cada entrada mostra o comentário original, a avaliação associada, o utilizador que reportou, a data e o tipo de denúncia. Os administradores podem aceitar ou rejeitar cada denúncia através de ações rápidas.

![Protótipo - Dashboard de Administração - Gestão de Denúncias de Comentários](deliveries/milestone-2/prototypes/prototype-administrator-comments.png)

### Dashboard de Administração - Gestão de Casas de Banho

O painel de sugestões permite aos administradores aprovar ou rejeitar novas casas de banho submetidas pela comunidade. Cada sugestão apresenta informações detalhadas como número de sanitas, disponibilidade de fraldário, separação por sexo, acessibilidade, se é pago e se requer consumo obrigatório.

![Protótipo - Dashboard de Administração - Gestão de Casas de Banho](deliveries/milestone-2/prototypes/prototype-administrator-toilets.png)

### Dashboard de Administração - Gestão de Permissões

A gestão de administradores permite criar diferentes níveis de acesso baseados em permissões específicas: Casas de Banho, Comentários e Utilizadores. Esta separação de responsabilidades garante que cada administrador tem acesso apenas às funcionalidades necessárias para o seu papel na moderação da plataforma.

![Protótipo - Dashboard de Administração - Gestão de Permissões](deliveries/milestone-2/prototypes/prototype-administrator-roles.png)

## Plano de Trabalho

O desenvolvimento do projeto está organizado em 8 sprints, desde a conceptualização inicial até à entrega final. A tabela seguinte detalha o foco principal e os entregáveis chave de cada sprint:

| Sprint | Período       | Foco Principal             | Entregáveis Chave                            |
| ------ | ------------- | -------------------------- | -------------------------------------------- |
| 0      | 28/09 - 19/10 | Análise & Conceptualização | Proposta, Requisitos, Arquitetura            |
| 1      | 20/10 - 26/10 | Setup Infraestrutura       | Docker, Base de Dados, Wireframes            |
| 2      | 27/10 - 02/11 | Sistemas Distribuídos & BD | NGINX, Replicação, Scripts BD, Auth JWT      |
| 3      | 03/11 - 09/11 | IA & API Core              | Algoritmo A*, Endpoints Toilets/Reviews      |
| 4      | 10/11 - 16/11 | Integração IA & API        | Microsserviço Flask, Testes                  |
| 5      | 17/11 - 23/11 | Frontend Web & Mobile      | Landing Page, Dashboard, App Kotlin (início) |
| 6      | 24/11 - 30/11 | Integração Completa        | App Mobile, Rotas IA, Testes E2E             |
| 7      | 01/12 - 15/12 | Refinamento & Entrega      | Segurança, Documentação, Vídeo               |

## Plano de Testes

### Testes da Componente de IA

O microsserviço de rotas implementa o algoritmo A* para cálculo de percursos otimizados. Os testes seguintes validam o correto funcionamento do algoritmo, tratamento de erros e performance do sistema.

**Testes de Validação de Entrada:**

- Coordenadas com formato inválido (letras, incompletas) → Erro 400
- Coordenadas fora dos limites de Lisboa → Erro 404
- Valores absurdos ou fora de intervalo → Erro 400
- Método HTTP incorreto (POST em vez de GET) → Erro 405

**Testes de Casos Extremos:**

- Origem igual ao destino → Distância 0, nós explorados < 10
- Coordenadas em áreas inacessíveis (rio, mar) → Erro ou path vazio
- Rotas muito longas (> 20km) → Verificar timeout e número de nós

**Testes de Consistência da Resposta:**

- Resposta contém todos os campos obrigatórios: path, tempo, distancia_km, nos_explorados
- Path conecta efetivamente origem ao destino
- Valores são positivos e coerentes
- Coordenadas do path estão dentro dos limites de Lisboa

**Testes de Performance:**

- Tempo de resposta inferior a 10 segundos
- Número de nós explorados proporcional à distância (< 5000 para rotas típicas)
- Comportamento sob múltiplas requisições simultâneas

### Resultados dos Testes da Componente de IA

Os testes foram executados sobre o microsserviço de rotas A* para validar o correto funcionamento do algoritmo, tratamento de erros e performance do sistema. O grafo de Lisboa carregado contém 199.016 nós e 558.024 arestas.

**Validação de Entrada:**

| Teste                   | Entrada                          | Resultado Esperado   | Resultado Obtido               | Status |
| ----------------------- | -------------------------------- | -------------------- | ------------------------------ | ------ |
| Formato inválido        | /abc,def/38.7223,-9.1393         | Erro 400             | Erro 400 - INVALID_FORMAT      | ✓      |
| Coordenadas incompletas | /38.7223/38.7169,-9.1333         | Erro 400             | Erro 400 - INVALID_FORMAT      | ✓      |
| Origem fora de Lisboa   | /40.4168,-3.7038/38.7223,-9.1393 | Erro área de serviço | Erro 400 - OUT_OF_SERVICE_AREA | ✓      |
| Destino fora de Lisboa  | /38.7223,-9.1393/41.1579,-8.6291 | Erro área de serviço | Erro 400 - OUT_OF_SERVICE_AREA | ✓      |

**Casos Extremos:**

| Teste                   | Distância | Nós Explorados | Tempo Resposta | Observação                  |
| ----------------------- | --------- | -------------- | -------------- | --------------------------- |
| Origem = Destino        | 0.0m      | 1              | 1.85s          | Comportamento correto       |
| Coordenadas no rio      | -         | -              | -              | Rejeitado como fora da área |
| Rota muito longa (26km) | 26.227m   | 28.898         | 0.59s          | Completou sem timeout       |

**Consistência da Resposta:**

Todas as validações de estrutura passaram com sucesso:

- Campos obrigatórios presentes (path, stats.distance_meters, stats.nodes_expanded, stats.time_seconds)
- Valores numéricos positivos
- Coordenadas do path dentro dos limites de Lisboa
- Path conecta origem ao destino

**Performance e Escalabilidade:**

| Teste            | Distância | Nós Explorados | Tempo Resposta | Nós/km |
| ---------------- | --------- | -------------- | -------------- | ------ |
| Rota curta       | 360.76m   | 25             | 1.74s          | 69     |
| Rota média       | 2.097m    | 1.065          | 1.72s          | 508    |
| Rota longa       | 6.874m    | 5.916          | 1.74s          | 861    |
| Rota muito longa | 8.521m    | 11.311         | 1.79s          | 1.328  |

**Métricas Agregadas:**

- Tempo médio de resposta: 1.75 segundos
- Tempo máximo de resposta: 1.79 segundos
- Média de nós explorados por km: 691
- Taxa de sucesso: 100% (12/12 testes)

## Conclusão

O **[World of Toilets](https://github.com/nycocado/worldoftoilets)** busca fornecer uma solução eficaz para facilitar a localização de casas de banho públicas e privadas, ao mesmo tempo que melhora a experiência do utilizador através de um sistema de avaliações detalhadas. A aplicação permite que os utilizadores encontrem rapidamente casas de banho próximas, com base em critérios como limpeza, acessibilidade e preço. Além disso, o projeto promove a colaboração dos utilizadores através de sugestões de novos locais e avaliações, criando assim uma base de dados sempre atualizada e confiável.

Outro ponto central é incentivar a participação ativa dos utilizadores na avaliação de casas de banho, permitindo que encontrem as melhores opções e forneçam feedback valioso. Este retorno beneficia não apenas os utilizadores, mas também as empresas responsáveis pelas casas de banho, oferecendo informações detalhadas sobre a experiência do público e ajudando-as a identificar áreas de melhoria e aprimorar os seus serviços. A aplicação inclui ainda um mapa próprio, com rotas calculadas por IA, facilitando o acesso e a navegação pelos locais recomendados.

Ao final, **[World of Toilets](https://github.com/nycocado/worldoftoilets)** busca não apenas atender a uma necessidade prática, mas também criar uma comunidade de utilizadores colaborativa e engajada, proporcionando uma solução abrangente e útil para o cotidiano de todos, com impacto positivo tanto para os utilizadores como para as empresas.

## Bibliografia

**Links Diretos do Relatório:**

- [World of Toilets Repository](https://github.com/nycocado/worldoftoilets) - GitHub (2025)
- [Think Toilet Repository](https://github.com/nycocado/think-toilet) - GitHub (2024)

**Tecnologias - Infraestrutura e Orquestração:**

- [Docker](https://www.docker.com/) - Docker Inc.
- [Docker Compose](https://docs.docker.com/compose/) - Docker Documentation
- [NGINX](https://nginx.org/) - F5 Networks
- [HAProxy](https://www.haproxy.org/) - HAProxy Technologies

**Tecnologias - Camada de Dados:**

- [MariaDB Galera Cluster](https://hub.docker.com/r/bitnami/mariadb-galera) - Bitnami
- [MinIO](https://min.io/) - MinIO Inc.
- [Amazon S3](https://aws.amazon.com/s3/) - Amazon Web Services

**Tecnologias - Desenvolvimento:**

- [Kotlin](https://kotlinlang.org/) - JetBrains
- [Jetpack Compose](https://developer.android.com/compose) - Android Developers
- [NestJS](https://nestjs.com/) - NestJS
- [Next.js](https://nextjs.org/) - Vercel
- [TypeScript](https://www.typescriptlang.org/) - Microsoft
- [React](https://react.dev/) - Meta
- [Flask](https://flask.palletsprojects.com/) - Pallets Projects
- [Bootstrap 5](https://getbootstrap.com/) - Bootstrap Team

**Tecnologias - IA e Mapas:**

- [OSMnx](https://osmnx.readthedocs.io/) - Geoff Boeing
- [OpenStreetMap](https://www.openstreetmap.org/) - OpenStreetMap Foundation

**Tecnologias - Segurança:**

- [JWT (JSON Web Tokens)](https://jwt.io/) - Auth0
- [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) - OpenBSD

**Ferramentas:**

- [Git](https://git-scm.com/) - Git SCM
- [GitHub](https://github.com/) - Microsoft
- [Figma](https://www.figma.com/) - Figma Inc.
- [Discord](https://discord.com/) - Discord Inc.
- [MailHog](https://github.com/mailhog/MailHog) - Ian Kent

**Aplicações da Pesquisa de Mercado:**

- [Where is the Toilet](https://play.google.com/store/apps/details?id=com.whereisthetoilet) - Google Play Store
- [Berlin Toilet](https://play.google.com/store/apps/details?id=com.berlintoilet) - Google Play Store
- [Flush - Toilet Finder](https://play.google.com/store/apps/details?id=toilet.samruston.com.toilet) - Google Play Store
- [Where is Public Toilet](https://play.google.com/store/apps/details?id=com.bfranca.toilets) - Google Play Store

**Referências Académicas:**

- Boeing, G. (2017). OSMnx: New Methods for Acquiring, Constructing, Analyzing, and Visualizing Complex Street Networks. *Computers, Environment and Urban Systems*, 65, 126-139. DOI: 10.1016/j.compenvurbsys.2017.05.004

- Russell, S., & Norvig, P. (2020). *Artificial Intelligence: A Modern Approach* (4th ed.). Pearson. [Algoritmo A*]

- Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson Education. [Metodologias Ágeis e UML]

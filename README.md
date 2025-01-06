# Think Toilet - [IADE](https://www.iade.europeia.pt/) - [UE](https://www.europeia.pt/)  
![IADE LOGO PNG](documents/logo/iade_logo.png)
**Universidade:** [Universidade Europeia](https://www.europeia.pt/)  
**Faculdade:** [IADE - Faculdade de Design, Tecnologia e Comunicação](https://www.iade.europeia.pt/)  
**Repositório:** [think-toilet](https://github.com/nycocado/think-toilet)  
**Curso:** Engenharia Informática

## Índice
- [Think Toilet - IADE - UE](#think-toilet---iade---ue)
  - [Índice](#índice)
  - [Elementos do Grupo](#elementos-do-grupo)
  - [Palavras-Chave](#palavras-chave)
  - [Descrição](#descrição)
    - [Motivação](#motivação)
    - [Objetivos](#objetivos)
  - [Público-Alvo](#público-alvo)
  - [Pesquisa de Mercado](#pesquisa-de-mercado)
    - [Where is the Toilet](#where-is-the-toilet)
    - [Berlin Toilet](#berlin-toilet)
    - [Flush](#flush)
    - [Where is Public Toilet](#where-is-public-toilet)
  - [Personas](#personas)
    - [Matilde Homão](#matilde-homão)
    - [David Barção](#david-barção)
    - [Maria Cunha](#maria-cunha)
  - [Casos de Utilização](#casos-de-utilização)
    - [Primeiro Caso - Localizar a melhor casa de banho próxima](#primeiro-caso---localizar-a-melhor-casa-de-banho-próxima)
    - [Segundo Caso - Feedback da casa de banho](#segundo-caso---feedback-da-casa-de-banho)
    - [Terceiro Caso - Pesquisar casa de banho específica](#terceiro-caso---pesquisar-casa-de-banho-específica)
  - [Plano de Trabalho (TODO)](#plano-de-trabalho-todo)
  - [Descrição da Solução](#descrição-da-solução)
  - [Enquadramento das Unidades Curriculares](#enquadramento-das-unidades-curriculares)
    - [Programação de Dispositivos Móveis](#programação-de-dispositivos-móveis)
    - [Programação Orientada por Objetos](#programação-orientada-por-objetos)
    - [Bases de Dados](#bases-de-dados)
    - [Matemática Discreta](#matemática-discreta)
    - [Projeto de Desenvolvimento Móvel](#projeto-de-desenvolvimento-móvel)
    - [Competências Comunicacionais](#competências-comunicacionais)
  - [Requisitos Técnicos](#requisitos-técnicos)
    - [Requisitos Funcionais](#requisitos-funcionais)
    - [Requisitos Não Funcionais](#requisitos-não-funcionais)
  - [Arquitetura da Solução](#arquitetura-da-solução)
    - [Componentes da Arquitetura:](#componentes-da-arquitetura)
      - [Front-end (Aplicação Móvel)](#front-end-aplicação-móvel)
      - [Back-end (Servidor)](#back-end-servidor)
      - [Banco de Dados](#banco-de-dados)
    - [Fluxo de Dados:](#fluxo-de-dados)
      - [Busca de Casas de Banho](#busca-de-casas-de-banho)
      - [Avaliação de Casas de Banho](#avaliação-de-casas-de-banho)
      - [Visualização de Avaliações](#visualização-de-avaliações)
      - [Visualização do Histórico de Avaliações](#visualização-do-histórico-de-avaliações)
  - [Tecnologias](#tecnologias)
    - [Desenvolvimento Móvel](#desenvolvimento-móvel)
    - [Desenvolvimento Back-End](#desenvolvimento-back-end)
    - [Bases de Dados](#bases-de-dados-1)
    - [Prototipação:](#prototipação)
  - [Diagrama de Classes](#diagrama-de-classes)
  - [Planificação](#planificação)
  - [Conclusão](#conclusão)
  - [Bibliografia](#bibliografia)
- [Base de Dados](#base-de-dados)
    - [Modelo Entidade-Relacionamento](#modelo-entidade-relacionamento)
    - [Documentos de Referência (TODO)](#documentos-de-referência-todo)
- [REST API](#rest-api)
    - [Documentos de Referência](#documentos-de-referência)

## Elementos do Grupo
- [Nycolas Souza](https://github.com/nycocado) - 20230989
- [Luan Ribeiro](https://github.com/Ninjaok) - 20230692
- [Lohanne Guedes](https://github.com/Lohannecristina) - 20220085

## Palavras-Chave
Localizador; Avaliação; Sanitários; Casa de banho; Público; Privada; Busca; Próximas; Aplicação; Mobile; Guia; Navegação; Google Maps; Encontrar; Rotas; Busca; Mapa; Interativo; App; Recomendação;

## Descrição
O **[Think Toilet](https://github.com/nycocado/think-toilet)** é uma aplicação móvel projetada para resolver um problema comum: localizar casas de banho limpas e acessíveis. Muitas vezes, as pessoas enfrentam dificuldades para encontrar uma casa de banho, especialmente em situações de emergência ou em áreas desconhecidas.

### Motivação
O **["Spreadshit"](https://exame.com/pop/spreadshit-planilha-avalia-banheiros-empresas/)** foi um evento viral em 2022 que popularizou reviews humorísticas de casas de banho. A pandemia de COVID-19, que levou ao fechamento de muitos banheiros públicos, fez com que encontrar um banheiro acessível se tornasse um desafio.

Com o fechamento de estabelecimentos e preocupações sobre a limpeza dos banheiros disponíveis, as pessoas começaram a compartilhar suas experiências online, formando uma comunidade disposta a ajudar na busca por opções mais seguras e limpas.

Além disso, muitos sistemas de busca de banheiros não são atualizados, complicando a vida dos usuários. Com isso, percebemos a necessidade de uma solução prática e eficaz. Portanto, desenvolvemos uma aplicação capaz de ajudar as pessoas a encontrar casas de banho limpas e acessíveis, permitindo também a avaliação, criando um banco de dados mais confiável e útil.

### Objetivos

- Facilitar a busca de casas de banho limpas e próximas.
- Permitir um ambiente saudável para o desenvolvimento da comunidade.
- Avaliação e feedback contínuos.
- Integração com mapas e navegação.

## Público-Alvo
O público-alvo da aplicação **[Think Toilet](https://github.com/nycocado/think-toilet)** inclui:
- Trabalhadores em trânsito, como motoristas e entregadores, que frequentemente necessitam de acesso a casas de banho durante o trabalho.
- Turistas e viajantes que estão explorando novas áreas e precisam localizar sanitários próximos.
- Pessoas com necessidades de acessibilidade, que buscam informações sobre instalações adaptadas.
- Profissionais que trabalham em campo, como trabalhadores da construção civil e eletricistas, que podem não ter acesso a instalações adequadas durante o dia de trabalho.

## Pesquisa de Mercado
A nossa pesquisa sobre aplicativos para busca de casas de banho foi um dos principais motivos para a escolha do tema do projeto. A maioria deles apresenta uma interface deficiente e poucas funções úteis além da localização dos sanitários.

### [Where is the Toilet](https://play.google.com/store/apps/details?id=com.iisrl.toilet.star.toilet_star&hl=pt_PT)
A aplicação funciona como um localizador de casas de banho, permitindo avaliações e a criação de novas.
- **Pontos Positivos:** Interface limpa, sem informações desnecessárias, facilitando a navegação.
- **Pontos Negativos:** Poucas casas de banho disponíveis. Apesar de parecer italiana, não encontramos opções na Itália. O sistema de busca é pouco intuitivo e o mapa não atualiza automaticamente, sendo necessário clicar para mostrar as casas de banho próximas.
- **Melhorias Feitas:** Automátização do mapa, mostrando as casas de banho próximas sem a necessidade de clicar.

### [Berlin Toilet](https://play.google.com/store/apps/details?id=com.futurice.berlintoiletapp&hl=pt_PT)
É uma aplicação para localização de casas de banho, utilizando o Google Maps para indicar direções e permitindo avaliações categóricas.
- **Pontos Positivos:** Sistema de localização intuitivo, permite saber se o estabelecimento é pago e oferece acessibilidade.
- **Pontos Negativos:** Interface fraca, não permite comentários sobre as casas de banho e as notas dos utilizadores não aparecem de forma imediata.
- **Melhorias Feitas:** Exibir a média de notas dos utilizadores na tela inicial para facilitar a escolha, permitir comentários e melhorar a interface.

### [Flush](https://play.google.com/store/apps/details?id=toilet.samruston.com.toilet&hl=pt_PT)
Aplicação de localização de casas de banho.
- **Pontos Positivos:** Localiza rapidamente banheiros no mapa, indicando se são pagos, acessíveis ou trancados. Permite criar casas de banho e reportar problemas.
- **Pontos Negativos:** Falta filtragem nas criações, avaliações e comentários não aparecem, não mostra as casas de banho mais próximas e não permite traçar rotas.
- **Melhorias Feitas:** Exibir avaliações e comentários, mostrar as mais próximas e permitir rotas.

### [Where is Public Toilet](https://play.google.com/store/apps/details?id=sfcapital.publictoiletinsouthaustralia&hl=pt_PT)
Aplicativo para localizar banheiros públicos, com informações úteis como avaliações e acessibilidade.
- **Pontos Positivos:** Lista de banheiros por distância, com avaliações, horários de funcionamento, favoritos e compartilhamento. Mostra pins no mapa e oferece rota.
- **Pontos Negativos:** Necessita baixar o banco de dados a cada instalação, o que é demorado. Não possui comentários e a interface é confusa e pouco intuitiva.
- **Melhorias Sugeridas:** Melhorar a interface, permitir comentários e avaliações, e facilitar a navegação.
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
- **Descrição:** Maria, mãe diagnosticada com Síndrome de Laron, cuida de um bebé de 8 meses e enfrenta os desafios de uma rotina intensa. Para lidar com as necessidades do seu filho, precisa estar sempre preparada para trocar fraldas e oferecer cuidados adequados, mesmo em locais fora de casa.
- **Objetivo:** Localizar rapidamente casas de banho equipadas com fraldários que atendam a altos padrões de limpeza e conforto.
- **Frustrações:** Devido à sua rotina corrida, Maria encontra dificuldades em encontrar casas de banho adequadas e bem equipadas para cuidar do seu bebé, o que adiciona stress à sua jornada diária.

## Casos de Utilização
### Primeiro Caso - Localizar a melhor casa de banho próxima

**Persona: Matilde Homão**  
Consideramos a localização da melhor casa de banho próxima como o objetivo principal do projeto, seguindo estes passos:
- Matilde encontra-se num local desconhecido e precisa urgentemente de uma casa de banho.
- O Matilde acede à aplicação e visualiza o mapa. 
- No mapa, são exibidas as casas de banho mais próximas, já na parte inferior, aparece a primeira casa de banho, e Matilde pode deslizar para ver as cinco opções mais próximas.
- Independentemente do método escolhido para aceder à casa de banho, o Matilde será redirecionado para a janela da casa de banho escolhida.
- Nessa janela, o Matilde pode clicar no botão escrito "Abrir no Maps", que o levará ao Google Maps, onde poderá escolher a rota até à casa de banho.

### Segundo Caso - Feedback da casa de banho
**Persona: Maria Cunha**  
O segundo caso envolve a avaliação de uma casa de banho:
- Maria utilizou uma casa de banho e gostaria de avaliar a excelente experiência que teve, compartilhando seu feedback positivo sobre a limpeza, conforto e acessibilidade do local.
- O Maria acede à aplicação e visualiza o mapa.
- No mapa, são exibidas as casas de banho mais próximas, já na parte inferior, destaca-se a primeira casa de banho que Maria utilizou, seguindo a recomendação da aplicação.
- Após selecionar a primeira casa de banho, o Maria é redirecionado para a janela da casa de banho selecionada.
- Nessa janela, o Maria clica no botão "Avaliar" e é levado à tela de avaliações.
- Maria pode comentar sobre a sua experiência e avaliar categorias como "Limpeza", "Papel", "Estrutura" e "Acessibilidade".
- Para concluir, o Maria clica no botão de confirmação para publicar a sua avaliação.

### Terceiro Caso - Pesquisar casa de banho específica
**Persona: David Barção**  
Este caso trata da busca por uma casa de banho específica pelo utilizador:
- David viajou para Lisboa, um destino que nunca havia visitado antes. Agora, hospedado em seu hotel, ele deseja planejar sua viagem como turista, explorando a capital de Portugal e seus principais pontos turísticos
- David acede à aplicação e visualiza o mapa.
- Na parte superior, clica no botão de pesquisa.
- O teclado é acionado, e o utilizador pode digitar a localização ou o nome do estabelecimento onde a casa de banho se encontra.
- Após a pesquisa, a aplicação exibe a casa de banho desejada, e David pode clicar para visualizar mais detalhes e avaliações.
- David pode então escolher a melhor rota para chegar à casa de banho, clicando no botão "Abrir no Maps".

## Plano de Trabalho (TODO)
- FAZER O PLANO DE TRABALHO

## Descrição da Solução
O projeto **[Think Toilet](https://github.com/nycocado/think-toilet)** é uma aplicação móvel que ajuda os utilizadores a encontrar e avaliar casas de banho próximas. A aplicação exibe um mapa interativo com as casas de banho mais bem avaliadas e fornece informações adicionais, incluindo avaliações de usuários. Os utilizadores podem avaliar critérios como limpeza, acessibilidade, papel disponível e estrutura, além de deixar comentários. A aplicação também permite denunciar locais ou comentários inadequados e visualizar seu histórico de avaliações. Com integração ao Google Maps, oferece rotas para facilitar o acesso aos locais.

## Enquadramento das Unidades Curriculares
### Programação de Dispositivos Móveis
O desenvolvimento mobile foi realizado em **[Kotlin](https://kotlinlang.org)**, utilizando **[Jetpack Compose](https://developer.android.com/compose)** como framework principal. Aplicamos os conhecimentos adquiridos na unidade curricular, como a criação de interfaces intuitivas, navegação entre telas, integração com APIs e gerenciamento de dados locais. A aplicação foi projetada para oferecer uma experiência de usuário fluida, responsiva e eficiente.

### Programação Orientada por Objetos  
O Back-End do projeto foi desenvolvido em **[Java](https://www.java.com/)** com o framework **[Spring Boot](https://spring.io)**, conectando a interface ao banco de dados. A arquitetura **REST** foi implementada para criar uma API modular e intuitiva, facilitando a comunicação entre o front-end e o back-end. O padrão **MVC** (Model-View-Controller) foi utilizado para separar a lógica de negócios, interface e dados, promovendo organização e escalabilidade. Aplicando também conhecimentos da programação orientada a objetos, como encapsulamento e herança, garantimos um código limpo e eficiente. Além disso, utilizamos **UML** para representação.

### Bases de Dados
O sistema de armazenamento utilizou **[MySQL](https://www.mysql.com/)**, aplicando conceitos como tabelas, chaves primárias e estrangeiras, além de consultas SQL otimizadas para manipulação e recuperação de dados. A estrutura relacional do banco garante integridade, eficiência e segurança das informações, permitindo uma gestão confiável dos dados do projeto.

### Matemática Discreta
Conceitos de teoria de conjuntos foram aplicados no desenvolvimento de estruturas de dados, como a representação de casas de banho e suas relações com outras tabelas do banco de dados. Essa abordagem permitiu uma integração consistente e eficiente dos dados, garantindo um sistema robusto.

### Projeto de Desenvolvimento Móvel
A unidade curricular desempenhou um papel central na planificação e gestão do projeto. Utilizamos ferramentas como o **[ClickUp](https://clickup.com/)** para organização e controle de tarefas, assegurando o cumprimento de prazos. Feedbacks de design e avaliações periódicas foram fundamentais para aprimorar a qualidade do projeto, além de desenvolver habilidades técnicas e interpessoais.

### Competências Comunicacionais
A comunicação eficaz foi essencial durante o desenvolvimento do projeto. Aplicamos as técnicas aprendidas na unidade curricular em apresentações e reuniões, além de utilizá-las na interação com a comunidade de usuários e na coleta de feedback. Esses esforços contribuíram para um projeto mais alinhado às necessidades dos utilizadores e melhoraram a colaboração entre os membros da equipe.

## Requisitos Técnicos
### Requisitos Funcionais
- Os usuários devem poder buscar casas de banho próximas por localização no mapa.
- Os usuários devem poder visualizar detalhes das casas de banho e avaliações, com a média das avaliações categóricas e a média geral das avaliações.
- Os usuários devem poder avaliar casas de banho, deixando comentários e notas sobre limpeza, acessibilidade, disponibilidade de papel e estrutura.
- Os usuários devem poder ver seu histórico de avaliações.
- A aplicação deve permitir que os usuários denunciem locais ou comentários inadequados.
- Os usúarios obrigatoriamente devem ser registrados e ter uma conta na plataforma para poder interagir com a comunidade

### Requisitos Não Funcionais
- A interface deve ser intuitiva e responsiva, proporcionando uma experiência de usuário agradável.
- O sistema deve permitir a moderação eficiente de comentários e sugestões, incluindo a análise de conteúdo para determinar se ele deve ser mantido, editado ou removido.
- A aplicação deve ser compatível com [Android 9 (API Level 28)]((https://developer.android.com/tools/releases/platforms#9.0)) ou superior.
- Deve ser utilizado [Kotlin](https://kotlinlang.org) com [Jetpack Compose](https://developer.android.com/compose) para a interface do usúario.
- Deve ser utilizado [Java](https://www.java.com/) com [Spring Boot](https://spring.io) para manipulação de dados.
- Utilização de [MySQL](https://www.mysql.com/) para o armazenamento de dados, incluindo informações sobre usuários, casas de banho, avaliações e sugestões.
- Informações sensíveis, como senhas de usuários, devem ser armazenadas de forma segura e criptografada.
- Integração com o [Google Maps API](https://developers.google.com/maps) para fornecer direções e exibir casas de banho no mapa.

## Arquitetura da Solução  
A arquitetura da solução do projeto **[Think Toilet](https://github.com/nycocado/think-toilet)** foi projetada para ser modular e escalável, abrangendo três componentes principais: o front-end (aplicação móvel), o back-end (servidor) e o banco de dados.

### Componentes da Arquitetura:
#### Front-end (Aplicação Móvel)  
Desenvolvida em **[Kotlin](https://kotlinlang.org)** com **[Jetpack Compose](https://developer.android.com/compose)** para a interface de usuário, a aplicação permite aos usuários buscar casas de banho, visualizar detalhes e fazer avaliações. A integração com o **[Google Maps API](https://developers.google.com/maps)** e **[OpenStreetMap](https://www.openstreetmap.org)** facilita a navegação e localização de casas de banho próximas.

#### Back-end (Servidor)  
Construído com **[Java](https://www.java.com/)** e **[Spring Boot](https://spring.io)**, o servidor implementa uma arquitetura RESTful para facilitar a comunicação entre o front-end e o back-end. Ele gerencia dados sobre casas de banho, avaliações e usuários, garantindo a integridade das informações.

#### Banco de Dados  
Utilizando **[MySQL](https://www.mysql.com/)**, o banco de dados foi projetado para armazenar informações sobre usuários, casas de banho, avaliações e sugestões. A estrutura relacional garante eficiência nas consultas e integridade dos dados.

### Fluxo de Dados:
#### Busca de Casas de Banho
- O usuário pesquisa casas de banho na aplicação.  
- A aplicação envia uma requisição ao servidor para obter dados das casas de banho.  
- O servidor processa a requisição e retorna os dados ao front-end.  

#### Avaliação de Casas de Banho
- O usuário seleciona uma casa de banho e fornece uma avaliação.  
- A aplicação envia a avaliação ao servidor.  
- O servidor armazena a avaliação no banco de dados e pode retornar uma confirmação ao usuário.  

#### Visualização de Avaliações
- O usuário pode visualizar avaliações de outras casas de banho.  
- O servidor responde às requisições de visualização com as avaliações armazenadas.  

#### Visualização do Histórico de Avaliações
- O usuário solicita visualizar seu histórico de avaliações.  
- A aplicação envia uma requisição ao servidor para obter o histórico de avaliações do usuário.  
- O servidor processa a requisição e retorna o histórico de avaliações ao front-end.  

## Tecnologias
### Desenvolvimento Móvel
- **Linguagem:** [Kotlin](https://kotlinlang.org)
- **Framework:** [Jetpack Compose](https://developer.android.com/compose)
- **SDK:** [Android SDK 28](https://developer.android.com/tools/releases/platforms#9.0)
- **Integração:** [Google Maps API](https://developers.google.com/maps) e [OpenStreetMap API](https://wiki.openstreetmap.org/wiki/API)

### Desenvolvimento Back-End
- **Linguagem:** [Java](https://www.java.com/)
- **Framework:** [Spring Boot](https://spring.io)

### Bases de Dados
- **Sistema de Gerenciamento:** [MySQL](https://www.mysql.com/)
- **Conexão:** via [Java](https://www.java.com/) com [Spring Boot](https://spring.io)

### Prototipação:
- **Software:** [Figma](https://www.figma.com/) para design e prototipação da interface do usuário.

## Diagrama de Classes
![Diagrama de Classes](documents/terceira_entrega/diagramas/classes.png)

## Planificação 
[Gráfico de Gantt](documents/primeira_entrega/gantt/gantt.pdf)  
[ClickUp](https://app.clickup.com/9012385337/v/s/90121717706)

## Conclusão
O **[Think Toilet](https://github.com/nycocado/think-toilet)** tem como principal objetivo fornecer uma solução eficaz para facilitar a localização de casas de banho públicas e privadas, ao mesmo tempo que melhora a experiência do utilizador através de um sistema de avaliações detalhadas. A aplicação permite que os utilizadores encontrem rapidamente casas de banho próximas, com base em critérios como limpeza e acessibilidade. Além disso, o projeto visa promover a colaboração dos utilizadores através de avaliações, criando assim um banco de dados sempre atualizado e confiável.

Com a integração ao [Google Maps](https://www.google.pt/maps), a aplicação também visa facilitar o acesso, fornecendo rotas diretas para os utilizadores. Ao final, **[Think Toilet](https://github.com/nycocado/think-toilet)** busca não apenas atender a uma necessidade prática, mas também criar uma comunidade de utilizadores colaborativa e engajada, proporcionando uma solução abrangente e útil para o cotidiano de todos.

## Bibliografia
- [Spreadshit: por trás da famosa planilha que avalia banheiros de empresas - Revista Exame](https://exame.com/pop/spreadshit-planilha-avalia-banheiros-empresas/)
- [Where is the Toilet - Jaser182](https://play.google.com/store/apps/details?id=com.iisrl.toilet.star.toilet_star&hl=pt_PT)
- [Berlin Toilet - WallDecaux](https://play.google.com/store/apps/details?id=com.futurice.berlintoiletapp&hl=pt_PT)
- [Flush - Sam Ruston](https://play.google.com/store/apps/details?id=toilet.samruston.com.toilet&hl=pt_PT)
- [Where is Public Toilet - sfcapital](https://play.google.com/store/apps/details?id=sfcapital.publictoiletinsouthaustralia&hl=pt_PT)
- [Kotlin - Jetbrains](https://kotlinlang.org)
- [Jetpack Compose - Google](https://developer.android.com/compose)
- [Android Studio - Google](https://developer.android.com)
- [Google Maps - Google](https://www.google.pt/maps)
- [Google Maps API - Google](https://developers.google.com/maps)
- [Java - Oracle](https://www.java.com/)
- [Spring Boot - VMware Tanzu](https://spring.io)
- [MySQL - Oracle](https://www.mysql.com/)
- [Android SDK 28 - Google](https://developer.android.com/tools/releases/platforms#9.0)
- [Figma - Figma, Inc.](https://www.figma.com/)

# Base de Dados
### Modelo Entidade-Relacionamento
![Modelo Entidade-Relacionamento](documents/segunda_entrega/diagramas/er.png)  
### Documentos de Referência (TODO)
- [Dicionário de Dados](documents/g04-dicionario-de-dados-v2.pdf)  
- [Guia de Dados - AINDA PRECISA SER ANEXADO](documents/g04-guia-de-dados-v2.pdf)

# REST API
### Documentos de Referência
- [Markdown](RESTDOC.md)
- [PDF](documents/g04-restdoc-v2.pdf)
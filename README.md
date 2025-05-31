# NewsExplorer - backend

Este é um projeto de API **RESTful** desenvolvido com **Node.js**, **Express.js**, **MongoDB** e **Mongoose**. A API recebe dados, os salva em um banco de dados e fornece informações sobre usuários e artigos para consumo na plataforma do projeto **[NewsExplorer](https://github.com/Vinimello90/news-explorer-frontend#readme)**.

## Tecnologias

- Node.js
- Express.js
- MongoDB
- Mongoose
- Bcryptjs
- Jsonwebtoken
- Cors
- Winston
- Joi / Celebrate

## Descrição das Tecnologias e Técnicas Utilizadas

### Node.js e Express.js

**Node.js** é um ambiente de execução JavaScript que permite rodar código fora do navegador, possibilitando o desenvolvimento de aplicações **back-end**. O framework **Express.js** foi utilizado para criar o servidor e as rotas da API.

A propriedade **process.env** é utilizada para definir o segredo para gerar o **hash** da senha e a porta através da variável **PORT**, que pode ser configurada durante a execução. Se não for especificada, a porta padrão será **3000**, utilizada no método `listen()` para inicializar o servidor.

As rotas de requisição para dados de usuários e artigos foram implementadas com os métodos `get()`, `post()` e `delete()` do **Express.js**. As rotas foram organizadas em módulos, utilizando o método `Router()` para criar um roteador. O método `require()` do **Node.js** carrega os módulos, e o método `use()` é utilizado para incluí-los no módulo principal.

Também foi implementado um middleware global para tratar erros nas rotas, utilizando o método `use()` no módulo principal para executar ao chamar o método `next()` nas rotas.

### MongoDB

É um banco de dados **NoSQL** orientado a documentos. Em vez de armazenar dados em tabelas, como bancos relacionais (por exemplo, MySQL ou PostgreSQL), ele usa documentos no formato **JSON**.

### Mongoose

É uma biblioteca para **Node.js** que facilita a interação com o **MongoDB**. Utilizando **Schemas** e **Models** do **mongoose**, é validado os campos e criado os dados dos usuários e dos artigos.

Os métodos `create(), find()`, `findById()`, e `findByIdAndRemove()` são usados para realizar as operações **CRUD** (Create, Read, Update, Delete) e manipular os dados no banco.

### Bcryptjs

Uso a biblioteca **bcryptjs** para transformar senhas em **hashes** antes de armazená-las no banco de dados. Para isso, utilizo a função `bcrypt.hash()`, passando a senha e um número que define o tamanho do **salt** que será adicionado antes da encriptação. O resultado é um **hash** seguro. Para validar uma senha, utilizo a função `bcrypt.compare()`, onde comparo a senha fornecida com a **hash** armazenada.

### Jsonwebtoken

Utilizo a biblioteca **jsonwebtoken** para gerar tokens de autenticação, que permitem identificar o usuário e mantê-lo conectado mesmo após fechar e reabrir a página. Para criar o token, uso a função `jwt.sign()`, que gera uma **hash** contendo informações como o ID do usuário e um prazo de expiração para o token, ficando o token inválido após o expirar sendo necessário um novo login. Para validar o token, uso `jwt.verify()`, que retorna o **payload** com os dados armazenados, como a ID do usuário, se o token for válido.

### Cors

O **CORS (Cross-Origin Resource Sharing)** é um mecanismo de segurança que define quais origens podem acessar recursos no servidor. Para facilitar sua implementação no **Node.js**, utilizo a biblioteca **cors**, que funciona como um middleware e simplifica a configuração do CORS em aplicações web.

### Winston

Utilizo a biblioteca **winston** para registrar logs da aplicação. Em conjunto com o middleware **express-winston**, consigo registrar automaticamente todas as requisições e erros. Para isso, aplico `app.use(requestLogger)` nas requisições e `app.use(errorLogger)` nos erros.

### Joi / Celebrate

Uso o **Joi** para definir e validar esquemas de dados. Já o **Celebrate** é um middleware do **Express** que aplica essas validações automaticamente nas requisições HTTP. Com os dois juntos, consigo garantir entradas seguras e bem estruturadas nas minhas APIs.

## Documentação

Após instalar as dependências com **npm i** e configurar o endereço do **mongodb** e a porta da **API**, inicie o servidor usando o comando **npm run start**.

## Endpoints

### POST /signin

Envia os dados enviados para autenticação, se os dados forem válidos é retornado um token de autorização.

- **email**: mínimo de 2 caracteres.

- **password**: mínimo de 8 caracteres.

Exemplo:

JSON

```json
{
  "email": "exemplo@exemplo.com",
  "password": "password123"
}
```

```bash
https://api.newsexplorer.protechadvanced.com/signin
```

### POST /signup

Cria um novo usuário com os dados enviados em JSON e retorna as informações do usuário criado.

- **email**: mínimo de 2 caracteres.

- **password**: mínimo de 8 caracteres.

- **username**: mínimo de 2 e máximo de 30 caracteres.

Exemplo:

JSON

```json
{
  "email": "exemplo@exemplo.com",
  "password": "password123",
  "username": "name"
}
```

Endereço (URL)

```bash
https://api.newsexplorer.protechadvanced.com/signup
```

### GET /users/me

Retorna os dados de um usuário específico com base no **ID** do usuário autorizado, em formato JSON.

\* É necessário enviar o token no headers para autorização.

Exemplo:

```bash
https://api.newsexplorer.protechadvanced.com/users/me
```

### GET /articles

Retorna todos os dados dos artigos com o ID do usuário autorizado em formato JSON.

\* É necessário enviar o token no headers para autorização.

Exemplo:

```bash
https://api.newsexplorer.protechadvanced.com/articles
```

### POST /articles

Cria um novo artigo com os dados enviados em JSON e retorna as informações do artigo criado.

\* É necessário enviar o token no headers para autorização.

- **title**: mínimo de 2 caracteres.

- **description**: mínimo de 2 caracteres.

- **keyword**: mínimo de 1 caracter.

- **source**: mínimo de 2 caracteres.

- **url**: URL válida.

- **urlToImage**: URL válida.

- **publishedAt**: data da publicação.

**Exemplo:**

JSON

```json
{
  "title": "Como a tecnologia revoluciona as cirurgias plásticas",
  "description": "Avanços em inteligência artificial e robótica têm transformado os procedimentos estéticos, oferecendo mais precisão e segurança para os pacientes.",
  "keyword": "tecnologia",
  "source": "Olhar Digital",
  "url": "https://olhardigital.com.br/2025/05/23/medicina-e-saude/como-a-tecnologia-revoluciona-as-cirurgias-plasticas/",
  "urlToImage": "https://img.odcdn.com.br/wp-content/uploads/2025/01/IA-medicina.jpg",
  "publishedAt": "2025-05-23T08:10:00Z"
}
```

Endereço (URL)

```bash
https://api.newsexplorer.protechadvanced.com/articles
```

### GET /articles/:articleId

Retorna um artigo específico com base no **ID** do artigo se o **ID** do usuário autorizado for o mesmo do proprietário do artigo.

\* É necessário enviar o token no headers para autorização.

**Exemplo**

Endereço (URL)

```bash
https://api.newsexplorer.protechadvanced.com/articles/12345
```

Substitua **12345** pelo **ID** do artigo desejado.

### DELETE /articles/:articleId

Remove um artigo específico com base no **ID** do artigo se o **ID** do usuário autorizado for o mesmo do proprietário do artigo.

\* É necessário enviar o token no headers para autorização.

**Exemplo**

Endereço (URL)

```bash
https://api.newsexplorer.protechadvanced.com/articles/12345
```

Substitua **12345** pelo **ID** do artigo desejado.

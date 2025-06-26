# NoteKeeper App

Uma aplicação web de anotações, estilo Google Keep, construída com o stack MERN. Este projeto foi desenvolvido como parte de um trabalho académico, cobrindo todo o ciclo de desenvolvimento de uma aplicação full-stack.

## ✨ Principais Funcionalidades

* **Autenticação de Utilizadores:** Sistema completo de registo e login com tokens JWT para segurança.
* **Gestão de Notas (CRUD):** Os utilizadores podem criar, ler, atualizar e apagar as suas próprias notas.
* **Organização Avançada:** Funcionalidades para fixar notas importantes, atribuir cores e gerir marcadores (tags) personalizados.
* **Interface Reativa:** Frontend moderno e intuitivo construído com React.

## 🚀 Tecnologias Utilizadas

O projeto é dividido em duas partes principais:

* **Backend:**
    * **Node.js:** Ambiente de execução
    * **Express.js:** Framework para a API
    * **MongoDB:** Base de dados NoSQL
    * **Mongoose:** Modelagem de dados
    * **JWT & Bcrypt:** Para autenticação e segurança

* **Frontend:**
    * **React:** Biblioteca para a interface de utilizador
    * **Vite:** Ambiente de desenvolvimento rápido
    * **Axios:** Para comunicação com o backend
    * **React Icons & React Modal:** Para melhoria da experiência do utilizador

## ⚙️ Como Executar o Projeto

Para executar o projeto localmente, são necessários dois terminais a funcionar em simultâneo.

---

### 1. Iniciar o Backend (API)

No primeiro terminal, navegue para a pasta do backend e inicie o servidor.

```bash
# Navegue para a pasta do backend
cd backend

# Instale as dependências (apenas na primeira vez)
npm install

# Inicie o servidor
npm run dev
```
*O servidor do backend estará a rodar em `http://localhost:5000`.*

---

### 2. Iniciar o Frontend (Interface)

Abra um **novo terminal**. Nele, navegue para a pasta do frontend e inicie o servidor de desenvolvimento.

```bash
# Navegue para a pasta do frontend
cd frontend

# Instale as dependências (apenas na primeira vez)
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
*A aplicação estará acessível em `http://localhost:5173` (ou no link fornecido pelo Vite).*

---
_Projeto desenvolvido por Felipe Felix Brant._

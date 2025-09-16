# MOUSIK - Brutalismo Sonoro Visual

## 1. Visão Geral

**MOUSIK** é uma plataforma web experimental e de estética brutalista que transforma sons em arte visual complexa e serve como uma Digital Audio Workstation (DAW) minimalista no navegador. A aplicação permite que artistas sonoros, músicos e designers visuais criem música a partir de instrumentos virtuais, manipulem sons com efeitos em tempo real e visualizem a interação de forma crua e impactante.

O projeto foi concebido com uma filosofia de design "Prensa Monocromática", focada em tipografia forte, minimalismo de alto contraste e uma experiência de utilizador direta e sem ornamentos.

## 2. Funcionalidades Principais

* **Sequenciador Multi-pista:** Crie composições complexas usando múltiplas pistas de instrumentos.
* **Piano Roll Interativo:** Adicione e remova notas numa grelha de 16 passos, com suporte para múltiplas oitavas.
* **Instrumentos Virtuais:**
    * Sintetizadores com diferentes formas de onda (`sawtooth`, `sine`, `square`).
    * Um sampler de bateria (`kick`, `snare`, `hat`) pré-carregado para criação de ritmos.
* **Cadeia de Efeitos Master:**
    * Filtro Passa-Baixa (Low-pass Filter)
    * Distorção
    * Reverb
* **Controles de Transporte:** Gestão de BPM, Play/Pause e controlo de volume global.
* **Ferramentas de Workflow:**
    * Adicionar, remover e selecionar pistas ativas.
    * Limpar todas as notas de uma pista.
    * Copiar e colar padrões de notas entre pistas.

## 3. Tech Stack

Este projeto foi construído com tecnologias modernas de front-end, focadas em performance e numa experiência de desenvolvimento robusta.

* **Framework:** [React](https://react.dev/) (v19) com TypeScript
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Estilização:** [Sass (SCSS)](https://sass-lang.com/) com CSS Modules
* **Motor de Áudio:** [Tone.js](https://tonejs.github.io/) para síntese, sampling e sequencing.
* **Navegação:** [React Router DOM](https://reactrouter.com/)
* **Linting:** ESLint

## 4. Estrutura do Projeto

A estrutura de pastas foi organizada para promover a separação de responsabilidades e a escalabilidade.

```
/src
├── components/         # Componentes reutilizáveis (Slider, Layout, Navbar)
├── pages/              # Componentes de página principais (Home, Studio)
│   └── Studio/
│       └── components/ # Componentes específicos da página Studio (PianoRoll, EffectsPanel)
├── services/           # Lógica de negócio e serviços (audioService)
├── styles/             # Estilos globais, variáveis e mixins SCSS
└── ...
```

## 5. Como Começar

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/mousik-app.git](https://github.com/seu-usuario/mousik-app.git)
    cd mousik-app
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Adicione os Samples de Bateria (Importante):**
    * Crie a seguinte estrutura de pastas: `public/samples/drumkit/`.
    * Coloque os seus ficheiros de áudio `.wav` ou `.mp3` dentro da pasta `drumkit` com os nomes:
        * `kick.wav`
        * `snare.wav`
        * `hat.wav`

### Execução

1.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

2.  **Abra o seu navegador:**
    Aceda a `http://localhost:5173` (ou o endereço que aparecer no seu terminal).

## 6. Próximos Passos e Contribuições

O MOUSIK é um projeto em evolução. As próximas funcionalidades planeadas incluem:
* Funcionalidade de exportação de áudio para `.wav`.
* Visualizador de áudio brutalista em tempo real.
* Automação de parâmetros de efeitos na timeline.
* Sistema de login e galeria de utilizadores.

Contribuições são bem-vindas. Sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

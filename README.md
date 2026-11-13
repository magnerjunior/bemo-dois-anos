# Bê & Mô — Dois anos de nós

Livro interativo de 18 páginas, em React + Vite + GSAP. Magner é Bê; Gabriella é Mô. As declarações são de Magner para Gabriella.

## Executar

Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Vite. Para produção:

```bash
npm run build
npm run preview
```

## Organização

- `src/App.jsx`: ciclo do livro, navegação e áudio persistente.
- `src/components/usePageTurn.js`: virada em torno da lombada, frente e verso, sombra e bloqueio durante o movimento. Usa uma cópia visual inerte da folha; não recria as interações durante a animação.
- `src/components/CoverArt.jsx`: capa.
- `src/components/PhotoLightbox.jsx`: ampliação individual ou das duas tiras, Escape e foco de teclado.
- `src/components/Photo.jsx`: fotografia, formatos alternativos e placeholder.
- `src/scenes/Pages.jsx`: 18 cenas e suas interações.
- `src/data/copy.js`: cabeçalhos e declarações principais por página.
- `src/data/album.js`: títulos, data inicial, 24 fotografias, grupos e pontos focais.
- `src/styles/global.css`: ilustrações e estilos base preservados.
- `src/styles/book.css`: livro vertical, tipografia e composição das páginas.
- `src/styles/interactions.css`: envelope, quarto, ponte e ajustes de objetos.

## Fotos

A pasta `public/fotos/` e seu `LEIA-ME-FOTOS.txt` foram preservados. Coloque `foto-01.jpg` a `foto-24.jpg`; também são aceitos `.jpeg`, `.png` e `.webp`. Na ausência da foto, o álbum usa o placeholder local correspondente.

Varal: 2 a 7. Mural: 8 a 13. Cabine: duas tiras, 14 a 16 e 17 a 19. A câmera reutiliza 4, 11 e 19. Não há fotografias adicionais.

As molduras e a ampliação preservam a foto inteira com `object-fit: contain`. As margens da moldura acomodam as diferentes proporções.

## Interações

- Capa: aproximação e abertura em perspectiva.
- Setas, teclado e gesto horizontal em áreas livres: avançar e voltar. Cliques repetidos são bloqueados durante a virada. O estado das páginas visitadas é preservado enquanto o livro está aberto.
- Envelope: abrir e guardar a carta.
- Reencontro: revelar/rever a cor, sem ocultar o botão.
- Contador: desde `2024-11-15T00:00:00-03:00`, independente do fuso configurado no dispositivo.
- Fotos: toque para ampliar; Escape ou fechar para voltar.
- Cabine: flash, primeira tira e segunda tira em sequência; ampliação conjunta das seis fotos.
- Câmera: uma foto por clique, até `03 / 03`; fotos reveladas permanecem ampliáveis.
- Quarto: mouse ou dedo movem uma lanterna pequena pelo ambiente. Quando o feixe alcança o abajur, ele acende automaticamente e revela a fotografia. Reiniciar remove a foto novamente.
- Ponte: tocar no cadeado fecha a haste; a chave cai e produz ondas. Não existe arraste.
- Música: somente após clique, sem repetição, sem fechar o livro e sem reiniciar ao navegar.

## Áudio e PWA

O arquivo local `public/audio/musica-teclado.mp3` está presente nesta cópia. Seu nome e o título da música não aparecem na interface. A falta do arquivo produz uma mensagem discreta e não impede a leitura.

O atalho instalado abre direto na capa (`/?album=1`). Com o livro fechado, toque em **Guardar álbum offline** para baixar os recursos, as 24 fotos e a melodia. Depois, use **Adicionar à tela inicial** ou a opção equivalente do navegador. O download requer uma conexão inicial e um endereço HTTPS no tablet. O endereço HTTP da rede local serve para testar o álbum online. No computador, o teste de desenvolvimento offline pode ser feito em `http://localhost:4173/` após `npm run build` e `npm run preview`.

Para acessar o desenvolvimento em outro aparelho na mesma rede, execute `npm run dev` e use o endereço de rede mostrado pelo Vite.

## Verificação

Com `npm run dev` em execução na porta 5173:

```bash
npx playwright install chromium
npm run test:interactions
npm run test:layout
npm run test:responsive
npm run test:edges
```

As capturas e os relatórios ficam em `artifacts/`. Foram percorridas as 18 páginas em 800×1280, 1280×800, 390×844, 360×640 e 844×390. Os testes verificam navegação, cliques rápidos, estado da carta, fotos, cabine, câmera, abajur, cadeado, MP3, mudança de orientação, foco, movimento reduzido e arquivo de áudio ausente. O teste do fim do áudio avança até os últimos instantes, sem esperar toda a duração da faixa.

## Limites conhecidos

- A virada usa uma folha com frente e verso em CSS 3D, sem malha física deformável. A prioridade é desempenho e estabilidade.
- Em celular horizontal com pouca altura, o livro conserva tamanho legível e o livro se ajusta à altura disponível. Prefira a orientação vertical para textos maiores.
- A inspeção foi feita no Chromium com viewports e toque emulados. Ainda é necessário conferir no tablet físico e, se forem usados, Safari/Firefox.

## Navegação em páginas duplas

O livro agora mantém pares abertos (1–2, 3–4, até 17–18). Entre a página ímpar e a par, a câmera se desloca sem virar papel. Ao passar para o próximo par, uma folha segmentada em 24 faixas se curva sobre a lombada, com conteúdo real na frente e no verso. No tablet vertical, a câmera prioriza uma página para manter a leitura grande; a outra continua ao lado, parcialmente fora do enquadramento.

O contador foi redesenhado como uma torre de relógio, com números sans-serif em negrito. Os testes específicos desta navegação são `node tests/spread.mjs` e `node tests/spread-all.mjs`, com o Vite na porta 5173. Os scripts anteriores de interação precisam considerar que duas folhas ficam montadas e visíveis ao mesmo tempo.

## Ajustes de enquadramento e cenários

A leitura mostra apenas uma pequena faixa da folha vizinha. Na virada, um afastamento discreto acompanha a folha, sem revelar o conteúdo da página seguinte. O topo mantém somente o ícone de tela cheia. O arraste não seleciona texto nem arrasta imagens.

As páginas receberam paletas diferentes, mantendo texturas locais. A passagem revela um relógio com um ônibus em órbita. O quarto tem paredes, piso em perspectiva, móveis e um abajur menor, ativado ao passar o feixe sobre ele. A chave preenchida é arremessada em arco após o fechamento do cadeado e produz ondas e gotas ao atingir o rio.

Validação desta revisão: `node tests/refinements.mjs` percorre 18 páginas em tablet, desktop e celular; verifica mouse, arraste contínuo de toque emulado, bilhete, chave, enquadramento da virada e ausência de seleção de texto. Relatório em `artifacts/refinements-report.json`.

## Capa ilustrada e compartilhamento

A capa tem ornamentos próprios, retrato sem recorte e os nomes Magner e Gabriella. Coloque o retrato em `public/capa/foto-capa.jpg`. Para uma arte de fundo personalizada, use `public/capa/arte-capa.jpg`. As instruções estão em `public/capa/LEIA-ME-CAPA.txt`; caminhos ficam em `src/data/presentation.js`. Sem esses arquivos, a capa usa a foto 1 ou seu placeholder.

A imagem de compartilhamento está em `public/og/album.jpg` (1200 × 630). Ela compõe o álbum em perspectiva sobre uma mesa com fotografias parcialmente escondidas. Depois de colocar suas fotos e personalizar a capa, atualize com:

```bash
npm run generate:og
```

Quando definir o endereço público, copie `.env.example` para `.env.local` e preencha `VITE_PUBLIC_SITE_URL` com o endereço HTTPS definitivo. Execute novamente `npm run build`. Sem domínio, a imagem está pronta, mas a prévia pública do WhatsApp ainda não pode ser validada. O título de compartilhamento é “Para Gabriella, com amor, de Magner”.

## Revisão das cenas ilustradas

`src/styles/storybook.css` reúne o acabamento desta revisão. `Scenery.jsx` desenha cidade, galhos e pássaros. O varal acende em sequência; o mural recebe seis fotos com recados no verso (`PhotoNote.jsx`); a cabine mostra silhuetas no flash e imprime duas tiras de três fotos. A câmera está em um ambiente escuro e cada impressão balança enquanto revela a imagem. O quarto repete as fotos 1, 11 e 21, com bilhetes, quadro M + G e coração iluminado. O cadeado tem formato de coração e iniciais.

A janela de leitura conserva uma página centralizada. A folha vizinha aparece apenas como uma faixa de papel, sem antecipar seu conteúdo. Na virada entre pares, um afastamento discreto acompanha a folha e retorna à leitura, sem abrir uma visão completa do próximo par.

Verificações da revisão:

```bash
npm run test:storybook
node tests/follow-camera.mjs
```

O primeiro percorre as 18 páginas e as novas interações no tablet vertical, horizontal e no celular. O segundo verifica viradas para frente e para trás com movimento normal em tablet vertical, horizontal e notebook, incluindo a ocultação do conteúdo da página 4 durante a passagem de 2 para 3. As imagens e relatórios ficam em `artifacts/`.

A checagem `node tests/final-smoke.mjs` cobre abrir/guardar a carta, quinze avanços simultâneos, arraste contínuo por toque até o abajur e reprodução/fim do MP3 sem fechar o livro. A revisão final passou em 54 visualizações de página (18 em cada tamanho: 800×1280, 1280×800 e 390×844), além das viradas em movimento normal no notebook 1366×768. Não substitui teste no aparelho físico.

## Entrada pública e caixa de presente

O endereço principal abre uma declaração antes do álbum. Ela reutiliza as fotos 1, 11 e 23, sem aumentar o conjunto de 24 fotografias. Textos, fotos e legendas dessa entrada ficam em `src/data/welcome.js`; a composição e a caixa estão em `src/components/Experience.jsx` e `src/styles/welcome.css`.

Ao tocar na caixa, uma sequência com crescimento, movimento da tampa, luz e confetes revela a capa. O álbum permanece fechado até o toque seguinte. Com movimento reduzido, a sequência usa apenas uma transição curta. Não há reprodução automática de música na entrada. O caminho `/#album` permite acessar diretamente a capa para manutenção e testes.

A leitura mantém uma página em destaque. Durante a virada, a folha vizinha pode aparecer brevemente com seu conteúdo, conforme a preferência mais recente; ao terminar, retorna à faixa discreta. Essa regra substitui a ocultação obrigatória durante a animação descrita nas revisões anteriores.

A música só é iniciada pelo controle da página 18. Depois disso, é possível folhear livremente sem interromper nem reiniciar o áudio; o indicador permanece visível durante a leitura. O presente entregue pessoalmente não é mencionado no site.

Teste desta etapa: `npm run test:welcome`. Percorre entrada, revelação, 18 páginas e navegação de retorno com MP3 tocando em 390×844, 800×1280 e 1280×800. Capturas em `artifacts/welcome-*.png` e `artifacts/gift-*.png`; resultados em `artifacts/welcome-report.json`. `node tests/follow-camera.mjs` verifica o movimento normal da virada e o enquadramento final.

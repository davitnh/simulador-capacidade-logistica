# Simulador de capacidade logística — Envoy

Projeto em **React + TypeScript (TSX), Vite e Tailwind CSS**, como o laboratório de roteirização enviado como referência. O simulador usa a paleta da Envoy e contém cinco controles, dois cenários prontos e uma leitura do gargalo em tempo real.

## Testar agora, sem instalar nada

Abra o arquivo separado `envoy-simulador-capacidade-preview.html` no Chrome. Ele é uma cópia de pré-visualização com o JavaScript e o CSS compilados no próprio HTML. Os arquivos TypeScript desta pasta são o código-fonte para o GitHub.

## Rodar o projeto localmente

```bash
npm ci
npm run dev
```

O Vite mostrará o endereço local. Para conferir a compilação de produção, rode `npm run build`.

## Arquivos principais

- `src/components/CapacitySimulator.tsx`: interface e interações do simulador.
- `src/components/CapacitySlider.tsx`: controle deslizante reutilizável.
- `src/lib/simulation.ts`: cenários e fórmula de cálculo.
- `src/index.css`: cores, estilos e layout responsivo.

Para colocar no GitHub, envie o conteúdo desta pasta para a raiz do repositório. A pasta `node_modules` e a saída `dist` não fazem parte do código-fonte.

O cálculo é ilustrativo: `capacidade efetiva = mínimo(pedidos, coleta, hubs, frota, parceiros)` e `backlog em 3 dias = 3 × máximo(0, pedidos − capacidade efetiva)`. Nenhum dado é enviado a um servidor.

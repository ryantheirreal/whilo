# Whilo — Visual Login & Mascot 03

## Referência visual

A tela foi reconstruída a partir da referência enviada: fundo quase preto, composição vertical de app mobile, título central, subtítulo cinza, CTA branco em formato pill, termos discretos e personagens coloridos flutuando nas bordas.

## Login

O login agora usa a mensagem **Whilo** com o posicionamento central da referência e a promessa em português: “Seu time de agentes sempre ativos que terminam o trabalho”. O botão **Log In or Sign Up** ocupa a largura principal e continua conectado ao fluxo demo local.

Os mascotes de login são componentes vetoriais leves, sem nova dependência ou imagem pesada. Cada bolha tem cor própria, olhos pretos e variações circular, cloud, square e hex para criar a mesma sensação de elenco vivo da referência.

## Chat

Na conversa mobile, o mascote e o nome do agente agora ficam centralizados na navbar superior. O menu de conversas fica à esquerda; voice call e ações ficam à direita. O agente continua trocável pelo toque no avatar/nome.

## Validação

`pnpm --dir apps/mobile build:web` foi aprovado com 2.711 módulos e o bundle está pronto para o deployment Vercel.

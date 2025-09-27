## Swipe Quiz - Visão Geral

Este fluxo cria um quiz de 10 perguntas em formato de cartões arrastáveis (tinder-like). Cada pergunta lista tags de esportes relacionadas. O usuário responde curtindo (arrastar para direita ou botão de like) ou não curtindo (arrastar para esquerda ou botão de dislike).

### Lógica de recomendação (MVP)
1. Cada pergunta tem uma lista de esportes (`tags`).
2. Quando o usuário dá like em uma pergunta, todos esportes daquela pergunta recebem +1 ponto.
3. Ao final, ordenamos os esportes por pontuação e mostramos o Top 3.
4. Empates são resolvidos pela ordem de aparição.

Exemplo de pergunta:
```
{
  id: 'q6',
  text: 'Prefere algo com raquete?',
  tags: ['Squash', 'Tamboréu'],
  color: '#E3F7FF'
}
```

### Como melhorar com IA (sugestão)
- Gere perguntas mais ricas agrupando esportes por atributos (local: aquático/indoor, energia: alta/baixa, coletivo/individual, técnica/força, tecnologia/cultura).
- Peça para o ChatGPT sugerir perguntas que discriminem bem entre os grupos e gere um peso diferente por esporte (ex.: +2 para esportes mais aderentes, +1 para secundários).
- Pode-se adicionar penalidade (-1) quando o usuário dá dislike.

### Extensões futuras
- Persistir resultados no Supabase (ver SQL abaixo).
- Registrar histórico de respostas por usuário.
- Reaplicar recomendações quando a base de esportes crescer.

### SQL opcional (tabelas de resultados)
Crie via arquivo dedicado se decidir persistir (vide `supabase/swipe_results.sql`).






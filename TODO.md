# Correções

- Mudança de mês de forma global usando controle de estado (estudar melhor qual utilizar) [Feature] [23.mar]

  - Mudança global [OK]
  - Criar botões auxiliares [OK]
  - Em vez de salvar o periodo em query string salvar no sessionStorage (deve manter somente para aquele trabalho) [OK]
  - Mudar todas as consultas de transações para client_side [OK]
  - Criar skeletons [ok]

- Corrigir data em que as despesas de crédito são importadas automaticamente [Fix] [29.mar]

  - Data de importação / criação deve ser diferente da data de lançamento [Backend]
  - Data de lançamento será a partir de agora, meramente visual [FRONT]
  - A data a ser considerada será a data criação [FRONT / BACK]
  - BANCO INTER - Ignorar o pagamento do mes passado [FRONT]

- Vincular o pagamento na aba débito do cartão de crédito a aba crédito automaticamente [Feature] [05.abr]

  - Tabela auxiliar? Não é necessário, apenas uma coluna em transactions deve resolver.
  - E se colocar no filtro dois meses? Simplesmente esconder do front se a fatura foi paga ou não, ou seja:
    1. Se as datas de filtro serem o default do mês, apresentar o status da fatura
    2. Caso seja uma pesquisa ampla, esconder o status.

# Descrição do módulo de investimento

1.  O usuário ao cadastrar a transação no módulo de débito, categorizará a transação como investimento.

    a. No banco será acrescentado como um no tipo da coluna `transactions_type`;

2.  O sistema deverá então calcular de forma dinâmica as seguintes informações:

    a. Valor mínimo de investimento baseado em `n`% da receita do mês. Exemplo: **`n` sendo `0.3` (30%) e no mês de fevereiro houve um receita de R$ 1.000,00, o valor que deveria ser investido é de R$ 300,00**.

    b. Valor investido não categorizado no mês corrente. No item **1** quando uma transação do tipo _investimento_ é criada, o valor dessa deve ser acrescentada a um valor final chamado de `valor investido não categorizado` que representa o valor investido naquele mês, porém ainda não identificado (Renda Fixa, Váriavel ou exterior).

    c. Deve calcular quantos % cada categoria de investimentos receberá por mês, esse valor terá um default de 30%, 40% e 10% sendo RF, RV e Exterior respectivamente.

3.  É necessário criar entidades de investimento de modo que a soma destas se iguale ao valor investido não categorizado, uma vez que este segundo tenha sido igualado, significa que os dados deste mês foram regularizados.

        Entidade: investments
        Campos: description, type, value, transaction_id (FK)

- Tratamentos de erros, autorizações e etc...

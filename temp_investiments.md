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

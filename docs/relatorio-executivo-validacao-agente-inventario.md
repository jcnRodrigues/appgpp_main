# Relatorio Executivo de Validacao

## Escopo

Validaçao do instalador do Agente de Inventario do AppGPP, incluindo:
- download do instalador
- elevacao de privilegios
- instalacao como servico Windows ou tarefa agendada
- persistencia do agente fora de `%TEMP%`
- envio de inventario ao servidor

## Status Esperado

- O instalador abre sem erro de caminho
- O usuario informa `Host/IP` e `Porta` do servidor
- A conexao com o servidor pode ser testada antes da instalacao
- A instalacao conclui com mensagem clara indicando:
  - `Servico instalado com sucesso`, ou
  - `Tarefa agendada instalada com sucesso`
- O agente continua executando apos reinicio do host

## Pontos de Controle

1. O executavel do instalador abre corretamente.
2. A elevacao de admin funciona no modo `.exe`.
3. O instalador copia o agente para `C:\ProgramData\AppGPP\HostInventory`.
4. Se `NSSM` estiver disponivel, o agente opera como servico.
5. Se `NSSM` nao estiver disponivel, o agente cai para tarefa agendada.
6. O inventario e enviado ao endpoint do servidor configurado.

## Riscos Observados

- Falta de permissao de administrador
- Bloqueio de porta no servidor
- Ausencia de `NSSM` na maquina alvo
- Politica de execucao do Windows bloqueando PowerShell
- Servidor indisponivel ou URL incorreta

## Conclusao

O fluxo foi ajustado para ser resiliente em duas modalidades:
- servico Windows quando `NSSM` existe
- tarefa agendada como fallback automatico

Isso reduz a chance de falha de instalacao e melhora a continuidade da coleta do inventario.


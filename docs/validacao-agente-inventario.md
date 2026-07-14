# Validacao Tecnica do Agente de Inventario

Documento de verificacao para o instalador do agente de inventario no host alvo.

## Objetivo

Validar o fluxo completo:
- download do instalador
- elevacao de privilegios
- coleta de host/IP e porta
- instalacao como servico ou tarefa agendada
- persistencia apos reinicio
- envio de inventario ao servidor

## Pre-requisitos

- Servidor AppGPP acessivel pelo host alvo
- Porta do servidor liberada
- Usuario com permissao de instalacao no Windows
- Internet ou acesso a intranet, conforme a topologia usada

## Itens a validar

1. Abrir o arquivo `HostInventoryAgent-Installer.exe`.
2. Confirmar que o instalador solicita elevacao quando executado sem admin.
3. Informar `Host/IP` e `Porta` validos do servidor.
4. Executar `Testar conexao` e confirmar retorno positivo.
5. Executar `Instalar`.
6. Confirmar a mensagem final exibida:
   - `Servico instalado com sucesso`
   - ou `Tarefa agendada instalada com sucesso`
7. Verificar se o agente foi copiado para:
   - `C:\ProgramData\AppGPP\HostInventory\HostInventoryAgent.ps1`
8. Verificar se o log foi criado em:
   - `C:\ProgramData\AppGPP\HostInventory\installer.log`
9. Confirmar que o modo de instalacao persistente foi aplicado:
   - com `NSSM`, como servico Windows
   - sem `NSSM`, como tarefa agendada
10. Reiniciar o host e confirmar que o agente volta a executar sozinho.
11. Confirmar que o inventario e enviado ao endpoint do servidor.

## Evidencias esperadas

- Janela do instalador abre sem erro de caminho
- Mensagem de sucesso condizente com o modo real
- Arquivo persistente existe fora de `%TEMP%`
- Inventario continua sendo enviado apos reinicio

## Possiveis falhas observadas

- Erro de elevacao no Windows
- Servico nao instalado por falta de `NSSM`
- Porta do servidor bloqueada
- Endpoint do servidor indisponivel
- Politica de execucao bloqueando PowerShell

## Resultado

- Data do teste:
- Host testado:
- Modo de instalacao:
- Resultado final:
- Observacoes:

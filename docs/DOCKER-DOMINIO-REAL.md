# Docker em Dominio Real

Use este roteiro quando o AppGPP for publicado com um dominio real e HTTPS valido.

## 1. DNS e rede

1. Aponte o registro `A` ou `CNAME` do dominio para o IP publico do servidor.
2. Libere as portas `80` e `443` no firewall do Windows e no firewall da rede.
3. Confirme que o servidor consegue sair para o MySQL externo, se o banco nao estiver local.

## 2. Certificado HTTPS

1. Se for homologacao, gere um certificado autoassinado e salve os arquivos em:
   - `nginx/certs/appgpp.crt`
   - `nginx/certs/appgpp.key`
2. Se for producao real, prefira Lets Encrypt e deixe o Certbot cuidar da emissao e renovacao.
3. Se o certificado for de uma autoridade confiavel, use a cadeia completa quando necessario.

Se voce estiver usando o certificado autoassinado apenas para homologacao:

```powershell
scripts\Gerar-Certificado-HTTPS.cmd
```

## 3. Variaveis de ambiente

No arquivo `.env`, ajuste para o dominio real:

- `NEXTAUTH_URL="https://app.seudominio.com"`
- `APPGPP_PUBLIC_URL="https://app.seudominio.com"`
- `NGINX_SERVER_NAME="app.seudominio.com"`
- `LETSENCRYPT_CERT_NAME="app.seudominio.com"`

Use apenas o host, sem `https://` e sem barra final.

Revise tambem:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## 4. NGINX

1. Use o arquivo `nginx/default-https.conf.template`.
2. Confira se os certificados apontam para o caminho correto.
3. Confirme que `NGINX_SERVER_NAME` esta configurado para o dominio real no `.env`.
4. Confirme que `LETSENCRYPT_CERT_NAME` bate com o nome do certificado emitido.

## 5. Subida

Emissao inicial do certificado:

```powershell
scripts\Emitir-Certificado-LetsEncrypt.cmd -Domain app.seudominio.com -Email admin@empresa.com
```

O comando sobe o NGINX em HTTP, emite o certificado via webroot e depois inicia o stack completo com renovacao automatica.
O script define `NGINX_SERVER_NAME`, `LETSENCRYPT_CERT_NAME`, `NEXTAUTH_URL` e `APPGPP_PUBLIC_URL` para o dominio informado e grava esses valores no `.env`.

Suba com o override HTTPS e renovacao automatica:

```bash
docker compose -f docker-compose.yml -f docker-compose.letsencrypt.yml -f docker-compose.letsencrypt-nginx.yml up -d --build
```

## 6. Validacao

1. Acesse `https://app.seudominio.com`.
2. Confirme que o navegador mostra certificado valido.
3. Confirme login local.
4. Confirme login Google, se houver.
5. Teste PDF, upload e backup.

## 7. Renovacao

- Renove o certificado antes do vencimento.
- Se o certificado for de CA externa, substitua os arquivos em `nginx/certs/` e recrie o container do NGINX.
- Se o dominio mudar, atualize `NEXTAUTH_URL` e `APPGPP_PUBLIC_URL` ao mesmo tempo.

## 8. Checklist rapido

- [ ] DNS aponta para o servidor.
- [ ] Portas `80` e `443` liberadas.
- [ ] Certificado valido instalado.
- [ ] `LETSENCRYPT_CERT_NAME` igual ao nome do certificado emitido.
- [ ] `.env` atualizado para `https://...`.
- [ ] `docker compose` subiu sem erro.
- [ ] Navegador abre sem aviso de inseguranca.

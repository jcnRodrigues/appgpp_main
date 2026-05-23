module.exports=[73890,e=>{"use strict";var t=e.i(2157),a=e.i(50227);function o(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function r(e){let r,i,n,s,d,l,c,u,p,m,g,_,f,h;return r=o(`${e.nomeFun} - ${e.idMatFun}`),i=o(function(e){if(!e||!e.trim())return"_______________________";let t=e.replace(/\D/g,"");return 11===t.length?`${t.slice(0,3)}.${t.slice(3,6)}.${t.slice(6,9)}-${t.slice(9)}`:e}(e.cpfFun)),s=o((n=e.tipoPatrimonio?.trim()||e.descricaoPat?.trim()||"PATRIMONIO").split(/\s+/).filter(Boolean)[0]||n),l=o((d=e.marca?.trim()||e.descricaoPat?.trim()||"Conforme cadastro").split(/\s+/).filter(Boolean)[0]||d),c=o(e.modelo?.trim()||e.descricaoPat?.trim()||"Conforme cadastro"),u=o(e.idPat),p=o(e.localData?.trim()||"PARAUAPEBAS PA, _____ de ______________ de ______"),g=o((m=(e.statusAlocacao||"").trim().toUpperCase()).includes("DEVOL")?"Devolução":m.includes("TRANSFER")?"Transferido":m.includes("ATIVO")?"Recebimento":"Condicao da alocacao: o usuario declara ciencia do status atual do patrimonio e de suas responsabilidades conforme as normas internas."),_="E proibida a instalacao de softwares sem a autorizacao da coordenacao da TI. Este equipamento esta licenciado com o sistema operacional Windows e o pacote Office (Word - Excel - Outlook - Power Point)",e.outrosProgramas&&e.outrosProgramas.length>0?_+=` e ${o(e.outrosProgramas.join(", "))}.`:_+=" e OBS se necessario incluir outros programas instalados que nao estao na lista.",h=(f=function(){for(let e of[a.default.join(process.cwd(),"public","iconPX.png"),a.default.join(process.cwd(),"public","Imagens","parex.png"),a.default.join(process.cwd(),"public","Imagens","parex_logo.png")])if(t.default.existsSync(e)){let o=a.default.extname(e).toLowerCase(),r=".jpg"===o||".jpeg"===o?"image/jpeg":"image/png",i=t.default.readFileSync(e).toString("base64");return`data:${r};base64,${i}`}return null}())?`<img src="${f}" alt="Logo Parex" class="logo-img" />`:'<div class="logo-fallback"><div class="logo">PAREX</div><div class="sub">ENGENHARIA</div></div>',`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Termo de Responsabilidade - PAT${u} - ${r}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #000;
      padding: 20mm;
      max-width: 210mm;
      margin: 0 auto;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header {
      display: grid;
      grid-template-columns: 38mm 1fr 34mm;
      border: 1px solid #7d7d7d;
      margin-bottom: 18px;
      min-height: 26mm;
    }
    .logo-box {
      border-right: 1px solid #7d7d7d;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
    }
    .logo-img {
      width: 100%;
      max-width: 30mm;
      height: auto;
      object-fit: contain;
    }
    .logo-fallback { text-align: center; }
    .logo-fallback .logo { font-size: 15pt; font-weight: bold; line-height: 1; }
    .logo-fallback .sub { font-size: 8pt; margin-top: 2px; }
    .header-center {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 6px 8px;
    }
    .header-center .titulo1 { font-size: 10.5pt; font-weight: bold; letter-spacing: .3px; }
    .header-center .titulo2 { font-size: 8.5pt; margin-top: 3px; font-weight: 600; }
    .doc-box {
      border-left: 1px solid #7d7d7d;
      display: grid;
      grid-template-rows: repeat(4, 1fr);
      font-size: 8pt;
      text-align: center;
      font-weight: 600;
    }
    .doc-row {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .doc-row + .doc-row { border-top: 1px solid #7d7d7d; }
    .doc-title { text-align: center; margin: 14px 0 16px; }
    .doc-title h1 { font-size: 14pt; font-weight: bold; line-height: 1.5; }
    .body p { margin-bottom: 12px; text-align: justify; }
    .assinatura { margin-top: 24px; font-size: 10pt; line-height: 2; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-box">
      ${h}
    </div>
    <div class="header-center">
      <div class="titulo1">USO ${s} PAREX</div>
      <div class="titulo2">Gerenciamento de Recursos Humanos</div>
    </div>
    <div class="doc-box">
      <div class="doc-row">PMO</div>
      <div class="doc-row">FO-09-052</div>
      <div class="doc-row">REV.:00</div>
      <div class="doc-row">PAG: 1 de 1</div>
    </div>
  </div>

  <div class="doc-title">
    <h1>Termo de Responsabilidade - ${g}<br>Uso ${s} Parex - Funcionarios</h1>
  </div>

  <div class="body">
    <p>&emsp;&emsp;Por este instrumento a PAREX entrega a guarda ao Sr., ${r}, neste ato denominado USUARIO, inscrito no CPF no. ${i}, um computador ${s} marca ${l}, modelo ${c}, contendo: 01 carregador de bateria, patrimoniado sob o Numero PAT ${u}, ficando o mesmo responsavel por qualquer dano, perda ou furto, e da mesma forma, pelo zelo e manutencao deste equipamento, sob pena de ressarcimento a PAREX se algum destes fatos ocorrer e for constatada negligencia por parte do USUARIO. O usuario permanece responsavel tambem pelo equipamento quando da transferencia do mesmo a outros funcionarios / terceiros sem a previa autorizacao da Coordenacao de TI Corporativa.</p>

    <p>&emsp;&emsp;O USUARIO reconhece que a utilizacao do equipamento se dara somente no horario comercial de trabalho, ou seja, de 07h30min (Sete horas e trinta minutos) as 17h30min (dezessete horas e trinta minutos), com intervalo de 01h00min (Uma hora), de 2a a 5a feiras e das 07h30min (Sete horas e trinta minutos) as 16h30min (dezesseis horas e trinta minutos), com intervalo de 01h00min (Uma hora) as 6a feiras e que o equipamento e para uso exclusivo no trabalho da empresa.</p>

    <p>&emsp;&emsp;${_}</p>
    <br/>

    <div class="assinatura">
      <div>${p}</div>
      <br/>
      <div style="margin-top: 20px;">_______________________________________</div>
      <div style="margin-top: 0px;">${r}</div>
      <div style="margin-top: 0px;">CPF - ${i}</div>
      <br/>
      <div style="margin-top: 14px;">_______________________________________</div>
      <div style="margin-top: 0px;">Responsavel setor TI</div>
    </div>
  </div>
</body>
</html>`}e.s(["renderPdf",()=>r],73890)},10061,e=>e.a(async(t,a)=>{try{let t=await e.y("puppeteer-582bc9288a971b4a");e.n(t),a()}catch(e){a(e)}},!0),21996,e=>e.a(async(t,a)=>{try{var o=e.i(10061),r=e.i(14747),i=e.i(22734),n=t([o]);[o]=n.then?(await n)():n;let d=`
  <style>
    body {
      background-color: #fff;
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100%;
    }
  </style>
`;async function s(e,t,a){let n=`${d}${e}`,s=await o.default.launch({headless:!0,args:["--no-sandbox","--disable-setuid-sandbox"]});try{let e=await s.newPage();if(await e.setContent(n,{waitUntil:"networkidle0",timeout:1e4}),!a){let a=r.default.join(process.cwd(),"public");i.default.existsSync(a)||i.default.mkdirSync(a,{recursive:!0});let o=r.default.join(a,`termo-${t.replace(/[/\\?%*:|"]/g,"-")}.pdf`);await e.pdf({path:o,format:"A4",printBackground:!0,margin:{top:"10mm",right:"10mm",bottom:"10mm",left:"10mm"}});return}let o=await e.pdf({format:"A4",printBackground:!0,margin:{top:"10mm",right:"10mm",bottom:"10mm",left:"10mm"}});return Buffer.from(o)}finally{await s.close()}}e.s(["generatePdf",()=>s]),a()}catch(e){a(e)}},!1),46756,e=>e.a(async(t,a)=>{try{var o=e.i(89171),r=e.i(73890),i=e.i(21996),n=e.i(6599),s=t([i]);async function d(e){let t=await (0,n.hasModuleAccessForRequest)(e,"ALOCACOES"),a=await (0,n.hasActionPermissionForRequest)(e,"PRINT");if(!t||!a)return o.NextResponse.json({message:"Sem permissao para gerar termo PDF"},{status:403});try{let{nomeFun:t,idMatFun:a,cpfFun:n,idPat:s,descricaoPat:d,statusAlocacao:l,tipoPatrimonio:c,marca:u,modelo:p,outrosProgramas:m,localData:g}=await e.json();if(!t||!a||!s||void 0===d)return o.NextResponse.json({message:"Dados obrigatÃ³rios: nomeFun, idMatFun, idPat, descricaoPat"},{status:400});let _={nomeFun:t,idMatFun:a,cpfFun:n??null,idPat:s,descricaoPat:d??"",...null!=l&&{statusAlocacao:l},...null!=c&&{tipoPatrimonio:c},...null!=u&&{marca:u},...null!=p&&{modelo:p},...null!=m&&{outrosProgramas:m},...null!=g&&{localData:g}},f=`${a}-${s}`,h=await (0,r.renderPdf)(_),v=await (0,i.generatePdf)(h,f,!0);if(!v)return o.NextResponse.json({message:"Falha ao gerar o PDF"},{status:500});let x=`Termo-Responsabilidade-${f}.pdf`;return new o.NextResponse(v,{status:200,headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="${x}"`,"Content-Length":String(v.length)}})}catch(e){return console.error("Erro ao gerar PDF do termo:",e),o.NextResponse.json({message:e instanceof Error?e.message:"Erro ao gerar PDF"},{status:500})}}[i]=s.then?(await s)():s,e.s(["POST",()=>d,"dynamic",0,"force-dynamic","maxDuration",0,60]),a()}catch(e){a(e)}},!1),9329,e=>e.a(async(t,a)=>{try{var o=e.i(47909),r=e.i(74017),i=e.i(96250),n=e.i(59756),s=e.i(61916),d=e.i(74677),l=e.i(69741),c=e.i(16795),u=e.i(87718),p=e.i(95169),m=e.i(47587),g=e.i(66012),_=e.i(70101),f=e.i(26937),h=e.i(10372),v=e.i(93695);e.i(52474);var x=e.i(220),R=e.i(46756),w=t([R]);[R]=w.then?(await w)():w;let P=new o.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/cadastro/termo-pdf/route",pathname:"/api/cadastro/termo-pdf",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/cadastro/termo-pdf/route.ts",nextConfigOutput:"",userland:R}),{workAsyncStorage:E,workUnitAsyncStorage:A,serverHooks:C}=P;function b(){return(0,i.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:A})}async function y(e,t,a){P.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let o="/api/cadastro/termo-pdf/route";o=o.replace(/\/index$/,"")||"/";let i=await P.prepare(e,t,{srcPage:o,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,params:w,nextConfig:b,parsedUrl:y,isDraftMode:E,prerenderManifest:A,routerServerContext:C,isOnDemandRevalidate:$,revalidateOnlyGenerated:T,resolvedPathname:O,clientReferenceManifest:S,serverActionsManifest:N}=i,U=(0,l.normalizeAppPath)(o),j=!!(A.dynamicRoutes[U]||A.routes[O]),q=async()=>((null==C?void 0:C.render404)?await C.render404(e,t,y,!1):t.end("This page could not be found"),null);if(j&&!E){let e=!!A.routes[O],t=A.dynamicRoutes[U];if(t&&!1===t.fallback&&!e){if(b.experimental.adapterPath)return await q();throw new v.NoFallbackError}}let F=null;!j||P.isDev||E||(F=O,F="/index"===F?"/":F);let I=!0===P.isDev||!j,D=j&&!I;N&&S&&(0,d.setManifestsSingleton)({page:o,clientReferenceManifest:S,serverActionsManifest:N});let k=e.method||"GET",H=(0,s.getTracer)(),M=H.getActiveScopeSpan(),z={params:w,prerenderManifest:A,renderOpts:{experimental:{authInterrupts:!!b.experimental.authInterrupts},cacheComponents:!!b.cacheComponents,supportsDynamicResponse:I,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:b.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,o,r)=>P.onRequestError(e,t,o,r,C)},sharedContext:{buildId:R}},B=new c.NodeNextRequest(e),L=new c.NodeNextResponse(t),K=u.NextRequestAdapter.fromNodeNextRequest(B,(0,u.signalFromNodeResponse)(t));try{let i=async e=>P.handle(K,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=H.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${k} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${k} ${o}`)}),d=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var s,l;let c=async({previousCacheEntry:r})=>{try{if(!d&&$&&T&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await i(n);e.fetchMetrics=z.renderOpts.fetchMetrics;let s=z.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let l=z.renderOpts.collectedTags;if(!j)return await (0,g.sendResponse)(B,L,o,z.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(o.headers);l&&(t[h.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,r=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:x.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==r?void 0:r.isStale)&&await P.onRequestError(e,t,{routerKind:"App Router",routePath:o,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:$})},!1,C),t}},u=await P.handleResponse({req:e,nextConfig:b,cacheKey:F,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:$,revalidateOnlyGenerated:T,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:d});if(!j)return null;if((null==u||null==(s=u.value)?void 0:s.kind)!==x.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});d||t.setHeader("x-nextjs-cache",$?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),E&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,_.fromNodeOutgoingHttpHeaders)(u.value.headers);return d&&j||p.delete(h.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,f.getCacheControlHeader)(u.cacheControl)),await (0,g.sendResponse)(B,L,new Response(u.value.body,{headers:p,status:u.value.status||200})),null};M?await l(M):await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${k} ${o}`,kind:s.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},l))}catch(t){if(t instanceof v.NoFallbackError||await P.onRequestError(e,t,{routerKind:"App Router",routePath:U,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:$})},!1,C),j)throw t;return await (0,g.sendResponse)(B,L,new Response(null,{status:500})),null}}e.s(["handler",()=>y,"patchFetch",()=>b,"routeModule",()=>P,"serverHooks",()=>C,"workAsyncStorage",()=>E,"workUnitAsyncStorage",()=>A]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__8b80f378._.js.map
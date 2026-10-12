/* =========================================================================
   W.G.F. — Sistema de Gestão Integrado
   Controlo de acesso ao sistema documental

   >>> PARA MUDAR O UTILIZADOR E O CÓDIGO, EDITE AS DUAS LINHAS ABAIXO. <<<
   Depois de editar, guarde o ficheiro e recarregue a página.
   ========================================================================= */

var WGF_UTILIZADOR = 'wgf';
var WGF_CODIGO     = 'Sgi2026';

/* -------------------------------------------------------------------------
   AVISO IMPORTANTE

   Este controlo corre no navegador de quem visita. Serve para evitar que o
   sistema fique à vista de qualquer pessoa que encontre o endereço, mas
   NÃO é uma proteção verdadeira: quem souber o que procura consegue ler o
   utilizador e o código no código-fonte da página.

   Para proteção a sério, use a autenticação do servidor — o ficheiro
   .htaccess que acompanha este sistema faz isso em alojamentos Apache
   (cPanel e semelhantes). Aí a palavra-passe nunca chega ao navegador e
   nenhuma página é servida sem ela.
   ------------------------------------------------------------------------- */

(function () {
  'use strict';

  var CHAVE = 'wgf_sgi_sessao';

  // Caminho relativo até à raiz do sistema, a partir desta página.
  function raiz() {
    var s = document.currentScript;
    if (s && s.getAttribute('data-raiz') !== null) return s.getAttribute('data-raiz');
    // alternativa: deduzir do src do próprio script
    if (s && s.src) {
      var m = s.src.match(/^(.*\/)auth-guard\.js(?:\?.*)?$/);
      if (m) return m[1];
    }
    return '';
  }

  function autenticado() {
    try {
      return sessionStorage.getItem(CHAVE) === 'ok';
    } catch (e) {
      return false;   // sessionStorage bloqueado: trata como não autenticado
    }
  }

  // A página de entrada não se protege a si própria.
  var naPaginaDeEntrada = /(^|\/)login\.html($|[?#])/.test(location.pathname + location.search);
  if (naPaginaDeEntrada) return;

  if (autenticado()) return;

  // Esconder a página antes de qualquer coisa aparecer, e reencaminhar.
  try {
    document.documentElement.style.visibility = 'hidden';
  } catch (e) { /* ignorar */ }

  // Caminho desta pagina relativo a raiz do sistema, para voltar ca depois.
  var r = raiz();
  var subir = (r.match(/\.\.\//g) || []).length;
  var partes = location.pathname.split('/').filter(Boolean);
  var relativo = partes.slice(partes.length - 1 - subir).join('/');
  var destino = r + 'login.html?de=' + encodeURIComponent(relativo + location.search + location.hash);

  // Se o sistema estiver dentro da moldura (iframe), reencaminhar a janela toda.
  try {
    if (window.top !== window.self) {
      window.top.location.replace(raiz() + 'login.html');
      return;
    }
  } catch (e) { /* origem diferente: segue abaixo */ }

  location.replace(destino);
})();

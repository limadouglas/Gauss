 var numLinhas = 3,
     numColunas = 4;
 var metodoTriangulacao = true;

 (function($) {

     var numEstados = 0,
         estadoAtual = 0;
     var semSolucao = false;
     var jaCalculado = false;

     var tabelas = [];

     addLinha = function() {
         var novaLinha = $('<tr>');
         var cols = "";

         for (var i = 0; i < numColunas; i++) {
             cols += '<td id="val-td"><input type="text" value="0" class="val-input"></td>';
         }

         cols += '<td><img src="imagens/SVG/minus.svg" class="img-responsive" alt="deletar-linha" onclick="delLinha(this);"></td>';

         novaLinha.append(cols);
         novaLinha.insertAfter($('#tabela-gauss tbody tr').eq(numLinhas - 1));

         numLinhas++;
         return false;
     };



     addColuna = function() {

         var cols = '<th>' + ("X" + numColunas) + '</th>';

         $(cols).insertAfter(($('#tabela-gauss thead tr th').eq(numColunas - 2)));

         for (var i = 0; i < numLinhas; i++) {
             cols = $('<td id="val-td"><input type="text" value="0" class="val-input"></td>');
             var tr = $('#tabela-gauss tbody tr').eq(i); // pegando linha da tabela
             $(cols).insertAfter(tr.find('td').eq(numColunas - 1)); // pegando celula da linha referente a tabela.
         }

         numColunas++;

         $('#nova-linha').attr('colspan', String(numColunas - 1));

         // adicionando coluna excluir no tfoot
         cols = $('<td><img src="imagens/SVG/minus.svg" class="img-responsive" alt="deletar-coluna" onclick="delColuna(this);"></td>');

         var tr = $('#tabela-gauss tfoot tr').eq(0);
         $(cols).insertAfter(tr.find('td').eq(numColunas - 3));

         return false;
     };



     delLinha = function(handler) {
         if (numLinhas > 2) {
             var tr = $(handler).closest('tr');
             tr.remove();
             numLinhas--;
         }
         return false;
     };



     delColuna = function(handler) {
         if (numColunas > 3) {
             var indiceCol = $(handler).closest('td').index();

             for (var i = 0; i < numLinhas; i++) {
                 var tr = $('#tabela-gauss tbody tr').eq(i); // pegando linha da tabela corpo
                 tr.find('td').eq(indiceCol).remove(); // excluindo celula da linha referente a tabela.
             }

             var tr = $('#tabela-gauss thead tr').eq(0); // pegando linha da tabela cabeçalho
             tr.find('th').eq(indiceCol).remove(); // excluindo celula da linha referente a tabela.

             tr = $('#tabela-gauss tfoot tr').eq(0); // pegando linha da tabela rodape
             tr.find('td').eq(indiceCol).remove(); // excluindo celula da linha referente a tabela.

             numColunas--;

             $('#nova-linha').attr('colspan', String(numColunas - 1));


             // renomeando celulas ho thead
             for (var i = 0; i < numColunas - 1; i++) {
                 var tr = $('#tabela-gauss thead tr').eq(0); // pegando linha da tabela cabeçalho
                 tr.find('th').eq(i).text("X" + String(i + 1)); // excluindo celula da linha referente a tabela.
             }
         }

         return false;
     };



     function indice(handler) {

         var tr = $('#tabela-gauss tbody tr').eq(i); // pegando linha da tabela corpo
         tr.find('td').eq(indiceCol).remove(); // excluindo celula da linha referente a tabela.

         var td = $(handler).closest('td').index();
         return td.find('input');
     }



     $("#tabela-gauss").on("click", "input", function() {
         //console.log($(this).val());
     });



     // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     seidel = function() {
         tabelas = [];
         var vetorX = [];
         var vetXAux = [];
         var contRepeticoes = 0;


         // iniciando o vetorX com um chute inicial de 0;
         for (var i = 0; i < numColunas; i++) {
             vetorX[i] = 0;
         }

         // Passo 1, estruturando a tabela para poder receber os valores de X.

         for (var posLinha = 0; posLinha < numLinhas; posLinha++) {
             var linha = getLinha(posLinha);
             var pivo = linha[posLinha];

             // verificando se o valor de x é diferente de 0
             if (linha[posLinha] == 0) {
                 semSolucao = true;
                 break;
             }

             linha[posLinha] = "---"; //"X" + (posLinha + 1);
             salvarEstado();

             // invertendo sinal de todos os valores de X diferente da coluna em destaque.
             for (var i = 0; i < numColunas - 1; i++) {
                 if (i != posLinha) {
                     linha[i] = -(linha[i]);
                 }
             }
             setLinha(linha, posLinha);
             salvarEstado();

             // dividindo todos os valores de Xn pelo pivo.
             for (var i = 0; i < numColunas; i++) {
                 if (i != posLinha) {
                     linha[i] = parseFloat(linha[i] / pivo).toFixed(3);
                 }
             }

             setLinha(linha, posLinha);
             salvarEstado();
         }


         // Passo 2, Calculando a Tabela de acordo com os novos valores descobertos de X.

         while (true && semSolucao != true) {
             for (var i = 0; i < numLinhas - 1; i++) {
                 vetXAux[i] = parseFloat(vetorX[i]).toFixed(3);
             }


             for (var posLinha = 0; posLinha < numLinhas; posLinha++) {
                 var linha = getLinha(posLinha);
                 linha[posLinha] = "---";
                 var resultadoX = 0;

                 // calculando o resultado 
                 for (var i = 0; i < numColunas; i++) {
                     if (i != posLinha && i != (numColunas - 1)) {
                         resultadoX += parseFloat(linha[i] * vetorX[i]);
                     } else if (i == (numColunas - 1)) {
                         resultadoX += parseFloat(linha[numColunas - 1]);
                     }
                 }

                 vetorX[posLinha] = resultadoX;

                 console.log("linha:  " + linha);
                 console.log("vetorX:  " + vetorX);

                 setLinha(linha, posLinha);
                 salvarEstado();
             }

             // Passo 3, Verificando a Precisão: comparando os resultados anteriores com os atuais. A precisão de todos os Xn tem que ser menor que 0.0001

             var numPrecisao = 0;
             for (var i = 0; i < numLinhas - 1; i++) {
                 // verificação da precisão para parar o calculo.
                 if (Math.abs(vetorX[i] - vetXAux[i]) < 0.0001 && vetorX[i] != "---") {
                     numPrecisao++;
                 }
             }

             if (numPrecisao == (numLinhas - 1) || contRepeticoes > 5000) {
                 break;
             }
             contRepeticoes++;
         }

         // removendo valores antigos da tabela de resultado.
         $('#tabela-resultado tbody').remove();
         $('#tabela-resultado').append("<tbody></tbody>");

         // caso sem solução seja falso os resultados serão mostrados, senão uma mensagem 'sem resultados' irá aparecer.
         if (!semSolucao) {
             for (var i = 0; i < numColunas - 1; i++) {
                 var novaLinha = $('<tr class="table-info">');
                 var cols = "<td id='resultadoX'>X" + String(i + 1) + "</td>";
                 cols += "<td>" + String(vetorX[i].toFixed(9)) + "</td>";
                 novaLinha.append(cols);
                 $('#tabela-resultado tbody').append(novaLinha);
             }
         } else {
             var novaLinha = $('<tr class="table-danger">');
             var cols = "<td id='resultadoX'>Sem Solução!</td>";
             novaLinha.append(cols);
             $('#tabela-resultado tbody').append(novaLinha);
         }

     }


     // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     triangulacao = function() {

         if (!jaCalculado) {
             jaCalculado = true;

             // resetando variaveis
             estadoAtual = 0;
             //avancarEstado();
             numEstados = 0;
             tabelas = [];

             // salvando estado inicial da tabela.
             salvarEstado();

             // Organizando a estrutura da tabela (Triangulo de Zeros).
             for (var posLinha = 0, posColuna = 0; posLinha < numLinhas - 1; posLinha++, posColuna++) {

                 var linha = [];
                 var linhaAux = [];

                 organizarTabela(posLinha, posColuna);

                 // tratamento de erro, quando o pivo da primeira linha for igual a 0
                 var linhaUm = getLinha(0);
                 if (linhaUm[0] == 0) {
                     semSolucao = true;
                     //break;
                 }

                 // atualizando valor da linha
                 linha = getLinha(posLinha);

                 for (var posLinhaCalc = posLinha + 1; posLinhaCalc < numLinhas; posLinhaCalc++) {

                     // atualizando vetor
                     linhaAux = getLinha(posLinhaCalc, i);

                     // calculando linhas
                     linhaAux = calcVetor(linha, linhaAux, posColuna, posLinha, posLinhaCalc);
                 }

             }


             // calculo final descobrindo os valores de Xn
             var xn;
             for (var posLinha = numLinhas - 1, posColuna = numColunas - 2; posLinha >= 0; posLinha--, posColuna--) {

                 // caso de divisão por zero a variavel semSolução será verdadeira e o programa irá finalizar os calculos.
                 if (celula(posLinha, posColuna) == 0) {
                     semSolucao = true;
                     break;
                 }

                 // calculando o valor de x
                 xn = (celula(posLinha, numColunas - 1) / celula(posLinha, posColuna));

                 // atualizando linha atual da tabela.
                 var linha = getLinha(posLinha);
                 linha[numColunas - 1] = xn;
                 linha[posColuna] = 0;
                 setLinha(linha, posLinha);
                 salvarEstado();

                 // multiplicando toda coluna de xn pelo valor descoberto na ultima linha.
                 for (var i = 0; i < posLinha; i++) {
                     var linha = getLinha(i);
                     linha[posColuna] = (linha[posColuna] * xn);
                     setLinha(linha, i);
                     salvarEstado();
                     linha[numColunas - 1] = linha[numColunas - 1] + (-linha[posColuna]);
                     linha[posColuna] = (0).toFixed(3);
                     setLinha(linha, i);
                     salvarEstado();
                 }

             }

             // removendo valores antigos da tabela de resultado.
             $('#tabela-resultado tbody').remove();
             $('#tabela-resultado').append("<tbody></tbody>");

             // caso sem solução seja falso os resultados serão mostrados, senão uma mensagem 'sem resultados' irá aparecer.
             if (!semSolucao) {
                 for (var i = 0; i < numColunas - 1; i++) {
                     var novaLinha = $('<tr class="table-info">');
                     var cols = "<td id='resultadoX'>X" + String(i + 1) + "</td>";
                     cols += "<td>" + String(celula(i, numColunas - 1).toFixed(6)) + "</td>";
                     novaLinha.append(cols);
                     $('#tabela-resultado tbody').append(novaLinha);
                 }
             } else {
                 var novaLinha = $('<tr class="table-danger">');
                 var cols = "<td id='resultadoX'>Sem Solução!</td>";
                 novaLinha.append(cols);
                 $('#tabela-resultado tbody').append(novaLinha);
             }
         }

     };


     // organizar linhas por tamanho absoluto do pivo
     function organizarTabela(posLinha, posColuna) {

         for (var i = posLinha + 1; i < numLinhas; i++) {
             var linhaUm = getLinha(posLinha);
             var linhaDois = getLinha(i);

             if (Math.abs(linhaUm[posColuna]) < Math.abs(linhaDois[posColuna])) {
                 setLinha(linhaDois, posLinha);
                 setLinha(linhaUm, i);
                 salvarEstado();
             }
         }
     }






     function calcVetor(vet1, vet2, posColuna, posLinhaVet1, posLinhaVet2) {
         // variaveis auxliares para salvar os primeiros valores de cada linha
         var valAux1 = vet1[posColuna],
             valAux2 = vet2[posColuna];


         if (valAux1 + valAux2 == 0) {
             // subtraindo as duas linhas e salvando na segunda linha
             for (var i = posColuna; i < vet1.length; i++) {
                 vet2[i] = vet1[i] + vet2[i];
             }

             //atualizar tabela
             setLinha(vet2, posLinhaVet2);
             salvarEstado();

             // se o primeiro valor da linha de baixo for igual a 0 então não preciso calcular.
         } else if (valAux2 != 0) {

             // multiplicando a linha de cima pelo primeiro valor da linha de baixo com o sinal invertido.
             for (var i = posColuna; i < vet1.length; i++) {
                 vet1[i] = vet1[i] * valAux2;
             }

             //atualizar tabela
             setLinha(vet1, posLinhaVet1);
             salvarEstado();

             // caso os valores não sejam divisiveis(resto diferente de 0) é necessario multiplicar o primeiro de cima pela linha de baixo.
             if ((valAux1 % valAux2) != 0 || (valAux2 % valAux1) != 0) {

                 for (var i = posColuna; i < vet2.length; i++) {
                     vet2[i] = vet2[i] * valAux1;
                 }
                 //atualizar tabela
                 setLinha(vet2, posLinhaVet2);
                 salvarEstado();
             }

             // subtraindo as duas linhas e salvando na segunda linha
             for (var i = posColuna; i < vet1.length; i++) {
                 vet2[i] = vet1[i] - vet2[i];
             }

             //atualizar tabela
             setLinha(vet2, posLinhaVet2);
             salvarEstado();
         }

         // retornando vetor com o resultado da segunda linha.
         return vet2;
     }

     // salvando estado da tabela.
     function salvarEstado() {

         var tabelaEstado = [];

         for (var i = 0; i < numLinhas; i++) {
             tabelaEstado[i] = getLinha(i);
         }

         tabelas[numEstados++] = tabelaEstado;
     }


     // esta funcao recebe as coordenas de uma celula da tabela e a retorna no tipo inteiro.
     function celula(linha, coluna) {
         var tr = $('#tabela-gauss tbody tr').eq(linha);
         return parseFloat(tr.find('input').eq(coluna).val());
     }

     // obter valor de uma linha
     function getLinha(linha) {
         var tr = $('#tabela-gauss tbody tr').eq(linha);
         var vetor = [];

         for (var i = 0; i < numColunas; i++) {
             vetor[i] = parseFloat(tr.find('input').eq(i).val()).toFixed(3);
         }

         return vetor;
     }

     // atualizar valores de uma linha
     function setLinha(vetor, linha) {

         var tr = $('#tabela-gauss tbody tr').eq(linha);

         for (var i = 0; i < vetor.length; i++) {
             tr.find('input').eq(i).val(String(vetor[i]));
         }
     }

     // calcular tudo de uma vez e mostrar resultado
     calcular = function() {

         if (!jaCalculado) {
             if (metodoTriangulacao) {
                 triangulacao();
             } else {
                 seidel();
             }
         }

         estadoAtual = numEstados - 1;
     }

     // ir para o proximo estado
     proximo = function() {
         if (!jaCalculado) {
             if (metodoTriangulacao) {
                 triangulacao();
             } else {
                 seidel();
             }
         }

         if (estadoAtual < numEstados - 1) {
             estadoAtual++;
         } else {
             estadoAtual = 0;
         }

         for (var i = 0; i < numLinhas; i++) {
             setLinha(tabelas[estadoAtual][i], i);
         }
     }


     // ir para o estado anterior
     anterior = function() {
         if (!jaCalculado) {
             if (metodoTriangulacao) {
                 triangulacao();
             } else {
                 seidel();
             }
         }


         if (estadoAtual > 0) {
             estadoAtual--;
         } else {
             estadoAtual = numEstados - 1;
         }

         for (var i = 0; i < numLinhas; i++) {
             setLinha(tabelas[estadoAtual][i], i);
         }
     }

     // esta função reconhece que algum valor da tabela foi alterado e permite que os valores possão ser recalculados, atribuindo false a variavel jaCalculado.
     $('input').on('input', function() {
         jaCalculado = false;
         semSolucao = false;
     });

     tipoMetodo = function(triangulacao) {
         if (triangulacao) {
             metodoTriangulacao = true;
             $('#tipoMetodo').text("Triangulação");
         } else {
             metodoTriangulacao = false;
             $('#tipoMetodo').text("Seidel");
         }

         jaCalculado = false;
     }

 })(jQuery);
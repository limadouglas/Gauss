 var numLinhas = 3,
     numColunas = 4;

 (function($) {


     addLinha = function() {
         var novaLinha = $('<tr>');
         var cols = "";

         for (var i = 0; i < numColunas; i++) {
             cols += '<td id="val-td"><input type="text" value="0" class="val-input"></td>';
         }
         cols += '<td><img src="imagens/SVG/minus.svg" class="img-responsive" alt="deletar-linha" onclick="delLinha(this);"></td>';

         novaLinha.append(cols);
         novaLinha.insertAfter($('#tabela-gauss tbody tr').eq(numLinhas - 1));

         //$('#nova-coluna').attr('rowspan', 1);

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
         if (numLinhas > 3) {
             var tr = $(handler).closest('tr');
             tr.remove();
             numLinhas--;
         }
         return false;
     };



     delColuna = function(handler) {
         if (numColunas > 4) {
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



     gauss = function() {
         // Organizando a estrutura da tabela(Triangulo de Zeros).
         for (var posLinha = 0, posColuna = 0; posLinha < numLinhas - 1; posLinha++, posColuna++) {

             var linha = [];
             var linhaAux = [];

             // organizar linhas por tamanho absoluto do pivo
             for (var i = posLinha + 1; i < numLinhas; i++) {
                 var linhaUm = getLinha(posLinha);
                 var linhaDois = getLinha(i);

                 if (Math.abs(linhaUm[posColuna]) < Math.abs(linhaDois[posColuna])) {
                     setLinha(linhaDois, posLinha);
                     setLinha(linhaUm, i);
                 }
             }

             // atualizando valor da linha
             linha = getLinha(posLinha);


             for (var posLinhaCalc = posLinha + 1; posLinhaCalc < numLinhas; posLinhaCalc++) {

                 // atualizando vetor
                 linhaAux = getLinha(posLinhaCalc, i);

                 // zerando valores iniciais do vetor(valores já calculados)
                 for (var i = 0; i < posColuna; i++) {
                     linha[i] = 0;
                     linhaAux[i] = 0;
                 }

                 linhaAux = calcVetor(linha, linhaAux, posColuna);
                 //atualizar tabela
                 setLinha(linhaAux, posLinhaCalc);
             }
         }


         // calculo final descobrindo os valores de Xn
         var xn;
         for (var posLinha = numLinhas - 1, posColuna = numColunas - 2; posLinha >= 0; posLinha--, posColuna--) {
             // calculando o valor de x
             xn = (celula(posLinha, numColunas - 1) / celula(posLinha, posColuna));

             // atualizando linha atual da tabela.
             var linha = getLinha(posLinha);
             linha[numColunas - 1] = xn;
             linha[posColuna] = 0;
             setLinha(linha, posLinha);

             // multiplicando toda coluna de xn pelo valor descoberto na ultima linha.
             for (var i = 0; i < posLinha; i++) {
                 var linha = getLinha(i);
                 linha[numColunas - 1] = linha[numColunas - 1] + (-(linha[posColuna] * xn));
                 linha[posColuna] = 0;
                 setLinha(linha, i);
             }

         }

         for (var i = 0; i < numColunas - 1; i++) {
             var novaLinha = $('tr');
             var cols = "<td>X" + String(i) + "</td>";
             cols = "<td>" + String(celula(i, numColunas - 1)) + "</td>";
             novaLinha.append(cols);
             $('#tabela-resultado tbody').append(novaLinha);
         }

     };


     // esta funcao recebe as coordenas de uma celula da tabela e a retorna no tipo inteiro.
     function celula(linha, coluna) {
         var tr = $('#tabela-gauss tbody tr').eq(linha);
         return parseFloat(tr.find('input').eq(coluna).val());
     }



     function calcVetor(vet1, vet2, pos) {
         // variaveis auxliares para salvar os primeiros valores de cada linha
         var valAux1 = vet1[pos],
             valAux2 = vet2[pos];

         // se o primeiro valor da linha de baixo for igual a 0 então não preciso calcular.
         if (valAux2 != 0) {
             // verificando se o primeiro valor da linha de cima é igual ao primeiro da linha de baixo negativado, quando isso acontece é necessario apenas somar as linhas.
             if (valAux1 != -(valAux2)) {

                 // multiplicando a linha de cima pelo primeiro valor da linha de baixo com o sinal invertido.
                 for (var i = pos; i < vet1.length; i++) {
                     vet1[i] = vet1[i] * -valAux2;
                 }
                 // caso os valores não sejam divisiveis(resto diferente de 0) é necessario multiplicar o primeiro de cima pela linha de baixo.
                 if ((valAux1 % valAux2) != 0) {
                     for (var i = pos; i < vet2.length; i++) {
                         vet2[i] = vet2[i] * valAux1;
                     }
                 }
             }
             // somando as duas linhas e salvando na segunda linha
             for (var i = pos; i < vet1.length; i++) {
                 vet2[i] = vet1[i] + vet2[i];
             }
         }

         // retornando vetor com o resultado da segunda linha.
         return vet2;
     }


     function getLinha(linha) {
         var tr = $('#tabela-gauss tbody tr').eq(linha);
         var vetor = [];

         for (var i = 0; i < numColunas; i++) {
             vetor[i] = parseFloat(tr.find('input').eq(i).val());
         }

         return vetor;
     }


     function setLinha(vetor, linha) {

         var tr = $('#tabela-gauss tbody tr').eq(linha);

         for (var i = 0; i < vetor.length; i++) {
             tr.find('input').eq(i).val(String(vetor[i]));
         }
     }


 })(jQuery);
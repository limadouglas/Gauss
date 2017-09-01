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
         console.log($(this).val());
     });



     gauss = function() {
         for (var i = 0; i < numLinhas - 1; i++) {
             var linha = [];
             var linhaAux = []
             for (var j = 0; j < numColunas - 1; j++) {
                 linha[j] = celula(i, j);
                 linhaAux[j] = celula(i + 1, j);
             }
         }
     };



     function celula(a, b) {
         var tr = $('#tabela-gauss tbody tr').eq(a);
         return tr.find('input').eq(b).val();
     }


 })(jQuery);

 5 * -2
 2 * 5


 2 * -2
 2 * 2
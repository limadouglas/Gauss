 
    var numLinhas = 3,
        numColunas = 4;

    (function($) {

        addLinha = function() {
            var novaLinha = $('<tr>');
            var cols = "";

            for (var i = 0; i < numColunas; i++) {
                cols += '<td id="val-td"><input type="text" value="0" class="val-input"></td>';
            }
            cols += '<td><img src="imagens/delete-circle.png" alt="deletar-linha" onclick="delLinha(this);"></td>';

            novaLinha.append(cols);
            novaLinha.insertAfter($('#tabela-gauss tbody tr').eq(numLinhas - 1));

            //$('#nova-coluna').attr('rowspan', 1);

            numLinhas++;
            return false;
        };


        addColuna = function() {

            var cols = '<th>' + (numColunas) + '</th>';

            $(cols).insertAfter(($('#tabela-gauss thead tr th').eq(numColunas - 2)));

            for (var i = 0; i < numLinhas; i++) {
                cols = $('<td id="val-td"><input type="text" value="0" class="val-input"></td>');
                var tr = $('#tabela-gauss tbody tr').eq(i); // pegando linha da tabela
                $(cols).insertAfter(tr.find('td').eq(numColunas - 1)); // pegando celula da linha referente a tabela.

            }

            numColunas++;

            $('#nova-linha').attr('colspan', String(numColunas));

            // adicionando coluna excluir no tfoot
            cols = $('<td><img src="imagens/delete-circle.png" alt="deletar-coluna" onclick="delColuna(this);"></td>');

            var tr = $('#tabela-gauss tfoot tr').eq(0);
            $(cols).insertAfter(tr.find('td').eq(numColunas - 2));
            return false;
        };


        delLinha = function(handler) {
            if (numLinhas > 1) {
                var tr = $(handler).closest('tr');
                tr.remove();
                numLinhas--;
            }
            return false;

        };

        delColuna = function(handler) {
            
            console.log($(handler).closest('tr').parent().index());

            //$(handler).closest('tr');
            //var tr = $('#tabela-gauss tfoot tr').eq(0);
            //$(cols).insertAfter(tr.find('td').eq(numColunas - 2));

            //cols = $('<td id="val-td"><input type="text" value="0" class="val-input"></td>');
            //var tr = $('#tabela-gauss tbody tr').eq(i); // pegando linha da tabela
            return false;
        };


    })(jQuery);
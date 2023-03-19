(function($){
    $(document).ready(function() {
        var table = $("#projects").DataTable(
        {
            "dom":"Blfrtip",
            "lengthMenu":[ [25,50,100,200,500,-1],[25,50, 100, 200,500, "All"] ],
            "serverSide":true,
            "processing":true,
            "searching": false,
            "ajax":{
                "url":"./lib/table.projects.php",
                "type":"POST",
                "pages": 5,
                "data": function ( d ) {
                    d.godina = $('#godina').val();
                    d.mesto = $('#mesto').val();
                    d.organ = $('#organ').val();
                    d.sektor = $('#sektor').val();
                    d.maticni = $('#maticni').val();
                    d.korisnik = $('#korisnik').val();
                    d.zastupnik = $('#zastupnik').val();
                    d.tip = $('#tip').val();
                    d.iznos = $('#iznos').val();
                }
            },
            "columns":
            [
                {
                    "data": "naziv_konkursa",
                    "width": "15%"
                },
                {
                    "data": "godina",
                    "width": "5%"
                },
                {
                    "data": "mesto",
                    "width": "10%"
                },
                {
                    "data": "organ",
                    "width": "10%"
                },
                {
                	"data": "sektor",
                    "width": "10%"
                },
                {
                    "data": "naziv",
                    "width": "10%"
                },
                {
                    "data": "korisnik",
                    "render": function(data, type, full){
                        var moreData =
                            '<div class="popHover" data-mb="'+full.maticni+'" data-id="'+full.id+'">'+data+
                                '<div class="tooltip">'+
                                    '<ul id="id_'+full.id+'">'+
                                    '</ul>'+
                                '</div>'+
                            '</div>';
                        return moreData;
                    },
                    "width": "10%"
                },
                {
                    "data": "zastupnik",
                    "render": function(data, type, full){
                        var zastupnici = [];
                        $.each(data, function(key, value) {
                            zastupnici.push(value.ime);
                        });
                        return zastupnici.join(", ")
                    },
                    "width": "10%"
                },
                {
                	"data": "tip",
                    "width": "10%"
                },
                {
                    "data": "maticni",
                    "width": "10%"
                },
                {
                    "data": "iznos",
                    "className": 'dt-body-right',
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                    "width": "10%"
                }
            ],
            "language": {
                lengthMenu: "Prikaži _MENU_ redova po strani",
                zeroRecords: "Nema podataka",
                info: "Strana _PAGE_ od _PAGES_",
                infoEmpty: "Prikazano 0 do 0 od 0 redova",
                infoFiltered: "(filtrirano od _MAX_ redova)",
                processing:     "Pretraga podataka...",
                search:         "Pretraga:",
                infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
                infoPostFix:    "",
                loadingRecords: "Podaci se učitavaju...",
                emptyTable:     "Nema podataka u tabeli",
                paginate: {
                    first:      "Prva",
                    previous:   "Prethodna",
                    next:       "Sledeća",
                    last:       "Poslednja"
                },
                aria: {
                    sortAscending:  ": sortiraj uzlazno",
                    sortDescending: ": sortiraj silazno"
                }
            }
        });
        //apply filter on table projects
        $('#godina,#organ,#mesto,#sektor,#maticni,#tip,#iznos,#korisnik,#zastupnik ').on('change', function(){
        	table.ajax.reload();
        })
        //export to CSV
        $('body').on('click', '#exportCsv', function(){
            var godina = $('#godina').val();
            var mesto = $('#mesto').val();
            var organ = $('#organ').val();
            var sektor = $('#sektor').val();
            var maticni = $('#maticni').val();
            var korisnik = $('#korisnik').val();
            var zastupnik = $('#zastupnik').val();
            var tip = $('#tip').val();
            var iznos = $('#iznos').val();
            var loc = "./toCsv.php?"+
                "godina="+godina+
                "&mesto="+mesto+
                "&organ="+organ+
                "&sektor="+sektor+
                "&maticni="+maticni+
                "&korisnik="+korisnik+
                "&zastupnik="+zastupnik+
                "&tip="+tip+
                "&iznos="+iznos;
            window.location.href = loc;
        })
        $('#god').select2({
            placeholder: 'Selektuj godinu'
        });

        //get dropdown
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: 'ajax.php',
            data: {
                action:'getDropDownLists'
            },
            success: function (response) {
                $.each(response, function(key, value) {
                    var select = '#'+key;
                    $(select).html(value);
                    $(select).select2({
                        placeholder: key.toUpperCase(),
                        width: '100%'
                    });
                    $(select).css('textTransform', 'capitalize');
                });

                $('#selects').show();
                $('#filterMsg').hide();
            },
            error: function (response) {
                console.log(response);
            }
        });
        //$( selector ).on( "mouseenter mouseleave", handlerInOut );
        $('body').on("mouseenter",".popHover", function(){
            var mb = $(this).attr('data-mb');
            var ID = $(this).attr('data-id');
            $('body').find('#id_'+ID).html('<li>Podaci se učitavaju...</li>')
            $.ajax({
                type: "POST",
                dataType: 'html',
                url: 'ajax.php',
                data: {
                    action:'additionalData',
                    mb: mb
                },
                success: function (response) {
                    $('body').find('#id_'+ID).html(response)
                },
                error: function (response) {
                    console.log(response);
                }
            });
        });
        var instance = [];
        //search
        $('body').on('click', '#resetBtn', function(){
        	var selects = ['godina','organ','mesto','sektor','tip','iznos'];
            $('.filter-autocomplete-item').val('');
        	$.each(selects, function(key, sel) {
        		//$('#'+sel).val('');
				$('#'+sel).val(null).trigger('change');
			});
        	table.ajax.reload();
        });
        $('#selects').hide();
        $('#filterMsg').show();

        //autocomplete
        function getAutocompleteOptions(placeholder, field)
        {
            var options = {
                placeholder: placeholder,
                url: function(search) {
                    return "ajax.php";
                },
                getValue: function(element) {
                    var fld = (field == 'zastupnik') ? 'ime' :field;
                    return element[fld];
                },
                ajaxSettings: {
                    dataType: "json",
                    method: "POST",
                    data: {
                        dataType: "json",
                        action: "autocomplete",
                        column: field
                    }
                },
                list: {
                    maxNumberOfElements: 100000,
                    match: {
                        enabled: true
                    }
                },
                preparePostData: function(data) {
                    data.search = $("#"+field).val();
                    return data;
                },
                requestDelay: 400
            };
            return options
        }
        $("#korisnik").easyAutocomplete(getAutocompleteOptions("Pretraga korisnika", "korisnik"));
        $("#maticni").easyAutocomplete(getAutocompleteOptions("Pretraga po matičnom br", "maticni"));
        $("#zastupnik").easyAutocomplete(getAutocompleteOptions("Pretraga po zastupniku", "zastupnik"));
    } );
}(jQuery));

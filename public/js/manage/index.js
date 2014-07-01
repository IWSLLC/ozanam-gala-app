(function() {
  $(function() {

    $('#export').click(function(){
      var extra = ''
      if ($('#showDownloaded').is(':checked'))
        extra = 'downloaded=1'
      var url ='/manage/api/registrations/' + $('#year option:selected').val() + '?csv=1&' + extra;
      setTimeout(function() { reload(); }, 1000)
      window.location = url;
    });

    $('#showDownloaded').change(function() {
      reload();
    })

    load();

  })
  var reload = function() {
    $('#list').dataTable().fnDestroy();
    load();
  }

  var load = function() {

    var extra = ''
    if ($('#showDownloaded').is(':checked'))
      extra = '?downloaded=1'
    var url ='/manage/api/registrations/' + $('#year option:selected').val() + extra;

    $.getJSON(url, function(json) {
      var data = [];
      if (json.data)
        data = json.data;

      grid = $('#list').dataTable({
        autoWidth: false,
        // dom: '<\'row-fluid\'<\'span6\'l><\'span6\'f>r>t<\'row-fluid\'<\'span6\'i><\'span6\'p>',
        // paginationType: 'bootstrap',
        serverSide: false,
        processing: true,
        drawCallback: function() {
          return $('div.dataTables_filter input').focus();
        },
        language: {
          emptyTable: "No matching records found"
        },
        sorting: [[ 7, "desc" ]],
        columns: [
          {
            data: '_id',
            title: 'Confirmation',
            visible : false,
            searchable : true
          }, {
            data: 'contact.contact',
            title: 'Contact'
          }, {
            data: 'contact.email',
            title: 'Email'
          }, {
            data: 'contact.phone',
            title: 'Phone'
          }, {
            data: 'sponsorship',
            title: 'Sponsorship'
          }, {
            data: 'order.paymentOption',
            title: 'Payment'
          }, {
            data: 'total',
            title: 'Total'
          }, {
            data: 'order.dateRegistered',
            render: function ( data, type, full ) { return moment(data).format('YYYY-MM-DD h:mm a'); },
            title: 'Registered'
          }, {
            data: 'order.dateRegistered',
            render: function ( data, type, full ) { return moment(data).fromNow(); },
            title: 'Age'
          }
        ],
        data : data
      });
    });
  }
}).call(this);

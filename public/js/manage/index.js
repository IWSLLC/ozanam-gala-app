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
        bAutoWidth: false,
        sDom: '<\'row-fluid\'<\'span6\'l><\'span6\'f>r>t<\'row-fluid\'<\'span6\'i><\'span6\'p>',
        sPaginationType: 'bootstrap',
        bServerSide: false,
        bProcessing: true,
        fnDrawCallback: function() {
          return $('div.dataTables_filter input').focus();
        },
        oLanguage: {
          sEmptyTable: "No matching records found"
        },
        aaSorting: [[ 7, "desc" ]],
        aoColumns: [
          {
            mData: '_id',
            sTitle: 'Confirmation',
            bVisible : false,
            bSearchable : true
          }, {
            mData: 'contact.contact',
            sTitle: 'Contact'
          }, {
            mData: 'contact.email',
            sTitle: 'Email'
          }, {
            mData: 'contact.phone',
            sTitle: 'Phone'
          }, {
            mData: 'sponsorship',
            sTitle: 'Sponsorship'
          }, {
            mData: 'order.paymentOption',
            sTitle: 'Payment'
          }, {
            mData: 'total',
            sTitle: 'Total'
          }, {
            mData: 'order.dateRegistered',
            mRender: function ( data, type, full ) { return moment(data).format('YYYY-MM-DD h:mm a'); },
            sTitle: 'Registered'
          }, {
            mData: 'order.dateRegistered',
            mRender: function ( data, type, full ) { return moment(data).fromNow(); },
            sTitle: 'Age'
          }
        ],
        aaData : data
      });  
    });
  }
}).call(this);
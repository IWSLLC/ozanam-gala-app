$(function() {

  $('#export').click(function(){
    var extra = ''
    if ($('#showDownloaded').is(':checked'))
      extra = 'downloaded=1'
    var url ='/manage/api/auctions/' + $('#year option:selected').val() + '?csv=1&' + extra;
    setTimeout(function() { reload();}, 1000)
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
  var url ='/manage/api/auctions/' + $('#year option:selected').val() + extra;

  $.getJSON(url, function(json) {
    var data = [];
    if (json.data)
      data = json.data;

    grid = $('#list').dataTable({
      serverSide: false,
      processing: true,
      drawCallback: function() {
        return $('div.dataTables_filter input').focus();
      },
      language: {
        sEmptyTable: "No matching records found"
      },
      sorting: [[ 5, "desc" ]],
      columns: [
        {
          data: '_id',
          title: 'Confirmation',
          visible : false,
          searchable : true
        }, {
          data: 'contact.donor',
          title: 'Donor'
        }, {
          data: 'contact.email',
          title: 'Email'
        }, {
          data: 'contact.phone',
          title: 'Phone'
        }, {
          data: 'contact.contact',
          title: 'Contact'
        }, {
          data: 'dateRegistered',
          render: function ( data, type, full ) { return moment(data).format('YYYY-MM-DD h:mm a'); },
          title: 'Registered'
        }, {
          data: 'dateRegistered',
          render: function ( data, type, full ) { return moment(data).fromNow(); },
          title: 'Age'
        }
      ],
      data : data
    });
  });
}

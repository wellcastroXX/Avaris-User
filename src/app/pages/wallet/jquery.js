Iugu.setAccountID("13E99F0E22E542C58BA9FC087CB6F87B");
Iugu.setTestMode(true);

jQuery(function($) {
  $('#payment-form').submit(function(evt) {
      var form = $(this);
      var tokenResponseHandler = function(data) {
          
          if (data.errors) {
              alert("Erro salvando cartão: " + JSON.stringify(data.errors));
          } else {
              $("#token").val( data.id );
              form.get(0).submit();
          }
          
          // Seu código para continuar a submissão
          // Ex: form.submit();
      }
      
      Iugu.createPaymentToken(this, tokenResponseHandler);
      return false;
  });
}); 
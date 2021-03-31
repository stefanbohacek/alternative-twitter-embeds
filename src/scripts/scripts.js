document.addEventListener( 'DOMContentLoaded', function(event){
  document.querySelectorAll( 'pre code' ).forEach( function( block ){
    hljs.highlightBlock( block );
  });
});

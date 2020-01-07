$(function () {
	// body...
	// alert("hi");
	if($('textarea#ta').length){
		CKEDITOR.replace('ta');
	}
	$('a.confirmDeletion').on('click',() => {
		// e.preventDefault();
		if (!confirm('Confirm deletion')){
			return false;
		}
	});

});
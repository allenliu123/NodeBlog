$(document).ready(function(){

	$.ajax({
		type: 'get',
		url: '/api/comment',
		data: {
			contentid: $('#contentId').val()
		},
		success: function(responseData){
			var data = responseData.reverse();
			$('#postContent').val('');
			$('#commentsCount').html(data.length);
			var html= '';
			for (var i = 0; i < data.length; i++) {
				
				html += "<hr><h5>"+ data[i].username +
						"<small class='float-right'>"+ 
						formatDate(data[i].postTime) +
						"</small>" + "<h5>"+ "<p>" +
						data[i].content +"</p>";
			}
			$("#commentContent").html(html);
		}
	})

	$('#commentBtn').on('click', function(){
		$.ajax({
			type: 'post',
			url: '/api/comment/post',
			data: {
				contentid: $('#contentId').val(),
				content: $('#postContent').val()
			},
			success: function(responseData){
				var data = responseData.data.reverse();
				
				$('#postContent').val('');
				$('#commentsCount').html(data.length);
				var html= '';
				for (var i = 0; i < data.length; i++) {
					
					html += "<h5>"+ data[i].username +
							"<small class='float-right'>"+ formatDate(data[i].postTime) +"</small>" +	
							"<h5>"+ 
							"<p>" + data[i].content +"</p><hr>";
				}
				$("#commentContent").html(html);
				$(".alert").find('b').html("success!");
				$(".alert a").html(" "+responseData.message);
				$('.alert').fadeIn();
			}
		})
	});
		
});

function formatDate(d){
	var date = new Date(d);
	return date.getFullYear() + '年' + date.getMonth() + '月' + date.getDate() + '日 ' +
	date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

}
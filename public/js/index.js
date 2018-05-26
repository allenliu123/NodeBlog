$(document).ready(function(){

	$("form").submit(function(event){
	 	event.preventDefault();
	});
	
	var $loginBox = $('#loginBox');
	var $registerBox = $('#registerBox');
	// var $userinfoBox = $('#userinfoBox');

	$loginBox.find('a').on('click', function(){
		$registerBox.show();
		$loginBox.hide();
	});

	$registerBox.find('a').on('click', function(){
		$loginBox.show();
		$registerBox.hide();
	});

	$registerBox.find('input[type="submit"]').on('click',function(){
		$.ajax({
			type: 'post',
			url: '/api/user/register',
			dataType:'json',
			data:{
				username: $registerBox.find('input[name="username"]').val(),
				password: $registerBox.find('input[name="password"]').val(),
				repassword: $registerBox.find('input[name="repassword"]').val()
			},
			success: function(result){
				if(result.code == 0){
					$(".alert").find('b').html("success!");
					$(".alert a").html(" "+result.message);
					$('.alert').fadeIn();
					setTimeout(function(){
						$loginBox.show();
						$registerBox.hide();	
						$('.alert').fadeOut();
					},1000);
				}
				else{
					$(".alert").find('b').html("error!");
					$(".alert a").html(" "+result.message);
					$('.alert').fadeIn();
				}
			}
		});
	});

	$loginBox.find('input[type="submit"]').on('click', function(){
		$.ajax({
			type: 'post',
			url: 'api/user/login',
			dataType: 'json',
			data: {
				username: $loginBox.find('input[name="username"]').val(),
				password: $loginBox.find('input[name="password"]').val(),
				
			},
			success:function(result){
				// console.log(result);
				if(result.code == 0){
					// $loginBox.find('p').html(result.message);
					// setTimeout(function(){
					// 	$userinfoBox.show();
					// 	$loginBox.hide();
					// 	$userinfoBox.find('#username').html(result.userinfo.username);
					// 	$userinfoBox.find('#info').html('welcome to my blog!');

						
					// },1000)

					window.location.reload();
				}else{
					$(".alert").find('b').html("error!");
					$(".alert a").html(" "+result.message);
					$('.alert').fadeIn();
				}
			}
		})
	});

	$('#logout').on('click', function(){
		$.ajax({
			type: 'get',
			url: 'api/user/logout',
			success: function(result){
				if(!result.code){
					window.location.reload();
				}
			}
		});
	})
});





$(function(){
	var rank = Number(localStorage.getItem('rank'));
	var USERNAME = localStorage.getItem('username');
	if(rank == 3){
		$('.vessel .switch-btn').show();
	}else{
		$('.vessel h2').show();
	}
	switch (rank){
		case 1:
			rank = 'staff';
			break;
		case 2:
			rank = 'manager';
			break;
		case 3:
			rank = 'ceo';
			break;	
		default:
			break;
	}
	$('.ico-rank').addClass('ico-'+rank);
	$('#username').text(USERNAME);

	$('.switch-btn>div').click(function(){
		$(this).addClass('active-btn').siblings().removeClass('active-btn');
		if($(this).hasClass('left-btn')){
			$('.twopart-vessel').animate({'left':0},200)
		}else{
			$('.twopart-vessel').animate({'left': '-540px'},200)
		}
	})
	
	$('#subPwdBtn').click(() => {
		var $logPwdErr = $('#logPwdErr');
		$logPwdErr.hide();
		if($('#oldpwd').val()){
			if($('#newpwd').val()){
				if($('#renewpwd').val()){
					if($('#newpwd').val() ==  $('#renewpwd').val()){
						$.post('/changepwd',{
							"username": USERNAME,
							"oldpwd": $('#oldpwd').val(),
							"newpwd": $('#newpwd').val()
						},function(res){
							console.log(res);
							if(res == 'success'){
								console.info('修改成功');
								$('.error-bar').fadeIn('fast');
								setTimeout(function(){
									$('.error-bar').fadeOut('slow');
								},3000)
							}else{
								$logPwdErr.text("原密码错误！").show();
							}
						})
						
					}else{
						$logPwdErr.text("两次输入的新密码不一致！").show();
					}
				}else{
					$logPwdErr.text("请再次输入新密码！").show();
				}
			}else{
				$logPwdErr.text("请输入新密码！").show();
			}
		}else{
			$logPwdErr.text("请输入原密码！").show();
		}
	});
	
	
	$('#subDealPwdBtn').click(() => {
		var $dealPwdErr = $('#dealPwdErr');
		$dealPwdErr.hide();
		if($('#oldDealPwd').val()){
			if($('#newDealPwd').val()){
				if($('#reNewDealPwd').val()){
					if($('#newDealPwd').val() ==  $('#reNewDealPwd').val()){
						$.post('/changepwd/dealPwd',{
							"username": USERNAME,
							"oldDealPwd": $('#oldDealPwd').val(),
							"newDealPwd": $('#newDealPwd').val()
						},function(res){
							console.log(res);
							if(res == 'success'){
								console.info('修改成功');
								$('.error-bar').fadeIn('fast');
								setTimeout(function(){
									$('.error-bar').fadeOut('slow');
								},3000)
							}else{
								$dealPwdErr.text("原密码错误！").show();
							}
						})
						
					}else{
						$dealPwdErr.text("两次输入的新密码不一致！").show();
					}
				}else{
					$dealPwdErr.text("请再次输入新密码！").show();
				}
			}else{
				$dealPwdErr.text("请输入新密码！").show();
			}
		}else{
			$dealPwdErr.text("请输入原密码！").show();
		}
	});
	
	$('.pwd-input-vessel').keydown(function(e){
		if(e.keyCode == 13){
			$('#subPwdBtn').click();
		}
	})
	
	$('.deal-pwd-vessel').keydown(function(e){
		if(e.keyCode == 13){
			$('#subDealPwdBtn').click();
		}
	})
	
})